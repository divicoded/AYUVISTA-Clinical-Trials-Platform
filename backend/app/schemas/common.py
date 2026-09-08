from datetime import datetime, date
from typing import Optional, List, Any
from pydantic import BaseModel, ConfigDict
from app.models.enums import (
    UserRole,
    StudyStatus,
    LifecycleStage,
    RiskLevel,
    SiteStatus,
    ParticipantStatus,
    ConsentStatus,
    VisitStatus,
    QuerySeverity,
    QueryStatus,
    MonitoringStatus,
    DeviationSeverity,
    DeviationStatus,
    IECDecision,
    AESeverity,
    AEExpectedness,
    AECausality,
    SafetyWorkflowState,
    SignalState,
    TaskPriority,
    TaskStatus,
)

# ----------------- AUTH & USER -----------------
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"

class LoginRequest(BaseModel):
    email: str
    password: str

class SwitchRoleRequest(BaseModel):
    role: UserRole

class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    role: UserRole
    department: Optional[str] = None
    is_active: bool
    last_login: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

# ----------------- STUDIES -----------------
class StudyBase(BaseModel):
    study_code: str
    title: str
    short_title: str
    study_type: str = "Interventional"
    intervention_type: str = "Herbo-mineral Formulation"
    phase: str = "Phase II"
    sponsor: str = "All India Institute of Ayurveda (AIIA)"
    target_enrollment: int = 100
    protocol_version: str = "v1.0"
    therapeutic_area: str = "Ayurvedic Medicine"
    population: str = "Adult patients aged 18-65"
    primary_objective: Optional[str] = None
    secondary_objectives: Optional[str] = None

class StudyCreate(StudyBase):
    start_date: Optional[date] = None
    expected_completion: Optional[date] = None

class StudyUpdate(BaseModel):
    title: Optional[str] = None
    short_title: Optional[str] = None
    target_enrollment: Optional[int] = None
    lifecycle_stage: Optional[LifecycleStage] = None
    status: Optional[StudyStatus] = None
    primary_objective: Optional[str] = None
    secondary_objectives: Optional[str] = None

class StudyLifecycleTransition(BaseModel):
    target_stage: LifecycleStage
    reason: Optional[str] = "Standard clinical trial milestone progression"

class StudyOut(StudyBase):
    id: str
    current_enrollment: int
    number_of_sites: int
    status: StudyStatus
    lifecycle_stage: LifecycleStage
    risk_score: float
    risk_level: RiskLevel
    start_date: Optional[date] = None
    expected_completion: Optional[date] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class HealthMatrixItem(BaseModel):
    study_code: str
    title: str
    short_title: str
    recruitment_status: str  # Healthy, Watch, At Risk, Critical
    iec_status: str
    ctri_status: str
    sites_status: str
    dq_status: str
    safety_status: str
    monitoring_status: str
    timeline_status: str
    overall_status: RiskLevel
    risk_score: float

class RecruitmentCurvePoint(BaseModel):
    month: str
    target: int
    actual: int
    projected: int

# ----------------- SITES -----------------
class SiteOut(BaseModel):
    id: str
    site_code: str
    site_name: str
    institution: str
    city: str
    state: str
    principal_investigator_name: Optional[str] = None
    site_coordinator_name: Optional[str] = None
    activation_date: Optional[date] = None
    status: SiteStatus
    target_enrollment: int
    enrolled_count: int
    screening_count: int
    active_participants_count: int
    query_count: int
    deviations_count: int
    monitoring_status: str
    model_config = ConfigDict(from_attributes=True)

# ----------------- PARTICIPANTS & VISITS -----------------
class ParticipantOut(BaseModel):
    id: str
    synthetic_id: str
    study_id: str
    site_id: str
    screening_date: Optional[date] = None
    enrollment_date: Optional[date] = None
    treatment_arm: str
    randomization_status: str
    participant_status: ParticipantStatus
    consent_status: ConsentStatus
    withdrawal_reason: Optional[str] = None
    age_years: int
    gender: str
    model_config = ConfigDict(from_attributes=True)

class VisitOut(BaseModel):
    id: str
    participant_id: str
    study_id: str
    site_id: str
    visit_name: str
    sequence_order: int
    target_date: date
    actual_date: Optional[date] = None
    window_days_min: int
    window_days_max: int
    status: VisitStatus
    compliance_flag: str
    notes: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class VisitCompleteRequest(BaseModel):
    actual_date: date
    notes: Optional[str] = None

# ----------------- QUERIES -----------------
class QueryOut(BaseModel):
    id: str
    query_code: str
    study_id: str
    site_id: str
    participant_id: Optional[str] = None
    field_name: str
    issue: str
    severity: QuerySeverity
    status: QueryStatus
    created_date: datetime
    due_date: date
    resolution: Optional[str] = None
    resolved_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

class QueryCreate(BaseModel):
    study_id: str
    site_id: str
    participant_id: Optional[str] = None
    field_name: str
    issue: str
    severity: QuerySeverity = QuerySeverity.MEDIUM
    due_date: date

class QueryResolveRequest(BaseModel):
    resolution: str

# ----------------- MONITORING & DEVIATIONS -----------------
class MonitoringVisitOut(BaseModel):
    id: str
    visit_code: str
    study_id: str
    site_id: str
    monitor_name: Optional[str] = None
    visit_type: str
    planned_date: date
    actual_date: Optional[date] = None
    status: MonitoringStatus
    findings: Optional[str] = None
    open_actions_count: int
    due_date: Optional[date] = None
    model_config = ConfigDict(from_attributes=True)

class ProtocolDeviationOut(BaseModel):
    id: str
    deviation_code: str
    study_id: str
    site_id: str
    participant_id: Optional[str] = None
    category: str
    description: str
    severity: DeviationSeverity
    discovery_date: date
    impact: Optional[str] = None
    corrective_action: Optional[str] = None
    preventive_action: Optional[str] = None
    status: DeviationStatus
    due_date: Optional[date] = None
    model_config = ConfigDict(from_attributes=True)

class DeviationCAPARequest(BaseModel):
    corrective_action: str
    preventive_action: str
    status: DeviationStatus = DeviationStatus.RESOLVED

# ----------------- ETHICS & CTRI -----------------
class EthicsSubmissionOut(BaseModel):
    id: str
    submission_code: str
    study_id: str
    submission_date: date
    version: str
    submission_type: str
    review_meeting_date: Optional[date] = None
    decision_date: Optional[date] = None
    decision: IECDecision
    conditions: Optional[str] = None
    validity_expiry_date: Optional[date] = None
    document_ref: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class EthicsDecisionRequest(BaseModel):
    decision: IECDecision
    conditions: Optional[str] = None
    decision_date: Optional[date] = None

class CTRIRegistrationOut(BaseModel):
    id: str
    study_id: str
    ctri_number: str
    registration_status: str
    registration_date: date
    is_prospective: bool
    last_update_date: date
    next_required_update: Optional[date] = None
    responsible_user_name: str
    connector_status: str
    model_config = ConfigDict(from_attributes=True)

class RegulatoryMilestoneOut(BaseModel):
    id: str
    study_id: str
    milestone_name: str
    due_date: date
    completed_date: Optional[date] = None
    owner_name: str
    status: str
    priority: str
    reminder_threshold_days: int
    evidence_document: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

# ----------------- SAFETY & PHARMACOVIGILANCE -----------------
class SafetyCaseOut(BaseModel):
    id: str
    case_number: str
    study_id: str
    site_id: str
    participant_id: str
    is_serious: bool
    adverse_event_term: str
    meddra_preferred_term: Optional[str] = None
    meddra_soc_term: Optional[str] = None
    meddra_code: Optional[str] = None
    severity: AESeverity
    expectedness: AEExpectedness
    causality: AECausality
    onset_date: datetime
    resolution_date: Optional[datetime] = None
    action_taken: str
    reporter_name: str
    reporting_deadline: Optional[datetime] = None
    workflow_state: SafetyWorkflowState
    submission_status: str
    narrative: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class SafetyTransitionRequest(BaseModel):
    target_state: SafetyWorkflowState
    reason: Optional[str] = "Clinical safety assessment workflow advance"
    meddra_preferred_term: Optional[str] = None
    meddra_soc_term: Optional[str] = None
    meddra_code: Optional[str] = None
    causality: Optional[AECausality] = None

class SafetySignalOut(BaseModel):
    id: str
    signal_code: str
    pattern_description: str
    study_id: Optional[str] = None
    observed_frequency: float
    expected_frequency: float
    relative_risk: float
    signal_state: SignalState
    analyst_name: str
    review_date: datetime
    conclusion: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

# ----------------- TASKS & NOTIFICATIONS -----------------
class TaskOut(BaseModel):
    id: str
    title: str
    study_id: Optional[str] = None
    site_id: Optional[str] = None
    owner_name: str
    due_date: date
    priority: TaskPriority
    status: TaskStatus
    source_module: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class TaskStatusUpdate(BaseModel):
    status: TaskStatus

# ----------------- AUDIT TRAIL -----------------
class AuditEventOut(BaseModel):
    id: str
    timestamp: datetime
    actor_id: Optional[str] = None
    actor_name: str
    actor_role: str
    action: str
    entity_type: str
    entity_id: str
    before_state_json: Optional[str] = None
    after_state_json: Optional[str] = None
    reason: Optional[str] = None
    session_id: Optional[str] = None
    ip_address: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

# ----------------- COMMAND CENTER METRICS -----------------
class PortfolioMetrics(BaseModel):
    active_studies: int
    total_participants: int
    recruitment_progress_pct: float
    active_sites: int
    open_queries: int
    ae_cases: int
    sae_cases: int
    overdue_tasks: int
    studies_at_risk: int
