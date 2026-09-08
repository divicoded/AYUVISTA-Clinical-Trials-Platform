from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.task import OperationalTask
from app.models.enums import TaskStatus
from app.schemas.common import TaskOut, TaskStatusUpdate

router = APIRouter(prefix="/tasks", tags=["Tasks & Notifications"])

@router.get("", response_model=List[TaskOut])
def list_tasks(
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(OperationalTask)
    if status:
        query = query.filter(OperationalTask.status == status)
    return query.order_by(OperationalTask.due_date.asc()).all()

@router.put("/{id}/status", response_model=TaskOut)
def update_task_status(
    id: str,
    req: TaskStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(OperationalTask).filter(OperationalTask.id == id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task.status = req.status
    if req.status == TaskStatus.COMPLETED:
        task.completed_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(task)
    return task

@router.get("/notifications")
def get_notifications(current_user: User = Depends(get_current_user)):
    return [
        {
            "id": "notif-1",
            "type": "CRITICAL",
            "title": "Expedited SAE Review Pending (PV-2026-0031)",
            "message": "Expedited 24h institutional reporting clock has 10 hours remaining.",
            "timestamp": "2026-09-06T10:00:00Z",
            "link": "/safety"
        },
        {
            "id": "notif-2",
            "type": "WARNING",
            "title": "Overdue Monitoring Visit at Bengaluru Site",
            "message": "Routine monitoring visit MON-2026-001 overdue by 14 days.",
            "timestamp": "2026-09-06T09:30:00Z",
            "link": "/monitoring"
        },
        {
            "id": "notif-3",
            "type": "WARNING",
            "title": "CTRI 6-Monthly Progress Filing Approaching",
            "message": "Study AYU-003 progress update due in 9 days.",
            "timestamp": "2026-09-06T08:15:00Z",
            "link": "/ethics"
        },
        {
            "id": "notif-4",
            "type": "INFO",
            "title": "14 Open Data Queries at SITE-BLR-02",
            "message": "2 queries marked as Critical requiring PI sign-off.",
            "timestamp": "2026-09-06T07:45:00Z",
            "link": "/data-quality"
        }
    ]
