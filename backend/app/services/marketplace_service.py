from typing import Dict, List, Any
from datetime import datetime

class MissionMarketplaceService:
    def __init__(self):
        self.marketplace_missions = [
            {
                "id": "MKT-MSN-101",
                "publishing_agency": "Municipal Smart City Corporation",
                "agency_code": "MCGM",
                "title": "School Corridor Morning Micro-Canyon Survey",
                "category": "PUBLIC_HEALTH",
                "priority": "HIGH",
                "reward_credits": 2500,
                "target_area": "Ward F/North Academic Belt",
                "required_payload": "Dual PM2.5/PM10 Laser Optical + NO2",
                "estimated_flight_min": 28,
                "coverage_km2": 6.8,
                "status": "OPEN",
                "claimed_by_drone": None,
                "description": "Evaluate ultrafine vehicular exhaust accumulation along 4 primary school transit gates prior to morning assembly."
            },
            {
                "id": "MKT-MSN-102",
                "publishing_agency": "State Pollution Control Board (SPCB)",
                "agency_code": "MPCB",
                "title": "Industrial Flare Stack Optical Gas & VOC Audit",
                "category": "ENFORCEMENT",
                "priority": "CRITICAL",
                "reward_credits": 5000,
                "target_area": "Sector 7 Petrochemical Complex",
                "required_payload": "Optical Gas Imaging (OGI) + PID Multi-Gas",
                "estimated_flight_min": 35,
                "coverage_km2": 12.4,
                "status": "CLAIMED",
                "claimed_by_drone": "VTOL-002",
                "description": "High-altitude thermal & infrared flare sweep to detect unburnt fugitive hydrocarbon flaring."
            },
            {
                "id": "MKT-MSN-103",
                "publishing_agency": "Forest & Wildlife Department",
                "agency_code": "FOREST",
                "title": "SGNP Wilderness Canopy Moisture & Wildfire Patrol",
                "category": "CONSERVATION",
                "priority": "MEDIUM",
                "reward_credits": 3200,
                "target_area": "Sanjay Gandhi National Park Buffer Zone",
                "required_payload": "FLIR Thermal Radiometric + Multi-spectral",
                "estimated_flight_min": 42,
                "coverage_km2": 26.0,
                "status": "OPEN",
                "claimed_by_drone": None,
                "description": "Autonomous grid sweep over dry deciduous buffer canopy to detect sub-canopy thermal anomalies."
            },
            {
                "id": "MKT-MSN-104",
                "publishing_agency": "Mumbai Port & Maritime Authority",
                "agency_code": "PORT",
                "title": "Marine Bayside Vessel Sulfur Exhaust Plume Sniffing",
                "category": "MARITIME_EMISSIONS",
                "priority": "HIGH",
                "reward_credits": 4000,
                "target_area": "Eastern Offshore Anchorage Basin",
                "required_payload": "Electrochemical SO2 + Sniffer Probe",
                "estimated_flight_min": 30,
                "coverage_km2": 18.5,
                "status": "OPEN",
                "claimed_by_drone": None,
                "description": "Sniff heavy fuel oil exhaust plumes from anchored container vessels to enforce MARPOL Annex VI 0.5% sulfur limits."
            }
        ]

    def get_missions(self) -> List[Dict[str, Any]]:
        return self.marketplace_missions

    def claim_mission(self, mission_id: str, drone_id: str) -> Dict[str, Any]:
        for m in self.marketplace_missions:
            if m["id"] == mission_id:
                m["status"] = "DISPATCHED"
                m["claimed_by_drone"] = drone_id
                m["dispatched_at"] = datetime.utcnow().isoformat()
                return {
                    "status": "SUCCESS",
                    "message": f"Mission {mission_id} successfully claimed and assigned to {drone_id}.",
                    "mission": m
                }
        return {"error": "Mission not found"}

marketplace_service = MissionMarketplaceService()
