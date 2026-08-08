from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
from app.database import get_db
from app.models.alert import Alert
from app.schemas.alert import AlertResponse, AlertCreate, AlertResolveRequest
from app.services.websocket_manager import ws_manager

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("", response_model=List[AlertResponse])
def get_alerts(
    severity: Optional[str] = Query(None),
    resolved: Optional[bool] = Query(None),
    limit: int = Query(50, le=200),
    db: Session = Depends(get_db)
):
    query = db.query(Alert)
    if severity:
        query = query.filter(Alert.severity == severity.upper())
    if resolved is not None:
        query = query.filter(Alert.resolved == resolved)
    alerts = query.order_by(Alert.timestamp.desc()).limit(limit).all()
    return alerts

@router.post("", response_model=AlertResponse)
async def create_alert(alert_in: AlertCreate, db: Session = Depends(get_db)):
    alert_id = alert_in.id or f"ALT-{int(datetime.now(timezone.utc).timestamp())}"
    alert = Alert(
        id=alert_id,
        drone_id=alert_in.drone_id,
        type=alert_in.type,
        severity=alert_in.severity,
        title=alert_in.title,
        description=alert_in.description,
        location_name=alert_in.location_name,
        latitude=alert_in.latitude,
        longitude=alert_in.longitude,
        metric_name=alert_in.metric_name,
        metric_value=alert_in.metric_value,
        threshold_value=alert_in.threshold_value,
        timestamp=datetime.now(timezone.utc),
        resolved=False
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)

    # Broadcast alert
    await ws_manager.broadcast({
        "event": "newAlert",
        "alert": {
            "id": alert.id,
            "drone_id": alert.drone_id,
            "severity": alert.severity,
            "title": alert.title,
            "description": alert.description,
            "timestamp": alert.timestamp.isoformat()
        }
    })
    return alert

@router.post("/{alert_id}/resolve", response_model=AlertResponse)
async def resolve_alert(alert_id: str, req: AlertResolveRequest, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert.resolved = True
    alert.resolved_at = datetime.now(timezone.utc)
    alert.resolved_by = req.resolved_by
    db.commit()
    db.refresh(alert)
    
    await ws_manager.broadcast({
        "event": "alertResolved",
        "alert_id": alert_id,
        "resolved_by": req.resolved_by
    })
    return alert
