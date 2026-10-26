from datetime import datetime
from pydantic import BaseModel, Field

class DeploymentCreate(BaseModel):
    service: str = Field(min_length=2, max_length=80)
    environment: str = Field(default="production", min_length=2, max_length=40)
    status: str = Field(default="success", pattern="^(success|failed|running)$")
    version: str = Field(default="manual", max_length=80)

class DeploymentOut(BaseModel):
    id: int
    service: str
    environment: str
    status: str
    version: str
    created_at: datetime

    class Config:
        from_attributes = True
