from fastapi import APIRouter, Body
from typing import Dict, Any
from app.services.simulator import simulator

router = APIRouter(prefix="/simulator", tags=["Simulator Control"])

@router.post("/inject-spike")
def inject_spike(drone_id: str = Body(..., embed=True)):
    simulator.inject_pollution_spike(drone_id)
    return {"message": f"Pollution plume injected on {drone_id}", "status": "INJECTED"}

@router.post("/emergency-rth")
def emergency_rth(drone_id: str = Body(..., embed=True)):
    simulator.trigger_emergency_rth(drone_id)
    return {"message": f"Emergency RTH commanded on {drone_id}", "status": "RTH"}

@router.post("/set-wind")
def set_wind(speed: float = Body(..., embed=True), direction: float = Body(210.0, embed=True)):
    simulator.global_wind_speed = speed
    simulator.global_wind_dir = direction
    return {"wind_speed": speed, "wind_direction": direction}

@router.get("/status")
def get_status():
    return {
        "running": simulator.running,
        "drones_count": len(simulator.drones),
        "global_wind_speed": simulator.global_wind_speed,
        "global_wind_dir": simulator.global_wind_dir,
        "global_temp": simulator.global_temp
    }
