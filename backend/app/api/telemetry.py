from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from app.database import get_db
from app.models.sensor import SensorReading
from app.schemas.telemetry import SensorReadingResponse, SensorReadingCreate

router = APIRouter(prefix="/telemetry", tags=["Telemetry"])

@router.get("/live")
def get_live_telemetry():
    """Returns instant snapshot of latest readings from all active simulated drones."""
    from app.services.simulator import simulator
    readings = []
    for drone_id, d in simulator.drones.items():
        readings.append({
            "drone_id": drone_id,
            "name": d.name,
            "latitude": d.lat,
            "longitude": d.lng,
            "altitude": d.altitude,
            "speed": d.speed,
            "heading": d.heading,
            "battery": d.battery,
            "signal_strength": d.signal_strength,
            "status": d.status,
            "mission_id": d.mission_id,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
    return readings

@router.get("/history", response_model=List[SensorReadingResponse])
def get_telemetry_history(
    drone_id: Optional[str] = Query(None),
    limit: int = Query(100, le=500),
    time_range: str = Query("1h"), # 1m, 5m, 15m, 1h, 24h, 7d
    db: Session = Depends(get_db)
):
    query = db.query(SensorReading)
    if drone_id and drone_id != "ALL":
        query = query.filter(SensorReading.drone_id == drone_id)
        
    # Calculate time threshold
    now = datetime.now(timezone.utc)
    delta_map = {
        "1m": timedelta(minutes=1),
        "5m": timedelta(minutes=5),
        "15m": timedelta(minutes=15),
        "1h": timedelta(hours=1),
        "24h": timedelta(hours=24),
        "7d": timedelta(days=7)
    }
    cutoff = now - delta_map.get(time_range, timedelta(hours=1))
    
    readings = query.order_by(SensorReading.timestamp.desc()).limit(limit).all()
    return readings

@router.post("", response_model=SensorReadingResponse)
def post_telemetry(reading_in: SensorReadingCreate, db: Session = Depends(get_db)):
    reading = SensorReading(**reading_in.model_dump())
    db.add(reading)
    db.commit()
    db.refresh(reading)
    return reading
