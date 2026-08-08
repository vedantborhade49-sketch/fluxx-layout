from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.services.city_twin_service import city_twin_service

router = APIRouter(prefix="/city-twin", tags=["City Digital Twin Simulation"])

class WhatIfSimulationRequest(BaseModel):
    source_id: str = "SRC-CHEMBUR-REFINERY"
    emission_delta_percent: float = 20.0
    wind_speed_ms: float = 5.5
    wind_direction_deg: float = 210.0
    temperature_c: float = 29.5
    inversion_layer_height_m: float = 350.0

@router.get("/topology")
async def get_city_topology():
    return city_twin_service.get_topology()

@router.post("/simulate-what-if")
async def run_what_if_simulation(req: WhatIfSimulationRequest):
    return city_twin_service.simulate_what_if_scenario(
        source_id=req.source_id,
        emission_delta_percent=req.emission_delta_percent,
        wind_speed_ms=req.wind_speed_ms,
        wind_direction_deg=req.wind_direction_deg,
        temperature_c=req.temperature_c,
        inversion_layer_height_m=req.inversion_layer_height_m
    )
