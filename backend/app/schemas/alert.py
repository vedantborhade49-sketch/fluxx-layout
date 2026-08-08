from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AlertBase(BaseModel):
    drone_id: Optional[str] = None
    type: str
    severity: str # INFO, WARNING, CRITICAL, EMERGENCY
    title: str
    description: str
    location_name: str = "Sector 4"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    metric_name: Optional[str] = None
    metric_value: Optional[float] = None
    threshold_value: Optional[float] = None

class AlertCreate(AlertBase):
    id: Optional[str] = None

class AlertResponse(AlertBase):
    id: str
    timestamp: datetime
    resolved: bool
    resolved_at: Optional[datetime] = None
    resolved_by: Optional[str] = None

    class Config:
        from_attributes = True

class AlertResolveRequest(BaseModel):
    resolved_by: str = "Operator"
