# AYUVISTA — Primary Demonstration Scenario & Narrative Script

## 1. Scenario Overview: Hero Study "AYU-003"
The demonstration is anchored on **AYU-003**:
- **Full Title**: Multicenter Randomized Controlled Trial of Standardized Guduchi (Tinospora cordifolia) and Pippali (Piper longum) Formulation in Post-Viral Fatigue and Chronic Metabolic Syndrome.
- **Hero Dilemma**: AYU-003 has entered operational jeopardy:
  - **Recruitment Lag**: 42% of projected enrollment completed (lagging by 85 participants).
  - **Site In Distress**: Site `SITE-BLR-02` (Bengaluru Ayush Specialty Center) has 1 overdue monitoring visit, 14 unresolved data queries (2 critical), and 3 open protocol deviations.
  - **Approaching Regulatory Deadline**: CTRI 6-Monthly Progress Filing due in 9 days.
  - **Safety Case Under Investigation**: SAE `PV-2026-0031` (Severe Acute Urticaria with Hepatic Enzyme Spike) requiring expedited 24h clock review and causality determination.

---

## 2. Step-by-Step Demonstration Script

### Step 1: Login as Principal Investigator
- **URL**: `http://localhost:5173/login`
- **Action**: Select Quick-Login preset or enter `pi@aiia.demo` / `Nexus@AIIA2026`.
- **System Response**: Authenticates with JWT, identifies role `PRINCIPAL_INVESTIGATOR`, redirects to Command Center.

### Step 2: Command Center — Portfolio Health & Risk Matrix
- **Observe**:
  - Portfolio Metrics: Active Studies (25), Total Enrolled (1,500+), Active Sites (40), Overdue Tasks.
  - **Study Health Matrix**: Observe `AYU-003` highlighted with a bold Amber/Red status (**AT RISK**, Risk Score: **78/100**).
  - Breakdown shows flags in: Recruitment (Lag), Monitoring (Overdue), Data Quality (Open queries), Regulatory (Due soon).
- **Action**: Click on study row `AYU-003` to enter its Study Workspace.

### Step 3: Study Workspace — Root Cause Analysis
- **Overview Tab**:
  - Inspect S-curve recruitment chart: Planned vs Actual curve widening.
  - Lifecycle tracker at `TREATMENT / INTERVENTION` stage.
- **Sites Tab**:
  - Filter sites for `AYU-003`. Identify `SITE-BLR-02` (Bengaluru) marked with `OVERDUE_ACTION`.
  - Click Bengaluru site to drill into its Site Detail.
- **Site Detail**:
  - Note 14 open queries, 1 overdue CRA monitoring visit, and 2 protocol deviations (unapproved concomitant medication).

### Step 4: Safety / Pharmacovigilance Workspace — SAE Expedited Clock
- **Action**: Navigate to `Safety / Pharmacovigilance` module.
- **Observe**:
  - Active SAE clock: Case `PV-2026-0031` showing reporting countdown timer.
  - Workflow state: Currently at `MEDICAL_REVIEW`.
- **Action**: Open Case Detail:
  - Synthetic participant: `SYN-P00219`.
  - Adverse term: "Severe Acute Urticaria & Transaminitis".
  - Perform Synthetic MedDRA PT Coding lookup via Dictionary Adapter.
  - Transition workflow to `CAUSALITY_REVIEW` -> `REGULATORY_ASSESSMENT`.
  - View audit event automatically registered with actor, previous state, new state.

### Step 5: Ethics & Regulatory Milestones
- **Action**: Navigate to `Ethics & Regulatory`.
- **Observe**:
  - CTRI Sandbox connector status: `CTRI/2025/11/075432` — Next required update due in 9 days.
  - Click "Simulate CTRI Milestone Validation" (Clearly labeled Sandbox Adapter).
  - Review milestone checklist and evidence documents.

### Step 6: Audit Trail Explorer (ALCOA+ Integrity)
- **Action**: Navigate to `Audit Trail`.
- **Observe**:
  - Filter by Entity: `SafetyCase`, ID: `PV-2026-0031`.
  - View the exact transition performed in Step 4:
    - Actor: Dr. Suhas Kumar (`pi@aiia.demo`)
    - Role: `PRINCIPAL_INVESTIGATOR`
    - Timestamp: Contemporaneous UTC ISO timestamp
    - Action: `TRANSITION`
    - Before: `{"workflow_state": "MEDICAL_REVIEW"}`
    - After: `{"workflow_state": "REGULATORY_ASSESSMENT"}`
    - Read-only immutability guaranteed.

### Step 7: Interoperability Hub (FHIR R4 & Adapters)
- **Action**: Navigate to `Interoperability`.
- **Observe**:
  - FHIR R4 Transform: Select Study `AYU-003` or Participant `SYN-P00219`.
  - View live generated standard HL7 FHIR `ResearchStudy` and `AdverseEvent` JSON resources.
  - Run Demo Sync on EDC Sandbox Adapter (Simulates 42 records processed, 0 schema errors).
  - View ABDM Health Repository mock exchange status (Sandbox Mode).

### Step 8: Reports & CDISC Tabulation Export
- **Action**: Navigate to `Reports & Exports`.
- **Observe**:
  - Generate CDISC SDTM-oriented export package for `AYU-003`.
  - Inspect generated domains: `DM.csv` (Demographics), `AE.csv` (Adverse Events), `DS.csv` (Disposition), `SV.csv` (Subject Visits).
  - Preview Define-XML structural metadata schema.
  - Export CSV download.

### Step 9: Return to Command Center & Simulated Mitigation
- **Observe**:
  - Risk score responds dynamically to query resolutions and workflow updates.
  - Demonstrate seamless role-switching (e.g. switch to `MONITOR` or `ETHICS` or `LEADERSHIP`) to prove RBAC segregation.

