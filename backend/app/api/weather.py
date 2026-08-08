from fastapi import APIRouter
from app.services.simulator import simulator

router = APIRouter(prefix="/weather", tags=["Weather"])

@router.get("")
def get_current_weather():
    return {
        "location": "San Francisco Bay Area - Coastal & Urban Basin",
        "temperature": round(simulator.global_temp, 1),
        "humidity": round(simulator.global_humidity, 1),
        "pressure": 1013.8,
        "wind_speed": round(simulator.global_wind_speed, 1),
        "wind_direction": round(simulator.global_wind_dir, 1),
        "rain_probability": 5.0,
        "uv_index": 4.8,
        "condition": "Partly Cloudy / Optimal Flight Window",
        "visibility_km": 14.5,
        "dew_point": 12.8,
        "sunrise": "06:18 AM",
        "sunset": "08:04 PM"
    }
