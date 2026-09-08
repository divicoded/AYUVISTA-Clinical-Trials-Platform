# AYUVISTA - GitHub, Docker & Cloud Deployment Master Guide
## Everything You Need to Know for Your Smart India Hackathon (SIH) Submission

> **Summary**:  
> * **Do you need GitHub for SIH?** **YES, 100% MANDATORY.** SIH evaluators require a public GitHub repository link where they verify your codebase, commit history, and technical architecture.  
> * **Do you need Docker for SIH?** **STRONGLY RECOMMENDED.** Having a functional `Dockerfile` and `docker-compose.yml` sets your team apart from 90% of competitors. Technical evaluators run `docker compose up` to verify that your app runs out-of-the-box on any laptop without dependency errors.

---

## 1. Step-by-Step GitHub Setup Guide (Copy-Paste Commands)

### Step 1.1: Create a New Repository on GitHub
1. Go to [github.com](https://github.com) and log in.
2. Click the **`+`** icon in the top-right corner $\rightarrow$ **New repository**.
3. Name your repository:  
   `AYUVISTA-Clinical-Trials-Platform` (or `AYUVISTA-CTMS`).
4. Set visibility to **Public** (SIH judges must be able to view it without login).
5. **Do NOT** check "Add a README file" or "Add .gitignore" (we already created them locally).
6. Click **Create repository**.
7. Copy your repository URL (e.g., `https://github.com/your-username/AYUVISTA-Clinical-Trials-Platform.git`).

---

### Step 1.2: Initialize Git & Push Your Local Code
Open **PowerShell** on your computer, navigate to `d:\Project\AIIA`, and run these commands one by one:

```powershell
# 1. Navigate to your project folder
cd d:\Project\AIIA

# 2. Initialize Git
git init

# 3. Add all files to staging (our .gitignore will automatically exclude node_modules and temp files)
git add .

# 4. Create your initial commit
git commit -m "feat: initial release of AYUVISTA - GCP & CDISC Clinical Trials Platform for SIH"

# 5. Set main branch
git branch -M main

# 6. Link your local project to your GitHub repository (replace with YOUR repository URL!)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/AYUVISTA-Clinical-Trials-Platform.git

# 7. Push all code to GitHub
git push -u origin main
```

*(If Git asks you to authenticate, sign in with your GitHub account in the browser pop-up).*

---

### Step 1.3: How to Update Your GitHub Repository Later
Whenever you make any changes to the code or documentation in the future:
```powershell
cd d:\Project\AIIA
git add .
git commit -m "docs: updated presentation materials and UI polish"
git push
```

---

## 2. Docker Setup & Demonstration Guide

We have already configured:
* `backend/Dockerfile`: Lightweight Python 3.12 image with FastAPI, healthcheck, and auto-seeding database.
* `frontend/Dockerfile`: Multi-stage build (Node 20 build $\rightarrow$ lightweight Nginx alpine server).
* `frontend/nginx.conf`: Nginx reverse proxy routing API calls to `http://backend:8000/api/` with SPA history fallback.
* `docker-compose.yml`: Root multi-container orchestration.

---

### How to Run the Entire Platform with 1 Docker Command
If a judge asks: *"Can I run this on my machine?"* or if you have Docker Desktop installed:

```powershell
cd d:\Project\AIIA

# Build and start both backend and frontend containers
docker compose up --build -d
```

### What Happens Behind the Scenes:
1. Docker builds the Python FastAPI backend and starts it on port `8000`.
2. The backend automatically initializes and seeds the clinical database with 25 studies, 40 sites, and 1,520 participants.
3. Docker compiles the React TypeScript frontend into production HTML/CSS/JS and serves it via Nginx on port `5173` (and port `80`).
4. You can open your browser at:  
   * Web Application: `http://localhost:5173` (or `http://localhost`)
   * Interactive Backend API Docs: `http://localhost:8000/docs`

### How to Stop the Containers:
```powershell
docker compose down
```

---

## 3. What Else Do You Need for an Outstanding SIH Submission?

To score maximum points in the evaluation matrix, ensure your GitHub repository has these 5 elements:

### 1. High-Impact GitHub README with Badges
We will update your root `README.md` to include:
* Technology badges (FastAPI, React, TypeScript, Docker, Tailwind CSS).
* Standards badges (`GCP-ASU`, `CDISC SDTM`, `HL7 FHIR R4`, `DPDP Act 2023`).
* 1-line summary of the problem and solution.
* Quick Start instructions (both `docker compose up` and manual local commands).
* Table of seeded test accounts with passwords.

### 2. A 2 to 3 Minute Video Demo (Unlisted YouTube / Loom Link)
* Evaluators often review 50+ projects in a few hours. A clear video demonstration link in your README ensures they see the app in action even before cloning the repo.
* **What to record in the video**:
  1. *0:00 - 0:30*: Show the Command Center and explain the problem.
  2. *0:30 - 1:15*: Show the Bengaluru site and schedule a CRA audit.
  3. *1:15 - 2:00*: Show the Pharmacovigilance 24h safety clock and MedDRA gate.
  4. *2:00 - 2:30*: Show the 1-click CDISC SDTM download and ALCOA+ audit trail.
  5. *2:30 - 3:00*: Conclude with the national impact for the Ministry of Ayush.

### 3. Live Cloud Hosting (Judges Can Test on Any Phone or Laptop)
The platform is fully hosted and accessible worldwide:
* **Frontend SPA (Vercel)**: **[https://ayuvista-ctms.vercel.app](https://ayuvista-ctms.vercel.app)**
* **Backend API (Render)**: **[https://ayuvista-backend.onrender.com](https://ayuvista-backend.onrender.com)** (Interactive docs at `/docs`)
* **GitHub Repository**: **[https://github.com/divicoded/AYUVISTA-Clinical-Trials-Platform](https://github.com/divicoded/AYUVISTA-Clinical-Trials-Platform)**
* **Automatic Standalone Engine**: If the cloud backend is sleeping or offline, the frontend automatically falls back to its built-in client-side mock engine (`mockData.ts`), guaranteeing zero 405/network errors.

### 4. Repository Structure Checklist
Your repository contains:
```
AYUVISTA/
├── backend/
│   ├── app/                 # FastAPI routes, models, services, RBAC
│   ├── tests/               # Pytest automated test suite
│   ├── Dockerfile           # Backend container definition
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/                 # React components, pages, context, mockData
│   ├── Dockerfile           # Multi-stage Node/Nginx container definition
│   ├── nginx.conf           # Reverse proxy configuration
│   ├── vercel.json          # Vercel SPA routing configuration
│   └── package.json         # Node dependencies
├── docs/
│   ├── SIH_OFFICIAL_TEMPLATE_PPT_INFOGRAPHICS.md # Official SIH 8-Slide template & infographics
│   ├── SIH_PRESENTATION_DECK_PPT_MATERIAL.md     # Master 11-slide pitch deck kit
│   ├── SIH_BEGINNER_PRESENTATION_MANUAL.md       # Zero-to-hero pitch manual & Q&A
│   ├── GITHUB_AND_DOCKER_DEPLOYMENT_GUIDE.md     # This deployment guide
│   ├── PRODUCT_ARCHITECTURE.md                   # System technical design
│   ├── API_DESIGN.md                             # Endpoint specification
│   ├── DATABASE_DESIGN.md                        # Schema and ERD documentation
│   └── DEMO_SCENARIO.md                          # Hero study AYU-003 scenario
├── .gitignore               # Clean repository filter
├── docker-compose.yml       # 1-command local orchestration
├── render.yaml              # 1-click Render.com cloud backend definition
├── vercel.json              # Root Vercel SPA deployment configuration
├── README.md                # Comprehensive project documentation
├── run.ps1                  # 1-click PowerShell local launcher
└── start.bat                # 1-click Windows CMD local launcher
```


