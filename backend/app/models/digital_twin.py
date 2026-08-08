from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean
from datetime import datetime, timezone
from app.database import Base

class DigitalTwin(Base):
    __tablename__ = "digital_twins"

    id = Column(String(50), primary_key=True, index=True) # e.g. "TWIN-VTOL-001"
    drone_id = Column(String(50), unique=True, index=True, nullable=False)
    drone_name = Column(String(100), default="SkyGuardian Pro Twin")
    
    # Physical State
    battery_soh = Column(Float, default=98.5) # State of Health %
    battery_cycles = Column(Integer, default=42)
    battery_temp = Column(Float, default=28.4) # °C
    motor1_temp = Column(Float, default=42.1)
    motor2_temp = Column(Float, default=41.8)
    motor3_temp = Column(Float, default=43.0)
    motor4_temp = Column(Float, default=42.5)
    esc_temp = Column(Float, default=46.2) # ESC Temperature °C
    vibration_level = Column(Float, default=0.12) # G-force vibration index
    compass_health = Column(Float, default=99.2) # %
    servo_wear = Column(Float, default=3.4) # % wear
    
    # Predictive Maintenance
    failure_risk_score = Column(Float, default=0.04) # 0.0 - 1.0
    recommended_maintenance_date = Column(DateTime, nullable=True)
    last_calibration = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    flight_hours_total = Column(Float, default=148.6)
    
    # Pre-Flight Simulation Cache
    simulated_burn_rate = Column(Float, default=1.22) # % battery / min
    simulated_max_wind = Column(Float, default=16.5) # m/s limit
    twin_synced_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
