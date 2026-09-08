from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.study import Study
from app.models.site import Site
from app.models.participant import Participant
from app.models.query import DataQuery
from app.models.safety import SafetyCase
from app.models.task import OperationalTask
from app.models.enums import QueryStatus, TaskStatus, RiskLevel
from app.schemas.common import PortfolioMetrics, HealthMatrixItem

router = APIRouter(prefix="/command-center", tags=["Command Center"])

@router.get("/metrics", response_model=PortfolioMetrics)
def get_command_center_metrics(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    total_studies = db.query(Study).count()
    total_participants = db.query(Participant).count()
    active_sites = db.query(Site).count()
    open_queries = db.query(DataQuery).filter(DataQuery.status.in_([QueryStatus.OPEN, QueryStatus.IN_REVIEW])).count()
    ae_cases = db.query(SafetyCase).filter(SafetyCase.is_serious == False).count()
    sae_cases = db.query(SafetyCase).filter(SafetyCase.is_serious == True).count()
    overdue_tasks = db.query(OperationalTask).filter(OperationalTask.status != TaskStatus.COMPLETED).count()
    studies_at_risk = db.query(Study).filter(Study.risk_level.in_([RiskLevel.AT_RISK, RiskLevel.CRITICAL])).count()

    total_target = sum([s.target_enrollment for s in db.query(Study).all()]) or 1
    recruitment_progress_pct = round((total_participants / total_target) * 100.0, 1)

    return {
        "active_studies": total_studies,
        "total_participants": total_participants,
        "recruitment_progress_pct": recruitment_progress_pct,
        "active_sites": active_sites,
        "open_queries": open_queries,
        "ae_cases": ae_cases,
        "sae_cases": sae_cases,
        "overdue_tasks": overdue_tasks,
        "studies_at_risk": studies_at_risk,
    }

@router.get("/health-matrix", response_model=List[HealthMatrixItem])
def get_study_health_matrix(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    studies = db.query(Study).order_by(Study.risk_score.desc()).all()
    matrix = []
    for s in studies:
        # Generate health indicators
        if s.study_code == "AYU-003":
            matrix.append(HealthMatrixItem(
                study_code=s.study_code,
                title=s.title,
                short_title=s.short_title,
                recruitment_status="At Risk",
                iec_status="Healthy",
                ctri_status="Watch",
                sites_status="Critical",
                dq_status="Critical",
                safety_status="At Risk",
                monitoring_status="Critical",
                timeline_status="Watch",
                overall_status=s.risk_level,
                risk_score=s.risk_score
            ))
        else:
            matrix.append(HealthMatrixItem(
                study_code=s.study_code,
                title=s.title,
                short_title=s.short_title,
                recruitment_status="Healthy" if s.risk_score < 30 else "Watch",
                iec_status="Healthy",
                ctri_status="Healthy",
                sites_status="Healthy",
                dq_status="Healthy" if s.risk_score < 40 else "Watch",
                safety_status="Healthy",
                monitoring_status="Healthy",
                timeline_status="Healthy",
                overall_status=s.risk_level,
                risk_score=s.risk_score
            ))
    return matrix

@router.get("/recruitment-trend")
def get_overall_recruitment_trend(current_user: User = Depends(get_current_user)):
    return [
        {"month": "Apr 2025", "planned": 200, "actual": 210, "lag": 0},
        {"month": "May 2025", "planned": 450, "actual": 470, "lag": 0},
        {"month": "Jun 2025", "planned": 700, "actual": 690, "lag": 10},
        {"month": "Jul 2025", "planned": 950, "actual": 910, "lag": 40},
        {"month": "Aug 2025", "planned": 1200, "actual": 1130, "lag": 70},
        {"month": "Sep 2025", "planned": 1450, "actual": 1340, "lag": 110},
        {"month": "Oct 2025 (Proj)", "planned": 1700, "actual": 1520, "lag": 180},
    ]
