from typing import Dict, List, Any

class PluginRegistryService:
    def __init__(self):
        self.plugins = [
            {
                "id": "PLUG-AQI-CORE",
                "name": "Urban Air Quality & Hazardous Gas Plumes",
                "category": "AIR_POLLUTION",
                "version": "v2.4.0",
                "status": "ACTIVE",
                "author": "FLUXX Core Atmospheric Lab",
                "channels": ["PM2.5", "PM10", "VOC", "CO2", "NO2", "SO2", "O3"],
                "algorithm": "Gaussian Plume Dispersion + Pasquill Gifford CFD",
                "description": "Standard high-density urban airshed monitoring and industrial stack compliance."
            },
            {
                "id": "PLUG-WILD-02",
                "name": "Wildfire Early Warning & Canopy Moisture",
                "category": "FORESTRY",
                "version": "v1.8.2",
                "status": "ACTIVE",
                "author": "Forestry Research Institute & FLUXX",
                "channels": ["Thermal Infrared (FLIR)", "NDVI Multi-spectral", "Canopy Vapor Deficit"],
                "algorithm": "Thermal Radiometric Hotspot Clustering + Fire Weather Index (FWI)",
                "description": "Sub-canopy smoldering detection and wildfire trajectory modeling."
            },
            {
                "id": "PLUG-WATER-03",
                "name": "Coastal Effluent & Maritime Vessel Plume Sniffing",
                "category": "MARINE_WATER",
                "version": "v1.2.0",
                "status": "ACTIVE",
                "author": "Maritime Environmental Intelligence Cell",
                "channels": ["SO2 Sniffer", "Optical Oil Sheen Index", "Turbidity", "Surface Temp"],
                "algorithm": "MARPOL Annex VI Ship Fuel Plume Inversion",
                "description": "Enforces 0.5% sulfur fuel limits on anchored cargo ships and tracks offshore industrial outfalls."
            },
            {
                "id": "PLUG-CBRN-04",
                "name": "CBRN Radiation & Toxic Industrial Chemical Hazmat",
                "category": "HAZMAT_DEFENSE",
                "version": "v1.0.4",
                "status": "ACTIVE",
                "author": "National Disaster Response Force (NDRF)",
                "channels": ["Gamma Geiger CPS", "NH3 Ammonia", "Cl2 Chlorine", "H2S Hydrogen Sulfide"],
                "algorithm": "Rapid Toxic Exclusion Zone Geometry (ALOHA standard)",
                "description": "Rapid response containment for chemical pipeline ruptures and hazardous industrial leaks."
            },
            {
                "id": "PLUG-AGRI-05",
                "name": "Agro-Methane Flux & Carbon Sequestration",
                "category": "CLIMATE_CARBON",
                "version": "v1.1.0",
                "status": "STANDBY",
                "author": "Climate Smart Agriculture Initiative",
                "channels": ["CH4 Laser Methane", "N2O Flux", "Surface Soil Moisture"],
                "algorithm": "Eddy Covariance Micro-meteorological Flux",
                "description": "Monitors paddy field methane emissions, stubble burning smoke plumes, and wetland carbon sinks."
            }
        ]

    def get_all_plugins(self) -> List[Dict[str, Any]]:
        return self.plugins

    def toggle_plugin(self, plugin_id: str) -> Dict[str, Any]:
        for p in self.plugins:
            if p["id"] == plugin_id:
                p["status"] = "INACTIVE" if p["status"] == "ACTIVE" else "ACTIVE"
                return p
        return {"error": "Plugin not found"}

plugin_registry_service = PluginRegistryService()
