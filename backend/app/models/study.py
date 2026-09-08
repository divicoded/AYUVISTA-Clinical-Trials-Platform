import uuid
from datetime import datetime, date, timezone
from sqlalchemy import Column, String, Text, Integer, Float, Date, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.enums import StudyStatus, LifecycleStage, RiskLevel

class Study(Base):
    __tablename__ = "studies"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    study_code = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(Text, nullable=False)
    short_title = Column(String(255), nullable=False)
    study_type = Column(String(100), default="Interventional")
    intervention_type = Column(String(100), default="Herbo-mineral Formulation")
    phase = Column(String(50), default="Phase II")
    sponsor = Column(String(255), default="All India Institute of Ayurveda (AIIA)")
    
    principal_investigator_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    coordinator_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    
    start_date = Column(Date, default=date.today)
    expected_completion = Column(Date, nullable=True)
    
    target_enrollment = Column(Integer, default=100)
    current_enrollment = Column(Integer, default=0)
    number_of_sites = Column(Integer, default=1)
    
    status = Column(Enum(StudyStatus), default=StudyStatus.ACTIVE)
    lifecycle_stage = Column(Enum(LifecycleStage), default=LifecycleStage.RECRUITMENT)
    protocol_version = Column(String(20), default="v1.0")
    therapeutic_area = Column(String(100), default="Ayurvedic Medicine")
    population = Column(String(255), default="Adult patients aged 18-65")
    
    primary_objective = Column(Text, nullable=True)
    secondary_objectives = Column(Text, nullable=True)
    
    # Operational risk calculations (0-100)
    risk_score = Column(Float, default=15.0)
    risk_level = Column(Enum(RiskLevel), default=RiskLevel.HEALTHY)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
