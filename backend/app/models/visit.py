import uuid
from datetime import datetime, date, timezone
from sqlalchemy import Column, String, Integer, Date, DateTime, Enum, ForeignKey, Text
from app.database import Base
from app.models.enums import VisitStatus

class Visit(Base):
    __tablename__ = "visits"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    participant_id = Column(String(36), ForeignKey("participants.id"), nullable=False)
    study_id = Column(String(36), ForeignKey("studies.id"), nullable=False)
    site_id = Column(String(36), ForeignKey("sites.id"), nullable=False)
    
    visit_name = Column(String(50), nullable=False)  # Screening, Baseline, V1 (Week 2), etc.
    sequence_order = Column(Integer, default=1)
    
    target_date = Column(Date, nullable=False)
    actual_date = Column(Date, nullable=True)
    
    window_days_min = Column(Integer, default=-3)
    window_days_max = Column(Integer, default=3)
    
    status = Column(Enum(VisitStatus), default=VisitStatus.SCHEDULED)
    compliance_flag = Column(String(50), default="COMPLIANT")  # COMPLIANT, NON_COMPLIANT, OUT_OF_WINDOW
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
