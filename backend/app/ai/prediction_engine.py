import math
import random
from typing import Dict, Any, List

class PredictionEngine:
    """
    Simulates / Computes AI-driven atmospheric pollution dispersion and multi-horizon forecasts
    based on current sensor readings, meteorological vectors (wind speed/direction), and diurnal curves.
    """
    
    @staticmethod
    def forecast_aqi(current_aqi: float, wind_speed: float, temp: float, humidity: float) -> Dict[str, Any]:
        """
        Calculates AQI projections for 30m, 1h, 6h, and 24h horizons.
        Accounts for thermal stagnation, wind clearing factor, and diurnal emission cycles.
        """
        # Wind ventilation factor: higher wind disperses pollutants
        ventilation_factor = max(0.65, 1.0 - (wind_speed * 0.04))
        # Temperature inversion factor: cool ground + warm upper air traps pollutants
        inversion_factor = 1.15 if temp < 15.0 and humidity > 70.0 else 0.95
        
        # 30-min projection (high inertia)
        pred_30m = round(current_aqi * (0.95 + (random.random() * 0.10) * ventilation_factor), 1)
        
        # 1-hour projection
        trend_1h = 1.05 * inversion_factor * ventilation_factor
        pred_1h = round(current_aqi * (trend_1h + (random.random() * 0.08 - 0.04)), 1)
        
        # 6-hour projection (diurnal shift)
        trend_6h = 1.18 * inversion_factor * ventilation_factor
        pred_6h = round(max(20.0, current_aqi * trend_6h + random.uniform(-5.0, 8.0)), 1)
        
        # 24-hour projection (cyclical normalization)
        pred_24h = round(max(25.0, current_aqi * 0.88 + random.uniform(-4.0, 6.0)), 1)
        
        # Generate 24-point hourly timeline for chart plotting
        hourly_forecast: List[Dict[str, Any]] = []
        base = current_aqi
        for hour in range(1, 25):
            diurnal_wave = math.sin((hour - 8) * math.pi / 12.0) * 15.0 # Peak around rush hour (8am/6pm)
            val = max(15.0, base + diurnal_wave * inversion_factor + random.uniform(-3.0, 3.0))
            hourly_forecast.append({
                "hour": f"+{hour}h",
                "predicted_aqi": round(val, 1),
                "confidence_lower": round(max(10.0, val * 0.88), 1),
                "confidence_upper": round(val * 1.12, 1)
            })
            
        return {
            "current_aqi": current_aqi,
            "prediction_30m": pred_30m,
            "prediction_1h": pred_1h,
            "prediction_6h": pred_6h,
            "prediction_24h": pred_24h,
            "confidence_score": 0.94,
            "atmospheric_risk": "ELEVATED" if pred_6h > 100 else ("MODERATE" if pred_6h > 50 else "LOW"),
            "hourly_timeline": hourly_forecast
        }

    @staticmethod
    def generate_recommendations(sensor_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generates AI actionable intelligence based on sensor anomalies."""
        pm25 = sensor_data.get("pm25", 15.0)
        co2 = sensor_data.get("co2", 415.0)
        voc = sensor_data.get("voc", 100.0)
        methane = sensor_data.get("methane", 1.8)
        
        if methane > 10.0:
            return {
                "risk_level": "CRITICAL",
                "pollution_type": "Fugitive Methane Emission",
                "source_hypothesis": "Industrial Flange / Pipeline Micro-Fracture",
                "confidence": 0.96,
                "recommendation": "IMMEDIATE ACTION: Dispatch emergency ground hazmat crew to inspect Sector 4 pipeline manifold. Reroute non-essential personnel.",
                "suggested_actions": [
                    "Isolate pipeline valve sector 4B",
                    "Maintain continuous VTOL thermal gas imaging",
                    "Alert municipal environmental safety authority"
                ]
            }
        elif pm25 > 80.0:
            return {
                "risk_level": "HIGH",
                "pollution_type": "Fine Particulate (PM2.5) Plume",
                "source_hypothesis": "Uncontained Construction Excavation or Diesel Generators",
                "confidence": 0.91,
                "recommendation": "Deploy mobile misting cannons at north perimeter. Issue advisory to neighboring commercial districts.",
                "suggested_actions": [
                    "Activate perimeter dust suppression water atomizers",
                    "Enforce 15 km/h speed limits on unpaved access roads",
                    "Increase VTOL survey frequency from 30m to 10m intervals"
                ]
            }
        elif voc > 350.0:
            return {
                "risk_level": "MODERATE",
                "pollution_type": "Volatile Organic Solvents (VOC)",
                "source_hypothesis": "Paint Finishing or Chemical Storage Venting",
                "confidence": 0.88,
                "recommendation": "Inspect storage tank vapor recovery units. Verify solvent capture filter efficiency.",
                "suggested_actions": [
                    "Audit vapor containment seals on storage vessels",
                    "Check industrial scrubber exhaust telemetry",
                    "Log environmental compliance report"
                ]
            }
        else:
            return {
                "risk_level": "LOW",
                "pollution_type": "Nominal Ambient Background",
                "source_hypothesis": "Normal Regional Circulation",
                "confidence": 0.98,
                "recommendation": "All environmental parameters are within EPA/WHO Class-1 standards. Continue routine autonomous patrols.",
                "suggested_actions": [
                    "Maintain scheduled autonomous patrol grids",
                    "Archive sensor telemetry to historical compliance ledger"
                ]
            }

prediction_engine = PredictionEngine()
