from fastapi import APIRouter
from app.services.mission_intelligence_service import mission_intelligence_service

router = APIRouter(prefix="/mission-intelligence", tags=["Mission Intelligence & Quality Scoring"])

@router.get("/score/{mission_id}")
async def get_mission_quality_score(mission_id: str = "MSN-2041"):
    return mission_intelligence_service.evaluate_mission_score(mission_id)
