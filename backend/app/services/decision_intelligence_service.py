from typing import Dict, List, Any
from datetime import datetime
import uuid

class DecisionIntelligenceService:
    def __init__(self):
        self.decision_plans = [
            {
                "id": "DEC-PLAN-882",
                "trigger_event_id": "ENV-204",
                "title": "Autonomous Petrochemical Plume Intercept & Public Safeguard",
                "created_at": datetime.utcnow().isoformat(),
                "status": "READY_FOR_EXECUTION",
                "confidence_score": 96.4,
                "summary": "Coordinated multi-agent operational sequence responding to acute catalytic cracker emission spike in Sector 7 Industrial Corridor.",
                "actions": [
                    {
                        "step": 1,
                        "action_type": "DRONE_DISPATCH",
                        "target": "VTOL-002 (AeroSentry X8)",
                        "instruction": "Deploy immediately to Plume Intercept Waypoint (19.0142, 72.8988, Alt: 85m)",
                        "status": "PENDING",
                        "estimated_duration_sec": 180,
                        "details": "Equipped with Optical Gas Imaging (OGI) & PID VOC sensor"
                    },
                    {
                        "step": 2,
                        "action_type": "FLEET_ORCHESTRATION",
                        "target": "VTOL-003 (EcoHawk Ranger)",
                        "instruction": "Delay routine forest patrol by 45 mins; hold in standby at Base Heliport",
                        "status": "PENDING",
                        "estimated_duration_sec": 0,
                        "details": "Reserve airframe for secondary downwind perimeter sweep if plume expands"
                    },
                    {
                        "step": 3,
                        "action_type": "STATUTORY_NOTIFICATION",
                        "target": "Maharashtra Pollution Control Board (MPCB)",
                        "instruction": "Transmit automated Section 31A statutory warning & plume trajectory dossier",
                        "status": "PENDING",
                        "estimated_duration_sec": 5,
                        "details": "Dispatched to Regional Officer & Air Quality Vigilance Cell"
                    },
                    {
                        "step": 4,
                        "action_type": "SENSOR_SAMPLING_RATE",
                        "target": "Airborne Fleet & Ground Nodes in Ward M/East",
                        "instruction": "Increase telemetry sampling rate from 2.0s to 500ms (High-Frequency Burst)",
                        "status": "PENDING",
                        "estimated_duration_sec": 2,
                        "details": "Captures high-resolution micro-vortices along street canyons"
                    },
                    {
                        "step": 5,
                        "action_type": "CIVIL_ADVISORY",
                        "target": "Municipal Disaster Management Cell & School Corridor",
                        "instruction": "Issue precautionary indoor air advisory for 3 schools within 2.5km downwind",
                        "status": "PENDING",
                        "estimated_duration_sec": 10,
                        "details": "Alerts Holy Family Convent, Vidyaniketan School, and Model High School"
                    },
                    {
                        "step": 6,
                        "action_type": "REPORT_GENERATION",
                        "target": "Certified Incident Compliance Dossier",
                        "instruction": "Auto-compile cryptographic sensor evidence and dispatch legal audit packet",
                        "status": "PENDING",
                        "estimated_duration_sec": 15,
                        "details": "Signed with platform private key for statutory legal defensibility"
                    }
                ],
                "impact_mitigation": {
                    "estimated_exposure_reduction_pct": 74.5,
                    "prevented_vulnerable_exposures": 2840,
                    "economic_damage_averted_inr": "₹14.2 Lakhs"
                }
            }
        ]
        self.execution_logs = []

    def get_latest_plan(self) -> Dict[str, Any]:
        return self.decision_plans[0]

    def execute_chain(self, plan_id: str) -> Dict[str, Any]:
        plan = None
        for p in self.decision_plans:
            if p["id"] == plan_id:
                plan = p
                break
        
        if not plan:
            plan = self.decision_plans[0]
            
        executed_steps = []
        for action in plan["actions"]:
            action["status"] = "COMPLETED"
            action["executed_at"] = datetime.utcnow().isoformat()
            executed_steps.append({
                "step": action["step"],
                "target": action["target"],
                "action": action["instruction"],
                "status": "SUCCESS",
                "timestamp": datetime.utcnow().isoformat()
            })

        plan["status"] = "EXECUTED_IN_FIELD"
        plan["executed_at"] = datetime.utcnow().isoformat()

        log_entry = {
            "execution_id": f"EXEC-{uuid.uuid4().hex[:6].upper()}",
            "plan_id": plan["id"],
            "timestamp": datetime.utcnow().isoformat(),
            "operator": "AI Autonomous Operational Coordinator",
            "steps_completed": len(executed_steps),
            "status": "SUCCESS"
        }
        self.execution_logs.insert(0, log_entry)

        return {
            "status": "SUCCESS",
            "message": "All 6 autonomous coordinator actions executed with full synchronization across fleet and statutory agencies.",
            "plan": plan,
            "execution_log": log_entry
        }

    def reset_plan(self, plan_id: str) -> Dict[str, Any]:
        for p in self.decision_plans:
            if p["id"] == plan_id:
                p["status"] = "READY_FOR_EXECUTION"
                for action in p["actions"]:
                    action["status"] = "PENDING"
                    action.pop("executed_at", None)
                return p
        return self.decision_plans[0]

decision_intelligence_service = DecisionIntelligenceService()
