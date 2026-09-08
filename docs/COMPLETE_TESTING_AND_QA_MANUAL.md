# AYUVISTA - Complete Quality Assurance & System Testing Manual
## Step-by-Step Verification Playbook for Evaluators, QA Testers & Reviewers

> **Document Scope**:  
> This testing manual provides an exhaustive, step-by-step test protocol to verify every user interface screen, clinical workflow, regulatory gate, and backend service in **AYUVISTA**.  
> Anyone can follow these numbered steps to thoroughly validate the platform in 15 to 20 minutes.

---

## 1. Quick Reference Testing Information

* **Live Cloud Frontend (Vercel)**: [https://ayuvista-ctms.vercel.app](https://ayuvista-ctms.vercel.app)
* **Live Cloud Backend API (Render)**: [https://ayuvista-backend.onrender.com/docs](https://ayuvista-backend.onrender.com/docs)
* **GitHub Repository**: [https://github.com/divicoded/AYUVISTA-Clinical-Trials-Platform](https://github.com/divicoded/AYUVISTA-Clinical-Trials-Platform)
* **Local Frontend (if testing offline)**: `http://localhost:5173`
* **Local Backend (if testing offline)**: `http://localhost:8000/docs`
* **Universal Demo Password**: `Nexus@AIIA2026` (or use the 1-click pastel preset cards on the login screen)

---

## 2. Testing Execution Summary Matrix

| Test Suite | Module Under Test | Key Feature to Verify | Time to Test |
| :--- | :--- | :--- | :---: |
| **Suite 01** | Authentication & RBAC | 1-Click Role Logins, JWT Tokens, Topbar Role Switcher | 2 mins |
| **Suite 02** | Command Center | 0-100 Study Risk Score, S-Curve Recruitment, Health Matrix | 2 mins |
| **Suite 03** | Study Workspace | Hero Study AYU-003, 10-Stage Lifecycle Stepper, 8 Sites | 2 mins |
| **Suite 04** | Sites Oversight | 40 Hospital Sites, Overdue Site BLR-02, CRA Visit Scheduling | 2 mins |
| **Suite 05** | Safety Watchtower | Live 24-Hour Statutory Countdown Clock (Case PV-2026-0031) | 2 mins |
| **Suite 06** | Gated Safety Workflow | 8-Stage Sequential Progression, MedDRA Gate, WHO-UMC Gate | 2 mins |
| **Suite 07** | Clinical Data Quality | Severity Pills, Query Resolution Modal, eCRF Justification | 1 min |
| **Suite 08** | Protocol Deviations | CAPA Plan Formulation, Corrective and Preventive Action Logs | 1 min |
| **Suite 09** | Ethics & Regulatory | CTRI Registry Status, 6-Monthly Progress Milestone Sync | 1 min |
| **Suite 10** | Interoperability & FHIR | Live HL7 FHIR R4 JSON Payload Inspector, CDISC Exporters | 2 mins |
| **Suite 11** | ALCOA+ Audit Ledger | 21 CFR Part 11 Ledger, Before/After JSON Diffs, CSV Export | 1 min |
| **Suite 12** | Tasks & Micro-Delight | Task Toggle, Interactive Add Modal, Canvas Confetti Feedback | 1 min |
| **Suite 13** | Mobile Responsiveness | iPhone/Android 360px-390px Viewport, Zero Horizontal Overflow | 1 min |

---

## 3. Step-by-Step Test Protocols

### TEST SUITE 01: Authentication & 8-Role Access Control

* **Goal**: Verify that users can authenticate seamlessly and switch personas without session failure.
* **Test Steps**:
  1. Navigate to: [https://ayuvista-ctms.vercel.app](https://ayuvista-ctms.vercel.app)
  2. Notice the login screen featuring 8 pastel role cards:
     * *Principal Investigator* (`pi@aiia.demo`)
     * *Study Coordinator* (`coordinator@aiia.demo`)
     * *Clinical Monitor / CRA* (`monitor@aiia.demo`)
     * *Ethics Committee / IEC* (`ethics@aiia.demo`)
     * *Pharmacovigilance Officer* (`pv@aiia.demo`)
     * *Institutional Leadership* (`leadership@aiia.demo`)
     * *Regulatory Auditor* (`regulator@aiia.demo`)
     * *System Administrator* (`admin@aiia.demo`)
  3. Click the **Principal Investigator** card. Notice the email field auto-populates with `pi@aiia.demo`.
  4. Click the dark green button **"Sign in to Command Center"**.
  5. Check the top-right header: notice your name displays as **Prof. Dr. Suhas Kumar** with the pill tag **PRINCIPAL_INVESTIGATOR**.
  6. In the header, click the **Switch Role** dropdown menu and select **Pharmacovigilance & Safety**.
  7. Notice the active user immediately changes to **Dr. Vikramaditya Joshi** (`PHARMACOVIGILANCE`) with zero page reloads.
* **Pass Criteria**:
  * [ ] Login completes with 0 errors (no 401 or 405 error).
  * [ ] Instant role switching updates permissions and user tags dynamically.

---

### TEST SUITE 02: Executive Command Center & Portfolio Analytics

* **Goal**: Verify portfolio-level governance KPIs and S-curve recruitment tracking across 25 active clinical protocols.
* **Test Steps**:
  1. Click **Command Center** in the left sidebar navigation.
  2. Verify the 4 primary metric summary cards at the top:
     * **Active Studies**: 25 Protocols
     * **Total Sites**: 40 National Hospital Centers
     * **Enrolled Participants**: 1,520 Synthetic Tokenized Subjects
     * **Active Safety Alerts**: High-priority alert banner visible
  3. Inspect the **Portfolio S-Curve Cumulative Recruitment** graph:
     * Hover your cursor over the chart points.
     * Verify that target trajectory (dotted line) versus actual enrolled subjects (solid teal curve) displays values.
  4. Scroll down to the **Multi-Study Health Matrix** table:
     * Locate Hero Study **AYU-003** (Guduchi-Pippali Formulation).
     * Verify its Risk Badge displays **78.5 / 100 (AT RISK)** in red/amber.
     * Verify that other studies (e.g., AYU-001 Ashwagandha) display **HEALTHY** in green.
  5. In the top alert notification card, click the link **"Open Study AYU-003 Workspace"** (or click row AYU-003 in the table).
* **Pass Criteria**:
  * [ ] Metric cards show non-zero statistical data.
  * [ ] Recharts interactive tooltip renders on mouse hover.
  * [ ] Hero Study AYU-003 clearly flags operational risk at 78.5 score.

---

### TEST SUITE 03: Study Workspace & Hero Study AYU-003

* **Goal**: Verify in-depth operational surveillance for a specific clinical trial protocol.
* **Test Steps**:
  1. Inside the **Study Workspace** for study `AYU-003`:
  2. Verify the **10-Stage Protocol Lifecycle Stepper**:
     * `PROTOCOL` -> `IEC_SUBMISSION` -> `IEC_APPROVAL` -> `CTRI_REGISTRATION` -> `SITE_ACTIVATION` -> `RECRUITMENT` -> `TREATMENT` (current active stage highlighted) -> `FOLLOW_UP` -> `DATABASE_LOCK` -> `CLOSE_OUT`.
  3. Verify the **Recruitment Lag Indicator**:
     * Target: 250 subjects | Actual: 105 subjects (-44.7% recruitment lag).
  4. Click the **Participating Sites** tab:
     * Notice 8 sites assigned to AYU-003.
     * Notice site **SITE-BLR-02** (Bengaluru Ayush Specialty Center) flagged as **DEFICIENT / OVERDUE ACTION**.
  5. Click the **Safety Cases** tab:
     * Notice case **PV-2026-0031** flagged with urgent priority.
  6. Click the **Data Queries** tab:
     * Notice open discrepancy queries including ALT transaminase laboratory value flag.
* **Pass Criteria**:
  * [ ] 10-stage lifecycle progress bar displays correct active milestone.
  * [ ] Tab switching between Sites, Queries, Deviations, and Safety is smooth and instantaneous.

---

### TEST SUITE 04: Multi-Center Site Oversight & CRA Visit Scheduling

* **Goal**: Verify hospital network surveillance and interactive on-site audit visit scheduling.
* **Test Steps**:
  1. Click **Sites** in the left sidebar navigation.
  2. Notice the grid of hospital centers across Delhi, Bengaluru, Jaipur, Mumbai, Varanasi, Pune, etc.
  3. Locate the card for **SITE-BLR-02 (Bengaluru Ayush Specialty Center)**:
     * Notice the red warning badge: **OVERDUE ACTION**.
     * PI: Dr. R. K. Hegde | Open Queries: 14 | Protocol Deviations: 3.
  4. Click on the Bengaluru site card. A spacious 4-tab drawer slides out from the right:
     * **Tab 1: Overview & Leadership**: Site KPIs, coordinator contact info, and activation dates.
     * **Tab 2: Data Queries**: Filter by severity (`CRITICAL`, `MAJOR`, `MINOR`).
     * **Tab 3: Protocol Deviations**: Temperature excursion log.
     * **Tab 4: CRA Monitoring & Audits**: Historical visit records.
  5. Switch to **Tab 4 (CRA Monitoring & Audits)**.
  6. Click the green button **"Schedule CRA On-Site Visit"**:
     * Enter monitor name: `Mr. Rajesh Nair (CRA)`.
     * Select visit type: `Targeted For-Cause Audit`.
     * Pick a future date.
     * Click **"Confirm & Dispatch Visit Notice"**.
  7. **Observe Visual Feedback**:
     * Celebratory confetti bursts across the screen.
     * The site monitoring badge dynamically updates from `OVERDUE ACTION` to `PENDING VISIT`.
* **Pass Criteria**:
  * [ ] Slide-out drawer opens without horizontal overflow.
  * [ ] Scheduling the visit triggers confetti and updates site status in real-time.

---

### TEST SUITE 05: Safety Watchtower & 24-Hour Statutory SAE Countdown Clock

* **Goal**: Verify statutory compliance with CDSCO NDCT Rules 2019 Rule 22 requiring Serious Adverse Events (SAEs) to be notified within 24 hours.
* **Test Steps**:
  1. Click **Safety** in the left sidebar navigation.
  2. At the top of the screen, locate the **Urgent Expedited SAE Banner**:
     * Notice Case **PV-2026-0031**: *Severe Acute Urticaria with Hepatic Transaminitis Spike*.
  3. **Inspect the Active Statutory Countdown Clock**:
     * Notice the animated live ticking clock showing exact hours, minutes, and seconds remaining (e.g., `09h 48m 12s remaining`).
     * Verify the legal compliance label: `Statutory Reporting Clock - NDCT Rules 2019 (Rule 22)`.
  4. Click the case card **PV-2026-0031** to open the Safety Dossier Drawer.
* **Pass Criteria**:
  * [ ] The 24-hour countdown clock is active, visually prominent, and updates every second.
  * [ ] Case details display patient token `SYN-P00219`, drug interruption status, and narrative.

---

### TEST SUITE 06: Gated 8-Stage Sequential Safety Workflow

* **Goal**: Verify that safety cases cannot skip regulatory quality gates (MedDRA coding and causality sign-off).
* **Test Steps**:
  1. Inside the Safety Dossier Drawer for Case **PV-2026-0031**:
  2. Look at the **8-Stage Workflow Stepper**:
     * `1. REPORTED` -> `2. VALIDATED` -> `3. MEDICAL_REVIEW` (current) -> `4. CODING` -> `5. CAUSALITY_REVIEW` -> `6. REGULATORY_ASSESSMENT` -> `7. SUBMITTED` -> `8. CLOSED`.
  3. Click the button **"Advance to Next Stage"**:
     * Notice the case advances to **Step 4 (CODING)**.
  4. **Verify MedDRA Compliance Gate at Step 4**:
     * Notice the system enforces MedDRA classification before proceeding.
     * Click **"Lookup MedDRA Terminology"**:
     * Verify Preferred Term (PT) `Urticaria acute` (Code: `10046735`) and SOC `Skin and subcutaneous tissue disorders`.
     * Click **"Save Coding & Complete Gate"**.
  5. Advance to **Step 5 (CAUSALITY_REVIEW)**:
     * **Verify WHO-UMC Causality Gate at Step 5**:
     * Select a formal causality category: `PROBABLE / LIKELY` (or `POSSIBLE`).
     * Enter clinical justification: `De-challenge positive after formulation cessation.`
     * Click **"Sign Off Causality (WHO-UMC)"**.
  6. Advance through **REGULATORY_ASSESSMENT** to **SUBMITTED**:
     * Notice celebratory confetti and verified dossier generation.
* **Pass Criteria**:
  * [ ] Forward progression enforces required regulatory data at Steps 4 and 5.
  * [ ] Workflow progress percentage indicator updates accurately.

---

### TEST SUITE 07: Clinical Data Quality & eCRF Discrepancy Query Resolution

* **Goal**: Verify the eCRF discrepancy management workflow under GCP-ASU standards.
* **Test Steps**:
  1. Click **Data Quality** in the left sidebar navigation.
  2. Inspect the discrepancy queries list:
     * Notice severity tags: `CRITICAL` (Red), `HIGH` (Amber), `LOW` (Green).
  3. Locate query **QRY-2026-0014**: *ALT lab report value (120 U/L) exceeds protocol upper threshold*.
  4. Click the query to open the resolution dialog:
     * Type in the investigator response: `Repeat lab sample requested; subject asymptomatic.`
     * Click **"Submit & Mark Answered"**.
  5. Notice the query status changes from `OPEN` to `ANSWERED`.
* **Pass Criteria**:
  * [ ] Query filter pills work (`ALL`, `OPEN`, `ANSWERED`, `CLOSED`).
  * [ ] Submitting a resolution updates the query state.

---

### TEST SUITE 08: Protocol Deviations & CAPA Formulation

* **Goal**: Verify deviation classification and corrective/preventive action tracking.
* **Test Steps**:
  1. On the **Data Quality** page, click the **Protocol Deviations** tab.
  2. Locate deviation **DEV-2026-003**: *Trial drug storage temperature logged at 28.4 deg C for 36 hours*.
  3. Click **"View / Edit CAPA Plan"**:
     * Inspect Corrective Action: `Quarantined affected batch #GP-2025-08.`
     * Inspect Preventive Action: `Calibrated HVAC unit and installed continuous digital thermal logger.`
     * Click **"Update CAPA Status"**.
* **Pass Criteria**:
  * [ ] Deviations correctly categorise into Investigational Product, Consent, and Protocol Visit windows.

---

### TEST SUITE 09: Ethics Committee & CTRI Registry Interoperability

* **Goal**: Verify ethics approval validity and Clinical Trials Registry - India (CTRI) progress reporting.
* **Test Steps**:
  1. Click **Ethics & Regulatory** in the left sidebar navigation.
  2. Inspect the **CTRI Registration Card**:
     * CTRI Identifier: `CTRI/2025/11/074829`.
     * Registration status: `VERIFIED PROSPECTIVE`.
     * Next 6-monthly progress milestone: Due in **9 days**.
  3. Click the button **"Test CTRI Sandbox Sync"**:
     * Observe the simulated bidirectional handshake with the ICMR registry gateway.
     * Confetti triggers upon successful handshake confirmation.
  4. Scroll down to the **Institutional Ethics Committee (IEC) Clearances** section:
     * Locate approval code `IEC-AIIA-2025-089`.
     * Click **"Download Approval Certificate"**:
     * A formatted plain-text ethics certificate opens with decision details and 24-month validity.
* **Pass Criteria**:
  * [ ] CTRI sandbox sync runs and gives visual confirmation.
  * [ ] Clearance certificate downloads cleanly.

---

### TEST SUITE 10: Interoperability, HL7 FHIR R4 & CDISC Standards

* **Goal**: Verify international data standardization for FDA, WHO, and ABDM submissions.
* **Test Steps**:
  1. Click **Interoperability** in the left sidebar navigation.
  2. Under the **HL7 FHIR R4 Micro-Transformations** section:
     * In the resource selector dropdown, choose **`ResearchStudy`** and entity `AYU-003`.
     * Verify the generated JSON matches HL7 FHIR standard format (`resourceType: "ResearchStudy"`).
     * Switch resource to **`AdverseEvent`** and entity `PV-2026-0031`.
     * Verify adverse reaction JSON includes MedDRA coding and severity.
     * Switch resource to **`Patient`** and entity `SYN-P00219`.
     * Verify zero real-world PII exposure (tokenized DPDP 2023 profile).
  3. Click the **"Copy JSON Payload"** button:
     * Notice the copy confirmation tooltip (`Copied!`).
  4. Click the button **"Simulate ABDM Consent Flow"**:
     * Notice the simulated ABHA tokenization and consent artefact exchange.
  5. Navigate to **Reports & Exports** in the sidebar:
     * Click **"Download CDISC SDTM (DM.csv)"**: Demographics tabulation dataset downloads.
     * Click **"Download CDISC SDTM (AE.csv)"**: Adverse Events domain dataset downloads.
     * Click **"Download Define-XML 2.0"**: Standard machine-readable XML metadata file downloads.
* **Pass Criteria**:
  * [ ] FHIR JSON renders dynamically for all three resource types.
  * [ ] CDISC CSV and Define-XML files download with valid columns.

---

### TEST SUITE 11: ALCOA+ Cryptographic Audit Ledger & State Diffs

* **Goal**: Verify 21 CFR Part 11 electronic records compliance with tamper-evident before/after state diffs.
* **Test Steps**:
  1. Click **Audit Trail** in the left sidebar navigation.
  2. Inspect the audit ledger entries:
     * Verify that every write action has: Actor, Role, Indian Standard Time (IST) timestamp, Action Name, and Entity ID.
  3. Click on any row to open the **JSON State Diff Inspection Drawer**:
     * Verify the **Before State** and **After State** JSON objects displaying exact modified fields.
  4. Click the button **"Export Audit Ledger (CSV)"**:
     * Verify an immutable CSV audit report downloads.
* **Pass Criteria**:
  * [ ] Audit events are immutable with complete before/after state diffs.
  * [ ] No delete or edit buttons exist on the audit trail (append-only).

---

### TEST SUITE 12: Interactive Tasks Board & Operational Workflow

* **Goal**: Verify clinical task management and real-time completion status.
* **Test Steps**:
  1. Click **Tasks** in the left sidebar navigation.
  2. Notice priority filter pills: `ALL`, `URGENT`, `HIGH`, `MEDIUM`, `LOW`.
  3. Locate the task: *Submit CTRI 6-Monthly Progress Report for AYU-003*.
  4. Click the round checkbox to toggle its completion:
     * Notice the celebratory confetti animation.
     * The task state updates dynamically.
  5. Click the button **"Add New Task"**:
     * Enter title: `Verify temperature calibration log for Ward 4`.
     * Set priority to `HIGH`.
     * Click **"Create Task"**.
     * Verify the new task appears at the top of the list.
* **Pass Criteria**:
  * [ ] Task toggle works with instant visual feedback.
  * [ ] New task modal successfully inserts task into the view.

---

### TEST SUITE 13: Mobile Responsiveness & Viewport Hardening

* **Goal**: Verify zero horizontal viewport overflow on smartphone screens.
* **Test Steps**:
  1. Open Chrome / Edge Developer Tools (`F12`).
  2. Click the Device Toggle icon (`Ctrl + Shift + M`).
  3. Select **iPhone 14 / 15 Pro** (width: `393px`) or **Samsung Galaxy S20** (width: `360px`).
  4. Scroll vertically through each page:
     * **Login Page**: Role preset cards wrap into a clean single column.
     * **Command Center**: Stat cards and S-curve chart scale down to fit screen width without horizontal scrollbars.
     * **Sites Drawer**: Multi-tab drawer fits 100% of mobile screen width with touch-scrollable tabs.
     * **Header Dropdowns**: Notifications tray and user menu fit within screen margins (`w-[calc(100vw-1.5rem)]`).
* **Pass Criteria**:
  * [ ] Zero horizontal overflow on mobile screens (`body { overflow-x: hidden }`).
  * [ ] All drawer action buttons remain fully visible and tap-accessible.

---

### TEST SUITE 14: Dual Cloud Backend Health & Network Fallback Resilience

* **Goal**: Verify that the platform handles cloud API connections and cold starts with zero downtime.
* **Test Steps**:
  1. Open browser developer tools -> **Network** tab.
  2. Filter by `Fetch/XHR`.
  3. Navigate to **Command Center**:
     * Verify requests go to `https://ayuvista-backend.onrender.com/api/v1/...`.
     * Notice response headers include CORS origins and valid JSON data.
  4. Disconnect your internet connection (or select **Offline** in the Network tab throttling dropdown).
  5. Refresh the page:
     * Notice the platform continues to operate using its built-in client-side engine.
     * No blank white screen; no fatal unhandled exceptions.
* **Pass Criteria**:
  * [ ] Production cloud API returns HTTP 200 responses.
  * [ ] In offline/cold-start conditions, the application falls back gracefully.

---

## 4. Final Verification Sign-Off Sheet

Fill this sheet once testing is complete:

| Validation Item | Tested By | Date Tested | Status | Notes |
| :--- | :--- | :---: | :---: | :--- |
| **Authentication & RBAC** | | | [ ] PASS / [ ] FAIL | |
| **Command Center & S-Curve** | | | [ ] PASS / [ ] FAIL | |
| **Hero Study AYU-003** | | | [ ] PASS / [ ] FAIL | |
| **Sites Network (40 Sites)** | | | [ ] PASS / [ ] FAIL | |
| **24h Statutory SAE Clock** | | | [ ] PASS / [ ] FAIL | |
| **8-Stage Gated Safety** | | | [ ] PASS / [ ] FAIL | |
| **Data Quality & Queries** | | | [ ] PASS / [ ] FAIL | |
| **Protocol Deviations & CAPA**| | | [ ] PASS / [ ] FAIL | |
| **Ethics & CTRI Sandbox** | | | [ ] PASS / [ ] FAIL | |
| **HL7 FHIR R4 Payloads** | | | [ ] PASS / [ ] FAIL | |
| **CDISC SDTM / XML Export** | | | [ ] PASS / [ ] FAIL | |
| **ALCOA+ Audit Ledger** | | | [ ] PASS / [ ] FAIL | |
| **Mobile Responsiveness** | | | [ ] PASS / [ ] FAIL | |
| **Live Vercel & Render Cloud**| | | [ ] PASS / [ ] FAIL | |

> **Conclusion**:  
> If all 14 test suites pass, **AYUVISTA** is verified 100% operational, regulatory-grade, and ready for official evaluation at the **Smart India Hackathon (SIH)**.
