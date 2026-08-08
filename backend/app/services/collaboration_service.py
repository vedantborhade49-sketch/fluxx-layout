from typing import Dict, List, Any
from datetime import datetime

class CollaborationService:
    def __init__(self):
        self.annotations = [
            {
                "id": "NOTE-01",
                "incident_id": "INC-2026-088",
                "author": "Cmdr. Rajesh Verma (Lead Flight Controller)",
                "role": "Chief Drone Operator",
                "timestamp": "2026-08-07T14:30:00Z",
                "coordinates": {"lat": 19.0410, "lng": 72.8980},
                "area_name": "Sector 7 Refinery Perimeter",
                "title": "Visual confirmation of fugitive VOC plume",
                "notes": "VTOL-02 optical 4K zoom identified white vapor leaking from storage tank 4-B pressure release valve. Cross-checked with sensor VOC reading of 420 ppb.",
                "assigned_to": "Dr. Ananya Sharma (SPCB Enforcement Officer)",
                "status": "INVESTIGATING",
                "priority": "HIGH"
            },
            {
                "id": "NOTE-02",
                "incident_id": "INC-2026-089",
                "author": "Dr. Ananya Sharma (SPCB)",
                "role": "Environmental Inspector",
                "timestamp": "2026-08-07T15:10:00Z",
                "coordinates": {"lat": 19.0380, "lng": 72.8620},
                "area_name": "Ward F/North Matunga School Corridor",
                "title": "Ground CAAQM Station cross-calibration verified",
                "notes": "Mobile CAAQM van deployed. Ambient PM2.5 matches drone sensor reading within ±3.2% tolerance. Statutory inspection notice issued to refinery operator.",
                "assigned_to": "Capt. Sameer Khan (Municipal Officer)",
                "status": "ACTION_TAKEN",
                "priority": "MEDIUM"
            }
        ]

    def get_annotations(self) -> List[Dict[str, Any]]:
        return self.annotations

    def add_annotation(self, data: Dict[str, Any]) -> Dict[str, Any]:
        new_entry = {
            "id": f"NOTE-{len(self.annotations) + 1:02d}",
            "incident_id": data.get("incident_id", f"INC-2026-{random_suffix()}"),
            "author": data.get("author", "Flight Operations Officer"),
            "role": data.get("role", "Field Specialist"),
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "coordinates": data.get("coordinates", {"lat": 19.0760, "lng": 72.8777}),
            "area_name": data.get("area_name", "Target Geographic Grid"),
            "title": data.get("title", "Operational Observation"),
            "notes": data.get("notes", "No notes specified."),
            "assigned_to": data.get("assigned_to", "SPCB Environmental Desk"),
            "status": data.get("status", "OPEN"),
            "priority": data.get("priority", "HIGH")
        }
        self.annotations.insert(0, new_entry)
        return new_entry

    def update_status(self, note_id: str, new_status: str) -> Dict[str, Any]:
        for n in self.annotations:
            if n["id"] == note_id:
                n["status"] = new_status
                return n
        return {"error": "Annotation not found"}

def random_suffix():
    import random
    return f"{random.randint(100, 999)}"

collaboration_service = CollaborationService()
