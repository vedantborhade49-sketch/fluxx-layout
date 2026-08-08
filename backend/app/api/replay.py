"""
FLUXX Replay & Ingestion REST API Endpoints
Controls live environmental data replay and provides unified ingestion gateway.
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

from app.services.replay_engine import replay_engine
from app.services.data_normalizer import normalize_environmental_reading
from app.services.eri_engine import calculate_eri
from app.ai.anomaly_detector import anomaly_detector
from app.services.websocket_manager import ws_manager

router = APIRouter(prefix="", tags=["Replay & Ingestion"])

class SpeedRequest(BaseModel):
    speed: float = Field(..., ge=0.25, le=10.0, description="Playback speed multiplier (0.5, 1, 2, 4)")

class SeekRequest(BaseModel):
    sample: int = Field(..., ge=1, description="1-based sample index to seek to")

class IngestRequest(BaseModel):
    source: Optional[str] = Field("esp32_sensor", description="Source identifier (e.g. esp32_001, kharghar_csv, vtol_001)")
    mode: Optional[str] = Field("live", description="Data mode (live or replay)")
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    elevation: Optional[float] = None
    pm2_5_ug_m3: Optional[float] = None
    pm10_ug_m3: Optional[float] = None
    co2_ppm: Optional[float] = None
    temperature_c: Optional[float] = None
    humidity_percent: Optional[float] = None
    wind_speed_m_s: Optional[float] = None
    wind_direction_deg: Optional[float] = None
    timestamp: Optional[str] = None
    sensors: Optional[Dict[str, float]] = None
    location: Optional[Dict[str, float]] = None

@router.post("/replay/start")
async def start_replay():
    """Starts or resumes chronological dataset replay."""
    await replay_engine.start()
    return {"status": "SUCCESS", "message": "Replay started", "data": replay_engine.get_status()}

@router.post("/replay/pause")
async def pause_replay():
    """Pauses dataset replay."""
    await replay_engine.pause()
    return {"status": "SUCCESS", "message": "Replay paused", "data": replay_engine.get_status()}

@router.post("/replay/reset")
async def reset_replay():
    """Resets replay back to sample 1."""
    await replay_engine.reset()
    return {"status": "SUCCESS", "message": "Replay reset to sample 1", "data": replay_engine.get_status()}

@router.post("/replay/speed")
async def set_replay_speed(req: SpeedRequest):
    """Sets replay speed multiplier."""
    await replay_engine.set_speed(req.speed)
    return {"status": "SUCCESS", "message": f"Speed set to {req.speed}x", "data": replay_engine.get_status()}

@router.post("/replay/seek")
async def seek_replay(req: SeekRequest):
    """Seeks to a specific sample number (1..N)."""
    await replay_engine.seek(req.sample)
    return {"status": "SUCCESS", "message": f"Seeked to sample {req.sample}", "data": replay_engine.get_status()}

@router.get("/replay/status")
def get_replay_status():
    """Returns current playback engine status."""
    return replay_engine.get_status()

@router.get("/replay/current")
def get_replay_current():
    """Returns current active observation reading."""
    reading = replay_engine.get_current_reading()
    if not reading:
        raise HTTPException(status_code=404, detail="No active replay reading found")
    
    eri = calculate_eri(reading.get("sensors", {}), reading.get("timestamp"))
    return {
        "reading": reading,
        "eri": eri,
        "status": replay_engine.get_status()
    }

@router.get("/replay/samples")
def get_all_samples():
    """Returns all 50 observations for full spatial boundary, survey path, and statistics."""
    samples = replay_engine.get_all_samples()
    return {
        "count": len(samples),
        "source": "kharghar_csv",
        "samples": samples
    }

@router.post("/ingest")
async def ingest_sensor_reading(payload: IngestRequest):
    """
    Unified Ingestion Endpoint.
    Accepts arbitrary sensor readings (CSV replay, physical ESP32, or VTOL MAVLink telemetry),
    normalizes them, runs AI Anomaly Detection & ERI, and broadcasts to the platform.
    """
    raw_dict = payload.model_dump(exclude_none=True)
    if "sensors" in raw_dict and isinstance(raw_dict["sensors"], dict):
        for k, v in raw_dict["sensors"].items():
            raw_dict[k] = v
    if "location" in raw_dict and isinstance(raw_dict["location"], dict):
        for k, v in raw_dict["location"].items():
            raw_dict[k] = v

    normalized = normalize_environmental_reading(
        raw_dict,
        source=payload.source or "hardware_sensor",
        mode=payload.mode or "live"
    )

    eri = calculate_eri(normalized["sensors"], normalized["timestamp"])
    anomaly = anomaly_detector.evaluate_sample(normalized)

    # Broadcast to WebSocket
    await ws_manager.broadcast({
        "type": "sensor_reading",
        "event": "sensor_reading",
        "data": {
            **normalized,
            "eri": eri
        }
    })

    await ws_manager.broadcast({
        "type": "eri_update",
        "event": "eri_update",
        "data": eri
    })

    if anomaly:
        await ws_manager.broadcast({
            "type": "alert",
            "event": "alert",
            "data": anomaly
        })

    return {
        "status": "INGESTED",
        "reading": normalized,
        "eri": eri,
        "anomaly": anomaly
    }
