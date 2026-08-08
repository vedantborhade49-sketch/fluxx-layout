from fastapi import APIRouter, Query, Body
from typing import Dict, Any
from app.services.digital_twin_service import digital_twin_service

router = APIRouter(prefix="/digital-twin", tags=["Digital Twin"])

@router.get("/{drone_id}")
def get_digital_twin_state(drone_id: str):
    """
    Returns real-time digital twin state (motor thermals, ESC, vibration, battery SOH, failure risk).
    """
    return digital_twin_service.get_twin(drone_id)

@router.post("/simulate-mission")
def simulate_pre_flight_mission(
    drone_id: str = Body("VTOL-001"),
    distance_km: float = Body(14.8),
    planned_altitude: float = Body(120.0),
    wind_speed: float = Body(4.8),
    payload_weight_kg: float = Body(1.2)
):
    """
    Simulates mission profile through the Digital Twin physics engine prior to takeoff.
    """
    return digital_twin_service.simulate_pre_flight_mission(
        drone_id=drone_id,
        distance_km=distance_km,
        planned_altitude=planned_altitude,
        wind_speed=wind_speed,
        payload_weight_kg=payload_weight_kg
    )
