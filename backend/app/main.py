import os
from datetime import datetime, timezone
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc
from .database import Base, engine, SessionLocal
from .models import Deployment
from .schemas import DeploymentCreate, DeploymentOut

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CloudDeploy API",
    description="Demo deployment dashboard API for a DevOps portfolio project.",
    version="1.0.0",
)

origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

SERVICES = [
    {"id": "frontend", "name": "Web Frontend", "technology": "React · Nginx", "environment": "production", "status": "healthy", "uptime": "99.98%", "region": "ap-south-1"},
    {"id": "backend", "name": "API Service", "technology": "Python · FastAPI", "environment": "production", "status": "healthy", "uptime": "99.95%", "region": "ap-south-1"},
    {"id": "database", "name": "Application Data", "technology": "SQLite · Persistent volume", "environment": "production", "status": "healthy", "uptime": "99.99%", "region": "ap-south-1"},
]

@app.get("/api/health")
def health():
    return {"status": "healthy", "service": "clouddeploy-api", "timestamp": datetime.now(timezone.utc).isoformat()}

@app.get("/api/summary")
def summary(db: Session = Depends(get_db)):
    deployments = db.query(Deployment).all()
    successful = sum(1 for d in deployments if d.status == "success")
    return {
        "services": len(SERVICES),
        "healthy": sum(1 for s in SERVICES if s["status"] == "healthy"),
        "deployments": len(deployments),
        "successful_deployments": successful,
        "failed_deployments": sum(1 for d in deployments if d.status == "failed"),
        "environment": "production",
        "region": "ap-south-1",
    }

@app.get("/api/services")
def list_services():
    return SERVICES

@app.get("/api/deployments", response_model=list[DeploymentOut])
def list_deployments(limit: int = 20, db: Session = Depends(get_db)):
    if limit < 1 or limit > 100:
        raise HTTPException(status_code=400, detail="limit must be between 1 and 100")
    return db.query(Deployment).order_by(desc(Deployment.created_at)).limit(limit).all()

@app.post("/api/deployments", response_model=DeploymentOut, status_code=201)
def create_deployment(payload: DeploymentCreate, db: Session = Depends(get_db)):
    if payload.service not in {"frontend", "backend", "full-stack"}:
        raise HTTPException(status_code=400, detail="service must be frontend, backend, or full-stack")
    deployment = Deployment(**payload.model_dump())
    db.add(deployment)
    db.commit()
    db.refresh(deployment)
    return deployment
