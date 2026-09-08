from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.study import Study
from app.models.participant import Participant
from app.models.visit import Visit
from app.models.enums import VisitStatus
from app.schemas.common import ParticipantOut, VisitOut, VisitCompleteRequest

router = APIRouter(prefix="/participants", tags=["Participants"])

@router.get("", response_model=List[ParticipantOut])
def list_participants(
    study_id: Optional[str] = None,
    site_id: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Participant)
    if study_id:
        # Check if study_id is code
        st = db.query(Study).filter((Study.id == study_id) | (Study.study_code == study_id)).first()
        if st:
            query = query.filter(Participant.study_id == st.id)
    if site_id:
        query = query.filter(Participant.site_id == site_id)
    if search:
        s = f"%{search}%"
        query = query.filter(Participant.synthetic_id.ilike(s))
    
    return query.limit(limit).all()

@router.get("/{id_or_synthetic}", response_model=ParticipantOut)
def get_participant(id_or_synthetic: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = db.query(Participant).filter((Participant.id == id_or_synthetic) | (Participant.synthetic_id == id_or_synthetic)).first()
    if not p:
        raise HTTPException(status_code=404, detail="Synthetic participant not found")
    return p

@router.get("/{id_or_synthetic}/visits", response_model=List[VisitOut])
def get_participant_visits(id_or_synthetic: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = db.query(Participant).filter((Participant.id == id_or_synthetic) | (Participant.synthetic_id == id_or_synthetic)).first()
    if not p:
        raise HTTPException(status_code=404, detail="Synthetic participant not found")
    return db.query(Visit).filter(Visit.participant_id == p.id).order_by(Visit.sequence_order.asc()).all()

@router.put("/visits/{visit_id}/complete", response_model=VisitOut)
def complete_visit(
    visit_id: str,
    req: VisitCompleteRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    visit = db.query(Visit).filter(Visit.id == visit_id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")

    visit.status = VisitStatus.COMPLETED
    visit.actual_date = req.actual_date
    if req.notes:
        visit.notes = req.notes
    db.commit()
    db.refresh(visit)
    return visit
