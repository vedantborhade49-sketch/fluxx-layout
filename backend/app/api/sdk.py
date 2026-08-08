from fastapi import APIRouter
from app.services.sdk_service import developer_sdk_service

router = APIRouter(prefix="/sdk", tags=["Developer SDK & Third-Party Integration"])

@router.get("/specs")
async def get_sdk_specifications():
    return developer_sdk_service.get_sdk_documentation()
