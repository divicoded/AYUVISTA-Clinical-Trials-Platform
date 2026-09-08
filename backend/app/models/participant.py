import uuid
from datetime import datetime, date, timezone
from sqlalchemy import Column, String, Integer, Date, DateTime, Enum, ForeignKey
from app.database import Base
from app.models.enums import ParticipantStatus, ConsentStatus

class Participant(Base):
    __tablename__ = "participants"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    synthetic_id = Column(String(50), unique=True, index=True, nullable=False)  # e.g., SYN-P00001
    study_id = Column(String(36), ForeignKey("studies.id"), nullable=False)
    site_id = Column(String(36), ForeignKey("sites.id"), nullable=False)
    
    screening_date = Column(Date, default=date.today)
    enrollment_date = Column(Date, nullable=True)
    
    treatment_arm = Column(String(150), default="Arm A: Standard Classical Formulation")
    randomization_status = Column(String(50), default="RANDOMIZED")  # PENDING, RANDOMIZED
    randomization_code = Column(String(50), nullable=True)
    
    participant_status = Column(Enum(ParticipantStatus), default=ParticipantStatus.ACTIVE)
    consent_status = Column(Enum(ConsentStatus), default=ConsentStatus.OBTAINED)
    withdrawal_reason = Column(String(255), nullable=True)
    
    age_years = Column(Integer, default=45)  # Synthetic demographic
    gender = Column(String(20), default="Other")  # Synthetic demographic: Male, Female, Other
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Consent(Base):
    __tablename__ = "consents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    participant_id = Column(String(36), ForeignKey("participants.id"), nullable=False)
    study_id = Column(String(36), ForeignKey("studies.id"), nullable=False)
    
    consent_version = Column(String(20), default="v1.2")
    consent_type = Column(String(50), default="Main Informed Consent Form")
    date_obtained = Column(Date, default=date.today)
    status = Column(Enum(ConsentStatus), default=ConsentStatus.OBTAINED)
    method = Column(String(50), default="Written In-Person")
    witness_name = Column(String(100), nullable=True)
    document_ref = Column(String(255), default="DOC-ICF-SIGNED.pdf")
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
