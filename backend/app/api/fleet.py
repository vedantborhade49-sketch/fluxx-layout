from fastapi import APIRouter
from app.services.fleet_service import fleet_service

router = APIRouter(prefix="/fleet", tags=["Fleet Management & Diagnostics"])

@router.get("/summary")
def get_fleet_summary():
    """
    Returns fleet health, predictive maintenance warnings, and flight hours.
    """
    return fleet_service.get_fleet_summary()
