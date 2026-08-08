from fastapi import APIRouter
from app.services.plugins_service import plugin_registry_service

router = APIRouter(prefix="/plugins", tags=["Extensible Environmental Plugin Registry"])

@router.get("/registry")
async def get_plugin_registry():
    return plugin_registry_service.get_all_plugins()

@router.post("/toggle/{plugin_id}")
async def toggle_plugin(plugin_id: str):
    return plugin_registry_service.toggle_plugin(plugin_id)
