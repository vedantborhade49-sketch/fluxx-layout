from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime, timezone
from app.database import Base

class WeatherData(Base):
    __tablename__ = "weather_data"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    location = Column(String(100), default="San Francisco Bay Area", index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    temperature = Column(Float, default=21.4)  # °C
    humidity = Column(Float, default=62.0)     # %
    pressure = Column(Float, default=1014.2)   # hPa
    wind_speed = Column(Float, default=5.4)    # m/s
    wind_direction = Column(Float, default=215.0) # degrees
    rain_probability = Column(Float, default=10.0) # %
    uv_index = Column(Float, default=5.2)
    condition = Column(String(50), default="Partly Cloudy")
    sunrise = Column(String(10), default="06:18 AM")
    sunset = Column(String(10), default="08:04 PM")
