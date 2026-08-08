"""
FLUXX Environmental Risk Index (ERI) Calculation Engine
Computes dynamic composite risk index (0-100) based on weighted multi-sensor parameters.
"""

from typing import Dict, Any
from datetime import datetime, timezone

def calculate_eri(sensors: Dict[str, float], timestamp: str = None) -> Dict[str, Any]:
    """
    Computes the FLUXX Environmental Risk Index (0-100).
    Weights:
      - PM2.5: 35%
      - PM10:  20%
      - CO2:   20%
      - Thermal / Humidity Discomfort: 15%
      - Wind Stagnation / Dispersion Risk: 10%
    """
    pm25 = sensors.get("pm25", 0.0)
    pm10 = sensors.get("pm10", 0.0)
    co2 = sensors.get("co2", 400.0)
    temp = sensors.get("temperature", 25.0)
    humidity = sensors.get("humidity", 50.0)
    wind_speed = sensors.get("windSpeed", 3.0)

    # 1. PM2.5 sub-index (0 to 100 based on standard AQI breakpoints)
    if pm25 <= 12.0:
        pm25_sub = (pm25 / 12.0) * 25
    elif pm25 <= 35.4:
        pm25_sub = 25 + ((pm25 - 12.0) / 23.4) * 25
    elif pm25 <= 55.4:
        pm25_sub = 50 + ((pm25 - 35.4) / 20.0) * 25
    else:
        pm25_sub = min(100, 75 + ((pm25 - 55.4) / 95.0) * 25)

    # 2. PM10 sub-index
    if pm10 <= 54:
        pm10_sub = (pm10 / 54.0) * 25
    elif pm10 <= 154:
        pm10_sub = 25 + ((pm10 - 54.0) / 100.0) * 25
    elif pm10 <= 254:
        pm10_sub = 50 + ((pm10 - 154.0) / 100.0) * 25
    else:
        pm10_sub = min(100, 75 + ((pm10 - 254.0) / 150.0) * 25)

    # 3. CO2 sub-index
    if co2 <= 450:
        co2_sub = 15.0
    elif co2 <= 650:
        co2_sub = 15.0 + ((co2 - 450) / 200) * 35
    elif co2 <= 1000:
        co2_sub = 50.0 + ((co2 - 650) / 350) * 30
    else:
        co2_sub = min(100, 80.0 + ((co2 - 1000) / 1000) * 20)

    # 4. Thermal & Humidity Heat Index Discomfort
    thermal_sub = max(0, min(100, (temp - 24) * 4.5 + max(0, (humidity - 60) * 0.8)))

    # 5. Wind Stagnation factor (Low wind traps pollutants)
    if wind_speed < 1.0:
        stagnation_sub = 85.0
    elif wind_speed < 2.5:
        stagnation_sub = 55.0
    else:
        stagnation_sub = max(10.0, 40.0 - wind_speed * 5.0)

    # Weighted Composite Score
    score = (
        0.35 * pm25_sub +
        0.20 * pm10_sub +
        0.20 * co2_sub +
        0.15 * thermal_sub +
        0.10 * stagnation_sub
    )
    score = int(round(max(0, min(100, score))))

    if score <= 30:
        level = "GOOD"
        recommendation = "Air quality is satisfactory. Atmospheric conditions promote healthy dispersion."
    elif score <= 60:
        level = "MODERATE"
        recommendation = "Acceptable environmental baseline. Sensitive individuals should monitor outdoor exposure."
    elif score <= 80:
        level = "UNHEALTHY"
        recommendation = "Elevated particulate concentrations detected. Reduce prolonged outdoor physical exertion."
    else:
        level = "HAZARDOUS"
        recommendation = "Critical pollution plume detected. Immediate mitigation and alert dispatch recommended."

    # Identify primary contributing indicator
    sub_scores = {
        "PM2.5": pm25_sub,
        "PM10": pm10_sub,
        "CO₂": co2_sub,
        "Thermal Stress": thermal_sub,
        "Air Stagnation": stagnation_sub
    }
    primary_pollutant = max(sub_scores, key=sub_scores.get)

    return {
        "score": score,
        "level": level,
        "primary_pollutant": primary_pollutant,
        "recommendation": recommendation,
        "sub_scores": {k: round(v, 1) for k, v in sub_scores.items()},
        "timestamp": timestamp or datetime.now(timezone.utc).isoformat()
    }
