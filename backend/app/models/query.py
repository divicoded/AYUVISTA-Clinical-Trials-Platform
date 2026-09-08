import uuid
from datetime import datetime, date, timezone
from sqlalchemy import Column, String, Text, Date, DateTime, Enum, ForeignKey
from app.database import Base
from app.models.enums import QuerySeverity, QueryStatus

class DataQuery(Base):
    __tablename__ = "data_queries"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    query_code = Column(String(50), unique=True, index=True, nullable=False)  # e.g., QRY-2026-0042
    study_id = Column(String(36), ForeignKey("studies.id"), nullable=False)
    site_id = Column(String(36), ForeignKey("sites.id"), nullable=False)
    participant_id = Column(String(36), ForeignKey("participants.id"), nullable=True)
    visit_id = Column(String(36), ForeignKey("visits.id"), nullable=True)
    
    field_name = Column(String(100), nullable=False)  # e.g., "Vital Signs - Systolic BP", "Dosha Assessment Score"
    issue = Column(Text, nullable=False)
    severity = Column(Enum(QuerySeverity), default=QuerySeverity.MEDIUM)
    status = Column(Enum(QueryStatus), default=QueryStatus.OPEN)
    
    assigned_to_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    due_date = Column(Date, nullable=False)
    resolution = Column(Text, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
