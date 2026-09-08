from typing import List, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, record_audit_event
from app.models.user import User
from app.models.site import Site
from app.models.participant import Participant
from app.models.query import DataQuery
from app.models.deviation import ProtocolDeviation
from app.models.enums import QueryStatus, DeviationStatus
from app.schemas.common import SiteOut

router = APIRouter(prefix="/sites", tags=["Sites"])

@router.get("", response_model=List[SiteOut])
def list_sites(
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Site)
    if search:
        s = f"%{search}%"
        query = query.filter((Site.site_code.ilike(s)) | (Site.site_name.ilike(s)) | (Site.city.ilike(s)))
    sites = query.all()

    # Dynamically update counts
    for site in sites:
        site.enrolled_count = db.query(Participant).filter(Participant.site_id == site.id).count()
        site.screening_count = int(site.enrolled_count * 1.2)
        site.active_participants_count = site.enrolled_count
        site.query_count = db.query(DataQuery).filter(
            DataQuery.site_id == site.id,
            DataQuery.status.in_([QueryStatus.OPEN, QueryStatus.IN_REVIEW])
        ).count()
        site.deviations_count = db.query(ProtocolDeviation).filter(
            ProtocolDeviation.site_id == site.id,
            ProtocolDeviation.status != DeviationStatus.CLOSED
        ).count()

    return sites

@router.get("/{id_or_code}", response_model=SiteOut)
def get_site(id_or_code: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    site = db.query(Site).filter((Site.id == id_or_code) | (Site.site_code == id_or_code)).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    
    site.enrolled_count = db.query(Participant).filter(Participant.site_id == site.id).count()
    site.query_count = db.query(DataQuery).filter(
        DataQuery.site_id == site.id,
        DataQuery.status.in_([QueryStatus.OPEN, QueryStatus.IN_REVIEW])
    ).count()
    site.deviations_count = db.query(ProtocolDeviation).filter(
        ProtocolDeviation.site_id == site.id,
        ProtocolDeviation.status != DeviationStatus.CLOSED
    ).count()
    return site

class SiteMonitoringStatusUpdate(BaseModel):
    monitoring_status: str
    reason: Optional[str] = None

@router.put("/{id}/monitoring-status", response_model=SiteOut)
def update_site_monitoring_status(
    id: str,
    req: SiteMonitoringStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    site = db.query(Site).filter((Site.id == id) | (Site.site_code == id)).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    
    before_status = site.monitoring_status
    site.monitoring_status = req.monitoring_status
    db.commit()
    db.refresh(site)

    record_audit_event(
        db=db,
        actor=current_user,
        action="SITE_MONITORING_STATUS_UPDATE",
        entity_type="Site",
        entity_id=site.id,
        before_state={"monitoring_status": before_status},
        after_state={"monitoring_status": site.monitoring_status},
        reason=req.reason or f"Updated monitoring status to {req.monitoring_status}"
    )

    site.enrolled_count = db.query(Participant).filter(Participant.site_id == site.id).count()
    site.screening_count = int(site.enrolled_count * 1.2)
    site.active_participants_count = site.enrolled_count
    site.query_count = db.query(DataQuery).filter(
        DataQuery.site_id == site.id,
        DataQuery.status.in_([QueryStatus.OPEN, QueryStatus.IN_REVIEW])
    ).count()
    site.deviations_count = db.query(ProtocolDeviation).filter(
        ProtocolDeviation.site_id == site.id,
        ProtocolDeviation.status != DeviationStatus.CLOSED
    ).count()
    return site

