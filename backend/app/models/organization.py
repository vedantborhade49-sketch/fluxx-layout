from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from datetime import datetime, timezone
from app.database import Base

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String(50), primary_key=True, index=True) # e.g. "ORG-MPCB-MUMBAI"
    name = Column(String(150), nullable=False)
    code = Column(String(50), unique=True, index=True)
    domain = Column(String(100), default="Government Environmental Agency")
    region = Column(String(100), default="Maharashtra Basin")
    assigned_drones_count = Column(Integer, default=3)
    active_missions_count = Column(Integer, default=2)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
