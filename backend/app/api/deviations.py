from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, record_audit_event
from app.models.user import User
from app.models.study import Study
from app.models.deviation import ProtocolDeviation
from app.schemas.common import ProtocolDeviationOut, DeviationCAPARequest

router = APIRouter(prefix="/deviations", tags=["Protocol Deviations"])

@router.get("", response_model=List[ProtocolDeviationOut])
def list_deviations(
    study_id: Optional[str] = None,
    site_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(ProtocolDeviation)
    if study_id:
        st = db.query(Study).filter((Study.id == study_id) | (Study.study_code == study_id)).first()
        if st:
            query = query.filter(ProtocolDeviation.study_id == st.id)
    if site_id:
        query = query.filter(ProtocolDeviation.site_id == site_id)
    return query.order_by(ProtocolDeviation.discovery_date.desc()).all()

@router.put("/{id}/capa", response_model=ProtocolDeviationOut)
def record_capa(
    id: str,
    req: DeviationCAPARequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    dev = db.query(ProtocolDeviation).filter(ProtocolDeviation.id == id).first()
    if not dev:
        raise HTTPException(status_code=404, detail="Protocol deviation not found")

    dev.corrective_action = req.corrective_action
    dev.preventive_action = req.preventive_action
    dev.status = req.status
    db.commit()
    db.refresh(dev)

    record_audit_event(
        db=db,
        actor=current_user,
        action="CAPA_RECORDED",
        entity_type="ProtocolDeviation",
        entity_id=dev.id,
        after_state={"status": dev.status.value, "corrective_action": req.corrective_action},
        reason="Assigned Corrective and Preventive Action plan"
    )
    return dev
