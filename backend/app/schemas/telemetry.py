from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class SensorReadingBase(BaseModel):
    drone_id: str
    latitude: float
    longitude: float
    altitude: float = 120.0
    battery: float = 100.0
    aqi: float = 45.0
    pm25: float = 12.0
    pm10: float = 24.0
    co2: float = 415.0
    voc: float = 120.0
    ozone: float = 32.0
    methane: float = 1.8
    temperature: float = 22.5
    humidity: float = 58.0
    pressure: float = 1013.25
    wind_speed: float = 4.2
    wind_direction: float = 180.0
    uv_index: float = 4.5
    noise_level: float = 52.0
    mission_id: Optional[str] = None

class SensorReadingCreate(SensorReadingBase):
    pass

class SensorReadingResponse(SensorReadingBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class HeatmapPointResponse(BaseModel):
    lat: float
    lng: float
    val: float
    weight: float = 1.0
    layer: str

    class Config:
        from_attributes = True

class LiveTelemetryBroadcast(BaseModel):
    event: str
    drone_id: str
    telemetry: Dict[str, Any]
    sensors: Dict[str, Any]
    ai: Optional[Dict[str, Any]] = None
    alerts: Optional[List[Dict[str, Any]]] = None
    timestamp: str
