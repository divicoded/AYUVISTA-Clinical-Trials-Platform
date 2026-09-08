import uuid
from datetime import datetime, date, timezone
from sqlalchemy import Column, String, Text, Boolean, Integer, Date, DateTime, Enum, ForeignKey
from app.database import Base
from app.models.enums import IECDecision

class EthicsSubmission(Base):
    __tablename__ = "ethics_submissions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    submission_code = Column(String(50), unique=True, index=True, nullable=False)  # e.g., IEC-AIIA-2026-012
    study_id = Column(String(36), ForeignKey("studies.id"), nullable=False)
    
    submission_date = Column(Date, default=date.today)
    version = Column(String(20), default="v1.0")
    submission_type = Column(String(50), default="Initial Protocol Review")  # Initial, Amendment, Continuing Review, SAE Report
    
    review_meeting_date = Column(Date, nullable=True)
    decision_date = Column(Date, nullable=True)
    decision = Column(Enum(IECDecision), default=IECDecision.UNDER_REVIEW)
    conditions = Column(Text, nullable=True)
    validity_expiry_date = Column(Date, nullable=True)
    
    document_ref = Column(String(255), default="IEC_APPROVAL_LETTER.pdf")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class CTRIRegistration(Base):
    __tablename__ = "ctri_registrations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    study_id = Column(String(36), ForeignKey("studies.id"), unique=True, nullable=False)
    
    ctri_number = Column(String(50), unique=True, index=True, nullable=False)  # e.g., CTRI/2025/11/075432
    registration_status = Column(String(50), default="REGISTERED")  # REGISTERED, PROVISIONALLY_APPROVED, PENDING_QUERY
    registration_date = Column(Date, default=date.today)
    is_prospective = Column(Boolean, default=True)
    
    last_update_date = Column(Date, default=date.today)
    next_required_update = Column(Date, nullable=True)
    responsible_user_name = Column(String(255), default="Prof. Dr. Suhas Kumar")
    
    submission_payload_json = Column(Text, nullable=True)
    connector_status = Column(String(50), default="Connected (Sandbox)")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class RegulatoryMilestone(Base):
    __tablename__ = "regulatory_milestones"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    study_id = Column(String(36), ForeignKey("studies.id"), nullable=False)
    
    milestone_name = Column(String(100), nullable=False)  # e.g. IEC Annual Renewal, CTRI 6-Monthly Progress Update
    due_date = Column(Date, nullable=False)
    completed_date = Column(Date, nullable=True)
    
    owner_name = Column(String(255), default="PI / Regulatory Coordinator")
    status = Column(String(50), default="UPCOMING")  # UPCOMING, DUE_SOON, OVERDUE, COMPLETED
    priority = Column(String(20), default="MEDIUM")  # HIGH, MEDIUM, LOW
    reminder_threshold_days = Column(Integer, default=30)
    
    evidence_document = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
