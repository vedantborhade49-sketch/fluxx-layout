from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text
from datetime import datetime, timezone
from app.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String(50), primary_key=True, index=True) # e.g. "ALT-2026-001"
    drone_id = Column(String(50), index=True, nullable=True)
    type = Column(String(100), default="POLLUTION_SPIKE") # POLLUTION_SPIKE, LOW_BATTERY, HIGH_TEMP, SIGNAL_LOST, GEOFENCE_BREACH, HIGH_WIND, GAS_LEAK
    severity = Column(String(50), default="WARNING")      # INFO, WARNING, CRITICAL, EMERGENCY
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    location_name = Column(String(150), default="Sector 4 - Alpha Industrial")
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    metric_name = Column(String(50), nullable=True)
    metric_value = Column(Float, nullable=True)
    threshold_value = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    resolved = Column(Boolean, default=False)
    resolved_at = Column(DateTime, nullable=True)
    resolved_by = Column(String(100), nullable=True)
