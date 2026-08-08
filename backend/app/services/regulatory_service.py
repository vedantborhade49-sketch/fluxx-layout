from typing import Dict, List, Any

class RegulatoryService:
    def get_role_dashboard_data(self, role: str) -> Dict[str, Any]:
        """
        Returns specialized KPIs and alerts structured for specific government agencies.
        """
        if role == "PCB":
            return {
                "agency_title": "State Pollution Control Board (Enforcement & Compliance)",
                "kpis": [
                    {"label": "Continuous Stacks Monitored", "value": "42 Stacks", "status": "NOMINAL"},
                    {"label": "Statutory Limit Exceedances", "value": "3 Active", "status": "VIOLATION", "alert": True},
                    {"label": "Avg Urban Airshed AQI", "value": "138 AQI", "status": "MODERATE"},
                    {"label": "Notices Issued (24h)", "value": "5 Show-Cause Notices", "status": "ACTIONED"}
                ],
                "active_violations": [
                    {"source": "Refinery Alpha FCCU Stack", "pollutant": "VOC / PM2.5", "measured": "420 ppb", "limit": "250 ppb", "fine_accrued": "₹2,50,000 / day"},
                    {"source": "MIDC Unit 12 Boiler", "pollutant": "SO₂", "measured": "110 µg/m³", "limit": "80 µg/m³", "fine_accrued": "₹1,00,000 / day"}
                ],
                "actionable_tools": ["Generate Statutory Summons", "Dispatch Enforcement Drone", "Seal Emission Valve"]
            }
        elif role == "FOREST":
            return {
                "agency_title": "State Forest, Wildlife & Ecological Conservation Department",
                "kpis": [
                    {"label": "Canopy Area Under Surveillance", "value": "103.8 km²", "status": "ACTIVE"},
                    {"label": "Wildfire Fire Weather Index (FWI)", "value": "HIGH (Index 24)", "status": "WARNING", "alert": True},
                    {"label": "Thermal Canopy Hotspots Detected", "value": "1 Micro-Hotspot", "status": "INVESTIGATING"},
                    {"label": "Acoustic Biodiversity Density", "value": "84% Nominal Birds/Fauna", "status": "HEALTHY"}
                ],
                "active_violations": [
                    {"source": "North Canopy Buffer Strip", "event": "Biomass Smoldering Detected", "surface_temp": "46.5°C", "humidity": "29%", "recommendation": "Deploy VTOL water-misting coordinate"}
                ],
                "actionable_tools": ["Trigger Wildfire Patrol", "Log Wildlife Acoustic Event", "Map Forest Degradation (NDVI)"]
            }
        elif role == "MUNICIPAL":
            return {
                "agency_title": "Metropolitan Municipal Corporation & Smart City Operations",
                "kpis": [
                    {"label": "Total Wards Monitored", "value": "24 Administrative Wards", "status": "ONLINE"},
                    {"label": "Population in High Risk Zone", "value": "342,000 Citizens", "status": "CRITICAL", "alert": True},
                    {"label": "Street Canyon Cleanliness Grade", "value": "Grade B+", "status": "NOMINAL"},
                    {"label": "Automated Smog Guns Triggered", "value": "12 Deployed in Wards M & F", "status": "SUPPRESSING"}
                ],
                "active_violations": [
                    {"ward": "Ward M/East (Chembur)", "population": "807,500", "current_eri": "82 (High Risk)", "advisory": "Citizen health advisory active"}
                ],
                "actionable_tools": ["Trigger Automated Smog Sprinklers", "Reroute Heavy Commercial Freight", "Issue Citizen SMS Broadcast"]
            }
        else: # DISASTER
            return {
                "agency_title": "Disaster Management & Hazardous Material Response Authority",
                "kpis": [
                    {"label": "Emergency Level", "value": "LEVEL-2 HAZMAT PLUME ALERT", "status": "EMERGENCY", "alert": True},
                    {"label": "Plume Travel Speed", "value": "16.2 km/h (SW 210°)", "status": "TRACKING"},
                    {"label": "ETA to Nearest Dense Settlement", "value": "38 Minutes", "status": "CRITICAL"},
                    {"label": "Evacuation Preparedness", "value": "Shelters Activated (3 Centers)", "status": "READY"}
                ],
                "active_violations": [
                    {"corridor": "Chembur to Sion Linear Dispersion Corridor", "hazard": "Volatile Organic Hydrocarbons", "safe_perimeter_km": "4.5 km"}
                ],
                "actionable_tools": ["Activate Common Alerting Protocol (CAP) Siren", "Deploy Autonomous VTOL Air Sampling Ring", "Order Shelter-in-Place"]
            }

regulatory_service = RegulatoryService()
