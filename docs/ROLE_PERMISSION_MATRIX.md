# AYUVISTA — Role-Based Access Control (RBAC) Matrix

## 1. System Roles Definition
AYUVISTA strictly enforces server-side role authorization at the FastAPI dependency level (`Depends(require_role(...))`) in addition to UI menu visibility and read/write guards.

| Role Code | Role Title | Primary Functional Scope |
| :--- | :--- | :--- |
| `ADMIN` | System Administrator | Full administrative control, system settings, user provisioning, dictionary maintenance, audit trail governance. |
| `PRINCIPAL_INVESTIGATOR` | Principal Investigator (PI) | Protocol authoring, study oversight, study health review, safety case review, ethics amendments, regulatory milestone sign-off. |
| `STUDY_COORDINATOR` | Study Coordinator (CRC) | Participant recruitment, screening, consent management, visit scheduling, eCRF data entry, query resolution, task execution. |
| `MONITOR` | Clinical Research Associate (CRA) | Site monitoring visits, protocol deviation logging, source data verification (SDV), issuing data queries, site performance tracking. |
| `ETHICS` | Institutional Ethics Committee (IEC) | Reviewing initial submissions, continuing reviews, approving protocol amendments, evaluating serious adverse event alerts. |
| `PHARMACOVIGILANCE` | Pharmacovigilance / Safety Officer | Adverse event intake, medical coding (MedDRA adapter), SAE causality assessment, expedited reporting clock tracking, signal detection. |
| `LEADERSHIP` | Institutional Director / Dean | Executive portfolio health, study risk index, cross-institutional recruitment metrics, compliance summaries, high-level reports. |
| `REGULATOR_READ_ONLY` | Regulatory Inspector / Auditor | Read-only access across studies, participant records, audit trail explorer, ALCOA+ compliance evidence, export validation. |

---

## 2. Granular Module Permission Matrix

| Module / Operation | Admin | PI | Coordinator | Monitor | Ethics | PV | Leadership | Regulator |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Command Center** | Full | Full | Assigned | Assigned | Summary | Safety | Executive | Read-Only |
| **Study Management** | Full | Create/Edit | Read | Read | Read | Read | Read | Read-Only |
| **Study Lifecycle Transition** | Full | Yes | No | No | Approvals | No | No | Read-Only |
| **Site Management** | Full | Read | Read | Read/Score | Read | Read | Read | Read-Only |
| **Participant Management** | Full | Read | Full | Read | Read (De-id) | Safety | Summary | Read-Only |
| **Visit Tracking** | Full | Read | Full | Verify | No | Read | Summary | Read-Only |
| **Data Queries** | Full | Review | Answer | Issue/Close | No | Read | Summary | Read-Only |
| **Monitoring Visits** | Full | Read | Read | Schedule/Log | Read | Read | Summary | Read-Only |
| **Protocol Deviations** | Full | Review/CAPA | Log | Log/CAPA | Review | Review | Summary | Read-Only |
| **Ethics & IEC Review** | Full | Submit | Read | Read | Decide/Sign | Read | Summary | Read-Only |
| **CTRI Registration Hub** | Full | Submit/Sync | Read | Read | Read | Read | Summary | Read-Only |
| **Regulatory Milestones** | Full | Sign-off | Update | Read | Read | Update | Summary | Read-Only |
| **Safety / AE Cases** | Full | Review | Log | Log | Review SAE | Full Lifecycle | Summary | Read-Only |
| **SAE Reporting Clock** | Full | Review | View | View | Review | Oversee/Submit | Summary | Read-Only |
| **Safety Signal Detection**| Full | Review | No | No | Review | Full Analytics| Summary | Read-Only |
| **Interoperability (FHIR/EDC)**| Full | Read | Demo Sync | No | No | No | Read | Read-Only |
| **CDISC / SDTM Export** | Full | Export | Export | Export | Export | Export | Export | Read-Only |
| **Audit Trail Explorer** | Full | Study Level| No | Site Level | IEC Level | PV Level | Full | Full Read |
| **Data Integrity (ALCOA+)**| Full | Read | Read | Read | Read | Read | Read | Read-Only |

---

## 3. Demo User Accounts Seeded

All demo accounts share the standard development password: `Nexus@AIIA2026`

1. **Admin**: `admin@aiia.demo`
2. **Principal Investigator**: `pi@aiia.demo` (Prof. Dr. Suhas Kumar)
3. **Study Coordinator**: `coordinator@aiia.demo` (Dr. Ananya Sharma)
4. **Clinical Monitor**: `monitor@aiia.demo` (Mr. Rajesh Nair)
5. **Ethics Committee**: `ethics@aiia.demo` (Dr. Meenakshi Sundaram)
6. **Pharmacovigilance**: `pv@aiia.demo` (Dr. Vikramaditya Joshi)
7. **Institutional Leadership**: `leadership@aiia.demo` (Prof. Tanuja Nesari)
8. **Regulator / Auditor**: `regulator@aiia.demo` (Dr. Arvind Verma)

