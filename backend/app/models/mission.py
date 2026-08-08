from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from datetime import datetime, timezone
from app.database import Base

class Mission(Base):
    __tablename__ = "missions"

    id = Column(String(50), primary_key=True, index=True)
    drone_id = Column(String(50), index=True, nullable=True)
    name = Column(String(150), nullable=False)
    type = Column(String(50), default="Environmental Survey")  # Environmental Survey, Agriculture, Disaster Assessment, Forest Monitoring, Industrial Inspection
    status = Column(String(50), default="IN_PROGRESS")  # PENDING, UPLOADING, IN_PROGRESS, COMPLETED, ABORTED, RETURNING
    area_name = Column(String(100), default="Industrial Zone Alpha")
    area_polygon = Column(Text, nullable=True)  # JSON serialized coordinates
    waypoints = Column(Text, nullable=True)     # JSON serialized array of waypoints
    start_time = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    end_time = Column(DateTime, nullable=True)
    distance_km = Column(Float, default=14.2)
    flight_time_min = Column(Float, default=32.5)
    coverage_sqkm = Column(Float, default=4.8)
    average_aqi = Column(Float, default=58.0)
