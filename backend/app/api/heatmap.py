from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import random
from app.database import get_db
from app.models.heatmap import HeatmapPoint
from app.services.simulator import simulator

router = APIRouter(prefix="/heatmap", tags=["Heatmap"])

@router.get("")
def get_heatmap_points(
    layer: str = Query("aqi"), # aqi, pm25, pm10, co2, voc, temp, humidity, wind, noise, ozone, methane
    limit: int = Query(250, le=1000),
    db: Session = Depends(get_db)
):
    """
    Returns interpolated spatial points for the selected heatmap layer.
    """
    # Fetch historical base points from simulator + database
    points = []
    
    # Add simulator dynamic memory points
    for p in simulator.historical_heatmap_points:
        val = p.get(layer, p.get("val", 50.0))
        points.append({
            "lat": p["lat"],
            "lng": p["lng"],
            "val": float(val),
            "weight": p.get("weight", 1.0),
            "layer": layer
        })
        
    # If not enough simulator points, pull from DB
    if len(points) < 80:
        db_pts = db.query(HeatmapPoint).limit(limit).all()
        for dp in db_pts:
            val = dp.value
            # Layer multiplier adjustments for realistic scales
            if layer == "pm25": val = round(dp.value * 0.28, 1)
            elif layer == "pm10": val = round(dp.value * 0.55, 1)
            elif layer == "co2": val = round(400.0 + dp.value * 2.5, 1)
            elif layer == "voc": val = round(60.0 + dp.value * 2.0, 1)
            elif layer == "temp": val = round(21.5 + (dp.value % 5), 1)
            elif layer == "wind": val = round(4.5 + (dp.value % 6), 1)
            elif layer == "methane": val = round(1.6 + (dp.value % 3) * 0.5, 2)
            elif layer == "ozone": val = round(25.0 + (dp.value % 20), 1)
            elif layer == "noise": val = round(45.0 + (dp.value % 30), 1)
            
            points.append({
                "lat": dp.latitude,
                "lng": dp.longitude,
                "val": float(val),
                "weight": dp.weight,
                "layer": layer
            })
            
    return {
        "layer": layer,
        "count": len(points),
        "points": points
    }

@router.get("/latest")
def get_latest_heatmap_matrix():
    """Returns compact spatial coordinates for all layers."""
    return {
        "active_drones": list(simulator.drones.keys()),
        "layers_available": [
            "aqi", "pm25", "pm10", "co2", "voc", "temp", "humidity", "wind", "noise", "ozone", "methane"
        ],
        "points_count": len(simulator.historical_heatmap_points)
    }
