from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any

class FleetManagementService:
    def __init__(self):
        self.fleet = [
            {
                "id": "VTOL-001",
                "name": "SkyGuardian Pro",
                "serial": "FLX-VTOL-8801-PRO",
                "status": "ACTIVE",
                "health_status": "OPTIMAL",
                "health_score": 98.4,
                "flight_hours": 154.2,
                "missions_completed": 87,
                "battery_health": 98.2,
                "firmware": "v4.2.1-PRO",
                "assigned_operator": "Capt. Elena Vance",
                "assigned_org": "State Pollution Control Board",
                "maintenance_due_in_hours": 45.8,
                "hardware_diagnostics": {
                    "motor_health": 99.1,
                    "esc_thermals": "47.1°C (Nominal)",
                    "vibration_rms": "0.11 G (Low)",
                    "gps_hdop": 0.65,
                    "compass_offset": "0.4°",
                    "servo_duty": "3.2% wear"
                }
            },
            {
                "id": "VTOL-002",
                "name": "AeroSentry X8",
                "serial": "FLX-VTOL-8802-PRO",
                "status": "ACTIVE",
                "health_status": "GOOD",
                "health_score": 94.2,
                "flight_hours": 289.4,
                "missions_completed": 142,
                "battery_health": 95.8,
                "firmware": "v4.2.1-PRO",
                "assigned_operator": "Marcus Brody",
                "assigned_org": "Metropolitan Climate Authority",
                "maintenance_due_in_hours": 10.6,
                "hardware_diagnostics": {
                    "motor_health": 94.5,
                    "esc_thermals": "49.3°C (Nominal)",
                    "vibration_rms": "0.16 G (Moderate)",
                    "gps_hdop": 0.72,
                    "compass_offset": "1.1°",
                    "servo_duty": "6.8% wear"
                }
            },
            {
                "id": "VTOL-003",
                "name": "EcoHawk Ranger",
                "serial": "FLX-VTOL-8803-PRO",
                "status": "ACTIVE",
                "health_status": "OPTIMAL",
                "health_score": 99.6,
                "flight_hours": 62.8,
                "missions_completed": 34,
                "battery_health": 99.1,
                "firmware": "v4.2.1-PRO",
                "assigned_operator": "Dr. Sarah Chen",
                "assigned_org": "State Forest & Wildlife Dept",
                "maintenance_due_in_hours": 137.2,
                "hardware_diagnostics": {
                    "motor_health": 99.8,
                    "esc_thermals": "43.6°C (Cool)",
                    "vibration_rms": "0.08 G (Low)",
                    "gps_hdop": 0.58,
                    "compass_offset": "0.2°",
                    "servo_duty": "1.5% wear"
                }
            },
            {
                "id": "VTOL-004",
                "name": "ThermalScout Alpha",
                "serial": "FLX-VTOL-8804-THERM",
                "status": "CHARGING",
                "health_status": "OPTIMAL",
                "health_score": 97.8,
                "flight_hours": 112.0,
                "missions_completed": 58,
                "battery_health": 97.4,
                "firmware": "v4.2.1-PRO",
                "assigned_operator": "Devon Hayes",
                "assigned_org": "Industrial Safety Consortium",
                "maintenance_due_in_hours": 88.0,
                "hardware_diagnostics": {
                    "motor_health": 98.2,
                    "esc_thermals": "29.4°C (Standby)",
                    "vibration_rms": "0.00 G",
                    "gps_hdop": 0.60,
                    "compass_offset": "0.5°",
                    "servo_duty": "4.1% wear"
                }
            },
            {
                "id": "VTOL-005",
                "name": "StormStrider Heavy",
                "serial": "FLX-VTOL-8805-HVY",
                "status": "MAINTENANCE",
                "health_status": "SERVICE_REQUIRED",
                "health_score": 86.5,
                "flight_hours": 420.5,
                "missions_completed": 210,
                "battery_health": 88.0,
                "firmware": "v4.1.9-STABLE",
                "assigned_operator": "Hangar Tech Team A",
                "assigned_org": "State Pollution Control Board",
                "maintenance_due_in_hours": -5.2, # Overdue
                "hardware_diagnostics": {
                    "motor_health": 88.0,
                    "esc_thermals": "Ambient",
                    "vibration_rms": "0.28 G (Motor 3 bearing wear detected)",
                    "gps_hdop": 0.85,
                    "compass_offset": "2.4°",
                    "servo_duty": "14.2% wear"
                }
            }
        ]

    def get_fleet_summary(self) -> Dict[str, Any]:
        total_drones = len(self.fleet)
        active = len([d for d in self.fleet if d["status"] == "ACTIVE"])
        charging = len([d for d in self.fleet if d["status"] == "CHARGING"])
        maintenance = len([d for d in self.fleet if d["status"] == "MAINTENANCE"])
        avg_health = round(sum(d["health_score"] for d in self.fleet) / total_drones, 1)
        total_flight_hours = round(sum(d["flight_hours"] for d in self.fleet), 1)

        return {
            "total_drones": total_drones,
            "active_airborne": active,
            "charging_docked": charging,
            "under_maintenance": maintenance,
            "fleet_average_health": avg_health,
            "total_fleet_flight_hours": total_flight_hours,
            "drones": self.fleet
        }

fleet_service = FleetManagementService()
