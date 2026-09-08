from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, require_role, record_audit_event
from app.models.user import User
from app.models.study import Study
from app.models.enums import UserRole, LifecycleStage
from app.schemas.common import StudyOut, StudyCreate, StudyUpdate, StudyLifecycleTransition, RecruitmentCurvePoint

router = APIRouter(prefix="/studies", tags=["Studies"])

@router.get("", response_model=List[StudyOut])
def list_studies(
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Study)
    if search:
        s = f"%{search}%"
        query = query.filter((Study.study_code.ilike(s)) | (Study.title.ilike(s)) | (Study.therapeutic_area.ilike(s)))
    return query.order_by(Study.risk_score.desc()).all()

@router.post("", response_model=StudyOut)
def create_study(
    req: StudyCreate,
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.PRINCIPAL_INVESTIGATOR])),
    db: Session = Depends(get_db)
):
    existing = db.query(Study).filter(Study.study_code == req.study_code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Study code already exists")
    
    study = Study(**req.model_dump())
    db.add(study)
    db.commit()
    db.refresh(study)

    record_audit_event(
        db=db,
        actor=current_user,
        action="CREATE",
        entity_type="Study",
        entity_id=study.id,
        after_state={"study_code": study.study_code, "title": study.title},
        reason="New clinical trial registered"
    )
    return study

@router.get("/{id_or_code}", response_model=StudyOut)
def get_study(id_or_code: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    study = db.query(Study).filter((Study.id == id_or_code) | (Study.study_code == id_or_code)).first()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")
    return study

@router.put("/{id_or_code}", response_model=StudyOut)
def update_study(
    id_or_code: str,
    req: StudyUpdate,
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.PRINCIPAL_INVESTIGATOR])),
    db: Session = Depends(get_db)
):
    study = db.query(Study).filter((Study.id == id_or_code) | (Study.study_code == id_or_code)).first()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")

    before_state = {"title": study.title, "stage": study.lifecycle_stage.value, "status": study.status.value}
    update_data = req.model_dump(exclude_unset=True)
    for k, v in update_data.items():
        setattr(study, k, v)
    
    db.commit()
    db.refresh(study)

    record_audit_event(
        db=db,
        actor=current_user,
        action="UPDATE",
        entity_type="Study",
        entity_id=study.id,
        before_state=before_state,
        after_state={"title": study.title, "stage": study.lifecycle_stage.value, "status": study.status.value},
        reason="Study metadata updated"
    )
    return study

@router.post("/{id_or_code}/transition", response_model=StudyOut)
def transition_study_lifecycle(
    id_or_code: str,
    req: StudyLifecycleTransition,
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.PRINCIPAL_INVESTIGATOR])),
    db: Session = Depends(get_db)
):
    study = db.query(Study).filter((Study.id == id_or_code) | (Study.study_code == id_or_code)).first()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")

    before_stage = study.lifecycle_stage.value
    study.lifecycle_stage = req.target_stage
    db.commit()
    db.refresh(study)

    record_audit_event(
        db=db,
        actor=current_user,
        action="LIFECYCLE_TRANSITION",
        entity_type="Study",
        entity_id=study.id,
        before_state={"lifecycle_stage": before_stage},
        after_state={"lifecycle_stage": study.lifecycle_stage.value},
        reason=req.reason or "Advanced study lifecycle"
    )
    return study

@router.get("/{id_or_code}/recruitment-curve", response_model=List[RecruitmentCurvePoint])
def get_study_recruitment_curve(id_or_code: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    study = db.query(Study).filter((Study.id == id_or_code) | (Study.study_code == id_or_code)).first()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")

    if study.study_code == "AYU-003":
        # Illustrates the actual recruitment lag for the hero narrative
        return [
            RecruitmentCurvePoint(month="M1 (Jul)", target=20, actual=22, projected=20),
            RecruitmentCurvePoint(month="M2 (Aug)", target=55, actual=48, projected=55),
            RecruitmentCurvePoint(month="M3 (Sep)", target=95, actual=75, projected=95),
            RecruitmentCurvePoint(month="M4 (Oct)", target=140, actual=95, projected=140),
            RecruitmentCurvePoint(month="M5 (Nov)", target=190, actual=105, projected=190),
            RecruitmentCurvePoint(month="M6 (Dec)", target=250, actual=105, projected=220),
        ]
    else:
        # Standard healthy curve
        target = study.target_enrollment
        return [
            RecruitmentCurvePoint(month="M1", target=int(target * 0.1), actual=int(target * 0.12), projected=int(target * 0.1)),
            RecruitmentCurvePoint(month="M2", target=int(target * 0.3), actual=int(target * 0.32), projected=int(target * 0.3)),
            RecruitmentCurvePoint(month="M3", target=int(target * 0.55), actual=int(target * 0.56), projected=int(target * 0.55)),
            RecruitmentCurvePoint(month="M4", target=int(target * 0.8), actual=int(target * 0.82), projected=int(target * 0.8)),
            RecruitmentCurvePoint(month="M5", target=target, actual=study.current_enrollment, projected=target),
        ]
