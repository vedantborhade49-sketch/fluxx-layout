from fastapi import APIRouter
from app.services.fusion_service import fusion_service

router = APIRouter(prefix="/sources", tags=["Multi-Source Fusion"])

@router.get("")
def get_all_sources():
    """
    Returns multi-source environmental intelligence data feeds (Ground IoT, EPA Stations, Satellites, Factories).
    """
    return fusion_service.get_all_sources()
