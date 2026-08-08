from fastapi import APIRouter
from app.services.regulatory_service import regulatory_service

router = APIRouter(prefix="/regulatory", tags=["Agency Regulatory Dashboards"])

@router.get("/dashboard/{role}")
async def get_regulatory_dashboard(role: str):
    role_key = role.upper()
    return regulatory_service.get_role_dashboard_data(role_key)
