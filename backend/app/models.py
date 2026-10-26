from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime
from .database import Base

class Deployment(Base):
    __tablename__ = "deployments"

    id = Column(Integer, primary_key=True, index=True)
    service = Column(String(80), nullable=False)
    environment = Column(String(40), nullable=False, default="production")
    status = Column(String(30), nullable=False, default="success")
    version = Column(String(80), nullable=False, default="manual")
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
