from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.services.decision_intelligence_service import decision_intelligence_service

router = APIRouter(prefix="/decision-intelligence", tags=["Decision Intelligence & Operational Coordinator"])

class ExecutePlanRequest(BaseModel):
    plan_id: str

@router.get("/plan")
async def get_active_decision_plan():
    return decision_intelligence_service.get_latest_plan()

@router.post("/execute-chain")
async def execute_decision_chain(req: ExecutePlanRequest):
    return decision_intelligence_service.execute_chain(req.plan_id)

@router.post("/reset/{plan_id}")
async def reset_decision_plan(plan_id: str):
    return decision_intelligence_service.reset_plan(plan_id)
