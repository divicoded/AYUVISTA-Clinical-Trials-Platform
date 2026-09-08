import json
from datetime import datetime, timezone
from typing import Generator, List, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.core.security import decode_token
from app.models.user import User
from app.models.enums import UserRole
from app.models.audit import AuditEvent

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_token(token)
    if payload is None:
        raise credentials_exception
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")
    return user

def require_role(allowed_roles: List[UserRole]):
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role == UserRole.ADMIN:
            return current_user  # Admin has access across domains
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: User role '{current_user.role.value}' does not have permission for this clinical operation.",
            )
        return current_user
    return role_checker

def record_audit_event(
    db: Session,
    actor: User,
    action: str,
    entity_type: str,
    entity_id: str,
    before_state: Optional[dict] = None,
    after_state: Optional[dict] = None,
    reason: Optional[str] = None,
    session_id: Optional[str] = None,
    ip_address: Optional[str] = "127.0.0.1"
) -> AuditEvent:
    event = AuditEvent(
        timestamp=datetime.now(timezone.utc),
        actor_id=actor.id if actor else None,
        actor_name=actor.full_name if actor else "System",
        actor_role=actor.role.value if actor else "SYSTEM",
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        before_state_json=json.dumps(before_state) if before_state else None,
        after_state_json=json.dumps(after_state) if after_state else None,
        reason=reason,
        session_id=session_id,
        ip_address=ip_address
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event
