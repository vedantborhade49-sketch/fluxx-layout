from fastapi import APIRouter
from app.services.playback_service import playback_service

router = APIRouter(prefix="/playback", tags=["Historical 4D Mission Playback"])

@router.get("/timeline")
async def get_playback_timeline():
    return playback_service.get_timeline_slices()
