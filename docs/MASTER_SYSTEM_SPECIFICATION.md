# AYUVISTA — COMPLETE MASTER DOCUMENTATION & SYSTEM SPECIFICATION

> **System Designation**: AYUVISTA Clinical Research Operations & Pharmacovigilance Platform  
> **Institutional Anchor**: All India Institute of Ayurveda (AIIA), Ministry of Ayush, Government of India  
> **Applicable Mandates**: GCP-ASU • ICMR Ethical Guidelines • NDCT Rules 2019 • CTRI • CDISC (SDTM/ADaM) • HL7 FHIR R4 • DPDP Act 2023  
> **Version**: 1.0.0 (Production-Ready Prototype)  
> **Date**: September 2026

---

## 1. System Overview & Problem Formulation

The **All India Institute of Ayurveda (AIIA)** in New Delhi serves as the apex body for postgraduate education and clinical research in Ayurveda. Critically, AIIA hosts the **National Pharmacovigilance Coordination Centre (NPvCC)** for Ayurveda, Siddha, Unani and Homoeopathy (ASU&H) drugs. 

### Operational Challenges in Current Clinical Research
1. **Siloed Trial Surveillance**: Across 25+ multicentric interventional trials and 40 national site networks, progress is logged in disconnected local spreadsheets, leading to blind spots in enrollment velocity and protocol deviations.
2. **Statutory Safety Non-Compliance**: Under the *New Drugs and Clinical Trials Rules, 2019* and ICMR Ethical Guidelines, Serious Adverse Events (SAEs) carry a strict **24-hour expedited reporting deadline** to the Licensing Authority (CDSCO) and Institutional Ethics Committee (IEC). Without automated countdown timers, reporting delays incur legal liability.
3. **Absence of Standardized Tabulation (CDISC)**: Ayurvedic research has struggled with international peer review and US FDA/EMA acceptance because clinical data is rarely packaged in standard CDISC SDTM (Study Data Tabulation Model) or ADaM (Analysis Data Model) formats.
4. **Data Integrity & Privacy Deficits**: Spreadsheets allow unrecorded edits, violating the international **ALCOA+** principles (Attributable, Legible, Contemporaneous, Original, Accurate) and exposing sensitive personal health data contrary to the **Digital Personal Data Protection (DPDP) Act 2023**.

### The AYUVISTA Solution
AYUVISTA is a cloud-based, multi-tenant, modular CTMS and safety platform that centralizes protocol lifecycle governance, real-time multi-center recruitment analytics, expedited pharmacovigilance surveillance, automated CDISC and HL7 FHIR generation, and an immutable cryptographic audit ledger.

---

## 2. Technical Stack & Engineering Specifications

### Frontend Architecture
* **Framework**: React 18.2 with TypeScript
* **Build System**: Vite 5 (ultra-fast Hot Module Replacement & production chunking)
* **Styling System**: Tailwind CSS 3 configured with custom **Material 3 Expressive** design tokens, organic radii (`rounded-[2rem]`), and soft pastel elevation cards.
* **Component Library**: Lucide React for consistent clinical iconography.
* **Data Visualization**: Recharts 2.x (Recruitment S-Curve Area Charts, Severity Bar Charts, Scatter Bubble Charts).
* **State Management**: React Context API (`AuthContext` with JWT persistence and live role switching).
* **HTTP Client**: Typed wrapper over native `fetch` supporting JSON REST, CSV blobs, and Define-XML streaming.

### Backend Architecture
* **Language & Runtime**: Python 3.12
* **Framework**: FastAPI (asynchronous, high-concurrency ASGI framework)
* **ORM & Database**: SQLAlchemy 2.0 with relational SQLite engine (seamlessly switchable to PostgreSQL via environment variable `DATABASE_URL`).
* **Data Validation**: Pydantic v2 schemas with `ConfigDict(from_attributes=True)`.
* **Security & Auth**: OAuth2 Password Bearer flow with JSON Web Tokens (JWT) signed via `python-jose` and passwords hashed using native `bcrypt` (work factor 12).
* **Testing Suite**: `pytest` and `httpx` / Starlette `TestClient`.

---

## 3. Database Schema & Entity Relationships

The relational model consists of 12 normalized clinical domain tables and 1 append-only forensic audit table:

```
[User] (1) --------< (M) [AuditEvent]
  |
  +-- (1) --------< (M) [Study] (as Principal Investigator)
                      |
                      +-- (1) --------< (M) [StudySite] >-------- (1) [Site]
                      |
                      +-- (1) --------< (M) [Participant]
                      |                     |
                      |                     +-- (1) --------< (M) [Visit]
                      |                     +-- (1) --------< (M) [Consent]
                      |                     +-- (1) --------< (M) [SafetyCase]
                      |
                      +-- (1) --------< (M) [DataQuery]
                      +-- (1) --------< (M) [ProtocolDeviation]
                      +-- (1) --------< (M) [MonitoringVisit]
                      +-- (1) --------< (M) [EthicsSubmission]
                      +-- (1) --------< (M) [CTRIRegistration]
                      +-- (1) --------< (M) [RegulatoryMilestone]
                      +-- (1) --------< (M) [SafetySignal]
```

### Table Dictionary & Primary Fields

1. **`users`**: User identity, email, hashed password, role enum, department, last login timestamp.
2. **`studies`**: `study_code` (e.g. `AYU-003`), title, phase, lifecycle stage enum, target enrollment, current enrollment, composite risk score ($0–100$), therapeutic area, protocol version.
3. **`sites`**: `site_code`, institutional name, city, state, active status, monitoring status enum.
4. **`study_sites`**: Associative table linking studies to sites with site-specific enrollment targets.
5. **`participants`**: Synthetic de-identified token (`SYN-Pxxxxx`), treatment arm, age, gender, randomization status, consent status.
6. **`visits`**: Sequence order, visit name (Screening, Day 0, Day 14, etc.), target date, actual date, allowable window days ($\pm \text{days}$), compliance status.
7. **`data_queries`**: Query code, eCRF field name, discrepancy description, severity (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`), status (`OPEN`, `ANSWERED`, `CLOSED`), resolution text.
8. **`protocol_deviations`**: Deviation code, category, description, severity, status, corrective action (CAPA), preventive action.
9. **`monitoring_visits`**: CRA monitor name, planned date, actual date, status, findings, open actions count.
10. **`safety_cases`**: Case number (e.g. `PV-2026-0031`), seriousness flag (`is_serious`), adverse event term, MedDRA Preferred Term (PT), MedDRA SOC term, MedDRA code, severity grade, causality rating, reporting deadline timestamp, 8-stage workflow state enum.
11. **`safety_signals`**: Signal code, pattern description, observed frequency %, expected frequency %, relative risk ratio ($RR$), signal state enum.
12. **`ethics_submissions` / `ctri_registrations` / `regulatory_milestones`**: Submission code, CTRI registration number, statutory milestone due dates, owner, evidence document reference.
13. **`audit_events`**: Immutable, append-only ledger recording timestamp (IST), actor ID, actor role, action verb, entity type, entity ID, before-state JSON, after-state JSON, and reason justification.

---

## 4. Role-Based Access Control (RBAC) Matrix

| User Role | Dashboard View | Studies & Sites | Participants & Visits | Safety & 24h Clock | Data Queries | CDISC & FHIR Export | Audit Ledger |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **System Administrator** | Full | Full CRUD | Full CRUD | Full CRUD | Full CRUD | Full Export | Full Read |
| **Principal Investigator** | Full | Full Edit | Read / Edit | Full Review | Answer / Resolve | Full Export | Read |
| **Study Coordinator** | Operational | Read | Create / Edit Visits | Report AE/SAE | Create / Review | View Preview | Read |
| **Clinical Monitor (CRA)** | Monitoring | Read | Source Data Verify | View Safety | Open / Close Queries | View Preview | Read |
| **Pharmacovigilance (PV)** | Safety Centric | Read | View Adverse Cases | Full 8-Stage Workflow | Read | Export AE Domain | Read |
| **Ethics Committee (IEC)** | Governance | Read | View Consent Status | View SAE Reports | Read | Read | Read |
| **Institutional Leadership** | Executive KPIs | Read Summary | Read Aggregates | View Signal Trends | Read Aggregates | Full Export | Read |
| **Regulator (Read-Only)** | Compliance | Read-Only | De-identified Read | Read-Only Regulatory | Read-Only | Full Export | Complete Read |

---

## 5. Standards Conformance & Interoperability Specifications

### 1. CDISC SDTM v3.3 Tabulation Models
* **`DM` (Demographics)**: One row per subject containing `STUDYID`, `DOMAIN`, `USUBJID`, `SUBJID`, `RFSTDTC`, `ARMCD`, `ARM`, `SEX`, `AGE`, `AGEU`, `COUNTRY`.
* **`AE` (Adverse Events)**: One row per adverse event containing `STUDYID`, `DOMAIN`, `USUBJID`, `AETERM`, `AEDECOD`, `AEBODSYS`, `AESER`, `AESEV`, `AEREL`, `AESTDTC`.
* **`DS` (Disposition)**: Captures protocol milestones, ongoing status, and withdrawal events with standard `DSDECOD` mappings.
* **`SV` (Subject Visits)**: Protocol visit schedule verification mapping visit order, planned window, and completion status.

### 2. CDISC ADaM v1.3 Analysis Datasets
* **`ADSL` (Subject-Level Analysis Dataset)**: Contains standard statistical analysis flags (`SAFFL` for safety population, `ITTFL` for intention-to-treat, and `COMPLFL` for trial completers).

### 3. Define-XML v2.0
* Machine-readable metadata package conforming to the CDISC ODM-1.3 schema, declaring item group definitions, variable typing, and standard codelists for regulatory electronic submission packages (ICH M11).

### 4. HL7 FHIR R4 REST API
* Native endpoint `GET /api/v1/interop/fhir/{resource_type}/{entity_id}` transforms internal relational models into standard HL7 FHIR R4 JSON schemas:
  * `ResearchStudy`: Conforms to FHIR R4 ResearchStudy resource structure.
  * `Patient`: De-identified FHIR Patient schema referencing synthetic tokens.
  * `AdverseEvent`: FHIR AdverseEvent resource capturing causality and severity.

---

## 6. Verification & Automated Testing Results

The platform has undergone rigorous automated integration testing:
* **Backend Test Suite**: `backend/tests/test_api.py` executed via `pytest`:
  * `test_health`: Passed (Returns 200 OK, healthy status, synthetic data flag).
  * `test_login_and_roles`: Passed (Validates JWT generation, RBAC profile parsing, hero study metrics, FHIR R4 JSON structure, CDISC SDTM CSV output, and immutable audit logging).
* **Frontend Compilation**: `tsc && vite build`:
  * 2,305 modules transformed with zero TypeScript errors.
* **Live Servers**: Both servers operating continuously as background daemons (`uvicorn` on port 8000, Vite dev server on port 5173).

