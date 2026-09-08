import uuid
from datetime import datetime, date, timezone
from sqlalchemy import Column, String, Text, Date, DateTime, Enum, ForeignKey
from app.database import Base
from app.models.enums import DeviationSeverity, DeviationStatus

class ProtocolDeviation(Base):
    __tablename__ = "protocol_deviations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    deviation_code = Column(String(50), unique=True, index=True, nullable=False)  # e.g., DEV-2026-018
    study_id = Column(String(36), ForeignKey("studies.id"), nullable=False)
    site_id = Column(String(36), ForeignKey("sites.id"), nullable=False)
    participant_id = Column(String(36), ForeignKey("participants.id"), nullable=True)
    
    category = Column(String(100), nullable=False)  # Informed Consent, Inclusion/Exclusion, IP Administration, Visit Window, Concomitant Med
    description = Column(Text, nullable=False)
    severity = Column(Enum(DeviationSeverity), default=DeviationSeverity.MINOR)
    discovery_date = Column(Date, default=date.today)
    
    impact = Column(Text, nullable=True)
    corrective_action = Column(Text, nullable=True)
    preventive_action = Column(Text, nullable=True)
    
    status = Column(Enum(DeviationStatus), default=DeviationStatus.OPEN)
    owner_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    due_date = Column(Date, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
