from fastapi import APIRouter, Query
from app.services.report_service import report_service

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/compliance")
def get_compliance_report(
    drone_id: str = Query("ALL"),
    start_date: str = Query(None),
    end_date: str = Query(None)
):
    """
    Returns structured Environmental Compliance Audit Report for PDF rendering or export.
    """
    return report_service.generate_compliance_report(
        drone_id=drone_id,
        start_date=start_date,
        end_date=end_date
    )
