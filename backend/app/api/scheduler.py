from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.services.scheduler_service import mission_scheduler_service

router = APIRouter(prefix="/scheduler", tags=["Autonomous Mission Scheduler"])

class ScheduleCreateRequest(BaseModel):
    title: str
    frequency: str
    cron_expression: str = "0 0 * * *"
    target_area: str
    drone_assigned: str
    survey_type: str
    coverage_area_sqkm: float = 10.0
    auto_dispatch: bool = True

@router.get("/list")
async def get_all_schedules():
    return mission_scheduler_service.get_schedules()

@router.post("/create")
async def create_schedule(req: ScheduleCreateRequest):
    return mission_scheduler_service.add_schedule(req.dict())

@router.post("/toggle/{schedule_id}")
async def toggle_schedule(schedule_id: str):
    return mission_scheduler_service.toggle_schedule(schedule_id)
