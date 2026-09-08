import uuid
from datetime import datetime, date, timezone
from sqlalchemy import Column, String, Text, Integer, Date, DateTime, Enum, ForeignKey
from app.database import Base
from app.models.enums import MonitoringStatus

class MonitoringVisit(Base):
    __tablename__ = "monitoring_visits"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    visit_code = Column(String(50), unique=True, index=True, nullable=False)  # e.g., MON-2026-015
    study_id = Column(String(36), ForeignKey("studies.id"), nullable=False)
    site_id = Column(String(36), ForeignKey("sites.id"), nullable=False)
    monitor_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    monitor_name = Column(String(255), nullable=True)
    
    visit_type = Column(String(50), default="Interim Monitoring")  # Site Initiation, Interim Monitoring, For-Cause, Close-Out
    planned_date = Column(Date, nullable=False)
    actual_date = Column(Date, nullable=True)
    
    status = Column(Enum(MonitoringStatus), default=MonitoringStatus.PLANNED)
    findings = Column(Text, nullable=True)
    open_actions_count = Column(Integer, default=0)
    due_date = Column(Date, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
