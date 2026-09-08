import uuid
from datetime import datetime, date, timezone
from sqlalchemy import Column, String, Text, Date, DateTime, Enum, ForeignKey
from app.database import Base
from app.models.enums import TaskPriority, TaskStatus

class OperationalTask(Base):
    __tablename__ = "operational_tasks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    study_id = Column(String(36), ForeignKey("studies.id"), nullable=True)
    site_id = Column(String(36), ForeignKey("sites.id"), nullable=True)
    
    owner_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    owner_name = Column(String(255), default="Assigned Staff")
    
    due_date = Column(Date, nullable=False)
    priority = Column(Enum(TaskPriority), default=TaskPriority.MEDIUM)
    status = Column(Enum(TaskStatus), default=TaskStatus.OPEN)
    source_module = Column(String(50), default="General")  # Monitoring, Queries, Deviations, Regulatory, Safety
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime, nullable=True)
