from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.audit import AuditEvent
from app.schemas.common import AuditEventOut

router = APIRouter(prefix="/audit", tags=["Audit Trail"])

@router.get("", response_model=List[AuditEventOut])
def list_audit_events(
    entity_type: Optional[str] = None,
    entity_id: Optional[str] = None,
    action: Optional[str] = None,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(AuditEvent)
    if entity_type:
        query = query.filter(AuditEvent.entity_type == entity_type)
    if entity_id:
        query = query.filter(AuditEvent.entity_id == entity_id)
    if action:
        query = query.filter(AuditEvent.action == action)
    
    return query.order_by(AuditEvent.timestamp.desc()).limit(limit).all()

@router.get("/entity/{entity_type}/{entity_id}", response_model=List[AuditEventOut])
def get_entity_history(
    entity_type: str,
    entity_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(AuditEvent).filter(
        AuditEvent.entity_type == entity_type,
        AuditEvent.entity_id == entity_id
    ).order_by(AuditEvent.timestamp.desc()).all()
