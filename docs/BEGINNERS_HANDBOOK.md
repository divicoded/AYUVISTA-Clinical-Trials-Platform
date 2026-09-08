# AYUVISTA — COMPLETE BEGINNER'S GUIDE & MASTER HANDBOOK

> **Welcome to AYUVISTA!**  
> If you have never built a healthcare application, never used clinical trial software, or don't know what acronyms like GCP, CTRI, CDISC, or MedDRA mean — **this guide is for you**.  
> Everything is explained in clear, simple language from first principles to the most advanced technical details.

---

## 1. What is this Project in 60 Seconds?

### The Problem
The **All India Institute of Ayurveda (AIIA)** in New Delhi is India's apex national institute for Ayurvedic medical research under the **Ministry of Ayush**. It conducts hundreds of clinical trials across India to prove the scientific efficacy of classical Ayurvedic medicines (e.g., Ashwagandha, Guduchi, Curcuma).  
Furthermore, AIIA serves as the **National Pharmacovigilance Coordination Centre (NPvCC)** for all ASU&H (Ayurveda, Siddha, Unani & Homoeopathy) drugs across India.

Currently, clinical trials in India are governed by strict legal rules:
1. **Mandatory CTRI Registration**: Every trial must be prospectively registered on the Clinical Trials Registry – India (`ctri.nic.in`) before enrolling its first participant.
2. **Strict Safety Timelines**: If a patient experiences a Serious Adverse Event (SAE) (e.g., hospitalization or severe reaction), the law mandates expedited reporting within **24 hours** to the licensing authority and Ethics Committee.
3. **Data Integrity (ALCOA+)**: No clinical records may be altered, erased, or faked. Every single mouse click, edits, and timestamp must be permanently recorded.
4. **Digital Personal Data Protection (DPDP Act 2023)**: Patient identities must be de-identified and protected.

**The Crisis**: Most trial coordinators and doctors still track trials using disconnected Excel spreadsheets, paper forms, and WhatsApp groups. This leads to missed regulatory deadlines, delayed drug approvals, audit failures, and a lack of international scientific recognition.

### The Solution: AYUVISTA
**AYUVISTA** is a unified, real-time, cloud-native **Clinical Trial Management System (CTMS)** and **Pharmacovigilance Dashboard**. It gives directors, doctors, ethics committees, and regulators a single, beautiful, auditable command center where every trial, patient, site, adverse event, and regulatory deadline is monitored in real-time.

---

## 2. Jargon Buster: Terms You Must Know for the Hackathon

| Term | What it Stands For | What it Actually Means (Simple Analogy) |
| :--- | :--- | :--- |
| **CTMS** | Clinical Trial Management System | An "Operating System" for clinical trials (like Salesforce, but for medical researchers). |
| **GCP** | Good Clinical Practice | An international ethical and quality standard that clinical trials must follow. |
| **NPvCC** | National Pharmacovigilance Coordination Centre | India's safety watchtower for Ayurvedic medicines, hosted right inside AIIA. |
| **CTRI** | Clinical Trials Registry – India | The government website where every trial must be publicly registered. |
| **IEC** | Institutional Ethics Committee | The board of doctors and legal experts that approves a trial before humans can be enrolled. |
| **AE vs SAE** | Adverse Event vs Serious Adverse Event | **AE**: A minor side effect (e.g., mild nausea). <br>**SAE**: A dangerous reaction requiring hospitalization or death — triggers a legal **24-hour reporting clock**. |
| **MedDRA** | Medical Dictionary for Regulatory Activities | A global standard dictionary of medical terms so a doctor in Delhi and a doctor in Tokyo use the exact same code for "Urticaria" or "Skin Rash". |
| **CDISC** | Clinical Data Interchange Standards Consortium | The global gold-standard format for packaging trial data when submitting to US FDA or India's CDSCO. |
| **SDTM** | Study Data Tabulation Model | Standardized CSV tables (e.g., `DM` for Demographics, `AE` for Adverse Events). |
| **ADaM** | Analysis Data Model | Formatted statistical datasets (e.g., `ADSL` subject-level analysis). |
| **Define-XML** | Dataset Definition XML | A machine-readable XML "data dictionary" that tells regulatory computers how datasets are structured. |
| **HL7 FHIR R4** | Fast Healthcare Interoperability Resources | Modern JSON API standard used worldwide to exchange health data between hospitals. |
| **ABDM** | Ayushman Bharat Digital Mission | India's national digital health highway (ABHA ID, consent manager). |
| **ALCOA+** | Attributable, Legible, Contemporaneous, Original, Accurate | The cardinal rule of medical records: who did it, when, why, and no deleting history. |
| **DPDP 2023** | Digital Personal Data Protection Act | India's data privacy law: synthetic tokens (`SYN-P00219`) instead of real patient names. |

---

## 3. High-Level Architecture

The system is built as a **Modular Monolith** using modern, rock-solid technologies:

```
+-----------------------------------------------------------------------+
|                       FRONTEND SINGLE PAGE APP                        |
|   React 18 + Vite 5 + TypeScript + Tailwind CSS 3 (Material 3 Theme)  |
|   Lucide Icons + Recharts + TanStack Query + Context API Auth        |
+-----------------------------------------------------------------------+
                                  |  REST API Calls / JWT Bearer Tokens
                                  v
+-----------------------------------------------------------------------+
|                         FASTAPI BACKEND CORE                          |
|   Python 3.12 + FastAPI + Pydantic v2 + SQLAlchemy 2.0 ORM            |
|   JWT Authentication + 8-Role RBAC Middleware + ALCOA+ Audit Recorder |
+-----------------------------------------------------------------------+
                                  |
    +-----------------------------+-----------------------------+
    |                             |                             |
    v                             v                             v
[Clinical Modules]        [Standard Interop]           [Security & Data]
- Study Lifecycle         - HL7 FHIR R4 API            - SQLite Database
- Multi-Site Monitor      - CDISC SDTM (DM,AE,DS,SV)   - BCrypt Password Hash
- 24h Safety Clock        - ADaM ADSL Exporter         - Immutable Audit Log
- MedDRA Coder            - Define-XML 2.0 Generator   - Synthetic Seeder
- Data Queries & CAPA     - ABDM / EDC / HIS Sandbox   - DPDP De-identification
```

---

## 4. Complete Module-by-Module Walkthrough

### Module 1: Portfolio Command Center (`/`)
* **Purpose**: Executive dashboard giving the AIIA Director a real-time pulse of the entire clinical trials ecosystem.
* **Key Features**:
  * **Welcome Ribbon**: Personalized greeting, live IST timestamp, and status.
  * **Operational Jeopardy Alert**: Automatically flags hero trial **AYU-003** with risk score $78.5/100$ due to recruitment lag, critical queries, and an active 24h SAE clock.
  * **5 Pastel Metric Cards**: Active Protocols ($25$), Total Enrolled ($1,520$), Trial Sites ($40$), Data Queries ($14$), and Safety Events ($65$ AE / $15$ SAE).
  * **Study Health Matrix Table**: Real-time surveillance grid rating all trials as *Healthy*, *Watch*, *At Risk*, or *Critical*.
  * **Recruitment S-Curve Area Chart**: Visualizes cumulative actual recruitment vs planned protocol target curve.
  * **Portfolio Risk Score Heatmap**: Recharts bar chart ranking the top 15 studies by composite risk score with direct click-through to workspace.

### Module 2: Studies Portfolio & 10-Stage Lifecycle (`/studies` and `/studies/:studyCode`)
* **Purpose**: Tracks trials from initial concept to database lock and final close-out.
* **Key Features**:
  * Filter by study phase (Phase II, Phase III, Observational) or search by therapeutic area.
  * **10-Stage Lifecycle Pipeline Stepper**: Interactive visual pipeline:
    `PROTOCOL` → `IEC_SUBMISSION` → `IEC_APPROVAL` → `CTRI_REGISTRATION` → `SITE_ACTIVATION` → `RECRUITMENT` → `TREATMENT` → `FOLLOW_UP` → `DATABASE_LOCK` → `CLOSE_OUT`.
  * **5 Tab Workspace**:
    1. *Overview*: Protocol dossier, endpoints, and study-specific S-curve.
    2. *Sites*: Participating hospitals and activation statuses.
    3. *Data Queries*: Unresolved eCRF discrepancies.
    4. *Deviations & CAPA*: Protocol violations, severity ratings, and Corrective/Preventive Actions.
    5. *Safety*: Associated Adverse Events and regulatory clocks.

### Module 3: Pharmacovigilance (PV) & 24-Hour Expedited Safety Clock (`/safety`)
* **Purpose**: Enables AIIA's mandate as the National Pharmacovigilance Coordination Centre (NPvCC).
* **Key Features**:
  * **Expedited 24h SAE Countdown Banner**: High-visibility rose card tracking Case **PV-2026-0031** (Severe Acute Urticaria & Transaminitis spike) with real-time countdown timer to regulatory submission deadline.
  * **8-Step Safety Audit Workflow Stepper**:
    `REPORTED` → `VALIDATED` → `MEDICAL_REVIEW` → `CODING` → `CAUSALITY_REVIEW` → `REGULATORY_ASSESSMENT` → `SUBMITTED` → `CLOSED`.
  * **MedDRA Coding Dictionary Adapter**: Search preferred terms (PT) and System Organ Class (SOC) (e.g., Code `10046735` for Urticaria) and attach them directly to safety reports.
  * **AE Severity Stacked Bar Chart**: Non-Serious AE vs Serious AE across severity grades (`MILD`, `MODERATE`, `SEVERE`, `LIFE_THREATENING`).
  * **Disproportionality Signal Map**: Scatter plot displaying Observed % vs Expected % frequency with bubble radius reflecting Relative Risk ($RR \times$).

### Module 4: Site Network & CRA Monitoring (`/sites` and `/monitoring`)
* **Purpose**: Oversight of all 40 hospital sites across India.
* **Key Features**:
  * Tracks target vs actual enrolled patients per center.
  * Identifies deficient sites (e.g., `SITE-BLR-02` in Bengaluru with overdue monitoring).
  * Slide-in detail drawer displaying open queries and deviations for that specific site.
  * Clinical Research Associate (CRA) visit schedule with Source Data Verification (SDV) flags.

### Module 5: Synthetic Participant Registry & Visit Tracker (`/participants`)
* **Purpose**: Full patient recruitment and visit window compliance.
* **Key Features**:
  * Complies with the **DPDP Act 2023** using synthetic de-identified tokens (`SYN-P00001` through `SYN-P01520`).
  * Displays demographic data (Age, Gender), Investigational Product arm, and e-Consent status (`OBTAINED`).
  * **Protocol Visit Schedule Drawer**: Shows screening, baseline (D0), and follow-up visits (D14, D28) with allowable window compliance ($\pm 2$ days) and one-click "Complete Visit" recording.

### Module 6: Data Quality & Discrepancies (`/data-quality`)
* **Purpose**: Electronic Case Report Form (eCRF) query management.
* **Key Features**:
  * 4 summary cards: Total, Open, Critical, and Resolved queries.
  * Color-coded severity badges (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
  * Interactive modal allowing investigators to submit resolution justification notes with full ALCOA+ audit logging.

### Module 7: Ethics & Regulatory Hub (`/ethics`)
* **Purpose**: Manages Institutional Ethics Committee (IEC) approvals and CTRI milestone synchronization.
* **Key Features**:
  * Upcoming statutory deadline banner (e.g., CTRI 6-monthly progress report due).
  * 3 sub-tabs: IEC Submissions, CTRI Registrations, and Regulatory Milestones.
  * Sandbox Sync button demonstrating simulated live synchronization with `ctri.nic.in`.

### Module 8: Interoperability Layer (`/interop`)
* **Purpose**: Bridges AIIA with external national and global health IT systems.
* **Key Features**:
  * **HL7 FHIR R4 Transformer**: Live REST endpoint returning valid FHIR R4 standard JSON for `ResearchStudy`, `Patient`, and `AdverseEvent`.
  * **Sandbox Adapters**: Interactive trigger cards for Electronic Data Capture (EDC), Hospital Information Systems (HIS), and Ayushman Bharat Digital Mission (ABDM).
  * One-click "Copy JSON to Clipboard" for regulatory integration testing.

### Module 9: CDISC Regulatory Reports Center (`/reports`)
* **Purpose**: Generates submission-ready dataset packages for drug authorities (CDSCO, US FDA).
* **Key Features**:
  * **SDTM Domain CSVs**:
    * `DM.csv` (Demographics — 1 row per subject)
    * `AE.csv` (Adverse Events — coded to MedDRA)
    * `DS.csv` (Disposition — protocol milestones and completion)
    * `SV.csv` (Subject Visits — tracking protocol visit dates)
  * **ADaM Dataset**: `ADSL.csv` (Subject-Level Analysis Dataset with safety population flags `SAFFL`, `ITTFL`).
  * **Define-XML v2.0**: Machine-readable XML specification with inline preview and direct download.

### Module 10: ALCOA+ Immutable Audit Trail (`/audit`)
* **Purpose**: Guarantees forensic data integrity.
* **Key Features**:
  * Records every system event: Timestamp (IST), Actor name, Role, Action type, Entity, and Reason.
  * **State Diff Viewer**: Click "View Diff" on any audit event to inspect exact JSON before/after state changes.

---

## 5. Complete API Reference

All backend endpoints are prefixed with `/api/v1` and documented interactively at `http://localhost:8000/docs`.

### Authentication & RBAC (`/api/v1/auth`)
* `POST /login` — Authenticate using email and password, returns JWT token.
* `GET /me` — Returns current logged-in user profile.
* `POST /switch-role` — Instant role switcher for hackathon demonstration.

### Command Center & Analytics (`/api/v1/command-center`)
* `GET /metrics` — High-level KPI metrics (active studies, enrolled participants, open queries, SAE count).
* `GET /health-matrix` — Multi-vector risk assessment for all studies.
* `GET /recruitment-trend` — Cumulative planned vs actual enrollment trajectory data points.

### Clinical Studies (`/api/v1/studies`)
* `GET /` — List all clinical studies with search and phase filters.
* `GET /{study_id_or_code}` — Get deep study dossier by ID or code (e.g., `AYU-003`).
* `POST /{study_id}/transition` — Transition study lifecycle stage with mandatory reason.
* `GET /{study_id}/recruitment-curve` — Get monthly planned vs actual enrollment for that study.

### Site Network (`/api/v1/sites`)
* `GET /` — List all 40 hospital trial sites with performance KPIs.
* `GET /{site_id}` — Get single site details.

### Participants & Visits (`/api/v1/participants`)
* `GET /` — List synthetic participants with pagination.
* `GET /{participant_id}/visits` — Get all protocol visits for a participant.
* `PUT /visits/{visit_id}/complete` — Mark a visit completed with actual date and notes.

### Data Queries (`/api/v1/queries`)
* `GET /` — List queries with optional filters.
* `GET /summary` — Aggregate query statistics.
* `PUT /{query_id}/answer` — Investigator submits discrepancy resolution.
* `PUT /{query_id}/close` — CRA or Data Manager verifies and closes query.

### Pharmacovigilance & Safety (`/api/v1/safety`)
* `GET /cases` — List all AE and SAE cases.
* `GET /cases/{case_id}` — Get full safety dossier.
* `POST /cases/{case_id}/transition` — Advance case through the 8-stage safety workflow.
* `GET /signals` — Retrieve disproportionality safety signals.
* `GET /coding/lookup?q=term` — Search synthetic MedDRA coding dictionary.

### Interoperability & Sandbox (`/api/v1/interop`)
* `GET /status` — Status of EDC, HIS, and ABDM sandbox connectors.
* `GET /fhir/{resource_type}/{entity_id}` — Return HL7 FHIR R4 JSON representation.
* `POST /edc/sync` — Trigger simulated EDC sync.
* `POST /abdm/demo-flow` — Execute simulated ABDM consent workflow.

### CDISC Exports (`/api/v1/exports`)
* `GET /cdisc/{study_id}/dm` — Download SDTM Demographics (`DM.csv`).
* `GET /cdisc/{study_id}/ae` — Download SDTM Adverse Events (`AE.csv`).
* `GET /cdisc/{study_id}/ds` — Download SDTM Disposition (`DS.csv`).
* `GET /cdisc/{study_id}/sv` — Download SDTM Subject Visits (`SV.csv`).
* `GET /cdisc/{study_id}/adam` — Download ADaM Subject-Level Analysis (`ADSL.csv`).
* `GET /cdisc/{study_id}/define-xml` — Download Define-XML 2.0 (`Define_XML.xml`).

### Audit Trail (`/api/v1/audit`)
* `GET /` — Query immutable audit events with actor and entity filters.
* `GET /entity/{entity_type}/{entity_id}` — Retrieve full historical timeline of a record.

---

## 6. How to Run the Platform (Step-by-Step)

### Prerequisites
* Windows 10/11 (or Linux / macOS)
* Python 3.12 installed
* Node.js v18+ & npm installed

### Quick Start (Windows)
Double-click `d:\Project\AIIA\start.bat` or run in PowerShell:
```powershell
d:\Project\AIIA\run.ps1
```

### Manual Start
**Terminal 1 — Backend**:
```powershell
cd d:\Project\AIIA\backend
& "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe" -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*API will run at:* `http://localhost:8000` (Swagger UI at `http://localhost:8000/docs`)

**Terminal 2 — Frontend**:
```powershell
cd d:\Project\AIIA\frontend
npm.cmd run dev
```
*Frontend will run at:* `http://localhost:5173`

---

## 7. Demo Credentials & Instant Login

All accounts use the standard password: `Nexus@AIIA2026`

| Role | Email | Best Used For Showing |
| :--- | :--- | :--- |
| **Principal Investigator** | `pi@aiia.demo` | Protocol oversight, risk evaluation, query answering |
| **Study Coordinator** | `coordinator@aiia.demo` | Participant enrollment, visit scheduling, eCRF entries |
| **Clinical Monitor (CRA)** | `monitor@aiia.demo` | Site inspection visits, SDV, deviation and CAPA management |
| **Pharmacovigilance Officer** | `pv@aiia.demo` | 24h expedited SAE countdown clock, MedDRA coding |
| **Ethics Committee (IEC)** | `ethics@aiia.demo` | Protocol approval review, continuing review oversight |
| **Institutional Leadership** | `leadership@aiia.demo` | Executive portfolio KPIs, CTRI registry compliance |
| **Regulatory Auditor** | `regulator@aiia.demo` | Read-only ALCOA+ audit trail inspection |
| **System Administrator** | `admin@aiia.demo` | Full administrative controls |

*(Tip: On the login page, you don't even need to type! Simply click any of the 8 pastel role cards to log in instantly).*

