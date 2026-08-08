from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class Waypoint(BaseModel):
    lat: float
    lng: float
    alt: float = 120.0
    action: str = "SURVEY" # TAKEOFF, WAYPOINT, SURVEY, HOVER, LAND, RTH
    speed: float = 12.0

class MissionBase(BaseModel):
    name: str
    drone_id: Optional[str] = "VTOL-001"
    type: str = "Environmental Survey"
    status: str = "IN_PROGRESS"
    area_name: str = "Industrial Zone Alpha"
    area_polygon: Optional[List[List[float]]] = None # [[lat, lng], [lat, lng], ...]
    waypoints: Optional[List[Waypoint]] = None
    distance_km: float = 12.4
    flight_time_min: float = 28.0
    coverage_sqkm: float = 3.5

class MissionCreate(MissionBase):
    pass

class MissionResponse(BaseModel):
    id: str
    drone_id: Optional[str] = None
    name: str
    type: str
    status: str
    area_name: str
    area_polygon: Optional[Any] = None
    waypoints: Optional[Any] = None
    start_time: datetime
    end_time: Optional[datetime] = None
    distance_km: float
    flight_time_min: float
    coverage_sqkm: float
    average_aqi: float

    class Config:
        from_attributes = True

class MissionGenerateGridRequest(BaseModel):
    polygon: List[List[float]] # [[lat, lng], ...]
    altitude: float = 120.0
    spacing_meters: float = 80.0
    drone_id: Optional[str] = "VTOL-001"
    name: Optional[str] = "Autonomous Grid Survey"
    type: Optional[str] = "Environmental Survey"
