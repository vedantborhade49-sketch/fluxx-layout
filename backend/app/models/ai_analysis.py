from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from datetime import datetime, timezone
from app.database import Base

class AIAnalysis(Base):
    __tablename__ = "ai_analysis"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    drone_id = Column(String(50), index=True, nullable=True)
    reading_id = Column(Integer, index=True, nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    
    # Predictions
    aqi_current = Column(Float, default=55.0)
    prediction_30m = Column(Float, default=58.0)
    prediction_1h = Column(Float, default=64.0)
    prediction_6h = Column(Float, default=82.0)
    prediction_24h = Column(Float, default=70.0)
    
    # Classification & Detection
    pollution_type = Column(String(100), default="Industrial Particulate")
    source_hypothesis = Column(String(200), default="Nearby Construction & Traffic Congestion")
    confidence = Column(Float, default=0.92) # 0.0 - 1.0
    risk_level = Column(String(50), default="MODERATE") # LOW, MODERATE, HIGH, CRITICAL
    recommendation = Column(Text, default="Increase drone telemetry frequency in Sector 4. Notify municipal dust suppression unit.")
    
    # Computer Vision detections (JSON serialized list of bounding boxes)
    detected_objects = Column(Text, nullable=True) 
