from typing import Dict, List, Any

class PlaybackService:
    def get_timeline_slices(self) -> List[Dict[str, Any]]:
        return [
            {
                "time_label": "09:00 AM",
                "timestamp": "2026-08-07T09:00:00Z",
                "summary": "Morning baseline conditions. Low thermal convective mixing.",
                "drones": [
                    {"id": "VTOL-001", "lat": 19.0760, "lng": 72.8777, "alt": 120, "battery": 98, "status": "SURVEYING", "aqi": 82, "voc": 95},
                    {"id": "VTOL-002", "lat": 19.0380, "lng": 72.8950, "alt": 0, "battery": 100, "status": "DOCKED", "aqi": 94, "voc": 110},
                    {"id": "VTOL-003", "lat": 19.2215, "lng": 72.9124, "alt": 140, "battery": 92, "status": "SURVEYING", "aqi": 42, "voc": 30}
                ],
                "eri_composite": 44.5,
                "eri_status": "MODERATE_RISK",
                "plume_active": False,
                "wind": {"speed_ms": 2.8, "dir_deg": 180}
            },
            {
                "time_label": "10:30 AM",
                "timestamp": "2026-08-07T10:30:00Z",
                "summary": "Industrial stack thermal cycle begins. Minor VOC increase in Sector 7.",
                "drones": [
                    {"id": "VTOL-001", "lat": 19.0850, "lng": 72.8650, "alt": 115, "battery": 78, "status": "SURVEYING", "aqi": 98, "voc": 140},
                    {"id": "VTOL-002", "lat": 19.0410, "lng": 72.8920, "alt": 90, "battery": 86, "status": "SURVEYING", "aqi": 148, "voc": 220},
                    {"id": "VTOL-003", "lat": 19.2300, "lng": 72.9180, "alt": 135, "battery": 74, "status": "SURVEYING", "aqi": 46, "voc": 35}
                ],
                "eri_composite": 58.2,
                "eri_status": "MODERATE_RISK",
                "plume_active": True,
                "wind": {"speed_ms": 4.1, "dir_deg": 195}
            },
            {
                "time_label": "12:00 PM",
                "timestamp": "2026-08-07T12:00:00Z",
                "summary": "Peak Catalytic Cracker emission spike. Plume begins south-west dispersion.",
                "drones": [
                    {"id": "VTOL-001", "lat": 19.0620, "lng": 72.8520, "alt": 125, "battery": 56, "status": "SURVEYING", "aqi": 124, "voc": 180},
                    {"id": "VTOL-002", "lat": 19.0490, "lng": 72.8850, "alt": 85, "battery": 62, "status": "INTERCEPTING", "aqi": 210, "voc": 390},
                    {"id": "VTOL-003", "lat": 19.2150, "lng": 72.9050, "alt": 140, "battery": 52, "status": "SURVEYING", "aqi": 52, "voc": 40}
                ],
                "eri_composite": 78.4,
                "eri_status": "CRITICAL_RISK",
                "plume_active": True,
                "wind": {"speed_ms": 5.8, "dir_deg": 210}
            },
            {
                "time_label": "02:30 PM",
                "timestamp": "2026-08-07T14:30:00Z",
                "summary": "Plume reaches Ward M/East boundary. Emergency response and SPCB notice issued.",
                "drones": [
                    {"id": "VTOL-001", "lat": 19.0450, "lng": 72.8720, "alt": 110, "battery": 34, "status": "RETURNING", "aqi": 165, "voc": 280},
                    {"id": "VTOL-002", "lat": 19.0520, "lng": 72.8780, "alt": 80, "battery": 40, "status": "MAPPING_PLUME", "aqi": 182, "voc": 340},
                    {"id": "VTOL-003", "lat": 19.2215, "lng": 72.9124, "alt": 0, "battery": 95, "status": "CHARGING", "aqi": 48, "voc": 32}
                ],
                "eri_composite": 84.0,
                "eri_status": "CRITICAL_RISK",
                "plume_active": True,
                "wind": {"speed_ms": 6.2, "dir_deg": 215}
            },
            {
                "time_label": "04:00 PM (LIVE)",
                "timestamp": "2026-08-07T16:00:00Z",
                "summary": "Automated smog guns active. Emission throttled. Baseline normalization in progress.",
                "drones": [
                    {"id": "VTOL-001", "lat": 19.0760, "lng": 72.8777, "alt": 120, "battery": 88, "status": "ON_PATROL", "aqi": 138, "voc": 190},
                    {"id": "VTOL-002", "lat": 19.0380, "lng": 72.8950, "alt": 95, "battery": 76, "status": "POST_INCIDENT_SCAN", "aqi": 154, "voc": 210},
                    {"id": "VTOL-003", "lat": 19.2215, "lng": 72.9124, "alt": 140, "battery": 82, "status": "CANOPY_SURVEY", "aqi": 44, "voc": 28}
                ],
                "eri_composite": 66.8,
                "eri_status": "HIGH_RISK",
                "plume_active": False,
                "wind": {"speed_ms": 4.5, "dir_deg": 200}
            }
        ]

playback_service = PlaybackService()
