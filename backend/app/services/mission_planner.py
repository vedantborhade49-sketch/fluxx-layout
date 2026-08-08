import math
import json
from typing import List, Dict, Any, Tuple

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates haversine distance in meters between two lat/lng coordinates."""
    R = 6371000  # Radius of earth in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) *
         math.sin(delta_lambda / 2.0) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

class MissionPlanner:
    @staticmethod
    def generate_survey_grid(
        polygon: List[List[float]],
        altitude: float = 120.0,
        spacing_meters: float = 80.0,
        speed_ms: float = 12.0
    ) -> Dict[str, Any]:
        """
        Generates a serpentine survey grid inside a bounding polygon.
        Polygon format: [[lat1, lng1], [lat2, lng2], ...]
        """
        if not polygon or len(polygon) < 3:
            # Fallback default area
            polygon = [
                [37.7749, -122.4294],
                [37.7849, -122.4294],
                [37.7849, -122.4094],
                [37.7749, -122.4094]
            ]

        lats = [p[0] for p in polygon]
        lngs = [p[1] for p in polygon]

        min_lat, max_lat = min(lats), max(lats)
        min_lng, max_lng = min(lngs), max(lngs)

        # 1 deg lat ~= 111,000 meters
        lat_step = (spacing_meters / 111000.0)
        # 1 deg lng ~= 111,000 * cos(lat) meters
        avg_lat = (min_lat + max_lat) / 2.0
        lng_step = (spacing_meters / (111000.0 * math.cos(math.radians(avg_lat))))

        waypoints: List[Dict[str, Any]] = []

        # Takeoff waypoint
        waypoints.append({
            "lat": min_lat,
            "lng": min_lng,
            "alt": altitude,
            "action": "TAKEOFF",
            "speed": speed_ms
        })

        curr_lat = min_lat
        sweep_east = True
        total_distance = 0.0

        while curr_lat <= max_lat + (lat_step / 2.0):
            if sweep_east:
                wp1 = {"lat": curr_lat, "lng": min_lng, "alt": altitude, "action": "SURVEY", "speed": speed_ms}
                wp2 = {"lat": curr_lat, "lng": max_lng, "alt": altitude, "action": "SURVEY", "speed": speed_ms}
                waypoints.extend([wp1, wp2])
            else:
                wp1 = {"lat": curr_lat, "lng": max_lng, "alt": altitude, "action": "SURVEY", "speed": speed_ms}
                wp2 = {"lat": curr_lat, "lng": min_lng, "alt": altitude, "action": "SURVEY", "speed": speed_ms}
                waypoints.extend([wp1, wp2])
            
            sweep_east = not sweep_east
            curr_lat += lat_step

        # Return to home waypoint
        waypoints.append({
            "lat": min_lat,
            "lng": min_lng,
            "alt": altitude,
            "action": "RTH",
            "speed": speed_ms
        })

        # Calculate total distance along waypoints
        for i in range(len(waypoints) - 1):
            w1 = waypoints[i]
            w2 = waypoints[i + 1]
            total_distance += calculate_distance(w1["lat"], w1["lng"], w2["lat"], w2["lng"])

        distance_km = round(total_distance / 1000.0, 2)
        flight_time_sec = total_distance / speed_ms
        flight_time_min = round(flight_time_sec / 60.0, 1)

        # Estimate coverage area (km2)
        d_lat = (max_lat - min_lat) * 111.0
        d_lng = (max_lng - min_lng) * 111.0 * math.cos(math.radians(avg_lat))
        coverage_sqkm = round(abs(d_lat * d_lng), 2)

        # Estimate battery consumption (assuming ~1.2% per minute of VTOL cruise + 5% takeoff/landing reserve)
        battery_req = round(min(100.0, 5.0 + (flight_time_min * 1.25)), 1)

        return {
            "waypoints": waypoints,
            "distance_km": distance_km,
            "flight_time_min": flight_time_min,
            "coverage_sqkm": coverage_sqkm,
            "battery_required_percent": battery_req,
            "altitude": altitude,
            "waypoint_count": len(waypoints)
        }

mission_planner = MissionPlanner()
