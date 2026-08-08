"""
FLUXX Dynamic Environmental Anomaly Detection Engine
Calculates rolling baseline averages, standard deviation bounds, and rate of change spikes.
Provides scientifically defensible, explainable anomaly notifications.
"""

from typing import List, Dict, Any, Optional
import math
import logging

logger = logging.getLogger("fluxx.anomaly")

class DynamicAnomalyDetector:
    def __init__(self, window_size: int = 5):
        self.window_size = window_size
        self.history: List[Dict[str, float]] = []

    def reset(self):
        self.history.clear()

    def evaluate_sample(self, sample: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Evaluates a newly arrived normalized sample against the rolling window.
        Returns explainable anomaly payload if an anomaly is confirmed.
        """
        sensors = sample.get("sensors", {})
        pm25 = float(sensors.get("pm25", 0.0))
        pm10 = float(sensors.get("pm10", 0.0))
        co2 = float(sensors.get("co2", 400.0))
        wind_speed = float(sensors.get("windSpeed", 2.5))
        sample_num = sample.get("sample", len(self.history) + 1)
        timestamp = sample.get("timestamp", "")
        location = sample.get("location", {})

        current_entry = {
            "pm25": pm25,
            "pm10": pm10,
            "co2": co2,
            "windSpeed": wind_speed
        }

        # Need at least 2 historical samples to calculate rate of change & baseline
        if len(self.history) < 2:
            self.history.append(current_entry)
            return None

        # Compute baseline on rolling window
        recent_window = self.history[-self.window_size:]
        avg_pm25 = sum(item["pm25"] for item in recent_window) / len(recent_window)
        variance = sum((item["pm25"] - avg_pm25) ** 2 for item in recent_window) / len(recent_window)
        std_pm25 = math.sqrt(variance)

        # Rate of change relative to recent baseline
        pct_change = ((pm25 - avg_pm25) / max(1.0, avg_pm25)) * 100.0

        anomaly = None

        # Anomaly Condition: > 35% sudden surge OR > 2.0 std dev above baseline
        if (pct_change >= 35.0 or (std_pm25 > 0 and (pm25 - avg_pm25) > 2.0 * std_pm25)) and pm25 > 45.0:
            supporting_indicators = []
            if pm10 > 75.0:
                supporting_indicators.append(f"PM10 Coarse Dust elevated ({pm10} µg/m³)")
            if co2 > 500.0:
                supporting_indicators.append(f"CO₂ concentration elevated ({co2} ppm)")
            supporting_indicators.append(f"Local wind speed {wind_speed} m/s")

            confidence = min(96, max(70, int(75 + abs(pct_change) * 0.15)))
            severity = "CRITICAL" if pm25 >= 75.0 or pct_change >= 80 else "WARNING"

            anomaly = {
                "id": f"ANOM-KH-{sample_num:03d}",
                "sample": sample_num,
                "timestamp": timestamp,
                "type": "ENVIRONMENTAL_ANOMALY",
                "severity": severity,
                "title": "ENVIRONMENTAL ANOMALY",
                "description": f"PM2.5 increased {abs(int(pct_change))}% relative to recent baseline ({avg_pm25:.1f} µg/m³).",
                "primary_indicator": "PM2.5",
                "baseline_value": round(avg_pm25, 1),
                "observed_value": round(pm25, 1),
                "change_percent": round(pct_change, 1),
                "supporting_indicators": supporting_indicators,
                "confidence": confidence,
                "location": location,
                "source": sample.get("source", "kharghar_csv")
            }

        # Keep history bounded
        self.history.append(current_entry)
        if len(self.history) > 50:
            self.history.pop(0)

        return anomaly

# Singleton instance
anomaly_detector = DynamicAnomalyDetector(window_size=5)
