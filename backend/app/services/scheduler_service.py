from typing import Dict, List, Any
from datetime import datetime

class MissionSchedulerService:
    def __init__(self):
        self.schedules = [
            {
                "id": "SCHED-IND-01",
                "title": "Industrial Corridor Daily Morning Sweep",
                "frequency": "Daily at 06:00 AM",
                "cron_expression": "0 6 * * *",
                "target_area": "Sector 7 Petrochemical & Chemical Cluster",
                "drone_assigned": "VTOL-002",
                "survey_type": "Fugitive VOC & Methane Leak Detection",
                "status": "ACTIVE",
                "next_run": "Tomorrow at 06:00 AM",
                "last_run_status": "COMPLETED_SUCCESS",
                "coverage_area_sqkm": 14.5,
                "auto_dispatch": True
            },
            {
                "id": "SCHED-FOR-02",
                "title": "National Park Wildfire & Canopy Patrol",
                "frequency": "Every 4 Hours",
                "cron_expression": "0 */4 * * *",
                "target_area": "Sanjay Gandhi National Park Buffer Zone",
                "drone_assigned": "VTOL-003",
                "survey_type": "Thermal Hotspot & Biomass Moisture Scan",
                "status": "ACTIVE",
                "next_run": "In 1 hr 45 min",
                "last_run_status": "COMPLETED_SUCCESS",
                "coverage_area_sqkm": 28.0,
                "auto_dispatch": True
            },
            {
                "id": "SCHED-SCH-03",
                "title": "School Zone Rush Hour Air Quality Survey",
                "frequency": "Mon-Fri at 08:30 AM & 04:30 PM",
                "cron_expression": "30 8,16 * * 1-5",
                "target_area": "Ward F/North & Central Academic Hub",
                "drone_assigned": "VTOL-001",
                "survey_type": "Ultrafine PM2.5 & NO2 Street Canyon Inspection",
                "status": "ACTIVE",
                "next_run": "Today at 04:30 PM",
                "last_run_status": "COMPLETED_SUCCESS",
                "coverage_area_sqkm": 8.2,
                "auto_dispatch": True
            },
            {
                "id": "SCHED-PORT-04",
                "title": "Bayside Marine Outfall & Heavy Vessel Patrol",
                "frequency": "Twice Daily at 12:00 PM & 08:00 PM",
                "cron_expression": "0 12,20 * * *",
                "target_area": "Eastern Sea Port & Marine Terminal",
                "drone_assigned": "VTOL-002",
                "survey_type": "Marine Fuel Sulfur Plume & Effluent Trace",
                "status": "PAUSED",
                "next_run": "Paused by Operator",
                "last_run_status": "SKIPPED_WEATHER",
                "coverage_area_sqkm": 19.8,
                "auto_dispatch": False
            }
        ]

    def get_schedules(self) -> List[Dict[str, Any]]:
        return self.schedules

    def toggle_schedule(self, schedule_id: str) -> Dict[str, Any]:
        for s in self.schedules:
            if s["id"] == schedule_id:
                s["status"] = "PAUSED" if s["status"] == "ACTIVE" else "ACTIVE"
                return s
        return {"error": "Schedule not found"}

    def add_schedule(self, new_sched: Dict[str, Any]) -> Dict[str, Any]:
        sched_entry = {
            "id": f"SCHED-CUSTOM-{len(self.schedules) + 1:02d}",
            "title": new_sched.get("title", "Custom Automated Survey"),
            "frequency": new_sched.get("frequency", "Custom Interval"),
            "cron_expression": new_sched.get("cron_expression", "0 0 * * *"),
            "target_area": new_sched.get("target_area", "Metro Airshed"),
            "drone_assigned": new_sched.get("drone_assigned", "VTOL-001"),
            "survey_type": new_sched.get("survey_type", "Standard Environmental Grid"),
            "status": "ACTIVE",
            "next_run": "Pending Next Clock Cycle",
            "last_run_status": "INITIALIZED",
            "coverage_area_sqkm": new_sched.get("coverage_area_sqkm", 10.0),
            "auto_dispatch": new_sched.get("auto_dispatch", True)
        }
        self.schedules.append(sched_entry)
        return sched_entry

mission_scheduler_service = MissionSchedulerService()
