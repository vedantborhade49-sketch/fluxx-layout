import math
import random
from datetime import datetime, timezone
from typing import Dict, Any, List

class DigitalTwinService:
    def __init__(self):
        self.twins: Dict[str, Dict[str, Any]] = {
            "VTOL-001": {
                "id": "TWIN-VTOL-001",
                "drone_id": "VTOL-001",
                "name": "SkyGuardian Pro Twin",
                "battery_soh": 98.2, # %
                "battery_cycles": 42,
                "battery_temp": 28.6,
                "motor1_temp": 42.4,
                "motor2_temp": 41.9,
                "motor3_temp": 43.1,
                "motor4_temp": 42.8,
                "esc_temp": 47.1,
                "vibration_level": 0.11, # G
                "compass_health": 99.4,
                "servo_wear": 3.2,
                "failure_risk_score": 0.03, # 3% failure risk
                "flight_hours_total": 154.2,
                "last_calibration": "2026-08-01T08:00:00Z",
                "simulated_burn_rate": 1.25, # %/min
                "firmware_version": "v4.2.1-PRO"
            },
            "VTOL-002": {
                "id": "TWIN-VTOL-002",
                "drone_id": "VTOL-002",
                "name": "AeroSentry X8 Twin",
                "battery_soh": 95.8,
                "battery_cycles": 78,
                "battery_temp": 31.2,
                "motor1_temp": 44.5,
                "motor2_temp": 45.1,
                "motor3_temp": 44.8,
                "motor4_temp": 45.9,
                "esc_temp": 49.3,
                "vibration_level": 0.16,
                "compass_health": 98.1,
                "servo_wear": 6.8,
                "failure_risk_score": 0.08,
                "flight_hours_total": 289.4,
                "last_calibration": "2026-07-28T14:30:00Z",
                "simulated_burn_rate": 1.35,
                "firmware_version": "v4.2.1-PRO"
            },
            "VTOL-003": {
                "id": "TWIN-VTOL-003",
                "drone_id": "VTOL-003",
                "name": "EcoHawk Ranger Twin",
                "battery_soh": 99.1,
                "battery_cycles": 18,
                "battery_temp": 26.4,
                "motor1_temp": 39.8,
                "motor2_temp": 39.4,
                "motor3_temp": 40.2,
                "motor4_temp": 39.9,
                "esc_temp": 43.6,
                "vibration_level": 0.08,
                "compass_health": 99.8,
                "servo_wear": 1.5,
                "failure_risk_score": 0.01,
                "flight_hours_total": 62.8,
                "last_calibration": "2026-08-05T10:15:00Z",
                "simulated_burn_rate": 1.15,
                "firmware_version": "v4.2.1-PRO"
            }
        }

    def get_twin(self, drone_id: str) -> Dict[str, Any]:
        twin = self.twins.get(drone_id, self.twins["VTOL-001"])
        # Add micro fluctuations for real-time fidelity
        motor_jitter = random.uniform(-0.4, 0.4)
        return {
            **twin,
            "motor1_temp": round(twin["motor1_temp"] + motor_jitter, 1),
            "motor2_temp": round(twin["motor2_temp"] + motor_jitter, 1),
            "motor3_temp": round(twin["motor3_temp"] + motor_jitter, 1),
            "motor4_temp": round(twin["motor4_temp"] + motor_jitter, 1),
            "esc_temp": round(twin["esc_temp"] + random.uniform(-0.3, 0.3), 1),
            "vibration_level": round(max(0.05, twin["vibration_level"] + random.uniform(-0.01, 0.01)), 3),
            "synced_at": datetime.now(timezone.utc).isoformat()
        }

    def simulate_pre_flight_mission(
        self,
        drone_id: str,
        distance_km: float,
        planned_altitude: float,
        wind_speed: float,
        payload_weight_kg: float = 1.2
    ) -> Dict[str, Any]:
        """
        AI Digital Twin Physics Engine: Simulates mission execution prior to flight.
        Calculates aerodynamics, wind drag penalty, payload mass inertia, and battery depletion profile.
        """
        twin = self.twins.get(drone_id, self.twins["VTOL-001"])
        
        # Base cruise speed = 12 m/s (~43.2 km/h)
        cruise_speed_kmh = 43.2
        flight_duration_hours = distance_km / cruise_speed_kmh
        flight_duration_min = flight_duration_hours * 60.0
        
        # Aerodynamic wind resistance factor
        wind_drag_multiplier = 1.0 + (wind_speed / 20.0) * 0.45
        
        # Payload penalty factor
        payload_multiplier = 1.0 + (payload_weight_kg / 3.0) * 0.25
        
        # Altitude penalty (air density)
        alt_multiplier = 1.0 + (planned_altitude / 500.0) * 0.08
        
        # Total predicted energy drain
        base_burn_rate = twin["simulated_burn_rate"] # % / min
        effective_burn_rate = base_burn_rate * wind_drag_multiplier * payload_multiplier * alt_multiplier
        predicted_battery_drain = round(flight_duration_min * effective_burn_rate, 1)
        remaining_battery_landing = round(max(0.0, 100.0 - predicted_battery_drain), 1)
        
        # Safety margin evaluation
        if remaining_battery_landing < 20.0:
            mission_feasibility = "HIGH_RISK"
            recommendation = "Warning: Predicted landing battery is below critical reserve (20%). Recommend reducing survey area or increasing altitude spacing."
        elif remaining_battery_landing < 35.0:
            mission_feasibility = "MODERATE_RISK"
            recommendation = "Feasible with caution. Recommended to fly with crosswind compensation enabled."
        else:
            mission_feasibility = "OPTIMAL"
            recommendation = "Mission profile cleared. High safety margin with plenty of reserve power for extended sensor dwell time."

        return {
            "drone_id": drone_id,
            "drone_name": twin["name"],
            "simulation_timestamp": datetime.now(timezone.utc).isoformat(),
            "inputs": {
                "distance_km": distance_km,
                "planned_altitude_m": planned_altitude,
                "wind_speed_ms": wind_speed,
                "payload_weight_kg": payload_weight_kg
            },
            "twin_metrics": {
                "battery_soh": twin["battery_soh"],
                "failure_risk_score": twin["failure_risk_score"],
                "vibration_nominal_g": twin["vibration_level"]
            },
            "predicted_metrics": {
                "flight_duration_min": round(flight_duration_min, 1),
                "predicted_battery_drain_percent": predicted_battery_drain,
                "estimated_landing_battery": remaining_battery_landing,
                "effective_burn_rate_pct_min": round(effective_burn_rate, 2),
                "max_wind_resistance_ms": 18.0
            },
            "feasibility": mission_feasibility,
            "ai_recommendation": recommendation,
            "energy_profile_curve": [
                {"min": 0, "battery": 100.0},
                {"min": round(flight_duration_min * 0.25, 1), "battery": round(100.0 - predicted_battery_drain * 0.25, 1)},
                {"min": round(flight_duration_min * 0.50, 1), "battery": round(100.0 - predicted_battery_drain * 0.50, 1)},
                {"min": round(flight_duration_min * 0.75, 1), "battery": round(100.0 - predicted_battery_drain * 0.75, 1)},
                {"min": round(flight_duration_min, 1), "battery": remaining_battery_landing}
            ]
        }

digital_twin_service = DigitalTwinService()
