import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Boolean, Float, DateTime, Enum, ForeignKey
from app.database import Base
from app.models.enums import AESeverity, AEExpectedness, AECausality, SafetyWorkflowState, SignalState

class SafetyCase(Base):
    __tablename__ = "safety_cases"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_number = Column(String(50), unique=True, index=True, nullable=False)  # e.g., PV-2026-0031
    study_id = Column(String(36), ForeignKey("studies.id"), nullable=False)
    site_id = Column(String(36), ForeignKey("sites.id"), nullable=False)
    participant_id = Column(String(36), ForeignKey("participants.id"), nullable=False)
    
    is_serious = Column(Boolean, default=False)  # True = SAE, False = Non-serious AE
    adverse_event_term = Column(String(255), nullable=False)
    
    # Synthetic / Demo Coding Adapter fields
    meddra_preferred_term = Column(String(255), nullable=True)  # e.g., "Rash erythematous", "Hepatic enzyme increased"
    meddra_soc_term = Column(String(255), nullable=True)  # System Organ Class: e.g., "Skin and subcutaneous tissue disorders"
    meddra_code = Column(String(20), nullable=True)  # e.g., "10037844"
    
    severity = Column(Enum(AESeverity), default=AESeverity.MILD)
    expectedness = Column(Enum(AEExpectedness), default=AEExpectedness.UNEXPECTED)
    causality = Column(Enum(AECausality), default=AECausality.POSSIBLE)
    
    onset_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    resolution_date = Column(DateTime, nullable=True)
    
    action_taken = Column(String(100), default="DOSE_NOT_CHANGED")  # DOSE_NOT_CHANGED, DOSE_REDUCED, DRUG_WITHDRAWN
    reporter_name = Column(String(150), default="Site Co-Investigator")
    
    # Expedited reporting clock for SAEs (e.g., 24h institutional IEC notification, 7d regulatory clock)
    reporting_deadline = Column(DateTime, nullable=True)
    
    workflow_state = Column(Enum(SafetyWorkflowState), default=SafetyWorkflowState.REPORTED)
    submission_status = Column(String(50), default="PENDING_SUBMISSION")
    
    narrative = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class SafetySignal(Base):
    __tablename__ = "safety_signals"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    signal_code = Column(String(50), unique=True, index=True, nullable=False)  # e.g., SIG-2026-004
    pattern_description = Column(Text, nullable=False)
    
    study_id = Column(String(36), ForeignKey("studies.id"), nullable=True)
    observed_frequency = Column(Float, default=0.0)  # e.g., 4.2%
    expected_frequency = Column(Float, default=1.0)  # e.g., 1.1%
    relative_risk = Column(Float, default=1.0)       # e.g., 3.8x
    
    signal_state = Column(Enum(SignalState), default=SignalState.DETECTED)
    analyst_name = Column(String(150), default="Dr. Vikramaditya Joshi (PV Officer)")
    review_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    conclusion = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
