from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime, timezone
from app.database import Base

class HeatmapPoint(Base):
    __tablename__ = "heatmap_points"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    layer = Column(String(50), default="aqi", index=True) # aqi, pm25, pm10, co2, voc, temp, humidity, wind, noise, ozone, methane
    latitude = Column(Float, nullable=False, index=True)
    longitude = Column(Float, nullable=False, index=True)
    value = Column(Float, nullable=False)
    weight = Column(Float, default=1.0)
    zone = Column(String(100), default="Default Zone")
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
