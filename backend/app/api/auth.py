from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, record_audit_event
from app.core.security import verify_password, create_access_token
from app.models.user import User
from app.models.enums import UserRole
from app.schemas.common import LoginRequest, SwitchRoleRequest, Token, UserOut

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user.last_login = datetime.now(timezone.utc)
    db.commit()

    token = create_access_token(data={"sub": user.id, "email": user.email, "role": user.role.value})
    record_audit_event(
        db=db,
        actor=user,
        action="LOGIN",
        entity_type="User",
        entity_id=user.id,
        reason=f"User session established with role {user.role.value}"
    )
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/switch-role", response_model=Token)
def switch_role(req: SwitchRoleRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Convenience helper for demo / hackathon presentation to test RBAC roles effortlessly"""
    current_user.role = req.role
    db.commit()
    db.refresh(current_user)

    token = create_access_token(data={"sub": current_user.id, "email": current_user.email, "role": current_user.role.value})
    record_audit_event(
        db=db,
        actor=current_user,
        action="ROLE_SWITCH",
        entity_type="User",
        entity_id=current_user.id,
        reason=f"Switched active demo role to {req.role.value}"
    )
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": current_user
    }
