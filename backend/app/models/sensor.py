from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime, timezone
from app.database import Base

class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    drone_id = Column(String(50), index=True, nullable=False)
    mission_id = Column(String(50), index=True, nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    
    # Coordinates & Physics
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    altitude = Column(Float, default=120.0)
    battery = Column(Float, default=100.0)
    
    # Air Quality & Gases
    aqi = Column(Float, default=45.0)
    pm25 = Column(Float, default=12.4)     # µg/m³
    pm10 = Column(Float, default=24.8)     # µg/m³
    co2 = Column(Float, default=415.0)     # ppm
    voc = Column(Float, default=120.0)     # ppb
    ozone = Column(Float, default=32.0)    # ppb
    methane = Column(Float, default=1.8)   # ppm
    
    # Meteorological & Ambient
    temperature = Column(Float, default=22.5)  # °C
    humidity = Column(Float, default=58.0)     # %
    pressure = Column(Float, default=1013.25)  # hPa
    wind_speed = Column(Float, default=4.2)    # m/s
    wind_direction = Column(Float, default=180.0) # degrees
    uv_index = Column(Float, default=4.5)
    noise_level = Column(Float, default=52.0)  # dB
