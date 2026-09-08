# AYUVISTA - Database Design & Schema Specification

## 1. Relational Model Overview
The persistence layer is modeled using SQLAlchemy 2.0. It supports SQLite (default for development/portable demonstration) and PostgreSQL (for production/multi-tenant scaling).

All models include standard audit columns: `created_at`, `updated_at`, `created_by`, `updated_by`.

---

## 2. Core Entities and Schemas

### 2.1 Users & Authentication
- **`users`**:
  - `id`: `String(36)` (UUID PK)
  - `email`: `String(255)` (Unique, Indexed)
  - `hashed_password`: `String(255)`
  - `full_name`: `String(255)`
  - `role`: `Enum(UserRole)` (`ADMIN`, `PRINCIPAL_INVESTIGATOR`, `STUDY_COORDINATOR`, `MONITOR`, `ETHICS`, `PHARMACOVIGILANCE`, `LEADERSHIP`, `REGULATOR_READ_ONLY`)
  - `department`: `String(100)` (e.g., Kayachikitsa, Dravyaguna, Shalya Tantra)
  - `is_active`: `Boolean`
  - `last_login`: `DateTime`

### 2.2 Studies & Governance
- **`studies`**:
  - `id`: `String(36)` (UUID PK)
  - `study_code`: `String(50)` (Unique, e.g., `AYU-001`, `AYU-003`)
  - `title`: `Text`
  - `short_title`: `String(255)`
  - `study_type`: `String(50)` (e.g., `Interventional`, `Observational`, `Classical Formulation Validation`)
  - `intervention_type`: `String(100)` (e.g., `Herbo-mineral Formulation`, `Panchakarma`, `Ayurgenomics`)
  - `phase`: `String(50)` (e.g., `Phase II`, `Phase III`, `Pilot`, `Post-Marketing`)
  - `sponsor`: `String(255)` (e.g., `AIIA / Ministry of Ayush`, `CCRAS`)
  - `principal_investigator_id`: `String(36)` (FK -> `users.id`)
  - `coordinator_id`: `String(36)` (FK -> `users.id`)
  - `start_date`: `Date`
  - `expected_completion`: `Date`
  - `target_enrollment`: `Integer`
  - `current_enrollment`: `Integer` (Calculated/Cached)
  - `status`: `Enum(StudyStatus)` (`DRAFT`, `SUBMITTED`, `ACTIVE`, `SUSPENDED`, `COMPLETED`, `LOCKED`, `CLOSED`)
  - `lifecycle_stage`: `Enum(LifecycleStage)` (`PROTOCOL`, `IEC_SUBMISSION`, `IEC_APPROVAL`, `CTRI_REGISTRATION`, `SITE_ACTIVATION`, `RECRUITMENT`, `TREATMENT`, `FOLLOW_UP`, `DATABASE_LOCK`, `CLOSE_OUT`)
  - `protocol_version`: `String(20)`
  - `therapeutic_area`: `String(100)` (e.g., `Metabolic Disorders`, `Immunology`, `Neurology`)
  - `primary_objective`: `Text`
  - `secondary_objectives`: `Text`
  - `risk_score`: `Float` (0-100, computed by Operational Risk Engine)
  - `risk_level`: `Enum(RiskLevel)` (`HEALTHY`, `WATCH`, `AT_RISK`, `CRITICAL`)

### 2.3 Sites & Investigators
- **`sites`**:
  - `id`: `String(36)` (UUID PK)
  - `site_code`: `String(50)` (Unique, e.g., `SITE-DEL-01`, `SITE-BLR-02`)
  - `site_name`: `String(255)`
  - `institution`: `String(255)`
  - `city`: `String(100)`
  - `state`: `String(100)`
  - `principal_investigator_id`: `String(36)` (FK -> `users.id`)
  - `site_coordinator_id`: `String(36)` (FK -> `users.id`)
  - `status`: `Enum(SiteStatus)` (`PENDING`, `INITIATED`, `ACTIVE`, `SUSPENDED`, `CLOSED`)
  - `activation_date`: `Date`
  - `target_enrollment`: `Integer`
  - `monitoring_status`: `String(50)` (`COMPLIANT`, `PENDING_VISIT`, `OVERDUE_ACTION`)

- **`study_sites`**:
  - `id`: `String(36)` (UUID PK)
  - `study_id`: `String(36)` (FK -> `studies.id`)
  - `site_id`: `String(36)` (FK -> `sites.id`)
  - `site_target_enrollment`: `Integer`
  - `status`: `String(50)`

### 2.4 Participants & Consent (Synthetic DPDP Privacy)
- **`participants`**:
  - `id`: `String(36)` (UUID PK)
  - `synthetic_id`: `String(50)` (Unique, Indexed, e.g., `SYN-P00001`)
  - `study_id`: `String(36)` (FK -> `studies.id`)
  - `site_id`: `String(36)` (FK -> `sites.id`)
  - `screening_date`: `Date`
  - `enrollment_date`: `Date`
  - `treatment_arm`: `String(100)` (e.g., `Ashwagandha Granules + Standard Care`, `Placebo`)
  - `randomization_status`: `String(50)` (`PENDING`, `RANDOMIZED`, `STRATIFIED`)
  - `participant_status`: `Enum(ParticipantStatus)` (`SCREENED`, `ELIGIBLE`, `ENROLLED`, `ACTIVE`, `WITHDRAWN`, `COMPLETED`)
  - `withdrawal_reason`: `String(255)`
  - `consent_status`: `Enum(ConsentStatus)` (`PENDING`, `OBTAINED`, `WITHDRAWN`, `SUPERSEDED`, `INVALID`)

- **`consents`**:
  - `id`: `String(36)` (UUID PK)
  - `participant_id`: `String(36)` (FK -> `participants.id`)
  - `study_id`: `String(36)` (FK -> `studies.id`)
  - `consent_version`: `String(20)`
  - `consent_type`: `String(50)` (`MAIN_ICF`, `GENOMIC_ADDENDUM`, `PEDIATRIC_ASSENT`)
  - `date_obtained`: `Date`
  - `status`: `Enum(ConsentStatus)`
  - `method`: `String(50)` (`WRITTEN_IN_PERSON`, `DIGITAL_VERIFIED`, `AUDIO_VISUAL`)
  - `witness_name`: `String(100)`
  - `document_ref`: `String(255)`

### 2.5 Visits & Data Queries
- **`visits`**:
  - `id`: `String(36)` (UUID PK)
  - `participant_id`: `String(36)` (FK -> `participants.id`)
  - `study_id`: `String(36)` (FK -> `studies.id`)
  - `visit_name`: `Enum(VisitName)` (`SCREENING`, `BASELINE`, `V1_WEEK2`, `V2_WEEK4`, `V3_WEEK8`, `V4_WEEK12`, `END_OF_TREATMENT`, `FOLLOW_UP`, `FINAL`)
  - `target_date`: `Date`
  - `actual_date`: `Date`
  - `window_days_min`: `Integer`
  - `window_days_max`: `Integer`
  - `status`: `Enum(VisitStatus)` (`SCHEDULED`, `COMPLETED`, `MISSED`, `RESCHEDULED`, `OUTSIDE_WINDOW`)
  - `notes`: `Text`

- **`data_queries`**:
  - `id`: `String(36)` (UUID PK)
  - `query_code`: `String(50)` (Unique, e.g., `QRY-2026-0042`)
  - `study_id`: `String(36)` (FK -> `studies.id`)
  - `site_id`: `String(36)` (FK -> `sites.id`)
  - `participant_id`: `String(36)` (FK -> `participants.id`, Optional)
  - `visit_id`: `String(36)` (FK -> `visits.id`, Optional)
  - `field_name`: `String(100)`
  - `issue_description`: `Text`
  - `severity`: `Enum(QuerySeverity)` (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`)
  - `status`: `Enum(QueryStatus)` (`OPEN`, `IN_REVIEW`, `ANSWERED`, `CLOSED`, `REOPENED`)
  - `assigned_to`: `String(36)` (FK -> `users.id`)
  - `created_date`: `DateTime`
  - `due_date`: `Date`
  - `resolution_text`: `Text`
  - `closed_date`: `DateTime`

### 2.6 Monitoring & Protocol Deviations
- **`monitoring_visits`**:
  - `id`: `String(36)` (UUID PK)
  - `study_id`: `String(36)` (FK -> `studies.id`)
  - `site_id`: `String(36)` (FK -> `sites.id`)
  - `monitor_id`: `String(36)` (FK -> `users.id`)
  - `visit_type`: `String(50)` (`SITE_INITIATION`, `INTERIM_MONITORING`, `FOR_CAUSE`, `CLOSE_OUT`)
  - `planned_date`: `Date`
  - `actual_date`: `Date`
  - `status`: `Enum(MonitoringStatus)` (`PLANNED`, `SCHEDULED`, `COMPLETED`, `OVERDUE`)
  - `findings_summary`: `Text`
  - `open_actions_count`: `Integer`
  - `report_file_id`: `String(36)`

- **`protocol_deviations`**:
  - `id`: `String(36)` (UUID PK)
  - `deviation_code`: `String(50)` (Unique, e.g., `DEV-2026-018`)
  - `study_id`: `String(36)` (FK -> `studies.id`)
  - `site_id`: `String(36)` (FK -> `sites.id`)
  - `participant_id`: `String(36)` (FK -> `participants.id`, Optional)
  - `category`: `String(100)` (`INFORMED_CONSENT`, `INCLUSION_EXCLUSION`, `STUDY_PROCEDURE`, `INVESTIGATIONAL_PRODUCT`, `VISIT_SCHEDULE`)
  - `description`: `Text`
  - `severity`: `Enum(DeviationSeverity)` (`MINOR`, `MAJOR`, `CRITICAL`)
  - `discovery_date`: `Date`
  - `impact_assessment`: `Text`
  - `capa_plan`: `Text`
  - `status`: `Enum(DeviationStatus)` (`OPEN`, `UNDER_REVIEW`, `CAPA_REQUIRED`, `RESOLVED`, `CLOSED`)
  - `owner_id`: `String(36)` (FK -> `users.id`)
  - `due_date`: `Date`

### 2.7 Ethics & CTRI Registrations
- **`ethics_submissions`**:
  - `id`: `String(36)` (UUID PK)
  - `study_id`: `String(36)` (FK -> `studies.id`)
  - `submission_code`: `String(50)` (e.g., `IEC-AIIA-2026-012`)
  - `submission_date`: `Date`
  - `version`: `String(20)`
  - `submission_type`: `String(50)` (`INITIAL`, `AMENDMENT`, `ANNUAL_CONTINUING_REVIEW`, `SAFETY_SAE_REPORT`)
  - `review_meeting_date`: `Date`
  - `decision_date`: `Date`
  - `decision`: `Enum(IECDecision)` (`DRAFT`, `SUBMITTED`, `UNDER_REVIEW`, `APPROVED`, `APPROVED_WITH_CONDITIONS`, `RETURNED`, `REJECTED`, `EXPIRED`)
  - `conditions`: `Text`
  - `validity_expiry_date`: `Date`

- **`ctri_registrations`**:
  - `id`: `String(36)` (UUID PK)
  - `study_id`: `String(36)` (Unique FK -> `studies.id`)
  - `ctri_number`: `String(50)` (e.g., `CTRI/2025/11/075432`)
  - `registration_status`: `String(50)` (`REGISTERED`, `PROVISIONALLY_APPROVED`, `PENDING_QUERY`, `SUBMITTED`)
  - `registration_date`: `Date`
  - `is_prospective`: `Boolean`
  - `last_update_date`: `Date`
  - `next_required_update`: `Date`
  - `responsible_officer_id`: `String(36)` (FK -> `users.id`)
  - `submission_payload_json`: `Text`

### 2.8 Regulatory Milestones
- **`regulatory_milestones`**:
  - `id`: `String(36)` (UUID PK)
  - `study_id`: `String(36)` (FK -> `studies.id`)
  - `milestone_name`: `String(100)` (e.g., `IEC Annual Renewal`, `CTRI 6-Monthly Progress Update`, `DSMB Safety Review`)
  - `due_date`: `Date`
  - `completed_date`: `Date`
  - `owner_id`: `String(36)` (FK -> `users.id`)
  - `status`: `Enum(MilestoneStatus)` (`UPCOMING`, `DUE_SOON`, `COMPLETED`, `OVERDUE`)
  - `priority`: `String(20)` (`HIGH`, `MEDIUM`, `LOW`)
  - `reminder_threshold_days`: `Integer` (Default 30)

### 2.9 Safety & Pharmacovigilance (AE / SAE / Signals)
- **`safety_cases`**:
  - `id`: `String(36)` (UUID PK)
  - `case_number`: `String(50)` (Unique, e.g., `PV-2026-0031`)
  - `study_id`: `String(36)` (FK -> `studies.id`)
  - `site_id`: `String(36)` (FK -> `sites.id`)
  - `participant_id`: `String(36)` (FK -> `participants.id`)
  - `is_serious`: `Boolean` (True = SAE, False = AE)
  - `adverse_event_term`: `String(255)`
  - `meddra_preferred_term`: `String(255)` (Synthetic/Demo MedDRA PT)
  - `meddra_soc_term`: `String(255)` (System Organ Class)
  - `severity`: `Enum(AESeverity)` (`MILD`, `MODERATE`, `SEVERE`, `LIFE_THREATENING`, `DEATH`)
  - `expectedness`: `Enum(AEExpectedness)` (`EXPECTED`, `UNEXPECTED`)
  - `causality`: `Enum(AECausality)` (`CERTAIN`, `PROBABLE`, `POSSIBLE`, `UNLIKELY`, `CONDITIONAL`, `NOT_ASSESSABLE`)
  - `onset_date`: `DateTime`
  - `resolution_date`: `DateTime`
  - `action_taken`: `String(100)` (`DOSE_NOT_CHANGED`, `DOSE_REDUCED`, `DRUG_INTERRUPTED`, `DRUG_WITHDRAWN`)
  - `reporter_name`: `String(100)`
  - `reporting_deadline`: `DateTime` (Strict countdown clock for SAEs: e.g., 24h/7d)
  - `workflow_state`: `Enum(SafetyWorkflowState)` (`REPORTED`, `VALIDATED`, `MEDICAL_REVIEW`, `CODING`, `CAUSALITY_REVIEW`, `REGULATORY_ASSESSMENT`, `SUBMITTED`, `CLOSED`)

- **`safety_signals`**:
  - `id`: `String(36)` (UUID PK)
  - `signal_code`: `String(50)` (e.g., `SIG-2026-004`)
  - `pattern_description`: `Text` (e.g., `Elevated ALT/AST cluster in Formulation X arm`)
  - `observed_frequency`: `Float`
  - `expected_frequency`: `Float`
  - `relative_risk`: `Float`
  - `signal_state`: `Enum(SignalState)` (`DETECTED`, `UNDER_REVIEW`, `MONITORING`, `CLOSED`)
  - `analyst_id`: `String(36)` (FK -> `users.id`)
  - `review_date`: `Date`
  - `conclusion`: `Text`

### 2.10 Audit Trail (ALCOA+ Append-Only)
- **`audit_events`**:
  - `id`: `String(36)` (UUID PK)
  - `timestamp`: `DateTime` (UTC, immutable)
  - `actor_id`: `String(36)` (FK -> `users.id`)
  - `actor_role`: `String(50)`
  - `action`: `String(50)` (`CREATE`, `UPDATE`, `TRANSITION`, `DELETE`, `EXPORT`, `LOGIN`)
  - `entity_type`: `String(50)` (e.g., `Study`, `Participant`, `SafetyCase`, `EthicsSubmission`)
  - `entity_id`: `String(50)`
  - `before_state_json`: `Text` (JSON string or NULL)
  - `after_state_json`: `Text` (JSON string)
  - `reason_for_change`: `Text`
  - `ip_address`: `String(50)`

