import logging
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from app.models.alert import Alert
from app.models.sensor import SensorReading
from app.models.drone import Drone
from app.database import SessionLocal

logger = logging.getLogger(__name__)

# Configurable Alert Rules
RULES = [
    {
        "type": "PM25_SPIKE",
        "metric": "pm25",
        "threshold": 100.0,
        "operator": ">",
        "severity": "CRITICAL",
        "title": "Severe PM2.5 Pollution Spike Detected",
        "desc_template": "PM2.5 levels surged to {val:.1f} µg/m³ (Limit: 100.0 µg/m³). Immediate dust suppression required."
    },
    {
        "type": "PM10_SPIKE",
        "metric": "pm10",
        "threshold": 150.0,
        "operator": ">",
        "severity": "WARNING",
        "title": "High Coarse Particulate (PM10) Alert",
        "desc_template": "PM10 recorded at {val:.1f} µg/m³ exceeding environmental threshold."
    },
    {
        "type": "CO2_ELEVATED",
        "metric": "co2",
        "threshold": 800.0,
        "operator": ">",
        "severity": "WARNING",
        "title": "Elevated Carbon Dioxide Concentration",
        "desc_template": "CO2 levels at {val:.0f} ppm indicate industrial exhaust or combustion plume."
    },
    {
        "type": "VOC_TOXIC",
        "metric": "voc",
        "threshold": 400.0,
        "operator": ">",
        "severity": "CRITICAL",
        "title": "Volatile Organic Compounds (VOC) Spike",
        "desc_template": "VOC concentration reached {val:.0f} ppb. Potential chemical or solvent leak."
    },
    {
        "type": "METHANE_LEAK",
        "metric": "methane",
        "threshold": 15.0,
        "operator": ">",
        "severity": "EMERGENCY",
        "title": "Industrial Methane Fugitive Emission",
        "desc_template": "Methane reading surged to {val:.1f} ppm in sector. Flammable gas risk."
    },
    {
        "type": "LOW_BATTERY",
        "metric": "battery",
        "threshold": 20.0,
        "operator": "<",
        "severity": "WARNING",
        "title": "VTOL Battery Reserve Depleted (<20%)",
        "desc_template": "Drone battery at {val:.1f}%. Preparing Return-To-Home sequence."
    },
    {
        "type": "CRITICAL_BATTERY",
        "metric": "battery",
        "threshold": 10.0,
        "operator": "<",
        "severity": "EMERGENCY",
        "title": "Critical Battery Level (<10%) - Emergency RTH",
        "desc_template": "Drone battery at {val:.1f}%. Immediate autonomous landing initiated."
    },
    {
        "type": "HIGH_TEMPERATURE",
        "metric": "temperature",
        "threshold": 42.0,
        "operator": ">",
        "severity": "WARNING",
        "title": "Extreme Ambient Thermal Condition",
        "desc_template": "Ambient temperature measured at {val:.1f}°C, exceeding standard operational limits."
    },
    {
        "type": "HIGH_WIND",
        "metric": "wind_speed",
        "threshold": 14.0,
        "operator": ">",
        "severity": "WARNING",
        "title": "VTOL High Wind Hazard (>14 m/s)",
        "desc_template": "Wind speed gusts at {val:.1f} m/s. Flight stability mode engaged."
    }
]

class AlertEngine:
    def __init__(self):
        self._last_alert_time: Dict[str, datetime] = {}
        self._cooldown_seconds = 45 # Prevent spamming same alert repeatedly

    def evaluate_reading(self, reading: Dict[str, Any], drone_id: str) -> List[Dict[str, Any]]:
        """Evaluates incoming sensor reading against defined threshold rules."""
        triggered_alerts = []
        now = datetime.now(timezone.utc)
        
        for rule in RULES:
            metric = rule["metric"]
            val = reading.get(metric)
            if val is None:
                continue
                
            threshold = rule["threshold"]
            op = rule["operator"]
            triggered = False
            
            if op == ">" and val > threshold:
                triggered = True
            elif op == "<" and val < threshold:
                triggered = True
                
            if triggered:
                key = f"{drone_id}_{rule['type']}"
                last_time = self._last_alert_time.get(key)
                if last_time and (now - last_time).total_seconds() < self._cooldown_seconds:
                    continue
                
                self._last_alert_time[key] = now
                
                alert_id = f"ALT-{int(now.timestamp() * 1000)}-{drone_id}-{rule['type'][:4]}"
                description = rule["desc_template"].format(val=val)
                
                alert_dict = {
                    "id": alert_id,
                    "drone_id": drone_id,
                    "type": rule["type"],
                    "severity": rule["severity"],
                    "title": rule["title"],
                    "description": description,
                    "location_name": f"Drone {drone_id} Sector",
                    "latitude": reading.get("latitude"),
                    "longitude": reading.get("longitude"),
                    "metric_name": metric,
                    "metric_value": float(val),
                    "threshold_value": float(threshold),
                    "timestamp": now.isoformat(),
                    "resolved": False
                }
                
                # Persist alert to database
                self._persist_alert(alert_dict)
                triggered_alerts.append(alert_dict)
                
        return triggered_alerts

    def _persist_alert(self, alert_dict: Dict[str, Any]):
        try:
            db = SessionLocal()
            alert_obj = Alert(
                id=alert_dict["id"],
                drone_id=alert_dict["drone_id"],
                type=alert_dict["type"],
                severity=alert_dict["severity"],
                title=alert_dict["title"],
                description=alert_dict["description"],
                location_name=alert_dict["location_name"],
                latitude=alert_dict.get("latitude"),
                longitude=alert_dict.get("longitude"),
                metric_name=alert_dict.get("metric_name"),
                metric_value=alert_dict.get("metric_value"),
                threshold_value=alert_dict.get("threshold_value"),
                timestamp=datetime.now(timezone.utc),
                resolved=False
            )
            db.add(alert_obj)
            db.commit()
            db.close()
        except Exception as e:
            logger.error(f"Failed to persist alert {alert_dict['id']}: {e}")

alert_engine = AlertEngine()
