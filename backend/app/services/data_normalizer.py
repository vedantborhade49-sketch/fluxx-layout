"""
FLUXX Unified Environmental Data Normalization Engine
Maps arbitrary inputs (CSV rows, ESP32 MQTT/Serial, VTOL MAVLink) to the Standard FLUXX Environmental Data Contract.
"""

from datetime import datetime, timezone
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger("fluxx.normalizer")

def normalize_environmental_reading(
    raw_data: Dict[str, Any],
    source: str = "kharghar_csv",
    mode: str = "replay"
) -> Dict[str, Any]:
    """
    Validates and normalizes raw environmental sensor inputs into standard FLUXX Data Contract.
    """
    # 1. Parse & Normalize Timestamp
    raw_ts = raw_data.get("timestamp") or raw_data.get("time") or raw_data.get("ts")
    if isinstance(raw_ts, datetime):
        iso_timestamp = raw_ts.isoformat()
    elif isinstance(raw_ts, str):
        try:
            # Handle standard format: 'YYYY-MM-DD HH:MM:SS'
            dt = datetime.strptime(raw_ts.strip(), "%Y-%m-%d %H:%M:%S")
            iso_timestamp = dt.replace(tzinfo=timezone.utc).isoformat()
        except ValueError:
            try:
                dt = datetime.fromisoformat(raw_ts.strip().replace("Z", "+00:00"))
                iso_timestamp = dt.isoformat()
            except Exception:
                iso_timestamp = datetime.now(timezone.utc).isoformat()
    else:
        iso_timestamp = datetime.now(timezone.utc).isoformat()

    # 2. Parse & Validate Coordinates
    try:
        lat = float(raw_data.get("latitude") or raw_data.get("lat") or 19.05028)
        lng = float(raw_data.get("longitude") or raw_data.get("lng") or raw_data.get("lon") or 73.06907)
        elevation = float(raw_data.get("elevation") or raw_data.get("alt") or raw_data.get("altitude") or 15.0)
    except (ValueError, TypeError):
        lat, lng, elevation = 19.05028, 73.06907, 15.0

    # 3. Parse & Standardize Sensor Readings
    def safe_float(keys, default_val=0.0):
        if isinstance(keys, str):
            keys = [keys]
        for k in keys:
            if k in raw_data and raw_data[k] is not None:
                try:
                    return round(float(raw_data[k]), 2)
                except (ValueError, TypeError):
                    pass
        return default_val

    pm25 = safe_float(["pm2_5_ug_m3", "pm25", "pm2_5", "pm2.5"], default_val=35.0)
    pm10 = safe_float(["pm10_ug_m3", "pm10", "pm_10"], default_val=55.0)
    co2 = safe_float(["co2_ppm", "co2", "carbon_dioxide"], default_val=420.0)
    temp = safe_float(["temperature_c", "temperature", "temp", "temp_c"], default_val=28.0)
    humidity = safe_float(["humidity_percent", "humidity", "rh"], default_val=65.0)
    wind_speed = safe_float(["wind_speed_m_s", "windSpeed", "wind_speed", "wind"], default_val=2.5)
    wind_dir = safe_float(["wind_direction_deg", "windDirection", "wind_direction", "bearing"], default_val=240.0)
    voc = safe_float(["voc_ppb", "voc", "tvoc"], default_val=max(15.0, round(pm25 * 1.8, 1)))

    return {
        "timestamp": iso_timestamp,
        "source": source,
        "mode": mode,
        "location": {
            "latitude": lat,
            "longitude": lng,
            "elevation": elevation
        },
        "sensors": {
            "pm25": pm25,
            "pm10": pm10,
            "co2": co2,
            "temperature": temp,
            "humidity": humidity,
            "windSpeed": wind_speed,
            "windDirection": wind_dir,
            "voc": voc
        }
    }
