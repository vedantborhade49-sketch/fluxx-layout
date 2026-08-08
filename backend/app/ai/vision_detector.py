import random
from typing import List, Dict, Any

class VisionDetector:
    """
    Simulates / processes aerial drone optical & thermal camera feeds
    with YOLOv8/YOLOv10 object detection bounding boxes for environmental hazards.
    """
    
    CLASSES = [
        {"label": "Smoke Plume", "risk": "HIGH", "color": "#FF3366"},
        {"label": "Construction Dust", "risk": "MEDIUM", "color": "#FFB800"},
        {"label": "Industrial Flare", "risk": "CRITICAL", "color": "#FF0055"},
        {"label": "Illegal Waste Site", "risk": "HIGH", "color": "#9900FF"},
        {"label": "Thermal Anomaly (Hotspot)", "risk": "HIGH", "color": "#FF5500"},
        {"label": "Vegetation Stress", "risk": "LOW", "color": "#00FF9D"},
        {"label": "Standing Waterlogging", "risk": "MEDIUM", "color": "#00F0FF"}
    ]
    
    @staticmethod
    def get_live_detections(drone_id: str, current_aqi: float) -> List[Dict[str, Any]]:
        """
        Returns active computer vision bounding boxes based on drone location & pollution levels.
        """
        detections = []
        
        # If air quality is polluted or industrial, generate relevant hazard detection bounding boxes
        if current_aqi > 75.0 or "VTOL-001" in drone_id:
            # Industrial emissions / dust
            detections.append({
                "id": "det-1",
                "label": "Smoke Plume",
                "confidence": round(random.uniform(0.88, 0.97), 2),
                "bbox": [0.18, 0.22, 0.58, 0.62], # [ymin, xmin, ymax, xmax] in normalized 0-1 coords
                "risk": "HIGH",
                "color": "#FF3366",
                "area_m2": 420.0
            })
            detections.append({
                "id": "det-2",
                "label": "Construction Dust",
                "confidence": round(random.uniform(0.82, 0.94), 2),
                "bbox": [0.45, 0.60, 0.82, 0.89],
                "risk": "MEDIUM",
                "color": "#FFB800",
                "area_m2": 850.0
            })
        elif "VTOL-003" in drone_id:
            # Forest / Agriculture
            detections.append({
                "id": "det-3",
                "label": "Vegetation Stress",
                "confidence": round(random.uniform(0.89, 0.98), 2),
                "bbox": [0.30, 0.35, 0.70, 0.75],
                "risk": "LOW",
                "color": "#00FF9D",
                "area_m2": 1200.0
            })
        else:
            # Urban traffic
            detections.append({
                "id": "det-4",
                "label": "Thermal Anomaly (Hotspot)",
                "confidence": round(random.uniform(0.85, 0.95), 2),
                "bbox": [0.25, 0.28, 0.62, 0.68],
                "risk": "MEDIUM",
                "color": "#FF5500",
                "area_m2": 310.0
            })
            
        return detections

vision_detector = VisionDetector()
