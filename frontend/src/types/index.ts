export type UserRole =
  | 'ADMIN'
  | 'PRINCIPAL_INVESTIGATOR'
  | 'STUDY_COORDINATOR'
  | 'MONITOR'
  | 'ETHICS'
  | 'PHARMACOVIGILANCE'
  | 'LEADERSHIP'
  | 'REGULATOR_READ_ONLY';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  department?: string;
  is_active: boolean;
  last_login?: string;
}

export type RiskLevel = 'HEALTHY' | 'WATCH' | 'AT_RISK' | 'CRITICAL';
export type StudyStatus = 'DRAFT' | 'SUBMITTED' | 'ACTIVE' | 'SUSPENDED' | 'COMPLETED' | 'LOCKED' | 'CLOSED';
export type LifecycleStage =
  | 'PROTOCOL'
  | 'IEC_SUBMISSION'
  | 'IEC_APPROVAL'
  | 'CTRI_REGISTRATION'
  | 'SITE_ACTIVATION'
  | 'RECRUITMENT'
  | 'TREATMENT'
  | 'FOLLOW_UP'
  | 'DATABASE_LOCK'
  | 'CLOSE_OUT';

export interface Study {
  id: string;
  study_code: string;
  title: string;
  short_title: string;
  study_type: string;
  intervention_type: string;
  phase: string;
  sponsor: string;
  target_enrollment: number;
  current_enrollment: number;
  number_of_sites: number;
  status: StudyStatus;
  lifecycle_stage: LifecycleStage;
  risk_score: number;
  risk_level: RiskLevel;
  protocol_version: string;
  therapeutic_area: string;
  population: string;
  primary_objective?: string;
  secondary_objectives?: string;
  start_date?: string;
  expected_completion?: string;
  created_at: string;
}

export interface HealthMatrixItem {
  study_code: string;
  title: string;
  short_title: string;
  recruitment_status: string;
  iec_status: string;
  ctri_status: string;
  sites_status: string;
  dq_status: string;
  safety_status: string;
  monitoring_status: string;
  timeline_status: string;
  overall_status: RiskLevel;
  risk_score: number;
}

export interface Site {
  id: string;
  site_code: string;
  site_name: string;
  institution: string;
  city: string;
  state: string;
  principal_investigator_name?: string;
  site_coordinator_name?: string;
  activation_date?: string;
  status: 'PENDING' | 'INITIATED' | 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
  target_enrollment: number;
  enrolled_count: number;
  screening_count: number;
  active_participants_count: number;
  query_count: number;
  deviations_count: number;
  monitoring_status: string;
}

export interface Participant {
  id: string;
  synthetic_id: string;
  study_id: string;
  site_id: string;
  screening_date?: string;
  enrollment_date?: string;
  treatment_arm: string;
  randomization_status: string;
  participant_status: 'SCREENED' | 'ELIGIBLE' | 'ENROLLED' | 'ACTIVE' | 'WITHDRAWN' | 'COMPLETED';
  consent_status: 'PENDING' | 'OBTAINED' | 'WITHDRAWN' | 'SUPERSEDED' | 'INVALID';
  age_years: number;
  gender: string;
}

export interface Visit {
  id: string;
  participant_id: string;
  study_id: string;
  site_id: string;
  visit_name: string;
  sequence_order: number;
  target_date: string;
  actual_date?: string;
  window_days_min: number;
  window_days_max: number;
  status: 'SCHEDULED' | 'COMPLETED' | 'MISSED' | 'RESCHEDULED' | 'OUTSIDE_WINDOW';
  compliance_flag: string;
  notes?: string;
}

export interface DataQuery {
  id: string;
  query_code: string;
  study_id: string;
  site_id: string;
  participant_id?: string;
  field_name: string;
  issue: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_REVIEW' | 'ANSWERED' | 'CLOSED' | 'REOPENED';
  created_date: string;
  due_date: string;
  resolution?: string;
  resolved_at?: string;
}

export interface ProtocolDeviation {
  id: string;
  deviation_code: string;
  study_id: string;
  site_id: string;
  participant_id?: string;
  category: string;
  description: string;
  severity: 'MINOR' | 'MAJOR' | 'CRITICAL';
  discovery_date: string;
  impact?: string;
  corrective_action?: string;
  preventive_action?: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'CAPA_REQUIRED' | 'RESOLVED' | 'CLOSED';
  due_date?: string;
}

export interface MonitoringVisit {
  id: string;
  visit_code: string;
  study_id: string;
  site_id: string;
  monitor_name?: string;
  visit_type: string;
  planned_date: string;
  actual_date?: string;
  status: 'PLANNED' | 'SCHEDULED' | 'COMPLETED' | 'OVERDUE';
  findings?: string;
  open_actions_count: number;
  due_date?: string;
}

export type SafetyWorkflowState =
  | 'REPORTED'
  | 'VALIDATED'
  | 'MEDICAL_REVIEW'
  | 'CODING'
  | 'CAUSALITY_REVIEW'
  | 'REGULATORY_ASSESSMENT'
  | 'SUBMITTED'
  | 'CLOSED';

export interface SafetyCase {
  id: string;
  case_number: string;
  study_id: string;
  site_id: string;
  participant_id: string;
  is_serious: boolean;
  adverse_event_term: string;
  meddra_preferred_term?: string;
  meddra_soc_term?: string;
  meddra_code?: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING' | 'DEATH';
  expectedness: 'EXPECTED' | 'UNEXPECTED';
  causality: 'CERTAIN' | 'PROBABLE' | 'POSSIBLE' | 'UNLIKELY' | 'CONDITIONAL' | 'NOT_ASSESSABLE';
  onset_date: string;
  resolution_date?: string;
  action_taken: string;
  reporter_name: string;
  reporting_deadline?: string;
  workflow_state: SafetyWorkflowState;
  submission_status: string;
  narrative?: string;
  created_at: string;
}

export interface SafetySignal {
  id: string;
  signal_code: string;
  pattern_description: string;
  study_id?: string;
  observed_frequency: number;
  expected_frequency: number;
  relative_risk: number;
  signal_state: 'DETECTED' | 'UNDER_REVIEW' | 'MONITORING' | 'CLOSED';
  analyst_name: string;
  review_date: string;
  conclusion?: string;
}

export interface CTRIRegistration {
  id: string;
  study_id: string;
  ctri_number: string;
  registration_status: string;
  registration_date: string;
  is_prospective: boolean;
  last_update_date: string;
  next_required_update?: string;
  responsible_user_name: string;
  connector_status: string;
}

export interface EthicsSubmission {
  id: string;
  submission_code: string;
  study_id: string;
  submission_date: string;
  version: string;
  submission_type: string;
  review_meeting_date?: string;
  decision_date?: string;
  decision: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'APPROVED_WITH_CONDITIONS' | 'RETURNED' | 'REJECTED' | 'EXPIRED';
  conditions?: string;
  validity_expiry_date?: string;
  document_ref?: string;
}

export interface RegulatoryMilestone {
  id: string;
  study_id: string;
  milestone_name: string;
  due_date: string;
  completed_date?: string;
  owner_name: string;
  status: string;
  priority: string;
  reminder_threshold_days: number;
  evidence_document?: string;
}

export interface OperationalTask {
  id: string;
  title: string;
  study_id?: string;
  site_id?: string;
  owner_name: string;
  due_date: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED';
  source_module: string;
  created_at: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor_id?: string;
  actor_name: string;
  actor_role: string;
  action: string;
  entity_type: string;
  entity_id: string;
  before_state_json?: string;
  after_state_json?: string;
  reason?: string;
  session_id?: string;
  ip_address?: string;
}

export interface PortfolioMetrics {
  active_studies: number;
  total_participants: number;
  recruitment_progress_pct: number;
  active_sites: number;
  open_queries: number;
  ae_cases: number;
  sae_cases: number;
  overdue_tasks: number;
  studies_at_risk: number;
}
