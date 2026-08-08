from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime, timezone
from app.database import Base

class Drone(Base):
    __tablename__ = "drones"

    id = Column(String(50), primary_key=True, index=True)  # e.g., "VTOL-001"
    serial_number = Column(String(100), unique=True, index=True)
    model = Column(String(100), default="Fluxx AeroVTOL X8")
    firmware = Column(String(50), default="v4.2.1-PRO")
    status = Column(String(50), default="ACTIVE")  # ACTIVE, IDLE, CHARGING, RETURNING, OFFLINE
    battery = Column(Float, default=100.0)  # 0 - 100%
    latitude = Column(Float, default=37.7749)
    longitude = Column(Float, default=-122.4194)
    altitude = Column(Float, default=120.0)  # meters
    speed = Column(Float, default=12.5)  # m/s
    heading = Column(Float, default=45.0)  # degrees
    signal_strength = Column(Float, default=96.0)  # %
    current_mission_id = Column(String(50), nullable=True)
    last_seen = Column(DateTime, default=lambda: datetime.now(timezone.utc))
