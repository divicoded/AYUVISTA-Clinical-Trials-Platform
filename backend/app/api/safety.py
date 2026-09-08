from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, require_role, record_audit_event
from app.models.user import User
from app.models.study import Study
from app.models.safety import SafetyCase, SafetySignal
from app.models.enums import UserRole, SafetyWorkflowState
from app.schemas.common import SafetyCaseOut, SafetyTransitionRequest, SafetySignalOut
from app.services.coding_adapter import coding_adapter

router = APIRouter(prefix="/safety", tags=["Safety & Pharmacovigilance"])

@router.get("/cases", response_model=List[SafetyCaseOut])
def list_safety_cases(
    study_id: Optional[str] = None,
    is_serious: Optional[bool] = None,
    workflow_state: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(SafetyCase)
    if study_id:
        st = db.query(Study).filter((Study.id == study_id) | (Study.study_code == study_id)).first()
        if st:
            query = query.filter(SafetyCase.study_id == st.id)
    if is_serious is not None:
        query = query.filter(SafetyCase.is_serious == is_serious)
    if workflow_state:
        query = query.filter(SafetyCase.workflow_state == workflow_state)
    return query.order_by(SafetyCase.onset_date.desc()).all()

@router.get("/cases/{id_or_number}", response_model=SafetyCaseOut)
def get_safety_case(id_or_number: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    case = db.query(SafetyCase).filter((SafetyCase.id == id_or_number) | (SafetyCase.case_number == id_or_number)).first()
    if not case:
        raise HTTPException(status_code=404, detail="Safety case not found")
    return case

@router.post("/cases/{id_or_number}/transition", response_model=SafetyCaseOut)
def transition_safety_case(
    id_or_number: str,
    req: SafetyTransitionRequest,
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.PHARMACOVIGILANCE, UserRole.PRINCIPAL_INVESTIGATOR])),
    db: Session = Depends(get_db)
):
    case = db.query(SafetyCase).filter((SafetyCase.id == id_or_number) | (SafetyCase.case_number == id_or_number)).first()
    if not case:
        raise HTTPException(status_code=404, detail="Safety case not found")

    before_state = {
        "workflow_state": case.workflow_state.value,
        "meddra_preferred_term": case.meddra_preferred_term,
        "causality": case.causality.value if case.causality else None
    }

    case.workflow_state = req.target_state
    if req.meddra_preferred_term:
        case.meddra_preferred_term = req.meddra_preferred_term
    if req.meddra_soc_term:
        case.meddra_soc_term = req.meddra_soc_term
    if req.meddra_code:
        case.meddra_code = req.meddra_code
    if req.causality:
        case.causality = req.causality

    if req.target_state == SafetyWorkflowState.SUBMITTED:
        case.submission_status = "SUBMITTED"

    db.commit()
    db.refresh(case)

    record_audit_event(
        db=db,
        actor=current_user,
        action="SAFETY_TRANSITION",
        entity_type="SafetyCase",
        entity_id=case.id,
        before_state=before_state,
        after_state={
            "workflow_state": case.workflow_state.value,
            "meddra_preferred_term": case.meddra_preferred_term,
            "causality": case.causality.value if case.causality else None
        },
        reason=req.reason or f"Advanced safety case to {req.target_state.value}"
    )
    return case

@router.get("/signals", response_model=List[SafetySignalOut])
def list_safety_signals(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(SafetySignal).order_by(SafetySignal.relative_risk.desc()).all()

@router.get("/coding/lookup")
def lookup_coding_terms(q: str = "", current_user: User = Depends(get_current_user)):
    return {
        "adapter_name": coding_adapter.dictionary_name,
        "version": coding_adapter.version,
        "is_licensed_production": coding_adapter.is_licensed_production,
        "disclaimer": "Synthetic Terminology Adapter for demonstration and hackathon validation.",
        "results": coding_adapter.search(q)
    }
