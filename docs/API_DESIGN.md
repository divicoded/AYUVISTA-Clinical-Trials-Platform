# AYUVISTA — RESTful API Design Specification

## 1. API Architecture Conventions
- Base Path: `/api/v1`
- Content Negotiation: `application/json` (Standard UTF-8)
- Authentication: Bearer JWT Token (`Authorization: Bearer <token>`)
- Standard Error Responses:
  ```json
  {
    "error": {
      "code": "ENTITY_NOT_FOUND",
      "message": "Study with code AYU-003 was not found.",
      "details": []
    }
  }
  ```
- Filtering & Pagination: `?page=1&limit=25&sort_by=created_at&order=desc&search=...`

---

## 2. API Endpoints by Domain Module

### 2.1 Authentication & Profile (`/api/v1/auth`)
- `POST /auth/login`: Authenticate email & password, returns JWT token and user profile.
- `GET /auth/me`: Current session profile and permission claims.
- `POST /auth/logout`: Invalidates session context.

### 2.2 Studies & Lifecycle Governance (`/api/v1/studies`)
- `GET /studies`: List clinical trials with summary metrics, filterable by therapeutic area, status, risk level.
- `POST /studies`: Register new study (PI / Admin).
- `GET /studies/{id}`: Detailed study dossier, objectives, protocol version, risk breakdown.
- `PUT /studies/{id}`: Update study parameters.
- `POST /studies/{id}/transition-lifecycle`: Advance study stage (e.g., `IEC_APPROVAL` -> `SITE_ACTIVATION`).
- `GET /studies/{id}/health-matrix`: Multidimensional health status (Recruitment, IEC, CTRI, Sites, DQ, Safety, Monitoring).
- `GET /studies/{id}/recruitment-curve`: S-curve coordinates (Planned vs Enrolled vs Projected Completion).

### 2.3 Site Network (`/api/v1/sites`)
- `GET /sites`: List institutional sites with performance scorecards.
- `POST /sites`: Provision institutional site.
- `GET /sites/{id}`: Detailed site analytics, active studies, query backlogs, monitoring status.
- `PUT /sites/{id}`: Update site contact or operational status.

### 2.4 Participants & Visits (`/api/v1/participants`, `/api/v1/visits`)
- `GET /participants`: List synthetic participant registry (filters by study, site, status).
- `POST /participants`: Enroll participant with synthetic ID generation (`SYN-Pxxxxx`).
- `GET /participants/{id}`: Complete participant dossier: visits, consent ledger, safety events, data flags.
- `GET /participants/{id}/timeline`: Chronological journey of visits and milestones.
- `GET /visits`: Query visit schedule (Scheduled, Completed, Missed, Outside Window).
- `PUT /visits/{id}/complete`: Record visit execution and compliance status.

### 2.5 Data Quality & Queries (`/api/v1/queries`)
- `GET /queries`: Query management dashboard with filters by severity, status, site, study.
- `POST /queries`: Issue new data query.
- `PUT /queries/{id}/answer`: Coordinator submits explanation/resolution.
- `PUT /queries/{id}/close`: Monitor verifies and closes query.
- `GET /queries/summary`: Quality index metrics (completeness, timeliness, query turnaround).

### 2.6 Monitoring & Deviations (`/api/v1/monitoring`, `/api/v1/deviations`)
- `GET /monitoring`: List monitoring visits, planned dates, findings, overdue flags.
- `POST /monitoring`: Schedule monitoring visit.
- `PUT /monitoring/{id}/complete`: Submit findings and corrective action list.
- `GET /deviations`: Protocol deviations repository with severity tagging (Minor, Major, Critical).
- `POST /deviations`: Log protocol deviation.
- `PUT /deviations/{id}/capa`: Assign and record CAPA plan.

### 2.7 Ethics & CTRI Tracking (`/api/v1/ethics`, `/api/v1/ctri`)
- `GET /ethics`: Submissions ledger with IEC meeting schedules and decision timelines.
- `POST /ethics`: Submit new protocol, amendment, or continuing review.
- `PUT /ethics/{id}/decision`: Record IEC approval/conditions.
- `GET /ctri`: CTRI registry status dashboard.
- `GET /ctri/{study_id}`: CTRI profile, registration number, prospective flag, update clock.
- `POST /ctri/{study_id}/sync-sandbox`: Trigger demo submission connector validation.

### 2.8 Safety & Pharmacovigilance (`/api/v1/safety`)
- `GET /safety/cases`: AE/SAE case listing with severity, causality, and reporting clock status.
- `POST /safety/cases`: Log adverse event / SAE.
- `GET /safety/cases/{id}`: Detailed safety case dossier.
- `POST /safety/cases/{id}/transition`: Advance workflow (`REPORTED` -> `VALIDATED` -> `MEDICAL_REVIEW` -> `CODING` -> `CAUSALITY_REVIEW` -> `REGULATORY_ASSESSMENT` -> `SUBMITTED` -> `CLOSED`).
- `GET /safety/signals`: Detected safety signals with observed vs expected incidence rates.
- `GET /safety/coding/lookup`: Terminology lookup via Coding Dictionary Adapter.

### 2.9 Interoperability Sandboxes (`/api/v1/interop`)
- `GET /interop/status`: Health and last-sync status of all sandbox connectors.
- `GET /interop/fhir/{resource_type}/{id}`: Generate HL7 FHIR R4 JSON representation.
- `POST /interop/edc/sync`: Execute sandbox EDC synchronization batch.
- `POST /interop/his/sync`: Execute sandbox Hospital Information System sync.
- `POST /interop/abdm/milestone-demo`: Simulate ABDM M1/M2/M3 transactions.

### 2.10 CDISC & Data Exports (`/api/v1/exports`)
- `GET /exports/cdisc/{study_id}/sdtm`: Generate SDTM-oriented domain bundles (DM, AE, DS, SV, LB).
- `GET /exports/cdisc/{study_id}/adam`: Generate ADaM-oriented analysis datasets.
- `GET /exports/cdisc/{study_id}/define-xml`: Generate Define-XML metadata specification.
- `GET /exports/reports/{report_type}`: CSV / printable report generation.

### 2.11 Audit & Data Governance (`/api/v1/audit`)
- `GET /audit`: Immutable audit log explorer with actor, before/after diffs, and filterable timestamps.
- `GET /audit/entity/{entity_type}/{entity_id}`: Complete lifecycle history of an entity.

