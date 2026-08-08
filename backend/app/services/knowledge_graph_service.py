from typing import Dict, List, Any

class KnowledgeGraphService:
    def __init__(self):
        self.nodes = [
            # Industrial Sources
            {"id": "SRC-01", "label": "Bharat Petrochemical Refinery", "type": "INDUSTRIAL_SOURCE", "category": "Refinery", "lat": 19.0118, "lng": 72.8942, "risk_tier": "CRITICAL"},
            {"id": "SRC-02", "label": "Rasayani Synthetic Chemicals", "type": "INDUSTRIAL_SOURCE", "category": "Chemical", "lat": 19.0085, "lng": 72.9015, "risk_tier": "HIGH"},
            {"id": "SRC-03", "label": "Trombay Thermal Power Station", "type": "INDUSTRIAL_SOURCE", "category": "Power", "lat": 18.9950, "lng": 72.9150, "risk_tier": "MEDIUM"},
            
            # Emissions & Plumes
            {"id": "EM-204", "label": "Acute VOC & Hydrocarbon Plume (ENV-204)", "type": "EMISSION_PLUME", "category": "Hazardous Gas", "peak_aqi": 188, "status": "ACTIVE"},
            {"id": "EM-108", "label": "SO2 Flaring Release", "type": "EMISSION_PLUME", "category": "Sulfur", "peak_aqi": 142, "status": "HISTORICAL"},
            
            # Sensitive Receptors: Schools & Child Care
            {"id": "SCH-01", "label": "Holy Family Convent High School", "type": "SENSITIVE_RECEPTOR", "category": "School", "lat": 19.0220, "lng": 72.8875, "students": 1450, "vulnerability": "HIGH"},
            {"id": "SCH-02", "label": "Vidyaniketan Public School", "type": "SENSITIVE_RECEPTOR", "category": "School", "lat": 19.0185, "lng": 72.8830, "students": 920, "vulnerability": "HIGH"},
            {"id": "SCH-03", "label": "Model International Academy", "type": "SENSITIVE_RECEPTOR", "category": "School", "lat": 19.0290, "lng": 72.8760, "students": 1800, "vulnerability": "MODERATE"},
            
            # Sensitive Receptors: Hospitals
            {"id": "HOSP-01", "label": "Apex Critical Care Hospital", "type": "SENSITIVE_RECEPTOR", "category": "Hospital", "lat": 19.0250, "lng": 72.8810, "beds": 280, "icu_capacity": 45},
            {"id": "HOSP-02", "label": "Chembur Pediatric & Pulmonary Clinic", "type": "SENSITIVE_RECEPTOR", "category": "Hospital", "lat": 19.0195, "lng": 72.8890, "beds": 65, "icu_capacity": 12},
            
            # Administrative Wards
            {"id": "WARD-ME", "label": "Ward M/East (Chembur-Govandi Airshed)", "type": "ADMIN_ZONE", "population": 485000, "base_aqi": 164},
            {"id": "WARD-FN", "label": "Ward F/North (Matunga Corridor)", "type": "ADMIN_ZONE", "population": 390000, "base_aqi": 128},
            
            # VTOL Fleet & Missions
            {"id": "DRONE-01", "label": "VTOL-001 (SkyGuardian Pro)", "type": "SURVEILLANCE_AGENT", "status": "ACTIVE"},
            {"id": "DRONE-02", "label": "VTOL-002 (AeroSentry X8)", "type": "SURVEILLANCE_AGENT", "status": "INTERCEPT_DISPATCHED"},
            {"id": "MSN-2041", "label": "Mission MSN-2041 (Plume Intercept)", "type": "MISSION", "quality_score": 94.5}
        ]

        self.edges = [
            {"source": "SRC-01", "target": "EM-204", "relation": "EMITS", "confidence": 0.94, "label": "Stack #4 Catalytic Cracker"},
            {"source": "SRC-02", "target": "EM-108", "relation": "EMITS", "confidence": 0.88, "label": "Boiler Release"},
            
            {"source": "EM-204", "target": "WARD-ME", "relation": "DISPERSES_INTO", "confidence": 0.96, "label": "Wind Vector 210° SW @ 4.8 m/s"},
            {"source": "EM-204", "target": "SCH-01", "relation": "THREATENS", "confidence": 0.91, "label": "Distance: 1.8km | ETA: 22 min"},
            {"source": "EM-204", "target": "SCH-02", "relation": "THREATENS", "confidence": 0.89, "label": "Distance: 2.3km | ETA: 29 min"},
            {"source": "EM-204", "target": "HOSP-02", "relation": "THREATENS", "confidence": 0.95, "label": "Distance: 1.2km | Acute VOC Risk"},
            
            {"source": "DRONE-02", "target": "EM-204", "relation": "INTERCEPTING", "confidence": 0.99, "label": "PID Sensor Sweep"},
            {"source": "DRONE-02", "target": "MSN-2041", "relation": "EXECUTING_MISSION", "confidence": 1.0, "label": "Serpentine Grid"},
            {"source": "MSN-2041", "target": "SRC-01", "relation": "EVIDENCE_GATHERING", "confidence": 0.97, "label": "Section 31A Audit Dossier"}
        ]

    def get_full_graph(self) -> Dict[str, Any]:
        return {
            "nodes": self.nodes,
            "edges": self.edges,
            "summary": {
                "total_entities": len(self.nodes),
                "total_relationships": len(self.edges),
                "threatened_schools_count": 3,
                "threatened_hospitals_count": 2,
                "primary_culprit": "Bharat Petrochemical Refinery (SRC-01)"
            }
        }

    def execute_natural_query(self, query_id: str) -> Dict[str, Any]:
        queries = {
            "schools_near_emissions": {
                "query_text": "Show every industrial source that caused AQI > 150 within 5 km of a school during the last 30 days.",
                "matched_sources": [
                    {"source": "Bharat Petrochemical Refinery (SRC-01)", "emissions": "Benzene, VOCs, PM2.5", "peak_aqi": 188, "distance_to_nearest_school": "1.8 km", "violations_count": 14},
                    {"source": "Rasayani Synthetic Chemicals (SRC-02)", "emissions": "SO2, NO2", "peak_aqi": 162, "distance_to_nearest_school": "3.2 km", "violations_count": 6}
                ],
                "affected_schools": [
                    {"name": "Holy Family Convent High School", "distance": "1.8 km", "threat_level": "CRITICAL", "exposure_hours": 42},
                    {"name": "Vidyaniketan Public School", "distance": "2.3 km", "threat_level": "HIGH", "exposure_hours": 28},
                    {"name": "Model International Academy", "distance": "4.1 km", "threat_level": "MODERATE", "exposure_hours": 12}
                ],
                "graph_subgraph_nodes": ["SRC-01", "SRC-02", "EM-204", "SCH-01", "SCH-02", "SCH-03"],
                "statutory_recommendation": "Initiate joint SPCB-DGCA physical inspection with VTOL-002 airborne optical audit."
            },
            "hospital_vulnerability": {
                "query_text": "Identify acute pulmonary care hospitals in direct path of active dispersion plume.",
                "matched_sources": [
                    {"source": "Bharat Petrochemical Refinery (SRC-01)", "emissions": "Fugitive VOCs", "peak_aqi": 188}
                ],
                "affected_schools": [
                    {"name": "Chembur Pediatric & Pulmonary Clinic", "distance": "1.2 km", "threat_level": "CRITICAL (ICU RISK)", "exposure_hours": 3}
                ],
                "graph_subgraph_nodes": ["SRC-01", "EM-204", "HOSP-02"],
                "statutory_recommendation": "Activate HEPA positive-pressure ventilation protocols at Chembur Pediatric Clinic."
            }
        }
        return queries.get(query_id, queries["schools_near_emissions"])

knowledge_graph_service = KnowledgeGraphService()
