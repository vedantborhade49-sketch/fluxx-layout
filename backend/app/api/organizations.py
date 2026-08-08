from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter(prefix="/organizations", tags=["Multi-Tenant Organizations"])

ORGANIZATIONS = [
    {
        "id": "ORG-MPCB-MUMBAI",
        "name": "State Pollution Control Board",
        "code": "SPCB-WEST",
        "domain": "Government Environmental Agency",
        "region": "Industrial & Urban Basin",
        "active_drones": 3,
        "active_missions": 2,
        "clearance_level": "Tier-1 Administrative"
    },
    {
        "id": "ORG-FOREST-DEPT",
        "name": "State Forest & Wildlife Department",
        "code": "FOREST-BIO",
        "domain": "Ecological Conservation",
        "region": "National Parks & Forest Reserves",
        "active_drones": 1,
        "active_missions": 1,
        "clearance_level": "Tier-2 Field Operations"
    },
    {
        "id": "ORG-CLIMATE-AUTH",
        "name": "Metropolitan Climate & Air Authority",
        "code": "METRO-AIR",
        "domain": "Municipal Smart City",
        "region": "Downtown Core & Transit Network",
        "active_drones": 2,
        "active_missions": 1,
        "clearance_level": "Tier-1 Administrative"
    },
    {
        "id": "ORG-IND-SAFETY",
        "name": "Industrial Safety & Hazardous Materials Hub",
        "code": "HAZMAT-IND",
        "domain": "Industrial Compliance",
        "region": "Refinery & Petrochemical Zone",
        "active_drones": 2,
        "active_missions": 2,
        "clearance_level": "Tier-1 Hazardous Response"
    }
]

@router.get("")
def get_organizations():
    return ORGANIZATIONS
