from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class DetectionObject(BaseModel):
    label: str # Smoke, Fire, Construction Dust, Illegal Dumping, Waterlogging, Crop Stress
    confidence: float # 0.0 - 1.0
    bbox: List[float] # [ymin, xmin, ymax, xmax] normalized
    risk: str # LOW, MEDIUM, HIGH, CRITICAL
    location: Optional[Dict[str, float]] = None

class AIAnalysisResponse(BaseModel):
    id: int
    drone_id: Optional[str]
    timestamp: datetime
    aqi_current: float
    prediction_30m: float
    prediction_1h: float
    prediction_6h: float
    prediction_24h: float
    pollution_type: str
    source_hypothesis: str
    confidence: float
    risk_level: str
    recommendation: str
    detected_objects: Optional[List[DetectionObject]] = None

    class Config:
        from_attributes = True

class AIPredictionRequest(BaseModel):
    drone_id: str
    horizon_hours: int = 24
