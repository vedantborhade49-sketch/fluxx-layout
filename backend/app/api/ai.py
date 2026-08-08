from fastapi import APIRouter, Depends, Query, Body
from typing import Dict, Any, List
from app.ai.prediction_engine import prediction_engine
from app.ai.anomaly_detector import anomaly_detector
from app.ai.vision_detector import vision_detector
from app.services.simulator import simulator

router = APIRouter(prefix="/ai", tags=["AI Engine"])

@router.get("/prediction")
def get_prediction(drone_id: str = Query("VTOL-001")):
    """
    Returns multi-horizon AQI forecast curves (30m, 1h, 6h, 24h) and hourly forecast timeline.
    """
    d = simulator.drones.get(drone_id)
    current_aqi = 65.0 if not d else (85.0 if d.zone_type == "industrial" else 45.0)
    wind_spd = simulator.global_wind_speed
    temp = simulator.global_temp
    humidity = simulator.global_humidity
    
    forecast = prediction_engine.forecast_aqi(current_aqi, wind_spd, temp, humidity)
    recommendations = prediction_engine.generate_recommendations({
        "pm25": current_aqi * 0.28,
        "co2": 450.0,
        "voc": 140.0,
        "methane": 1.9
    })
    return {
        "drone_id": drone_id,
        **forecast,
        **recommendations
    }

@router.post("/analysis")
def analyze_sensor_payload(data: Dict[str, Any] = Body(...)):
    """
    Executes real-time AI anomaly evaluation on arbitrary sensor telemetry.
    """
    recs = prediction_engine.generate_recommendations(data)
    current_aqi = data.get("aqi", 50.0)
    forecast = prediction_engine.forecast_aqi(
        current_aqi, data.get("wind_speed", 4.0), data.get("temperature", 22.0), data.get("humidity", 55.0)
    )
    detections = vision_detector.get_live_detections(data.get("drone_id", "VTOL-001"), current_aqi)
    
    return {
        **forecast,
        **recs,
        "detections": detections
    }

@router.get("/hotspots")
def get_hotspots():
    """
    Returns AI-clustered pollution hotspots.
    """
    points = simulator.historical_heatmap_points
    if not points:
        # Generate sample points
        points = [
            {"lat": 37.7782, "lng": -122.4165, "val": 125.0, "layer": "aqi"},
            {"lat": 37.7845, "lng": -122.4072, "val": 95.0, "layer": "aqi"},
            {"lat": 37.7655, "lng": -122.4340, "val": 35.0, "layer": "aqi"}
        ]
    hotspots = anomaly_detector.detect_hotspots(points, threshold=70.0)
    return hotspots

@router.get("/vision-threats")
def get_vision_threats(drone_id: str = Query("VTOL-001")):
    """
    Returns active computer vision hazard detection feed with bounding boxes.
    """
    d = simulator.drones.get(drone_id)
    aqi = 85.0 if d and d.zone_type == "industrial" else 45.0
    return {
        "drone_id": drone_id,
        "detections": vision_detector.get_live_detections(drone_id, aqi)
    }
