import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.seed_data import seed_database
from app.services.websocket_manager import ws_manager
from app.services.simulator import simulator

# Routers
from app.api.auth import router as auth_router
from app.api.drone import router as drone_router
from app.api.telemetry import router as telemetry_router
from app.api.heatmap import router as heatmap_router
from app.api.mission import router as mission_router
from app.api.ai import router as ai_router
from app.api.alerts import router as alerts_router
from app.api.weather import router as weather_router
from app.api.reports import router as reports_router
from app.api.simulator import router as simulator_router
from app.api.digital_twin import router as digital_twin_router
from app.api.fusion import router as fusion_router
from app.api.fleet import router as fleet_router
from app.api.organizations import router as organizations_router

# Advanced Enterprise Routers
from app.api.city_twin import router as city_twin_router
from app.api.intelligence import router as intelligence_router
from app.api.scheduler import router as scheduler_router
from app.api.collaboration import router as collaboration_router
from app.api.regulatory import router as regulatory_router
from app.api.playback import router as playback_router

# v2.0 Decision Intelligence & Ecosystem Routers
from app.api.decision_intelligence import router as decision_intelligence_router
from app.api.knowledge_graph import router as knowledge_graph_router
from app.api.mission_intelligence import router as mission_intelligence_router
from app.api.marketplace import router as marketplace_router
from app.api.plugins import router as plugins_router
from app.api.sdk import router as sdk_router
from app.api.replay import router as replay_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("fluxx.backend")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Startup: Seed DB
    try:
        seed_database()
    except Exception as e:
        logger.error(f"Error during database seed: {e}")
        
    # 2. Startup: Launch Simulator
    if settings.SIMULATION_ENABLED:
        simulator.start()
        
    logger.info("FLUXX Environmental Intelligence Platform v2.0 Enterprise Backend Started.")
    yield
    
    # 3. Shutdown: Stop Simulator
    simulator.stop()
    logger.info("FLUXX Backend Shutdown.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Real-Time Environmental Intelligence Platform with Digital Twin, Multi-Source Sensor Fusion & AI.",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount REST API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(drone_router, prefix=settings.API_V1_STR)
app.include_router(telemetry_router, prefix=settings.API_V1_STR)
app.include_router(heatmap_router, prefix=settings.API_V1_STR)
app.include_router(mission_router, prefix=settings.API_V1_STR)
app.include_router(ai_router, prefix=settings.API_V1_STR)
app.include_router(alerts_router, prefix=settings.API_V1_STR)
app.include_router(weather_router, prefix=settings.API_V1_STR)
app.include_router(reports_router, prefix=settings.API_V1_STR)
app.include_router(simulator_router, prefix=settings.API_V1_STR)
app.include_router(digital_twin_router, prefix=settings.API_V1_STR)
app.include_router(fusion_router, prefix=settings.API_V1_STR)
app.include_router(fleet_router, prefix=settings.API_V1_STR)
app.include_router(organizations_router, prefix=settings.API_V1_STR)

# Mount Advanced Enterprise Routers
app.include_router(city_twin_router, prefix=settings.API_V1_STR)
app.include_router(intelligence_router, prefix=settings.API_V1_STR)
app.include_router(scheduler_router, prefix=settings.API_V1_STR)
app.include_router(collaboration_router, prefix=settings.API_V1_STR)
app.include_router(regulatory_router, prefix=settings.API_V1_STR)
app.include_router(playback_router, prefix=settings.API_V1_STR)

# Mount Decision Intelligence & Ecosystem Routers
app.include_router(decision_intelligence_router, prefix=settings.API_V1_STR)
app.include_router(knowledge_graph_router, prefix=settings.API_V1_STR)
app.include_router(mission_intelligence_router, prefix=settings.API_V1_STR)
app.include_router(marketplace_router, prefix=settings.API_V1_STR)
app.include_router(plugins_router, prefix=settings.API_V1_STR)
app.include_router(sdk_router, prefix=settings.API_V1_STR)
app.include_router(replay_router, prefix=settings.API_V1_STR)
app.include_router(replay_router, prefix="/api")

@app.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "simulator_active": simulator.running,
        "microservices": [
            "Gateway API",
            "Auth Service",
            "Telemetry Service",
            "Digital Twin Service",
            "City Digital Twin Engine",
            "Environmental Intelligence & XAI Engine",
            "Decision Intelligence Operational Coordinator",
            "Unified Environmental Knowledge Graph",
            "Mission Intelligence Quality Scorer",
            "Cross-Agency Mission Marketplace",
            "Dynamic Extensible Plugin Registry",
            "Developer SDK & Integration Hub",
            "Autonomous Mission Scheduler",
            "Collaboration & Incident Annotation Cell",
            "Multi-Source Fusion Engine",
            "Fleet Diagnostics Engine",
            "AI Prediction & Dispersion Pipeline",
            "Mission Planner & Optimizer",
            "Regulatory Agency Hub",
            "Historical 4D Mission Playback",
            "Heatmap Engine (16 Overlays)",
            "Alert & Incident Service",
            "Report & Audit Generator"
        ]
    }

@app.websocket("/ws/live")
async def websocket_live_endpoint(websocket: WebSocket):
    """
    Real-Time WebSocket stream endpoint for live drone telemetry, heatmaps, AI alerts and mission status.
    """
    await ws_manager.connect(websocket)
    try:
        await websocket.send_json({
            "event": "connected",
            "message": "Connected to FLUXX Environmental Intelligence v2.0 Enterprise Stream",
            "active_drones": list(simulator.drones.keys())
        })
        while True:
            data = await websocket.receive_json()
            event = data.get("event")
            if event == "ping":
                await websocket.send_json({"event": "pong"})
            elif event == "inject_spike":
                drone_id = data.get("drone_id", "VTOL-001")
                simulator.inject_pollution_spike(drone_id)
            elif event == "emergency_rth":
                drone_id = data.get("drone_id", "VTOL-001")
                simulator.trigger_emergency_rth(drone_id)
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception as e:
        logger.warning(f"WebSocket client error: {e}")
        ws_manager.disconnect(websocket)
