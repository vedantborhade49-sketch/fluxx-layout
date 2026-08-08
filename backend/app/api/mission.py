import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime, timezone
from app.database import get_db
from app.models.mission import Mission
from app.schemas.mission import MissionResponse, MissionCreate, MissionGenerateGridRequest
from app.services.mission_planner import mission_planner
from app.services.websocket_manager import ws_manager

router = APIRouter(prefix="/mission", tags=["Missions"])

@router.get("", response_model=List[MissionResponse])
def get_all_missions(db: Session = Depends(get_db)):
    missions = db.query(Mission).all()
    results = []
    for m in missions:
        results.append(MissionResponse(
            id=m.id,
            drone_id=m.drone_id,
            name=m.name,
            type=m.type,
            status=m.status,
            area_name=m.area_name,
            area_polygon=json.loads(m.area_polygon) if m.area_polygon else None,
            waypoints=json.loads(m.waypoints) if m.waypoints else None,
            start_time=m.start_time,
            end_time=m.end_time,
            distance_km=m.distance_km,
            flight_time_min=m.flight_time_min,
            coverage_sqkm=m.coverage_sqkm,
            average_aqi=m.average_aqi
        ))
    return results

@router.post("/generate-grid")
def generate_mission_grid(req: MissionGenerateGridRequest):
    """
    Generates serpentine survey grid waypoints, calculates estimated distance,
    flight duration, battery consumption, and coverage area from drawn polygon vertices.
    """
    grid_result = mission_planner.generate_survey_grid(
        polygon=req.polygon,
        altitude=req.altitude,
        spacing_meters=req.spacing_meters
    )
    return {
        "mission_name": req.name,
        "drone_id": req.drone_id,
        "type": req.type,
        **grid_result
    }

@router.post("", response_model=MissionResponse)
async def create_mission(mission_in: MissionCreate, db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    mission_id = f"MSN-{now.strftime('%Y%m%d')}-{db.query(Mission).count() + 1:03d}"
    
    polygon_json = json.dumps(mission_in.area_polygon) if mission_in.area_polygon else None
    waypoints_json = json.dumps([w.model_dump() for w in mission_in.waypoints]) if mission_in.waypoints else None
    
    mission = Mission(
        id=mission_id,
        drone_id=mission_in.drone_id,
        name=mission_in.name,
        type=mission_in.type,
        status="UPLOADING",
        area_name=mission_in.area_name,
        area_polygon=polygon_json,
        waypoints=waypoints_json,
        start_time=now,
        distance_km=mission_in.distance_km,
        flight_time_min=mission_in.flight_time_min,
        coverage_sqkm=mission_in.coverage_sqkm,
        average_aqi=50.0
    )
    db.add(mission)
    db.commit()
    db.refresh(mission)

    # Broadcast mission update to WebSocket clients
    await ws_manager.broadcast({
        "event": "missionStatus",
        "mission_id": mission_id,
        "drone_id": mission.drone_id,
        "status": "UPLOADING",
        "name": mission.name
    })
    
    return MissionResponse(
        id=mission.id,
        drone_id=mission.drone_id,
        name=mission.name,
        type=mission.type,
        status=mission.status,
        area_name=mission.area_name,
        area_polygon=mission_in.area_polygon,
        waypoints=mission_in.waypoints,
        start_time=mission.start_time,
        end_time=mission.end_time,
        distance_km=mission.distance_km,
        flight_time_min=mission.flight_time_min,
        coverage_sqkm=mission.coverage_sqkm,
        average_aqi=mission.average_aqi
    )

@router.delete("/{mission_id}")
async def abort_mission(mission_id: str, db: Session = Depends(get_db)):
    mission = db.query(Mission).filter(Mission.id == mission_id).first()
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    
    mission.status = "ABORTED"
    mission.end_time = datetime.now(timezone.utc)
    db.commit()
    
    await ws_manager.broadcast({
        "event": "missionStatus",
        "mission_id": mission_id,
        "status": "ABORTED"
    })
    return {"message": f"Mission {mission_id} aborted", "status": "ABORTED"}
