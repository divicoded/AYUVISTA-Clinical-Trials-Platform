from datetime import date
from typing import List, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, record_audit_event
from app.models.user import User
from app.models.study import Study
from app.models.site import Site
from app.models.monitoring import MonitoringVisit
from app.models.enums import MonitoringStatus
from app.schemas.common import MonitoringVisitOut

router = APIRouter(prefix="/monitoring", tags=["Monitoring"])

class MonitoringVisitCreate(BaseModel):
    site_id: str
    study_id: Optional[str] = None
    monitor_name: str = "Mr. Rajesh Nair (Lead CRA)"
    visit_type: str = "Interim Monitoring Visit"
    planned_date: date
    findings: Optional[str] = None

@router.get("", response_model=List[MonitoringVisitOut])
def list_monitoring_visits(
    study_id: Optional[str] = None,
    site_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(MonitoringVisit)
    if study_id:
        st = db.query(Study).filter((Study.id == study_id) | (Study.study_code == study_id)).first()
        if st:
            query = query.filter(MonitoringVisit.study_id == st.id)
    if site_id:
        query = query.filter(MonitoringVisit.site_id == site_id)
    return query.order_by(MonitoringVisit.planned_date.desc()).all()

@router.post("", response_model=MonitoringVisitOut)
def create_monitoring_visit(
    req: MonitoringVisitCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    site = db.query(Site).filter((Site.id == req.site_id) | (Site.site_code == req.site_id)).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")

    study_id = req.study_id
    if not study_id:
        st = db.query(Study).first()
        study_id = st.id if st else None

    count = db.query(MonitoringVisit).count() + 1
    code = f"MON-2026-{count:03d}"
    mv = MonitoringVisit(
        visit_code=code,
        study_id=study_id,
        site_id=site.id,
        monitor_name=req.monitor_name,
        visit_type=req.visit_type,
        planned_date=req.planned_date,
        status=MonitoringStatus.SCHEDULED,
        findings=req.findings or f"Scheduled interim CRA on-site monitoring audit for site {site.site_code}.",
        open_actions_count=0
    )
    db.add(mv)
    # Update site status to PENDING_VISIT if it was OVERDUE_ACTION
    if site.monitoring_status == "OVERDUE_ACTION":
        site.monitoring_status = "PENDING_VISIT"

    db.commit()
    db.refresh(mv)

    record_audit_event(
        db=db,
        actor=current_user,
        action="SCHEDULE_MONITORING_VISIT",
        entity_type="MonitoringVisit",
        entity_id=mv.id,
        after_state={"visit_code": mv.visit_code, "planned_date": str(mv.planned_date), "status": "SCHEDULED"},
        reason=f"Scheduled CRA monitoring audit visit for site {site.site_code}"
    )
    return mv

