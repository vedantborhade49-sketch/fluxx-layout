from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DroneBase(BaseModel):
    id: str
    serial_number: str
    model: str = "Fluxx AeroVTOL X8"
    firmware: str = "v4.2.1-PRO"
    status: str = "ACTIVE"
    battery: float = 100.0
    latitude: float = 37.7749
    longitude: float = -122.4194
    altitude: float = 120.0
    speed: float = 12.5
    heading: float = 45.0
    signal_strength: float = 96.0
    current_mission_id: Optional[str] = None

class DroneCreate(DroneBase):
    pass

class DroneUpdate(BaseModel):
    status: Optional[str] = None
    battery: Optional[float] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    altitude: Optional[float] = None
    speed: Optional[float] = None
    heading: Optional[float] = None
    signal_strength: Optional[float] = None
    current_mission_id: Optional[str] = None

class DroneResponse(DroneBase):
    last_seen: datetime

    class Config:
        from_attributes = True
