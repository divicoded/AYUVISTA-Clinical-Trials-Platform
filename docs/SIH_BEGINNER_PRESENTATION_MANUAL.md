# AYUVISTA — The Beginner's Complete SIH Hackathon Presentation Manual
## Zero-to-Hero Guide: How to Understand, Speak, and Present AYUVISTA to Win SIH

> **DO NOT PANIC!** Even if you have never built a healthcare app, never read a clinical trial protocol, or don't know what acronyms like "GCP", "CDISC", or "MedDRA" mean — **this manual tells you everything in plain, simple language**.
> Read this guide from start to finish before your pitch, and you will sound like a professional clinical data scientist in front of the judges.

---

## 1. The Story in Plain English: What is This Project & Why Does it Exist?

### What is AIIA?
* **AIIA** stands for the **All India Institute of Ayurveda**, located in New Delhi. It is the apex, #1 national institute for Ayurvedic medical research in India, operating under the **Ministry of Ayush** (equivalent to AIIMS, but for Ayurveda).
* AIIA is not just a hospital — it conducts clinical research on classical Ayurvedic medicines (like Ashwagandha, Guduchi, Curcuma, Triphala) to prove scientifically that they work.
* Crucially, AIIA is appointed by the Government of India as the **National Pharmacovigilance Coordination Centre (NPvCC)** for all ASU&H (Ayurveda, Siddha, Unani & Homoeopathy) drugs nationwide. This means AIIA is the national watchtower responsible for monitoring the safety and side-effects of traditional medicines across all of India.

### What is a Clinical Trial?
* Before any medicine can be approved and sold safely, doctors must test it on human volunteers in structured stages called **Phases**:
  * **Phase I**: Safety test on a small group ($20-80$ healthy volunteers).
  * **Phase II**: Efficacy and dosage test on patients ($100-300$ people).
  * **Phase III**: Large multicenter trial ($300-3000+$ patients across multiple hospitals in India) to confirm effectiveness and monitor adverse reactions.
* These trials take years, cost crores of rupees, and involve hundreds of doctors, clinical coordinators, monitors, and patients.

### What was the Big Problem Before Our Project?
1. **The Spreadsheet Nightmare**: Doctors at 40 different hospitals across India were tracking patients, clinical visits, and lab tests on manual Excel spreadsheets, paper forms, and email attachments. Nobody had a central dashboard to see if a trial was succeeding or failing.
2. **The 24-Hour Legal Trap (NDCT Rules 2019)**: Under Indian law (New Drugs and Clinical Trials Rules 2019), if a patient in a clinical trial has a **Serious Adverse Event (SAE)** — like sudden liver damage, severe allergy, or hospitalization — the hospital has **strictly 24 hours** to report it to the regulatory authority (CDSCO) and the Ethics Committee. In a paper/spreadsheet system, emails get lost or delayed, resulting in legal penalties, trial bans, and patient safety risks.
3. **The Global Rejection Problem**: When Indian researchers tried to publish their findings or register Ayurvedic drugs with the US FDA or WHO, their data was rejected. Why? Because global regulators only accept trial data formatted according to an international standard called **CDISC** (Clinical Data Interchange Standards Consortium). Indian institutes could not afford expensive multinational software like Veeva or Medidata ($100,000+$ license fees).
4. **The Privacy Problem (DPDP Act 2023)**: Keeping real patient names and phone numbers in shared spreadsheets violates India's Digital Personal Data Protection Act 2023.

### What Did We Build to Solve This?
We built **AYUVISTA** — a unified, cloud-native **Clinical Trial Management System (CTMS)** and **Pharmacovigilance Platform**:
* It gives doctors, monitors, ethics committees, and government leaders **one central dashboard**.
* It has an automated **24-Hour Expedited Safety Clock** that prevents missed legal deadlines.
* It automatically converts Ayurvedic trial data into international **CDISC SDTM** and **HL7 FHIR** standards in 1 click.
* It ensures 100% data integrity with an **immutable ALCOA+ audit trail** (every change is permanently recorded with who did it, when, and why).
* It protects patient privacy by using **synthetic de-identified tokens** (`SYN-P00001` through `SYN-P01520`).

---

## 2. Jargon Buster: Speak These Buzzwords in Front of Judges

When the judges ask you technical questions, using these exact terms will make your team stand out:

| Term | What it Stands For | How to Explain it in 1 Simple Sentence |
| :--- | :--- | :--- |
| **CTMS** | Clinical Trial Management System | The central software "operating system" that manages clinical trials, hospital sites, patient visits, and compliance. |
| **GCP / GCP-ASU** | Good Clinical Practice (Ayurveda, Siddha, Unani) | The ethical and quality standard guidelines set by the Government of India that all Ayurvedic trials must follow. |
| **NPvCC** | National Pharmacovigilance Coordination Centre | India's national safety surveillance center for traditional medicine, headquartered inside AIIA. |
| **CTRI** | Clinical Trials Registry – India | The mandatory government registry (`ctri.nic.in`) where every trial must be officially registered before patient #1 is enrolled. |
| **IEC** | Institutional Ethics Committee | The independent committee of doctors, scientists, and legal experts that approves the trial protocol before human testing begins. |
| **AE** | Adverse Event | Any untoward medical occurrence in a patient (e.g., mild rash, headache, nausea) that may or may not be caused by the drug. |
| **SAE** | Serious Adverse Event | A life-threatening event, hospitalization, or death. Triggers the mandatory **24-Hour statutory reporting countdown**. |
| **MedDRA** | Medical Dictionary for Regulatory Activities | The global medical dictionary used by all drug agencies so that "skin rash" or "urticaria" has the exact same numeric code worldwide. |
| **CDISC** | Clinical Data Interchange Standards Consortium | The universal standard format for clinical trial data required by international regulators like the US FDA and European EMA. |
| **SDTM** | Study Data Tabulation Model | Standardized CSV tables that organize trial data into specific domains (`DM` = Demographics, `AE` = Adverse Events, `SV` = Subject Visits). |
| **ADaM** | Analysis Data Model | Statistical datasets formatted specifically for biostatisticians to run safety and efficacy algorithms (e.g., `ADSL` Subject-Level Analysis). |
| **Define-XML** | Dataset Definition XML | The machine-readable XML "metadata dictionary" that tells regulatory computers how to read the CDISC datasets. |
| **HL7 FHIR R4** | Fast Healthcare Interoperability Resources | Modern JSON-based API standard used worldwide to exchange health records between hospitals, labs, and clinics. |
| **ABDM** | Ayushman Bharat Digital Mission | India's national digital health initiative (ABHA ID, digital consent). |
| **ALCOA+** | Attributable, Legible, Contemporaneous, Original, Accurate | The international gold standard for clinical data integrity: you must prove who changed data, when, why, and you can never delete history. |
| **DPDP Act 2023** | Digital Personal Data Protection Act | India's privacy law mandating that clinical research participants must never have their real personal identities exposed. |

---

## 3. The 3-Minute Live Demo Playbook (Exactly What to Click & Say)

During your presentation, one team member should speak while another operates the laptop. Follow this script step-by-step:

### Step 1: Open the Command Center (`/`) — Time: 30 Seconds
* **What you see on screen**: The main dashboard at `http://localhost:5173`.
* **What to point at**:
  * Point at the top greeting and live IST clock (`Header.tsx`).
  * Point at the 5 pastel metric cards: $25$ Active Protocols, $1,520$ Participants, $40$ Sites, $14$ Open Queries, $80$ Safety Events.
  * Point at the **Red Operational Alert Banner** for Hero Study `AYU-003`.
* **What to say**:
  > *"Judges, this is the AYUVISTA Portfolio Command Center. Right away, our algorithmic risk engine flags Hero Study **AYU-003** — a Phase III trial of Guduchi and Pippali — with a critical risk score of 78.5 out of 100. The dashboard alerts the director to three simultaneous issues: recruitment is lagging target by 44%, the Bengaluru trial site is overdue for a monitoring audit, and an active Serious Adverse Event has triggered a 24-hour statutory clock."*

### Step 2: Open the Overdue Site in the Sites Module (`/sites`) — Time: 45 Seconds
* **What you click**: Click **Sites** on the left sidebar.
* **What you see**: A table of 40 trial sites across India. Look for `SITE-BLR-02` (Bengaluru Ayush Specialty Center) with the red pulse badge `OVERDUE ACTION`.
* **What you click**: Click on the Bengaluru row (`SITE-BLR-02`).
* **What opens**: The spacious 4-tab slide-out drawer (`max-w-4xl`).
* **What to click inside the drawer**:
  * Click **Tab 2 (Data Queries)**: Show the open discrepancy queries.
  * Click **Tab 4 (CRA Monitoring)**: Point to the overdue visit `MON-2026-001`.
  * Click the green button **"Schedule On-Site Audit Visit"**.
  * Enter Monitor Name: `"Dr. Rajesh Nair"`, select Date, and click **"Schedule Audit Visit"**.
  * *Watch the celebratory confetti trigger!*
* **What to say**:
  > *"Instead of scrolling through cramped boxes, our Material 3 slide-out drawer gives full visibility into the site. We see that Bengaluru has 14 unresolved data queries. As a Clinical Monitor, I can immediately schedule an on-site audit visit. When I submit, the site monitoring status automatically transitions from OVERDUE ACTION to PENDING VISIT, and an ALCOA+ audit record is contemporaneously written to the ledger."*

### Step 3: Open the Safety Module & 24h Regulatory Clock (`/safety`) — Time: 45 Seconds
* **What you click**: Click **Safety / PV** on the left sidebar.
* **What you see**:
  * The top **24-Hour Expedited Safety Clock** banner counting down in real-time.
  * Case `PV-2026-0031` (Transaminitis & Acute Urticaria).
* **What you click**: Click **"Review & Advance Workflow →"** on Case `PV-2026-0031`.
* **What opens**: The 8-stage gated safety workflow stepper (`Step 3 of 8 • 37.5%`).
* **What to show**:
  * Click **Step 4 (CODING)** in the stepper.
  * Show the **MedDRA Dictionary Lookup** button. Click it, search `"urticaria"`, select code `10046735`, and apply it.
  * Show that the advancement gate is now unlocked!
  * Click **Step 5 (CAUSALITY_REVIEW)**. Show the 6 WHO-UMC causality buttons (`Certain`, `Probable`, `Possible`, etc.). Click **"Probable"**.
* **What to say**:
  > *"Now we look at our crown jewel: the Pharmacovigilance module. Notice the live 24-hour countdown clock on Case PV-2026-0031, compliant with NDCT Rules 2019.  
  > Notice the workflow is strictly gated: an investigator cannot skip steps. At Step 4, the MedDRA gate enforces international medical coding so the term 'Urticaria' is recognized globally. At Step 5, doctors must select a WHO-UMC causality category before the statutory Form 44 dossier can be submitted to regulatory authorities."*

### Step 4: Show the CDISC Reports & Exports (`/reports`) — Time: 30 Seconds
* **What you click**: Click **Reports & Exports** on the left sidebar.
* **What you see**: The CDISC SDTM domain cards (`DM`, `AE`, `DS`, `SV`, `ADSL`, `DEFINE-XML`).
* **What you click**: Click the **Download (CSV)** button on `DM (Demographics)`. The browser immediately downloads `SDTM_DM.csv`!
* **What to say**:
  > *"When it is time to submit this trial to regulatory agencies like CDSCO or the US FDA, NEXUS generates complete, submission-ready CDISC SDTM packages and Define-XML in one click directly from our database, eliminating the need for expensive proprietary software licenses."*

### Step 5: Show the ALCOA+ Audit Trail (`/audit`) — Time: 30 Seconds
* **What you click**: Click **Audit Trail** on the left sidebar.
* **What you see**: The immutable ledger table with actor initials, role, timestamp, action, and diff viewer.
* **What you click**: Click **"View Diff →"** on the top row.
* **What opens**: The before/after JSON state diff viewer.
* **What to say**:
  > *"Finally, every single action we just performed — scheduling the visit, assigning the MedDRA code, and transitioning the study — is captured here in our append-only ALCOA+ audit trail. Notice the exact before and after JSON diffs. No record can ever be deleted, satisfying 21 CFR Part 11 and GCP-ASU forensic compliance."*

---

## 4. The 8 Clinical Roles & How to Switch Between Them

In the top-right header, there is an **Instant Role Switcher button** (`Role: PRINCIPAL INVESTIGATOR`). You can click it at any time to demonstrate Role-Based Access Control (RBAC):

1. **Principal Investigator (PI)** (`pi@aiia.demo`):
   * *Job*: The lead doctor responsible for the clinical trial.
   * *What they do in NEXUS*: Reviews protocol health, evaluates risk scores, answers data discrepancies.
2. **Study Coordinator (CRC)** (`coordinator@aiia.demo`):
   * *Job*: The on-site coordinator who interacts with patients daily.
   * *What they do in NEXUS*: Enrolls participants, tracks visits, records consent, logs eCRF data.
3. **Clinical Monitor (CRA)** (`monitor@aiia.demo`):
   * *Job*: The independent auditor who visits hospital sites to verify source records.
   * *What they do in NEXUS*: Schedules on-site monitoring visits, reviews open queries, logs deviations and CAPA.
4. **Pharmacovigilance Officer (PV)** (`pv@aiia.demo`):
   * *Job*: Safety doctor monitoring drug side-effects.
   * *What they do in NEXUS*: Monitors the 24h SAE countdown clock, performs MedDRA coding, establishes WHO-UMC causality.
5. **Ethics Committee (IEC)** (`ethics@aiia.demo`):
   * *Job*: The institutional committee that protects patient safety and ethics.
   * *What they do in NEXUS*: Reviews initial protocol submissions, checks continuing review renewals, tracks CTRI filings.
6. **Institutional Leadership / Director** (`leadership@aiia.demo`):
   * *Job*: The Director and Deans of AIIA and Ministry of Ayush officials.
   * *What they do in NEXUS*: Executive portfolio view, national recruitment trends, institutional risk matrix.
7. **Regulatory Auditor** (`regulator@aiia.demo`):
   * *Job*: Government drug inspector (e.g., from CDSCO or Ayush Ministry).
   * *What they do in NEXUS*: Read-only access to verify the cryptographic ALCOA+ audit ledger.
8. **System Administrator** (`admin@aiia.demo`):
   * *Job*: IT administrator managing user credentials and system health.

*(All test accounts share the standard password: `Nexus@AIIA2026`).*

---

## 5. How SIH Judges Score You & How to Maximize Points

SIH evaluation typically follows 5 key scoring buckets:

| Scoring Criteria | Weight | How AYUVISTA Wins Max Points | What to Say |
| :--- | :---: | :--- | :--- |
| **Problem Understanding & Relevance** | 20% | Demonstrates deep knowledge of Ayush Ministry, NPvCC mandate, CTRI rules, and GCP-ASU. | *"We didn't build a toy app; we studied the exact statutory mandates of AIIA as the National Pharmacovigilance Centre."* |
| **Innovation & Novelty** | 25% | First platform to bridge classical multi-herb Ayurvedic research with modern CDISC SDTM and HL7 FHIR formats. | *"We bring US FDA-level CDISC data standardization to India's traditional medicine without multi-crore licensing fees."* |
| **Technical Architecture & Completeness** | 25% | Full-stack working prototype: Python FastAPI backend + React TypeScript frontend + ALCOA+ audit ledger + live 24h clock. | *"Our solution is fully functional today — 25 studies, 40 sites, 1520 participants, all running live on our local servers."* |
| **Scalability & Security** | 15% | Relational schema, append-only immutable ledger, DPDP 2023 synthetic tokenization, and ABDM sandbox readiness. | *"Architected to scale from AIIA to the National Ayush Grid (NIA Jaipur, IPGTRA Jamnagar) with 100% data residency."* |
| **Presentation & Live Demo** | 15% | Smooth Material 3 Expressive UI, zero glitches, crisp timing, and bulletproof Q&A defense. | Confident delivery following the 3-minute demo script. |

---

## 6. Emergency Troubleshooting Cheat Sheet (What if something happens during demo?)

1. **What if the backend server stops?**
   * Open PowerShell in `d:\Project\AIIA\backend` and run:
     `& "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe" -m uvicorn app.main:app --host 0.0.0.0 --port 8000`
   * Backend Swagger API docs will immediately be live at: `http://localhost:8000/docs`
2. **What if the frontend stops?**
   * Open PowerShell in `d:\Project\AIIA\frontend` and run:
     `npm.cmd run dev`
   * Frontend will be live at: `http://localhost:5173`
3. **What if you forget your password on the login screen?**
   * Don't worry! On the login page at `http://localhost:5173/login`, you do not even need to type. Just **click on any of the 8 pastel role cards** (e.g. Principal Investigator or PV Officer) and it will log you in instantly!
4. **What if the judges ask to see code?**
   * Open VS Code or show the clean folder structure:
     * Backend: `d:\Project\AIIA\backend\app\api\` (clean modular routes: `studies.py`, `safety.py`, `sites.py`, `interop.py`, `exports.py`).
     * Frontend: `d:\Project\AIIA\frontend\src\pages\` (`CommandCenter.tsx`, `Safety.tsx`, `Sites.tsx`, `AuditTrail.tsx`).
     * Tests: Show `pytest tests/test_api.py -v` passing with exit code 0!

