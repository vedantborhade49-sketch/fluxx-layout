import math
from typing import List, Dict, Any

class AnomalyDetector:
    """
    Identifies spatial clusters of acute emissions and anomalous sensor deviations.
    """
    
    @staticmethod
    def detect_hotspots(points: List[Dict[str, Any]], threshold: float = 85.0) -> List[Dict[str, Any]]:
        """
        Groups points exceeding threshold into localized hotspot zones with estimated radius and severity.
        """
        hotspots = []
        high_points = [p for p in points if p.get("val", 0) >= threshold]
        
        # Simple spatial clustering
        for pt in high_points:
            lat, lng, val = pt["lat"], pt["lng"], pt["val"]
            severity = "CRITICAL" if val > 150 else ("HIGH" if val > 100 else "ELEVATED")
            hotspots.append({
                "id": f"HOTSPOT-{round(lat, 4)}-{round(lng, 4)}",
                "lat": lat,
                "lng": lng,
                "intensity": val,
                "severity": severity,
                "radius_meters": 120 + int(val * 1.5),
                "suspected_source": "Refinery Flares / High Traffic Inversion" if val > 120 else "Construction Dust Exhaust",
                "layer": pt.get("layer", "aqi")
            })
        return hotspots

anomaly_detector = AnomalyDetector()
