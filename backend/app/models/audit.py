import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime
from app.database import Base

class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True, nullable=False)
    
    actor_id = Column(String(36), nullable=True)
    actor_name = Column(String(255), nullable=False)
    actor_role = Column(String(50), nullable=False)
    
    action = Column(String(50), nullable=False)  # CREATE, UPDATE, TRANSITION, RESOLVE, CLOSE, EXPORT, LOGIN
    entity_type = Column(String(50), nullable=False, index=True)  # Study, Participant, SafetyCase, DataQuery, ProtocolDeviation, etc.
    entity_id = Column(String(50), nullable=False, index=True)
    
    before_state_json = Column(Text, nullable=True)
    after_state_json = Column(Text, nullable=True)
    
    reason = Column(Text, nullable=True)
    session_id = Column(String(100), nullable=True)
    ip_address = Column(String(50), default="127.0.0.1 (Local Session)")
