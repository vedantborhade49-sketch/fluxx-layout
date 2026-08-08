from fastapi import APIRouter
from pydantic import BaseModel
from app.services.marketplace_service import marketplace_service

router = APIRouter(prefix="/marketplace", tags=["Cross-Agency Mission Marketplace"])

class ClaimMissionRequest(BaseModel):
    mission_id: str
    drone_id: str = "VTOL-001"

@router.get("/missions")
async def get_marketplace_missions():
    return marketplace_service.get_missions()

@router.post("/claim")
async def claim_marketplace_mission(req: ClaimMissionRequest):
    return marketplace_service.claim_mission(req.mission_id, req.drone_id)
