from fastapi import APIRouter
from app.services.env_intelligence_service import env_intelligence_service
from app.services.simulator import simulator

router = APIRouter(prefix="/intelligence", tags=["Environmental Intelligence & XAI"])

@router.get("/event")
async def get_explainable_event(drone_id: str = "VTOL-001"):
    telemetry = simulator.get_latest_reading(drone_id)
    return env_intelligence_service.generate_explainable_event(drone_id, telemetry)

@router.get("/eri")
async def get_composite_eri(drone_id: str = "VTOL-001"):
    telemetry = simulator.get_latest_reading(drone_id)
    return env_intelligence_service.compute_eri_composite(telemetry)

@router.get("/mission-recommendations")
async def get_mission_recommendations():
    return env_intelligence_service.get_ai_mission_recommendations()
