# AYUVISTA

## Unified Clinical Research & Pharmacovigilance Platform for AYUSH
### All India Institute of Ayurveda (AIIA) • National Pharmacovigilance Coordination Centre (NPvCC) • Ministry of Ayush, Government of India

[![Smart India Hackathon](https://img.shields.io/badge/SIH-2026%20Edition-FF6F00?style=for-the-badge&logo=target)](https://sih.gov.in)
[![Vercel Frontend](https://img.shields.io/badge/Vercel-Production%20Live-black?style=for-the-badge&logo=vercel)](https://ayuvista-ctms.vercel.app)
[![Render Backend](https://img.shields.io/badge/Render-FastAPI%20Live-46E3B7?style=for-the-badge&logo=render)](https://ayuvista-backend.onrender.com/docs)
[![Docker Ready](https://img.shields.io/badge/Docker-Compose%20Ready-2496ED?style=for-the-badge&logo=docker)](./docker-compose.yml)
[![GCP Compliant](https://img.shields.io/badge/GCP--ASU-Compliant-0B4D3C?style=for-the-badge)](https://ayush.gov.in)
[![CDISC Standards](https://img.shields.io/badge/CDISC-SDTM%20v3.3%20%7C%20ADaM-0284C7?style=for-the-badge)](https://cdisc.org)
[![HL7 FHIR](https://img.shields.io/badge/HL7-FHIR%20R4-D97706?style=for-the-badge)](https://hl7.org/fhir)
[![DPDP Act 2023](https://img.shields.io/badge/DPDP%202023-Synthetic%20Tokenized-16A34A?style=for-the-badge)](https://meity.gov.in)

---

## 🌐 Live Cloud Deployments

| Component | Production URL | Documentation & Status |
| :--- | :--- | :--- |
| **Frontend Web App (Vercel)** | **[https://ayuvista-ctms.vercel.app](https://ayuvista-ctms.vercel.app)** | Complete Material 3 UI, mobile-responsive, 1-click role switcher |
| **Backend API (Render)** | **[https://ayuvista-backend.onrender.com](https://ayuvista-backend.onrender.com)** | Interactive Swagger UI: [https://ayuvista-backend.onrender.com/docs](https://ayuvista-backend.onrender.com/docs) |
| **GitHub Repository** | **[github.com/divicoded/AYUVISTA-Clinical-Trials-Platform](https://github.com/divicoded/AYUVISTA-Clinical-Trials-Platform)** | Clean public repository, verified tests, docker-compose ready |

---

## 🏆 Smart India Hackathon (SIH) Master Documentation

| Document | Description |
| :--- | :--- |
| 🧪 **[Complete QA & System Testing Manual](./docs/COMPLETE_TESTING_AND_QA_MANUAL.md)** | **Step-by-step verification playbook**: 14 testing suites with exact click steps, pass criteria, and verification sign-off sheet for testers and judges. |
| 📋 **[Official SIH 8-Slide PPT & Infographics Blueprint](./docs/SIH_OFFICIAL_TEMPLATE_PPT_INFOGRAPHICS.md)** | **Strict official SIH presentation template**: visual card layouts, metric counters, speaker scripts, judge Q&A defense, and Slide 8 Research & References. |
| 📊 **[SIH Master PPT & Pitch Deck Guide](./docs/SIH_PRESENTATION_DECK_PPT_MATERIAL.md)** | Complete 11-slide presentation deck with comprehensive data points and research citations. |
| 🎓 **[SIH Beginner's Presentation Manual](./docs/SIH_BEGINNER_PRESENTATION_MANUAL.md)** | Plain-English project narrative, 3-minute live demo sequence, jargon buster, and role breakdown. |
| 🚀 **[GitHub, Docker & Cloud Deployment Guide](./docs/GITHUB_AND_DOCKER_DEPLOYMENT_GUIDE.md)** | Step-by-step commands to push code, test with Docker Compose, and configure Vercel/Render. |
| 🌟 **[Complete Beginner's Handbook](./docs/BEGINNERS_HANDBOOK.md)** | Comprehensive module-by-module documentation explaining every screen, API, and database entity. |
| 🏛️ **[Master System Architecture](./docs/PRODUCT_ARCHITECTURE.md)** | Full technical design specifications, RBAC matrix, and compliance architecture. |
| 🔌 **[Interactive API Design](./docs/API_DESIGN.md)** | REST endpoint catalog with request/response schemas. |
| 🗄️ **[Database Design & Schemas](./docs/DATABASE_DESIGN.md)** | Entity relational models, table attributes, and foreign keys. |
| 🎭 **[Live Demo Scenario (AYU-003)](./docs/DEMO_SCENARIO.md)** | Live 9-act demonstration script tracking Hero Study `AYU-003`. |

---

## ⚡ Quick Start: How to Run the Platform Locally

### Option 1: Run with Docker (Recommended for Evaluators)
```powershell
docker compose up --build -d
```
* Frontend SPA: `http://localhost:5173` (or `http://localhost`)
* Backend API & Swagger Docs: `http://localhost:8000/docs`

---

### Option 2: 1-Click Windows Launcher
Double-click `start.bat` in the project root, or execute in PowerShell:
```powershell
d:\Project\AIIA\run.ps1
```

---

### Option 3: Manual Startup

**Terminal 1 - FastAPI Backend**:
```powershell
cd d:\Project\AIIA\backend
& "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe" -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
* Backend API: `http://localhost:8000`
* Interactive Swagger Docs: `http://localhost:8000/docs`

**Terminal 2 - React Frontend**:
```powershell
cd d:\Project\AIIA\frontend
npm.cmd run dev
```
* Frontend Application: `http://localhost:5173`

---

## 🔑 Instant Demo Login Presets

All demo accounts share the password: `Nexus@AIIA2026`  
*(On the login screen, click any of the 8 pastel role cards for instant 1-click authentication!)*

| Role | Email | Best Used For Showing |
| :--- | :--- | :--- |
| **Principal Investigator** | `pi@aiia.demo` | Protocol oversight, risk evaluation, query answering |
| **Study Coordinator** | `coordinator@aiia.demo` | Participant enrollment, visit scheduling, eCRF entries |
| **Clinical Monitor (CRA)** | `monitor@aiia.demo` | Site inspection visits, SDV, deviation and CAPA management |
| **Pharmacovigilance Officer** | `pv@aiia.demo` | **Live 24h statutory SAE countdown clock**, MedDRA coding gate |
| **Ethics Committee (IEC)** | `ethics@aiia.demo` | Protocol approval review, continuing review oversight |
| **Institutional Leadership** | `leadership@aiia.demo` | Executive portfolio KPIs, CTRI registry compliance |
| **Regulatory Auditor** | `regulator@aiia.demo` | Read-only **ALCOA+ audit trail inspection** |
| **System Administrator** | `admin@aiia.demo` | Full administrative controls |

---

## 🛡️ Synthetic Data & Privacy Notice
In compliance with the **Digital Personal Data Protection (DPDP) Act 2023**, all clinical trials, hospital sites, patient records (`SYN-Pxxxxx`), adverse event cases, and regulatory records in this prototype are **synthetic and de-identified**. External regulatory gateways (CTRI, ABDM, Hospital HIS, MedDRA) are simulated via labeled sandbox adapters.
