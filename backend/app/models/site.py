import uuid
from datetime import datetime, date, timezone
from sqlalchemy import Column, String, Integer, Date, DateTime, Enum, ForeignKey
from app.database import Base
from app.models.enums import SiteStatus

class Site(Base):
    __tablename__ = "sites"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    site_code = Column(String(50), unique=True, index=True, nullable=False)
    site_name = Column(String(255), nullable=False)
    institution = Column(String(255), nullable=False)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    
    principal_investigator_name = Column(String(255), nullable=True)
    site_coordinator_name = Column(String(255), nullable=True)
    
    activation_date = Column(Date, default=date.today)
    status = Column(Enum(SiteStatus), default=SiteStatus.ACTIVE)
    
    target_enrollment = Column(Integer, default=50)
    enrolled_count = Column(Integer, default=0)
    screening_count = Column(Integer, default=0)
    active_participants_count = Column(Integer, default=0)
    query_count = Column(Integer, default=0)
    deviations_count = Column(Integer, default=0)
    
    monitoring_status = Column(String(50), default="COMPLIANT")  # COMPLIANT, PENDING_VISIT, OVERDUE_ACTION
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class StudySite(Base):
    __tablename__ = "study_sites"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    study_id = Column(String(36), ForeignKey("studies.id"), nullable=False)
    site_id = Column(String(36), ForeignKey("sites.id"), nullable=False)
    target_enrollment = Column(Integer, default=50)
    enrolled_count = Column(Integer, default=0)
    status = Column(String(50), default="ACTIVE")
