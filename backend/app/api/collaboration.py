from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.services.collaboration_service import collaboration_service

router = APIRouter(prefix="/collaboration", tags=["Incident Annotations & Collaboration"])

class AnnotationCreateRequest(BaseModel):
    incident_id: Optional[str] = None
    author: str = "Flight Operations Officer"
    role: str = "Chief Drone Specialist"
    coordinates: Dict[str, float] = {"lat": 19.0760, "lng": 72.8777}
    area_name: str
    title: str
    notes: str
    assigned_to: str = "SPCB Enforcement Cell"
    status: str = "OPEN"
    priority: str = "HIGH"

@router.get("/annotations")
async def get_all_annotations():
    return collaboration_service.get_annotations()

@router.post("/annotations/create")
async def create_annotation(req: AnnotationCreateRequest):
    return collaboration_service.add_annotation(req.dict())

@router.post("/annotations/status/{note_id}")
async def update_annotation_status(note_id: str, new_status: str):
    return collaboration_service.update_status(note_id, new_status)
