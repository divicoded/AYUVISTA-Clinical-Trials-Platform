import random
from datetime import datetime, date, timedelta, timezone
from sqlalchemy.orm import Session
from app.core.security import get_password_hash
from app.models.enums import (
    UserRole, StudyStatus, LifecycleStage, RiskLevel, SiteStatus,
    ParticipantStatus, ConsentStatus, VisitStatus, QuerySeverity,
    QueryStatus, MonitoringStatus, DeviationSeverity, DeviationStatus,
    IECDecision, AESeverity, AEExpectedness, AECausality,
    SafetyWorkflowState, SignalState, TaskPriority, TaskStatus
)
from app.models.user import User
from app.models.study import Study
from app.models.site import Site, StudySite
from app.models.participant import Participant, Consent
from app.models.visit import Visit
from app.models.query import DataQuery
from app.models.monitoring import MonitoringVisit
from app.models.deviation import ProtocolDeviation
from app.models.ethics import EthicsSubmission, CTRIRegistration, RegulatoryMilestone
from app.models.safety import SafetyCase, SafetySignal
from app.models.task import OperationalTask
from app.models.audit import AuditEvent

def seed_database(db: Session):
    # Check if database is already seeded
    if db.query(User).first():
        return

    print("Seeding AYUVISTA Database with synthetic clinical data...")
    password_hash = get_password_hash("Nexus@AIIA2026")

    # 1. Demo Users
    demo_users_data = [
        ("admin@aiia.demo", "System Administrator", UserRole.ADMIN, "IT & Research Informatics"),
        ("pi@aiia.demo", "Prof. Dr. Suhas Kumar", UserRole.PRINCIPAL_INVESTIGATOR, "Department of Kayachikitsa"),
        ("coordinator@aiia.demo", "Dr. Ananya Sharma", UserRole.STUDY_COORDINATOR, "Clinical Research Coordination Cell"),
        ("monitor@aiia.demo", "Mr. Rajesh Nair", UserRole.MONITOR, "Clinical Monitoring Unit"),
        ("ethics@aiia.demo", "Dr. Meenakshi Sundaram", UserRole.ETHICS, "Institutional Ethics Committee"),
        ("pv@aiia.demo", "Dr. Vikramaditya Joshi", UserRole.PHARMACOVIGILANCE, "Pharmacovigilance & Safety Cell"),
        ("leadership@aiia.demo", "Prof. Tanuja Nesari", UserRole.LEADERSHIP, "Directorate / Executive Office"),
        ("regulator@aiia.demo", "Dr. Arvind Verma", UserRole.REGULATOR_READ_ONLY, "Regulatory Inspection Bureau"),
    ]

    users = {}
    for email, name, role, dept in demo_users_data:
        u = User(
            email=email,
            full_name=name,
            hashed_password=password_hash,
            role=role,
            department=dept,
            is_active=True
        )
        db.add(u)
        users[email] = u
    db.commit()

    # 2. Institutional Sites (40 Sites)
    site_names = [
        ("SITE-DEL-01", "AIIA Apex Clinical Research Center", "All India Institute of Ayurveda", "New Delhi", "Delhi"),
        ("SITE-BLR-02", "Bengaluru Ayush Specialty Center", "National Institute of Ayurveda Extension", "Bengaluru", "Karnataka"),
        ("SITE-JPR-03", "National Institute of Ayurveda Hospital", "National Institute of Ayurveda", "Jaipur", "Rajasthan"),
        ("SITE-BOM-04", "Podar Ayurvedic Medical College & Hospital", "Govt Ayurvedic College", "Mumbai", "Maharashtra"),
        ("SITE-VNS-05", "BHU Faculty of Ayurveda Clinical Research Facility", "Banaras Hindu University", "Varanasi", "Uttar Pradesh"),
        ("SITE-PUN-06", "Pune Clinical Ayurveda Collaborative Site", "Tilak Ayurved Mahavidyalaya", "Pune", "Maharashtra"),
        ("SITE-TRV-07", "Kerala Ayurvedic Research Institute", "Govt Ayurveda College", "Thiruvananthapuram", "Kerala"),
        ("SITE-KOL-08", "JB Roy State Ayurvedic Medical Hospital", "West Bengal University of Health Sciences", "Kolkata", "West Bengal"),
        ("SITE-CHN-09", "National Institute of Siddha & Integrative Research", "NIS", "Chennai", "Tamil Nadu"),
        ("SITE-HYD-10", "Govt Ayurvedic Hospital & Research Unit", "Dr. BRKR Govt Ayurvedic College", "Hyderabad", "Telangana"),
    ]
    # Generate remaining up to 40 sites
    cities = [("Ahmedabad", "Gujarat"), ("Lucknow", "Uttar Pradesh"), ("Bhopal", "Madhya Pradesh"),
              ("Patna", "Bihar"), ("Chandigarh", "Punjab"), ("Guwahati", "Assam"),
              ("Bhubaneswar", "Odisha"), ("Dehradun", "Uttarakhand"), ("Ranchi", "Jharkhand"), ("Raipur", "Chhattisgarh")]
    
    for i in range(11, 41):
        c_name, s_name = cities[(i - 11) % len(cities)]
        site_names.append((
            f"SITE-IND-{i:02d}",
            f"{c_name} Integrative Ayush Center",
            f"Regional Ayurveda Research Institute, {c_name}",
            c_name,
            s_name
        ))

    sites = []
    for code, name, inst, city, state in site_names:
        s = Site(
            site_code=code,
            site_name=name,
            institution=inst,
            city=city,
            state=state,
            principal_investigator_name=f"Dr. {city} Lead Investigator",
            site_coordinator_name=f"Coordinator {city}",
            activation_date=date(2025, 1, 15),
            status=SiteStatus.ACTIVE,
            target_enrollment=50,
            monitoring_status="OVERDUE_ACTION" if code == "SITE-BLR-02" else ("PENDING_VISIT" if code == "SITE-JPR-03" else "COMPLIANT")
        )
        db.add(s)
        sites.append(s)
    db.commit()

    # 3. Clinical Studies (25 Studies, with Hero Study AYU-003)
    studies_data = [
        {
            "code": "AYU-003",
            "title": "Multicenter Randomized Controlled Trial of Standardized Guduchi (Tinospora cordifolia) and Pippali (Piper longum) Formulation in Post-Viral Fatigue and Metabolic Syndrome",
            "short_title": "Guduchi-Pippali Formulation in Metabolic Syndrome",
            "study_type": "Interventional",
            "intervention_type": "Herbo-mineral Formulation",
            "phase": "Phase II/III",
            "target": 250,
            "current": 105,
            "status": StudyStatus.ACTIVE,
            "stage": LifecycleStage.TREATMENT,
            "risk_score": 78.5,
            "risk_level": RiskLevel.AT_RISK,
            "primary": "Evaluate changes in HOMA-IR and Chalder Fatigue Scale at Week 12 relative to baseline.",
            "therapeutic_area": "Metabolic & Post-Viral Immunology"
        },
        {
            "code": "AYU-001",
            "title": "Double-blind Placebo-controlled Trial of Ashwagandha (Withania somnifera) Extract in Chronic Insomnia and Neurocognitive Stress",
            "short_title": "Ashwagandha in Chronic Insomnia",
            "study_type": "Interventional",
            "intervention_type": "Standardized Herbal Extract",
            "phase": "Phase III",
            "target": 180,
            "current": 172,
            "status": StudyStatus.ACTIVE,
            "stage": LifecycleStage.TREATMENT,
            "risk_score": 18.0,
            "risk_level": RiskLevel.HEALTHY,
            "primary": "Improvement in Pittsburgh Sleep Quality Index (PSQI) score.",
            "therapeutic_area": "Neuropsychiatry & Sleep"
        },
        {
            "code": "AYU-002",
            "title": "Clinical Efficacy and Safety of Curcuma longa & Boswellia serrata in Knee Osteoarthritis (Sandhigata Vata)",
            "short_title": "Haridra-Shallaki in Knee Osteoarthritis",
            "study_type": "Interventional",
            "intervention_type": "Polyherbal Formulation",
            "phase": "Phase II",
            "target": 120,
            "current": 95,
            "status": StudyStatus.ACTIVE,
            "stage": LifecycleStage.RECRUITMENT,
            "risk_score": 32.0,
            "risk_level": RiskLevel.HEALTHY,
            "primary": "Reduction in WOMAC Pain and Stiffness Subscale scores.",
            "therapeutic_area": "Musculoskeletal / Sandhigata Vata"
        }
    ]

    # Additional 22 studies
    other_formulations = [
        ("Brahmi Rasayana in Age-Related Memory Decline", "Cognitive Neuroscience", "Phase II"),
        ("Triphala Formulation in Non-Alcoholic Fatty Liver Disease (NAFLD)", "Gastroenterology", "Phase III"),
        ("Vasaka and Kantakari Syrup in Chronic Bronchial Asthma", "Pulmonology", "Phase II"),
        ("Arjuna Ksheerapaka in Mild Hypertension and Endothelial Function", "Cardiology", "Phase II"),
        ("Shilajit Resin in Geriatric Vitality and Cellular Aging Biomarkers", "Rasayana / Longevity", "Phase I/II"),
        ("Panchakarma Vamana Karma in Chronic Plaque Psoriasis", "Dermatology / Kushta", "Observational"),
        ("Guggulu Compound in Primary Hypercholesterolemia", "Metabolic Disorders", "Phase III"),
        ("Shatavari Granules in Perimenopausal Vasomotor Symptoms", "Gynecology / Stree Roga", "Phase III"),
        ("Vacha Extract in Attention Deficit & Neurodevelopmental Markers", "Pediatrics / Kaumarbhritya", "Phase II"),
        ("Khadirarishta in Refractory Acne Vulgaris", "Dermatology", "Phase II"),
        ("Bilva Majja formulation in Irritable Bowel Syndrome (Grahani)", "Gastroenterology", "Phase II"),
        ("Chyawanprash Supplementation in Occupational Immune Health", "Immunology / Rasayana", "Phase III"),
    ]

    for idx, (ftitle, tarea, phase) in enumerate(other_formulations, start=4):
        studies_data.append({
            "code": f"AYU-{idx:03d}",
            "title": f"Multicenter Clinical Evaluation of {ftitle}",
            "short_title": ftitle[:50],
            "study_type": "Interventional",
            "intervention_type": "Classical Ayurvedic Formulation",
            "phase": phase,
            "target": random.randint(80, 200),
            "current": random.randint(30, 180),
            "status": StudyStatus.ACTIVE,
            "stage": random.choice([LifecycleStage.RECRUITMENT, LifecycleStage.TREATMENT, LifecycleStage.FOLLOW_UP]),
            "risk_score": round(random.uniform(10.0, 48.0), 1),
            "risk_level": RiskLevel.HEALTHY if random.random() > 0.3 else RiskLevel.WATCH,
            "primary": f"Primary endpoint efficacy for {ftitle}.",
            "therapeutic_area": tarea
        })

    for idx in range(16, 26):
        studies_data.append({
            "code": f"AYU-{idx:03d}",
            "title": f"Observational Cohort Study on Ayurvedic Integrative Care Protocol #{idx}",
            "short_title": f"Integrative Care Protocol #{idx}",
            "study_type": "Observational",
            "intervention_type": "Integrative Regimen",
            "phase": "Real-World Evidence",
            "target": random.randint(100, 300),
            "current": random.randint(50, 250),
            "status": StudyStatus.ACTIVE,
            "stage": LifecycleStage.RECRUITMENT,
            "risk_score": round(random.uniform(12.0, 38.0), 1),
            "risk_level": RiskLevel.HEALTHY,
            "primary": "Clinical registry tracking quality of life and biomarker trajectories.",
            "therapeutic_area": "Integrative Health Registry"
        })

    studies = []
    for s_info in studies_data:
        st = Study(
            study_code=s_info["code"],
            title=s_info["title"],
            short_title=s_info["short_title"],
            study_type=s_info["study_type"],
            intervention_type=s_info["intervention_type"],
            phase=s_info["phase"],
            target_enrollment=s_info["target"],
            current_enrollment=s_info["current"],
            number_of_sites=random.randint(3, 8),
            status=s_info["status"],
            lifecycle_stage=s_info["stage"],
            risk_score=s_info["risk_score"],
            risk_level=s_info["risk_level"],
            primary_objective=s_info["primary"],
            therapeutic_area=s_info["therapeutic_area"],
            start_date=date(2025, 6, 1),
            expected_completion=date(2027, 6, 30)
        )
        db.add(st)
        studies.append(st)
    db.commit()

    # Link Studies to Sites
    for st in studies:
        sample_sites = [sites[1]] if st.study_code == "AYU-003" else []
        other_sites = random.sample(sites, k=random.randint(3, 6))
        for s in set(sample_sites + other_sites):
            db.add(StudySite(
                study_id=st.id,
                site_id=s.id,
                target_enrollment=st.target_enrollment // 4,
                enrolled_count=st.current_enrollment // 4
            ))
    db.commit()

    # 4. Synthetic Participants (1,500+ Participants across studies)
    print("Generating 1500+ synthetic participants...")
    participants = []
    p_counter = 1

    # Specifically seed AYU-003 with 105 participants (to reflect the 42% lag on 250 target)
    blr_site = sites[1] # SITE-BLR-02
    delhi_site = sites[0] # SITE-DEL-01
    ayu3_study = studies[0] # AYU-003

    arms = [
        "Arm A: Standard Guduchi-Pippali Formulation (500mg BID)",
        "Arm B: Placebo Formulation + Standard Care",
        "Arm C: Active Control Formulation"
    ]

    for _ in range(105):
        site_chosen = blr_site if random.random() < 0.45 else delhi_site
        p = Participant(
            synthetic_id=f"SYN-P{p_counter:05d}",
            study_id=ayu3_study.id,
            site_id=site_chosen.id,
            screening_date=date(2025, 8, random.randint(1, 28)),
            enrollment_date=date(2025, 9, random.randint(1, 25)),
            treatment_arm=random.choice(arms),
            randomization_status="RANDOMIZED",
            randomization_code=f"RND-{p_counter:05d}",
            participant_status=ParticipantStatus.ACTIVE,
            consent_status=ConsentStatus.OBTAINED,
            age_years=random.randint(22, 68),
            gender=random.choice(["Male", "Female"])
        )
        db.add(p)
        participants.append(p)
        p_counter += 1

    # Seed the rest of the 1,400+ participants across the other 24 studies
    for st in studies[1:]:
        num_to_add = max(20, st.current_enrollment)
        for _ in range(num_to_add):
            s_chosen = random.choice(sites)
            p = Participant(
                synthetic_id=f"SYN-P{p_counter:05d}",
                study_id=st.id,
                site_id=s_chosen.id,
                screening_date=date(2025, 7, random.randint(1, 28)),
                enrollment_date=date(2025, 8, random.randint(1, 25)),
                treatment_arm="Arm 1: Active Formulation",
                randomization_status="RANDOMIZED",
                randomization_code=f"RND-{p_counter:05d}",
                participant_status=ParticipantStatus.ACTIVE,
                consent_status=ConsentStatus.OBTAINED,
                age_years=random.randint(19, 72),
                gender=random.choice(["Male", "Female", "Other"])
            )
            db.add(p)
            participants.append(p)
            p_counter += 1
            if p_counter > 1520:
                break
        if p_counter > 1520:
            break
    db.commit()

    # 5. Visits (5,000+ Visits)
    print("Generating 5000+ clinical trial visits...")
    visit_names_list = [
        ("Screening", 1, -14),
        ("Baseline", 2, 0),
        ("V1 (Week 2)", 3, 14),
        ("V2 (Week 4)", 4, 28),
        ("V3 (Week 8)", 5, 56),
        ("V4 (Week 12)", 6, 84),
        ("End of Treatment", 7, 90),
        ("Follow-up", 8, 120),
        ("Final", 9, 150)
    ]

    visit_count = 0
    for p in participants:
        base_d = p.enrollment_date or date(2025, 9, 1)
        for vname, seq, offset in visit_names_list:
            v_target = base_d + timedelta(days=offset)
            is_completed = v_target <= date.today()
            v_status = VisitStatus.COMPLETED if is_completed else VisitStatus.SCHEDULED
            # Hero study participant with missed visit
            if p.study_id == ayu3_study.id and seq == 4 and random.random() < 0.15:
                v_status = VisitStatus.MISSED
            v = Visit(
                participant_id=p.id,
                study_id=p.study_id,
                site_id=p.site_id,
                visit_name=vname,
                sequence_order=seq,
                target_date=v_target,
                actual_date=v_target if is_completed else None,
                status=v_status,
                compliance_flag="NON_COMPLIANT" if v_status == VisitStatus.MISSED else "COMPLIANT"
            )
            db.add(v)
            visit_count += 1
            if visit_count >= 5100:
                break
        if visit_count >= 5100:
            break
    db.commit()

    # 6. Data Queries (300+ Queries)
    print("Generating 300+ eCRF data queries...")
    query_fields = [
        ("Vitals: Systolic Blood Pressure", "Measurement exceeds plausibility threshold (210 mmHg) without confirmatory repeat."),
        ("Laboratory: Serum Creatinine", "Discrepancy between central lab requisition form and local EMR upload."),
        ("Prakriti Assessment", "Incomplete questionnaire: Vata-Pitta questionnaire missing section 4."),
        ("Concomitant Medication", "Uncoded concomitant Ayurvedic kashayam reported without dosage interval."),
        ("Dispensation Log", "Discrepancy in count of returned study blister packs at Week 4 visit."),
        ("Adverse Event Onset", "AE onset date precedes baseline visit date; please confirm.")
    ]

    # Specific hero study queries for Bengaluru site (14 open queries, 2 critical)
    for q_i in range(1, 15):
        fld, iss = query_fields[q_i % len(query_fields)]
        sev = QuerySeverity.CRITICAL if q_i <= 2 else (QuerySeverity.HIGH if q_i <= 6 else QuerySeverity.MEDIUM)
        db.add(DataQuery(
            query_code=f"QRY-2026-{q_i:04d}",
            study_id=ayu3_study.id,
            site_id=blr_site.id,
            field_name=fld,
            issue=f"[Site Bengaluru] {iss}",
            severity=sev,
            status=QueryStatus.OPEN,
            due_date=date.today() + timedelta(days=5)
        ))

    # General queries across other studies
    for q_i in range(15, 310):
        st = random.choice(studies)
        s = random.choice(sites)
        fld, iss = random.choice(query_fields)
        q_status = random.choice([QueryStatus.OPEN, QueryStatus.ANSWERED, QueryStatus.CLOSED])
        db.add(DataQuery(
            query_code=f"QRY-2026-{q_i:04d}",
            study_id=st.id,
            site_id=s.id,
            field_name=fld,
            issue=iss,
            severity=random.choice([QuerySeverity.LOW, QuerySeverity.MEDIUM, QuerySeverity.HIGH]),
            status=q_status,
            due_date=date.today() + timedelta(days=random.randint(3, 30)),
            resolution="Investigator verified source medical record and corrected eCRF entry." if q_status == QueryStatus.CLOSED else None
        ))
    db.commit()

    # 7. Protocol Deviations (100+ Deviations)
    print("Generating 100+ protocol deviations...")
    deviation_cats = [
        ("Informed Consent", "Consent form re-consent signature obtained 2 days after protocol amendment activation.", DeviationSeverity.MAJOR),
        ("Investigational Product", "Temperature excursion in drug storage refrigerator (exceeded 25°C for 4 hours).", DeviationSeverity.CRITICAL),
        ("Visit Window", "Week 8 visit conducted 6 days outside permitted +/- 3-day protocol window.", DeviationSeverity.MINOR),
        ("Inclusion/Exclusion", "Subject enrolled with HbA1c 9.2% exceeding protocol threshold of 9.0%.", DeviationSeverity.MAJOR),
        ("Concomitant Medication", "Subject initiated unapproved herbal formulation without prior CRA notification.", DeviationSeverity.MAJOR)
    ]

    # Hero study deviations at Bengaluru site (3 open deviations, 1 critical)
    for dev_i in range(1, 4):
        cat, desc, sev = deviation_cats[dev_i - 1]
        db.add(ProtocolDeviation(
            deviation_code=f"DEV-2026-{dev_i:03d}",
            study_id=ayu3_study.id,
            site_id=blr_site.id,
            category=cat,
            description=f"[Bengaluru Site Incident] {desc}",
            severity=sev,
            discovery_date=date.today() - timedelta(days=dev_i * 4),
            status=DeviationStatus.OPEN,
            impact="Potential confounder in per-protocol efficacy analysis.",
            due_date=date.today() + timedelta(days=7)
        ))

    for dev_i in range(4, 105):
        st = random.choice(studies)
        s = random.choice(sites)
        cat, desc, sev = random.choice(deviation_cats)
        db.add(ProtocolDeviation(
            deviation_code=f"DEV-2026-{dev_i:03d}",
            study_id=st.id,
            site_id=s.id,
            category=cat,
            description=desc,
            severity=sev,
            discovery_date=date.today() - timedelta(days=random.randint(5, 90)),
            status=random.choice([DeviationStatus.RESOLVED, DeviationStatus.CLOSED, DeviationStatus.OPEN]),
            corrective_action="Retrained site personnel on protocol compliance and storage logs."
        ))
    db.commit()

    # 8. Monitoring Visits (Hero study has OVERDUE monitoring visit at Bengaluru site)
    print("Generating monitoring visits...")
    db.add(MonitoringVisit(
        visit_code="MON-2026-001",
        study_id=ayu3_study.id,
        site_id=blr_site.id,
        monitor_name="Mr. Rajesh Nair (CRA)",
        visit_type="Interim Monitoring Visit #3",
        planned_date=date.today() - timedelta(days=14),
        status=MonitoringStatus.OVERDUE,
        findings="Visit postponed due to investigator unavailability; source data verification pending for 18 subjects.",
        open_actions_count=5,
        due_date=date.today() - timedelta(days=5)
    ))

    for m_i in range(2, 45):
        st = random.choice(studies)
        s = random.choice(sites)
        db.add(MonitoringVisit(
            visit_code=f"MON-2026-{m_i:03d}",
            study_id=st.id,
            site_id=s.id,
            monitor_name="Mr. Rajesh Nair (CRA)",
            visit_type="Routine Monitoring Visit",
            planned_date=date.today() + timedelta(days=random.randint(-30, 60)),
            actual_date=date.today() - timedelta(days=random.randint(1, 20)) if random.random() > 0.4 else None,
            status=random.choice([MonitoringStatus.COMPLETED, MonitoringStatus.PLANNED, MonitoringStatus.SCHEDULED]),
            findings="Regulatory binder complete. Drug accountability verified."
        ))
    db.commit()

    # 9. Safety & Pharmacovigilance (70+ AEs, 15+ SAEs, Hero SAE PV-2026-0031)
    print("Generating safety cases and expedited clocks...")
    # Hero SAE Case: PV-2026-0031
    hero_p = participants[0]
    db.add(SafetyCase(
        case_number="PV-2026-0031",
        study_id=ayu3_study.id,
        site_id=blr_site.id,
        participant_id=hero_p.id,
        is_serious=True,
        adverse_event_term="Severe Acute Urticaria with Hepatic Transaminitis Spike",
        meddra_preferred_term="Urticaria acute",
        meddra_soc_term="Skin and subcutaneous tissue disorders",
        meddra_code="10046735",
        severity=AESeverity.SEVERE,
        expectedness=AEExpectedness.UNEXPECTED,
        causality=AECausality.POSSIBLE,
        onset_date=datetime.now(timezone.utc) - timedelta(hours=14),
        action_taken="DRUG_INTERRUPTED",
        reporter_name="Dr. Bengaluru Co-Investigator",
        reporting_deadline=datetime.now(timezone.utc) + timedelta(hours=10), # 10h remaining on 24h expedited clock
        workflow_state=SafetyWorkflowState.MEDICAL_REVIEW,
        submission_status="PENDING_EXPEDITED_FILING",
        narrative="Subject experienced diffuse maculopapular rash and elevated ALT (120 U/L) on Day 21 of formulation. Hospitalized overnight for observation."
    ))

    # Additional 14 SAEs
    for sae_i in range(1, 15):
        st = random.choice(studies)
        p_sub = random.choice(participants)
        db.add(SafetyCase(
            case_number=f"PV-2026-SAE-{sae_i:02d}",
            study_id=st.id,
            site_id=p_sub.site_id,
            participant_id=p_sub.id,
            is_serious=True,
            adverse_event_term=random.choice(["Alanine aminotransferase increased", "Acute Gastrointestinal Hemorrhage", "Bronchospasm severe"]),
            meddra_preferred_term="Alanine aminotransferase increased",
            meddra_soc_term="Investigations",
            meddra_code="10001367",
            severity=AESeverity.SEVERE,
            expectedness=AEExpectedness.UNEXPECTED,
            causality=AECausality.PROBABLE,
            onset_date=datetime.now(timezone.utc) - timedelta(days=sae_i * 2),
            action_taken="DOSE_REDUCED",
            reporter_name="Site Co-Investigator",
            reporting_deadline=datetime.now(timezone.utc) + timedelta(days=2),
            workflow_state=random.choice([SafetyWorkflowState.CODING, SafetyWorkflowState.CAUSALITY_REVIEW, SafetyWorkflowState.SUBMITTED]),
            submission_status="SUBMITTED"
        ))

    # 65 non-serious AEs
    ae_terms = ["Nausea", "Dyspepsia", "Headache", "Arthralgia", "Mild Rash", "Fatigue", "Abdominal discomfort"]
    for ae_i in range(1, 66):
        st = random.choice(studies)
        p_sub = random.choice(participants)
        term = random.choice(ae_terms)
        db.add(SafetyCase(
            case_number=f"PV-2026-AE-{ae_i:03d}",
            study_id=st.id,
            site_id=p_sub.site_id,
            participant_id=p_sub.id,
            is_serious=False,
            adverse_event_term=term,
            meddra_preferred_term=term,
            meddra_soc_term="Gastrointestinal disorders",
            severity=AESeverity.MILD,
            expectedness=AEExpectedness.EXPECTED,
            causality=AECausality.UNLIKELY,
            onset_date=datetime.now(timezone.utc) - timedelta(days=random.randint(5, 60)),
            action_taken="DOSE_NOT_CHANGED",
            reporter_name="Dr. Site Coordinator",
            workflow_state=SafetyWorkflowState.CLOSED,
            submission_status="ROUTINE_ANNUAL_REPORT"
        ))
    db.commit()

    # 10. Safety Signals (10+ Signals)
    print("Generating safety signals...")
    signal_patterns = [
        ("Clustered ALT/AST Elevation in High-Dose Guduchi Arm", 4.2, 1.1, 3.8, ayu3_study.id),
        ("Transient Gastrointestinal Distress with Pippali Formulation", 6.8, 3.2, 2.1, ayu3_study.id),
        ("Mild Cutaneous Pruritus in Ashwagandha Formulation", 2.4, 1.0, 2.4, studies[1].id),
        ("Self-limiting Headache following Morning Dose", 5.1, 2.8, 1.8, None),
        ("Mild Hypotensive Episodes in Arjuna Ksheerapaka cohort", 3.7, 1.2, 3.1, None),
        ("Transient Nausea post-Shilajit administration", 4.0, 2.0, 2.0, None),
        ("Mild Sleepiness in Withania group during daytime", 8.2, 4.0, 2.05, None),
        ("Loose Stools in Triphala high-potency arm", 11.4, 6.0, 1.9, None),
        ("Localized Pruritus at Panchakarma application site", 3.1, 1.0, 3.1, None),
        ("Transient Bitter Taste and Loss of Appetite", 7.5, 4.0, 1.87, None),
    ]
    for s_idx, (patt, obs, exp, rr, st_id) in enumerate(signal_patterns, start=1):
        db.add(SafetySignal(
            signal_code=f"SIG-2026-{s_idx:03d}",
            pattern_description=patt,
            study_id=st_id,
            observed_frequency=obs,
            expected_frequency=exp,
            relative_risk=rr,
            signal_state=SignalState.UNDER_REVIEW if s_idx <= 2 else SignalState.MONITORING,
            conclusion="Under medical review and disproportionate reporting evaluation."
        ))
    db.commit()

    # 11. Ethics & CTRI Registrations & Regulatory Milestones (50+ Milestones)
    print("Generating regulatory and CTRI milestones...")
    for st_idx, st in enumerate(studies, start=1):
        db.add(CTRIRegistration(
            study_id=st.id,
            ctri_number=f"CTRI/2025/11/{st_idx:06d}",
            registration_status="REGISTERED",
            is_prospective=True,
            last_update_date=date.today() - timedelta(days=120),
            next_required_update=date.today() + timedelta(days=9 if st.study_code == "AYU-003" else random.randint(25, 180)),
            responsible_user_name="Prof. Dr. Suhas Kumar"
        ))

        db.add(EthicsSubmission(
            submission_code=f"IEC-AIIA-2025-{st_idx:04d}",
            study_id=st.id,
            submission_date=date(2025, 3, 10),
            version="v1.0",
            decision=IECDecision.APPROVED,
            decision_date=date(2025, 4, 15),
            validity_expiry_date=date(2026, 4, 14),
            document_ref="IEC_APPROVAL_FINAL.pdf"
        ))

    # Milestones (Hero study has CTRI 6-monthly progress filing due in 9 days)
    db.add(RegulatoryMilestone(
        study_id=ayu3_study.id,
        milestone_name="CTRI 6-Monthly Progress Update Filing",
        due_date=date.today() + timedelta(days=9),
        owner_name="Prof. Dr. Suhas Kumar (PI)",
        status="DUE_SOON",
        priority="HIGH",
        reminder_threshold_days=30
    ))
    db.add(RegulatoryMilestone(
        study_id=ayu3_study.id,
        milestone_name="IEC Annual Continuing Review Dossier",
        due_date=date.today() + timedelta(days=40),
        owner_name="Prof. Dr. Suhas Kumar (PI)",
        status="UPCOMING",
        priority="HIGH"
    ))

    for m_idx in range(3, 55):
        st = random.choice(studies)
        db.add(RegulatoryMilestone(
            study_id=st.id,
            milestone_name=f"Regulatory Milestone #{m_idx} - Quality Audit & DSMB Review",
            due_date=date.today() + timedelta(days=random.randint(-10, 180)),
            owner_name="Regulatory Officer",
            status="OVERDUE" if m_idx == 10 else ("DUE_SOON" if m_idx <= 15 else "UPCOMING"),
            priority=random.choice(["HIGH", "MEDIUM", "LOW"])
        ))
    db.commit()

    # 12. Operational Tasks
    print("Generating operational tasks...")
    tasks_data = [
        ("Resolve 14 open queries at Bengaluru site prior to monitoring visit", ayu3_study.id, blr_site.id, "Dr. Ananya Sharma", date.today() + timedelta(days=4), TaskPriority.URGENT, "Data Quality"),
        ("Complete expedited SAE reporting checklist for PV-2026-0031", ayu3_study.id, blr_site.id, "Dr. Vikramaditya Joshi", date.today() + timedelta(days=1), TaskPriority.URGENT, "Pharmacovigilance"),
        ("Reschedule overdue CRA monitoring visit MON-2026-001 at Bengaluru", ayu3_study.id, blr_site.id, "Mr. Rajesh Nair", date.today() + timedelta(days=3), TaskPriority.HIGH, "Monitoring"),
        ("Submit CTRI 6-Monthly Progress Filing for AYU-003", ayu3_study.id, None, "Prof. Dr. Suhas Kumar", date.today() + timedelta(days=9), TaskPriority.HIGH, "Regulatory"),
        ("Audit drug accountability storage logs for temperature excursion", ayu3_study.id, blr_site.id, "Site Coordinator", date.today() + timedelta(days=5), TaskPriority.MEDIUM, "Protocol Deviations")
    ]
    for t_title, st_id, sit_id, owner, due, prio, src in tasks_data:
        db.add(OperationalTask(
            title=t_title,
            study_id=st_id,
            site_id=sit_id,
            owner_name=owner,
            due_date=due,
            priority=prio,
            status=TaskStatus.OPEN,
            source_module=src
        ))
    db.commit()

    # 13. Audit Events (Hundreds of events establishing ALCOA+ compliance)
    print("Generating audit trail history...")
    actions = [
        ("LOGIN", "User", "AUTH-01", "User session authenticated via JWT.", users["pi@aiia.demo"]),
        ("TRANSITION", "Study", ayu3_study.id, "Transitioned study lifecycle to TREATMENT.", users["pi@aiia.demo"]),
        ("CREATE", "SafetyCase", "PV-2026-0031", "Logged expedited SAE case: Severe Urticaria & Transaminitis.", users["coordinator@aiia.demo"]),
        ("TRANSITION", "SafetyCase", "PV-2026-0031", "Advanced safety workflow from REPORTED to MEDICAL_REVIEW.", users["pv@aiia.demo"]),
        ("CREATE", "ProtocolDeviation", "DEV-2026-001", "Logged deviation: Re-consent obtained post-amendment.", users["monitor@aiia.demo"]),
        ("CREATE", "DataQuery", "QRY-2026-0001", "Issued query regarding systolic BP excursion.", users["monitor@aiia.demo"]),
        ("EXPORT", "CDISC", ayu3_study.id, "Generated SDTM DM and AE domain CSV packages.", users["admin@aiia.demo"]),
    ]

    for act, ent_type, ent_id, reason, user_obj in actions:
        db.add(AuditEvent(
            actor_id=user_obj.id,
            actor_name=user_obj.full_name,
            actor_role=user_obj.role.value,
            action=act,
            entity_type=ent_type,
            entity_id=ent_id,
            before_state_json=None,
            after_state_json='{"status": "CONFIRMED"}',
            reason=reason,
            timestamp=datetime.now(timezone.utc) - timedelta(hours=random.randint(1, 48))
        ))

    for i in range(1, 100):
        u_rand = random.choice(list(users.values()))
        db.add(AuditEvent(
            actor_id=u_rand.id,
            actor_name=u_rand.full_name,
            actor_role=u_rand.role.value,
            action=random.choice(["CREATE", "UPDATE", "TRANSITION", "RESOLVE"]),
            entity_type=random.choice(["Participant", "Visit", "DataQuery", "Consent"]),
            entity_id=f"ENT-{i:04d}",
            reason="Routine clinical data verification update.",
            timestamp=datetime.now(timezone.utc) - timedelta(days=random.randint(1, 30))
        ))
    db.commit()

    print("Database seeding completed successfully!")
