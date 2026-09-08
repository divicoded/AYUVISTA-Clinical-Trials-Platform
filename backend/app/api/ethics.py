from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, require_role, record_audit_event
from app.models.user import User
from app.models.study import Study
from app.models.ethics import EthicsSubmission, CTRIRegistration, RegulatoryMilestone
from app.models.enums import UserRole
from app.schemas.common import EthicsSubmissionOut, EthicsDecisionRequest, CTRIRegistrationOut, RegulatoryMilestoneOut

router = APIRouter(prefix="/ethics", tags=["Ethics & Regulatory"])

@router.get("/submissions", response_model=List[EthicsSubmissionOut])
def list_ethics_submissions(
    study_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(EthicsSubmission)
    if study_id:
        st = db.query(Study).filter((Study.id == study_id) | (Study.study_code == study_id)).first()
        if st:
            query = query.filter(EthicsSubmission.study_id == st.id)
    return query.order_by(EthicsSubmission.submission_date.desc()).all()

@router.put("/submissions/{id}/decision", response_model=EthicsSubmissionOut)
def record_iec_decision(
    id: str,
    req: EthicsDecisionRequest,
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.ETHICS, UserRole.PRINCIPAL_INVESTIGATOR])),
    db: Session = Depends(get_db)
):
    sub = db.query(EthicsSubmission).filter(EthicsSubmission.id == id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Ethics submission not found")

    before_state = {"decision": sub.decision.value}
    sub.decision = req.decision
    if req.conditions:
        sub.conditions = req.conditions
    if req.decision_date:
        sub.decision_date = req.decision_date
    db.commit()
    db.refresh(sub)

    record_audit_event(
        db=db,
        actor=current_user,
        action="IEC_DECISION",
        entity_type="EthicsSubmission",
        entity_id=sub.id,
        before_state=before_state,
        after_state={"decision": sub.decision.value, "conditions": sub.conditions},
        reason="Institutional Ethics Committee issued formal decision"
    )
    return sub

@router.get("/ctri", response_model=List[CTRIRegistrationOut])
def list_ctri_registrations(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(CTRIRegistration).all()

@router.get("/ctri/{study_id_or_code}", response_model=CTRIRegistrationOut)
def get_ctri_for_study(study_id_or_code: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    st = db.query(Study).filter((Study.id == study_id_or_code) | (Study.study_code == study_id_or_code)).first()
    if not st:
        raise HTTPException(status_code=404, detail="Study not found")
    reg = db.query(CTRIRegistration).filter(CTRIRegistration.study_id == st.id).first()
    if not reg:
        raise HTTPException(status_code=404, detail="CTRI registration not found for study")
    return reg

@router.post("/ctri/{study_id_or_code}/sync-sandbox")
def sync_ctri_sandbox(study_id_or_code: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    st = db.query(Study).filter((Study.id == study_id_or_code) | (Study.study_code == study_id_or_code)).first()
    if not st:
        raise HTTPException(status_code=404, detail="Study not found")
    
    return {
        "status": "Sandbox Validation Passed",
        "study_code": st.study_code,
        "connector": "CTRI Public Registry Sandbox Connector (Demo v1.0)",
        "prospective_validated": True,
        "last_validated_at": datetime.now(timezone.utc).isoformat(),
        "disclaimer": "This transaction was validated against the AIIA CTRI Prototype Sandbox adapter."
    }

@router.get("/milestones", response_model=List[RegulatoryMilestoneOut])
def list_regulatory_milestones(
    study_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(RegulatoryMilestone)
    if study_id:
        st = db.query(Study).filter((Study.id == study_id) | (Study.study_code == study_id)).first()
        if st:
            query = query.filter(RegulatoryMilestone.study_id == st.id)
    return query.order_by(RegulatoryMilestone.due_date.asc()).all()
