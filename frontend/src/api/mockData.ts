// AYUVISTA - Standalone Client-Side Mock Fallback Engine
// Provides high-fidelity, deterministic synthetic clinical trial data
// Guarantees zero downtime and seamless 100% operation on Vercel / static hosting.

import { User, UserRole, Study, Site, SafetyCase, DataQuery, ProtocolDeviation, MonitoringVisit, OperationalTask, PortfolioMetrics } from '../types';

export const DEMO_USERS: Record<string, User> = {
  'admin@aiia.demo': {
    id: 'u-001',
    email: 'admin@aiia.demo',
    full_name: 'System Administrator',
    role: 'ADMIN',
    department: 'IT & Research Informatics',
    is_active: true,
  },
  'pi@aiia.demo': {
    id: 'u-002',
    email: 'pi@aiia.demo',
    full_name: 'Prof. Dr. Suhas Kumar',
    role: 'PRINCIPAL_INVESTIGATOR',
    department: 'Department of Kayachikitsa',
    is_active: true,
  },
  'coordinator@aiia.demo': {
    id: 'u-003',
    email: 'coordinator@aiia.demo',
    full_name: 'Dr. Ananya Sharma',
    role: 'STUDY_COORDINATOR',
    department: 'Clinical Research Coordination Cell',
    is_active: true,
  },
  'monitor@aiia.demo': {
    id: 'u-004',
    email: 'monitor@aiia.demo',
    full_name: 'Mr. Rajesh Nair',
    role: 'MONITOR',
    department: 'Clinical Monitoring Unit',
    is_active: true,
  },
  'ethics@aiia.demo': {
    id: 'u-005',
    email: 'ethics@aiia.demo',
    full_name: 'Dr. Meenakshi Sundaram',
    role: 'ETHICS',
    department: 'Institutional Ethics Committee',
    is_active: true,
  },
  'pv@aiia.demo': {
    id: 'u-006',
    email: 'pv@aiia.demo',
    full_name: 'Dr. Vikramaditya Joshi',
    role: 'PHARMACOVIGILANCE',
    department: 'Pharmacovigilance & Safety Cell',
    is_active: true,
  },
  'leadership@aiia.demo': {
    id: 'u-007',
    email: 'leadership@aiia.demo',
    full_name: 'Prof. Tanuja Nesari',
    role: 'LEADERSHIP',
    department: 'Directorate / Executive Office',
    is_active: true,
  },
  'regulator@aiia.demo': {
    id: 'u-008',
    email: 'regulator@aiia.demo',
    full_name: 'Dr. Arvind Verma',
    role: 'REGULATOR_READ_ONLY',
    department: 'Regulatory Inspection Bureau',
    is_active: true,
  },
};

export const MOCK_STUDIES: Study[] = [
  {
    id: 's-003',
    study_code: 'AYU-003',
    title: 'Multicenter Randomized Controlled Trial of Standardized Guduchi (Tinospora cordifolia) and Pippali (Piper longum) Formulation in Post-Viral Fatigue and Metabolic Syndrome',
    short_title: 'Guduchi-Pippali in Metabolic Syndrome',
    study_type: 'Interventional',
    intervention_type: 'Herbo-mineral Formulation',
    phase: 'Phase II/III',
    sponsor: 'All India Institute of Ayurveda (AIIA)',
    target_enrollment: 250,
    current_enrollment: 105,
    number_of_sites: 8,
    status: 'ACTIVE',
    lifecycle_stage: 'TREATMENT',
    risk_score: 78.5,
    risk_level: 'AT_RISK',
    protocol_version: 'v2.1 (Amendment 3)',
    therapeutic_area: 'Metabolic & Post-Viral Immunology',
    population: 'Adults aged 18-65 with documented post-viral fatigue score >= 18 and HOMA-IR > 2.5',
    primary_objective: 'Evaluate changes in HOMA-IR and Chalder Fatigue Scale at Week 12 relative to baseline.',
    created_at: '2025-06-15T00:00:00Z',
  },
  {
    id: 's-001',
    study_code: 'AYU-001',
    title: 'Double-blind Placebo-controlled Trial of Ashwagandha (Withania somnifera) Extract in Chronic Insomnia and Neurocognitive Stress',
    short_title: 'Ashwagandha in Chronic Insomnia',
    study_type: 'Interventional',
    intervention_type: 'Standardized Herbal Extract',
    phase: 'Phase III',
    sponsor: 'All India Institute of Ayurveda (AIIA)',
    target_enrollment: 180,
    current_enrollment: 172,
    number_of_sites: 6,
    status: 'ACTIVE',
    lifecycle_stage: 'TREATMENT',
    risk_score: 18.0,
    risk_level: 'HEALTHY',
    protocol_version: 'v1.4',
    therapeutic_area: 'Neuropsychiatry & Sleep',
    population: 'Adults with chronic non-restorative sleep > 3 months',
    primary_objective: 'Improvement in Pittsburgh Sleep Quality Index (PSQI) score.',
    created_at: '2025-04-10T00:00:00Z',
  },
  {
    id: 's-002',
    study_code: 'AYU-002',
    title: 'Clinical Efficacy and Safety of Curcuma longa & Boswellia serrata in Knee Osteoarthritis (Sandhigata Vata)',
    short_title: 'Haridra-Shallaki in Knee Osteoarthritis',
    study_type: 'Interventional',
    intervention_type: 'Polyherbal Formulation',
    phase: 'Phase II',
    sponsor: 'National Institute of Ayurveda (NIA Jaipur)',
    target_enrollment: 120,
    current_enrollment: 95,
    number_of_sites: 5,
    status: 'ACTIVE',
    lifecycle_stage: 'RECRUITMENT',
    risk_score: 32.0,
    risk_level: 'HEALTHY',
    protocol_version: 'v2.0',
    therapeutic_area: 'Musculoskeletal / Sandhigata Vata',
    population: 'Patients with Kellgren-Lawrence Grade II/III knee osteoarthritis',
    primary_objective: 'Reduction in WOMAC Pain and Stiffness Subscale scores.',
    created_at: '2025-05-20T00:00:00Z',
  },
];

// Generate remaining 22 studies
const additionalStudyTitles = [
  'Brahmi Rasayana in Age-Related Memory Decline',
  'Triphala Formulation in Non-Alcoholic Fatty Liver Disease',
  'Vasaka and Kantakari Syrup in Chronic Bronchial Asthma',
  'Arjuna Ksheerapaka in Mild Hypertension',
  'Shilajit Resin in Geriatric Vitality Markers',
  'Panchakarma Vamana Karma in Plaque Psoriasis',
  'Guggulu Compound in Primary Hypercholesterolemia',
  'Shatavari Granules in Perimenopausal Vasomotor Symptoms',
  'Vacha Extract in Neurodevelopmental Markers',
  'Khadirarishta in Refractory Acne Vulgaris',
  'Bilva Majja Formulation in Irritable Bowel Syndrome',
  'Chyawanprash Supplementation in Occupational Health',
  'Ashwagandha-Guduchi Synergy in Post-COVID Syndrome',
  'Punarnava Decoction in Chronic Renal Impairment Stage 2',
  'Yashtimadhu Ghrita in Non-Ulcer Dyspepsia',
  'Dashamoola Kwatha in Diabetic Peripheral Neuropathy',
  'Manjistha Extract in Atopic Dermatitis',
  'Kaishore Guggulu in Hyperuricemia and Gout',
  'Varunadi Kashaya in Benign Prostatic Hyperplasia',
  'Tagara Extract in Generalized Anxiety Disorder',
  'Amritarishta in Chronic Intermittent Pyrexia',
  'Saraswatarishta in Post-Stroke Neuroplasticity',
];

additionalStudyTitles.forEach((title, idx) => {
  const code = `AYU-${String(idx + 4).padStart(3, '0')}`;
  MOCK_STUDIES.push({
    id: `s-${String(idx + 4).padStart(3, '0')}`,
    study_code: code,
    title: `Multicenter Clinical Evaluation of ${title}`,
    short_title: title,
    study_type: 'Interventional',
    intervention_type: 'Classical Ayurvedic Formulation',
    phase: idx % 2 === 0 ? 'Phase II' : 'Phase III',
    sponsor: 'Ministry of Ayush / AIIA Research Network',
    target_enrollment: 100 + (idx * 10),
    current_enrollment: 40 + (idx * 8),
    number_of_sites: 4 + (idx % 4),
    status: 'ACTIVE',
    lifecycle_stage: idx % 3 === 0 ? 'TREATMENT' : 'RECRUITMENT',
    risk_score: 22 + (idx * 2) % 40,
    risk_level: (idx === 2 || idx === 7) ? 'WATCH' : 'HEALTHY',
    protocol_version: 'v1.0',
    therapeutic_area: 'Ayurvedic Clinical Science',
    population: 'Adult cohort aged 18-60',
    created_at: '2025-07-01T00:00:00Z',
  });
});

export const MOCK_SITES: Site[] = [
  {
    id: 'site-del-01',
    site_code: 'SITE-DEL-01',
    site_name: 'AIIA Apex Clinical Research Center',
    institution: 'All India Institute of Ayurveda',
    city: 'New Delhi',
    state: 'Delhi',
    principal_investigator_name: 'Prof. Dr. Suhas Kumar',
    site_coordinator_name: 'Dr. Ananya Sharma',
    activation_date: '2025-01-15',
    status: 'ACTIVE',
    target_enrollment: 50,
    enrolled_count: 42,
    screening_count: 58,
    active_participants_count: 38,
    query_count: 4,
    deviations_count: 1,
    monitoring_status: 'COMPLIANT',
  },
  {
    id: 'site-blr-02',
    site_code: 'SITE-BLR-02',
    site_name: 'Bengaluru Ayush Specialty Center',
    institution: 'National Institute of Ayurveda Extension',
    city: 'Bengaluru',
    state: 'Karnataka',
    principal_investigator_name: 'Dr. R. K. Hegde',
    site_coordinator_name: 'Ms. Soumya Rao',
    activation_date: '2025-02-01',
    status: 'ACTIVE',
    target_enrollment: 50,
    enrolled_count: 24,
    screening_count: 36,
    active_participants_count: 19,
    query_count: 14,
    deviations_count: 3,
    monitoring_status: 'OVERDUE_ACTION',
  },
  {
    id: 'site-jpr-03',
    site_code: 'SITE-JPR-03',
    site_name: 'National Institute of Ayurveda Hospital',
    institution: 'National Institute of Ayurveda',
    city: 'Jaipur',
    state: 'Rajasthan',
    principal_investigator_name: 'Prof. Sanjeev Sharma',
    site_coordinator_name: 'Dr. Neha Pareek',
    activation_date: '2025-01-20',
    status: 'ACTIVE',
    target_enrollment: 50,
    enrolled_count: 39,
    screening_count: 48,
    active_participants_count: 35,
    query_count: 6,
    deviations_count: 0,
    monitoring_status: 'PENDING_VISIT',
  },
];

// Generate remaining up to 40 sites
const cities = [
  ['SITE-BOM-04', 'Podar Ayurvedic Hospital', 'Govt Ayurvedic College', 'Mumbai', 'Maharashtra'],
  ['SITE-VNS-05', 'BHU Faculty of Ayurveda', 'Banaras Hindu University', 'Varanasi', 'Uttar Pradesh'],
  ['SITE-PUN-06', 'Tilak Ayurved Mahavidyalaya', 'Tilak Hospital', 'Pune', 'Maharashtra'],
  ['SITE-TRV-07', 'Kerala Ayurvedic Research Institute', 'Govt Ayurveda College', 'Thiruvananthapuram', 'Kerala'],
  ['SITE-KOL-08', 'JB Roy State Ayurvedic Hospital', 'WBUHS', 'Kolkata', 'West Bengal'],
  ['SITE-CHN-09', 'National Institute of Siddha', 'NIS', 'Chennai', 'Tamil Nadu'],
  ['SITE-HYD-10', 'Govt Ayurvedic Hospital & Research Unit', 'Dr. BRKR College', 'Hyderabad', 'Telangana'],
  ['SITE-AMD-11', 'Akhandanand Ayurvedic Hospital', 'Gujarat Ayurved University', 'Ahmedabad', 'Gujarat'],
  ['SITE-LKO-12', 'State Ayurvedic College', 'Lucknow University', 'Lucknow', 'Uttar Pradesh'],
];

cities.forEach(([code, name, inst, city, state], i) => {
  MOCK_SITES.push({
    id: `site-${code.toLowerCase()}`,
    site_code: code,
    site_name: name,
    institution: inst,
    city,
    state,
    principal_investigator_name: `Dr. ${city} Lead Investigator`,
    site_coordinator_name: `Coordinator ${city}`,
    activation_date: '2025-02-15',
    status: 'ACTIVE',
    target_enrollment: 40,
    enrolled_count: 28 + (i % 10),
    screening_count: 35 + (i % 12),
    active_participants_count: 24 + (i % 8),
    query_count: 2 + (i % 6),
    deviations_count: i % 3 === 0 ? 1 : 0,
    monitoring_status: 'COMPLIANT',
  });
});

export const MOCK_SAFETY_CASES: SafetyCase[] = [
  {
    id: 'sc-0031',
    case_number: 'PV-2026-0031',
    study_id: 's-003',
    site_id: 'site-blr-02',
    participant_id: 'SYN-P00219',
    is_serious: true,
    adverse_event_term: 'Severe Acute Urticaria with Hepatic Transaminitis Spike',
    meddra_preferred_term: 'Urticaria acute',
    meddra_soc_term: 'Skin and subcutaneous tissue disorders',
    meddra_code: '10046735',
    severity: 'SEVERE',
    expectedness: 'UNEXPECTED',
    causality: 'POSSIBLE',
    onset_date: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    reporting_deadline: new Date(Date.now() + 10 * 3600 * 1000).toISOString(), // 10h left on 24h clock!
    workflow_state: 'MEDICAL_REVIEW',
    submission_status: 'PENDING_EXPEDITED_FILING',
    action_taken: 'DRUG_INTERRUPTED',
    reporter_name: 'Dr. Bengaluru Co-Investigator',
    narrative: 'Subject experienced diffuse maculopapular rash and elevated ALT (120 U/L) on Day 21 of Guduchi-Pippali formulation. Hospitalized overnight for surveillance.',
    created_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
  },
  {
    id: 'sc-0012',
    case_number: 'PV-2026-0012',
    study_id: 's-001',
    site_id: 'site-del-01',
    participant_id: 'SYN-P00084',
    is_serious: false,
    adverse_event_term: 'Mild Morning Drowsiness and Sedation',
    meddra_preferred_term: 'Somnolence',
    meddra_soc_term: 'Nervous system disorders',
    meddra_code: '10041349',
    severity: 'MILD',
    expectedness: 'EXPECTED',
    causality: 'PROBABLE',
    onset_date: new Date(Date.now() - 5 * 86400 * 1000).toISOString(),
    reporting_deadline: new Date(Date.now() + 2 * 86400 * 1000).toISOString(),
    workflow_state: 'CODING',
    submission_status: 'ROUTINE',
    action_taken: 'DOSE_NOT_CHANGED',
    reporter_name: 'Dr. Ananya Sharma',
    narrative: 'Subject reported mild sluggishness upon waking; resolved spontaneously after Week 2.',
    created_at: new Date(Date.now() - 5 * 86400 * 1000).toISOString(),
  },
  {
    id: 'sc-0019',
    case_number: 'PV-2026-0019',
    study_id: 's-002',
    site_id: 'site-jpr-03',
    participant_id: 'SYN-P00155',
    is_serious: false,
    adverse_event_term: 'Transient Gastric Irritation (Amlapitta)',
    meddra_preferred_term: 'Dyspepsia',
    meddra_soc_term: 'Gastrointestinal disorders',
    meddra_code: '10013946',
    severity: 'MODERATE',
    expectedness: 'EXPECTED',
    causality: 'PROBABLE',
    onset_date: new Date(Date.now() - 8 * 86400 * 1000).toISOString(),
    reporting_deadline: new Date(Date.now() + 1 * 86400 * 1000).toISOString(),
    workflow_state: 'CAUSALITY_REVIEW',
    submission_status: 'ROUTINE',
    action_taken: 'CONCOMITANT_THERAPY_GIVEN',
    reporter_name: 'Prof. Sanjeev Sharma',
    narrative: 'Patient experienced mild epigastric burning after empty-stomach administration. Advised to take formulation post-prandially with warm water.',
    created_at: new Date(Date.now() - 8 * 86400 * 1000).toISOString(),
  },
];

export const MOCK_QUERIES: DataQuery[] = [
  {
    id: 'q-001',
    query_code: 'QRY-2026-0014',
    study_id: 's-003',
    site_id: 'site-blr-02',
    participant_id: 'p-00219',
    field_name: 'ALT_TRANSAMINASE_VAL',
    issue: 'ALT lab report value (120 U/L) exceeds protocol upper threshold (3x ULN). Urgent causality confirmation required.',
    severity: 'CRITICAL',
    status: 'OPEN',
    created_date: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    due_date: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'q-002',
    query_code: 'QRY-2026-0011',
    study_id: 's-003',
    site_id: 'site-blr-02',
    participant_id: 'p-00212',
    field_name: 'CONCOMITANT_MED_DOSE',
    issue: 'Missing daily dosage unit for Metformin 500mg co-administered with trial drug.',
    severity: 'HIGH',
    status: 'ANSWERED',
    created_date: new Date(Date.now() - 3 * 86400 * 1000).toISOString(),
    due_date: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    resolution: 'Updated eCRF with exact dose: 500mg BID with meals.',
  },
  {
    id: 'q-003',
    query_code: 'QRY-2026-0008',
    study_id: 's-001',
    site_id: 'site-del-01',
    participant_id: 'p-00084',
    field_name: 'VISIT_DATE_DEVIATION',
    issue: 'Visit completed on Day 32 instead of Day 28 (+/- 2 days window).',
    severity: 'LOW',
    status: 'CLOSED',
    created_date: new Date(Date.now() - 10 * 86400 * 1000).toISOString(),
    due_date: new Date(Date.now() - 3 * 86400 * 1000).toISOString(),
    resolution: 'Patient was out of station due to bereavement. Approved by PI.',
  },
];

export const MOCK_DEVIATIONS: ProtocolDeviation[] = [
  {
    id: 'dev-001',
    deviation_code: 'DEV-2026-003',
    study_id: 's-003',
    site_id: 'site-blr-02',
    category: 'INVESTIGATIONAL_PRODUCT',
    description: 'Trial drug storage temperature logged at 28.4°C for 36 hours (protocol specifies controlled room temperature <= 25°C).',
    severity: 'MAJOR',
    status: 'OPEN',
    discovery_date: new Date(Date.now() - 4 * 86400 * 1000).toISOString(),
    corrective_action: 'Quarantined affected batch #GP-2025-08. Calibrated HVAC unit and installed continuous digital thermal logger.',
  },
  {
    id: 'dev-002',
    deviation_code: 'DEV-2026-001',
    study_id: 's-003',
    site_id: 'site-del-01',
    category: 'INFORMED_CONSENT',
    description: 'Subject SYN-P00042 re-consent version 2.1 obtained 4 days after protocol amendment activation.',
    severity: 'MINOR',
    status: 'RESOLVED',
    discovery_date: new Date(Date.now() - 15 * 86400 * 1000).toISOString(),
    corrective_action: 'Re-trained study coordinator on re-consenting timelines; signed deviation note filed.',
  },
];

export const MOCK_MONITORING: MonitoringVisit[] = [
  {
    id: 'mon-001',
    visit_code: 'MON-2026-001',
    study_id: 's-003',
    site_id: 'site-blr-02',
    monitor_name: 'Mr. Rajesh Nair (CRA)',
    visit_type: 'Interim Monitoring Visit #3',
    planned_date: new Date(Date.now() - 14 * 86400 * 1000).toISOString().split('T')[0],
    status: 'OVERDUE',
    findings: 'Visit delayed due to PI schedule conflict. 18 subject files awaiting Source Data Verification (SDV); 14 open queries.',
    open_actions_count: 5,
    due_date: new Date(Date.now() - 5 * 86400 * 1000).toISOString().split('T')[0],
  },
  {
    id: 'mon-002',
    visit_code: 'MON-2026-002',
    study_id: 's-001',
    site_id: 'site-del-01',
    monitor_name: 'Mr. Rajesh Nair (CRA)',
    visit_type: 'Routine Monitoring Visit',
    planned_date: new Date(Date.now() + 7 * 86400 * 1000).toISOString().split('T')[0],
    status: 'SCHEDULED',
    findings: 'Regulatory binder up to date; drug accountability log matches physical blister packs.',
    open_actions_count: 0,
  },
];

export const MOCK_TASKS: OperationalTask[] = [
  {
    id: 't-001',
    title: 'Urgent 24h SAE Initial Filing to CDSCO / Ethics Committee (PV-2026-0031)',
    owner_name: 'Dr. Vikramaditya Joshi',
    priority: 'URGENT',
    status: 'OPEN',
    due_date: new Date(Date.now() + 10 * 3600 * 1000).toISOString(),
    study_id: 's-003',
    source_module: 'PHARMACOVIGILANCE',
    created_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
  },
  {
    id: 't-002',
    title: 'Conduct On-site Audit Visit at Bengaluru Center (SITE-BLR-02)',
    owner_name: 'Mr. Rajesh Nair',
    priority: 'HIGH',
    status: 'OPEN',
    due_date: new Date(Date.now() + 3 * 86400 * 1000).toISOString(),
    study_id: 's-003',
    source_module: 'MONITORING',
    created_at: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
  },
  {
    id: 't-003',
    title: 'Submit CTRI 6-Monthly Progress Report for AYU-003',
    owner_name: 'Prof. Tanuja Nesari',
    priority: 'MEDIUM',
    status: 'COMPLETED',
    due_date: new Date(Date.now() + 9 * 86400 * 1000).toISOString(),
    study_id: 's-003',
    source_module: 'REGULATORY',
    created_at: new Date(Date.now() - 10 * 86400 * 1000).toISOString(),
  },
];

export const MOCK_AUDIT_LOGS = [
  {
    id: 'aud-001',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    actor_name: 'Dr. Vikramaditya Joshi',
    actor_role: 'PHARMACOVIGILANCE',
    action: 'CASE_STATE_TRANSITION',
    entity_type: 'SafetyCase',
    entity_id: 'PV-2026-0031',
    reason: 'Advanced case from VALIDATED to MEDICAL_REVIEW; 24h statutory clock active.',
    before_state_json: JSON.stringify({ state: 'VALIDATED' }),
    after_state_json: JSON.stringify({ state: 'MEDICAL_REVIEW' }),
  },
  {
    id: 'aud-002',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    actor_name: 'Dr. Ananya Sharma',
    actor_role: 'STUDY_COORDINATOR',
    action: 'QUERY_RESOLVE',
    entity_type: 'DataQuery',
    entity_id: 'QRY-2026-0011',
    reason: 'Resolved concomitant medication dosage field ambiguity with source justification.',
    before_state_json: JSON.stringify({ status: 'OPEN' }),
    after_state_json: JSON.stringify({ status: 'ANSWERED' }),
  },
  {
    id: 'aud-003',
    timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    actor_name: 'Mr. Rajesh Nair',
    actor_role: 'MONITOR',
    action: 'CRA_VISIT_SCHEDULE',
    entity_type: 'MonitoringVisit',
    entity_id: 'MON-2026-001',
    reason: 'Rescheduled on-site audit visit with Bengaluru PI Dr. R. K. Hegde.',
    before_state_json: JSON.stringify({ status: 'OVERDUE' }),
    after_state_json: JSON.stringify({ status: 'SCHEDULED' }),
  },
];

// Main Mock Handler
export function handleMockApi(endpoint: string, options: RequestInit = {}): any {
  const method = (options.method || 'GET').toUpperCase();
  const cleanEndpoint = endpoint.split('?')[0];

  console.log(`%c[AYUVISTA Standalone Engine] %c${method} ${endpoint}`, 'color: #0B4D3C; font-weight: bold;', 'color: #0284C7;');

  // 1. Auth: Login
  if (cleanEndpoint === '/auth/login' && method === 'POST') {
    let email = 'pi@aiia.demo';
    if (options.body) {
      try {
        const parsed = JSON.parse(options.body as string);
        if (parsed.email) email = parsed.email.toLowerCase();
      } catch {}
    }
    const matchedUser = DEMO_USERS[email] || {
      id: `u-${Date.now()}`,
      email,
      full_name: 'Ayurvedic Clinical Researcher',
      role: 'PRINCIPAL_INVESTIGATOR' as UserRole,
      department: 'All India Institute of Ayurveda',
      is_active: true,
    };
    return {
      access_token: `mock-jwt-ayuvista-${matchedUser.role.toLowerCase()}-${Date.now()}`,
      token_type: 'bearer',
      user: matchedUser,
    };
  }

  // 2. Auth: Switch Role
  if (cleanEndpoint === '/auth/switch-role' && method === 'POST') {
    let newRole: UserRole = 'PRINCIPAL_INVESTIGATOR';
    if (options.body) {
      try {
        const parsed = JSON.parse(options.body as string);
        if (parsed.role) newRole = parsed.role;
      } catch {}
    }
    const roleUserMap: Record<UserRole, string> = {
      ADMIN: 'admin@aiia.demo',
      PRINCIPAL_INVESTIGATOR: 'pi@aiia.demo',
      STUDY_COORDINATOR: 'coordinator@aiia.demo',
      MONITOR: 'monitor@aiia.demo',
      ETHICS: 'ethics@aiia.demo',
      PHARMACOVIGILANCE: 'pv@aiia.demo',
      LEADERSHIP: 'leadership@aiia.demo',
      REGULATOR_READ_ONLY: 'regulator@aiia.demo',
    };
    const user = DEMO_USERS[roleUserMap[newRole]] || { ...DEMO_USERS['pi@aiia.demo'], role: newRole };
    return {
      access_token: `mock-jwt-ayuvista-${newRole.toLowerCase()}-${Date.now()}`,
      token_type: 'bearer',
      user,
    };
  }

  // 3. Command Center: Metrics
  if (cleanEndpoint === '/command-center/metrics') {
    const portfolio: PortfolioMetrics = {
      active_studies: 25,
      total_participants: 1520,
      recruitment_progress_pct: 68.4,
      active_sites: 40,
      open_queries: 324,
      ae_cases: 68,
      sae_cases: 15,
      overdue_tasks: 2,
      studies_at_risk: 4,
    };
    return portfolio;
  }

  // 4. Command Center: Health Matrix
  if (cleanEndpoint === '/command-center/health-matrix') {
    return MOCK_STUDIES.map((s) => ({
      study_code: s.study_code,
      title: s.title,
      short_title: s.short_title,
      recruitment_status: s.study_code === 'AYU-003' ? 'CRITICAL_LAG (-44%)' : 'ON_TRACK',
      iec_status: 'APPROVED',
      ctri_status: 'REGISTERED',
      sites_status: s.study_code === 'AYU-003' ? 'DEFICIENT_SITE (BLR-02)' : 'ACTIVE',
      dq_status: s.study_code === 'AYU-003' ? 'ACTION_REQUIRED (14 Queries)' : 'HEALTHY',
      safety_status: s.study_code === 'AYU-003' ? 'ACTIVE_EXPEDITED_SAE' : 'NO_SIGNALS',
      monitoring_status: s.study_code === 'AYU-003' ? 'VISIT_OVERDUE (14d)' : 'COMPLIANT',
      timeline_status: s.study_code === 'AYU-003' ? 'MILESTONE_IN_9D' : 'ON_SCHEDULE',
      overall_status: s.risk_level,
      risk_score: s.risk_score,
    }));
  }

  // 5. Command Center: Recruitment Trend (S-Curve)
  if (cleanEndpoint === '/command-center/recruitment-trend') {
    return [
      { month: 'Jul 25', target: 120, actual: 110 },
      { month: 'Aug 25', target: 280, actual: 260 },
      { month: 'Sep 25', target: 480, actual: 440 },
      { month: 'Oct 25', target: 700, actual: 650 },
      { month: 'Nov 25', target: 950, actual: 880 },
      { month: 'Dec 25', target: 1200, actual: 1100 },
      { month: 'Jan 26', target: 1450, actual: 1320 },
      { month: 'Feb 26', target: 1700, actual: 1520 },
      { month: 'Mar 26', target: 1950, actual: null },
      { month: 'Apr 26', target: 2200, actual: null },
    ];
  }

  // 6. Studies list & individual study
  if (cleanEndpoint === '/studies') {
    return MOCK_STUDIES;
  }
  if (cleanEndpoint.startsWith('/studies/')) {
    const parts = cleanEndpoint.split('/');
    const codeOrId = parts[2];
    const subRoute = parts[3];

    const study = MOCK_STUDIES.find((s) => s.study_code === codeOrId || s.id === codeOrId) || MOCK_STUDIES[0];

    if (!subRoute) {
      return study;
    }
    if (subRoute === 'recruitment-curve') {
      return [
        { month: 'Month 1', target: 30, actual: 25 },
        { month: 'Month 2', target: 70, actual: 55 },
        { month: 'Month 3', target: 120, actual: 80 },
        { month: 'Month 4', target: 180, actual: 105 },
        { month: 'Month 5', target: 220, actual: null },
        { month: 'Month 6', target: 250, actual: null },
      ];
    }
    if (subRoute === 'sites') {
      return MOCK_SITES.slice(0, 8);
    }
    if (subRoute === 'queries') {
      return MOCK_QUERIES;
    }
    if (subRoute === 'deviations') {
      return MOCK_DEVIATIONS;
    }
    if (subRoute === 'participants') {
      return Array.from({ length: 25 }, (_, i) => ({
        id: `p-${i + 1}`,
        synthetic_id: `SYN-P${String(i + 100).padStart(5, '0')}`,
        study_id: study.id,
        site_id: 'site-blr-02',
        enrollment_date: '2025-08-12',
        status: i === 0 ? 'ADVERSE_EVENT' : 'ACTIVE',
        age: 28 + (i % 35),
        gender: i % 2 === 0 ? 'M' : 'F',
      }));
    }
  }

  // 7. Sites
  if (cleanEndpoint === '/sites') {
    return MOCK_SITES;
  }
  if (cleanEndpoint.startsWith('/sites/')) {
    const siteId = cleanEndpoint.split('/')[2];
    const subRoute = cleanEndpoint.split('/')[3];
    const site = MOCK_SITES.find((s) => s.id === siteId || s.site_code === siteId) || MOCK_SITES[0];

    if (!subRoute) return site;
    if (subRoute === 'queries') return MOCK_QUERIES.filter((q) => q.site_id === site.id || site.id === 'site-blr-02');
    if (subRoute === 'deviations') return MOCK_DEVIATIONS.filter((d) => d.site_id === site.id || site.id === 'site-blr-02');
    if (subRoute === 'monitoring') return MOCK_MONITORING;
    if (subRoute === 'schedule-visit' && method === 'POST') {
      site.monitoring_status = 'PENDING_VISIT';
      return { message: 'Monitoring visit scheduled successfully', site };
    }
  }

  // 8. Safety Cases
  if (cleanEndpoint === '/safety/cases') {
    return MOCK_SAFETY_CASES;
  }
  if (cleanEndpoint.startsWith('/safety/cases/')) {
    const caseId = cleanEndpoint.split('/')[3];
    const action = cleanEndpoint.split('/')[4];
    const safetyCase = MOCK_SAFETY_CASES.find((sc) => sc.id === caseId || sc.case_number === caseId) || MOCK_SAFETY_CASES[0];

    if (!action) return safetyCase;
    if (action === 'transition' && method === 'POST') {
      const states = ['REPORTED', 'VALIDATED', 'MEDICAL_REVIEW', 'CODING', 'CAUSALITY_REVIEW', 'REGULATORY_ASSESSMENT', 'SUBMITTED', 'CLOSED'];
      const curIdx = states.indexOf(safetyCase.workflow_state);
      if (curIdx < states.length - 1) {
        safetyCase.workflow_state = states[curIdx + 1] as any;
      }
      return { message: 'Case advanced successfully', case: safetyCase };
    }
    if (action === 'revert' && method === 'POST') {
      const states = ['REPORTED', 'VALIDATED', 'MEDICAL_REVIEW', 'CODING', 'CAUSALITY_REVIEW', 'REGULATORY_ASSESSMENT', 'SUBMITTED', 'CLOSED'];
      const curIdx = states.indexOf(safetyCase.workflow_state);
      if (curIdx > 0) {
        safetyCase.workflow_state = states[curIdx - 1] as any;
      }
      return { message: 'Case reverted successfully', case: safetyCase };
    }
    if (action === 'code-meddra' && method === 'POST') {
      return { message: 'MedDRA coding assigned successfully', case: safetyCase };
    }
    if (action === 'sign-causality' && method === 'POST') {
      return { message: 'WHO-UMC causality signed successfully', case: safetyCase };
    }
  }

  // 9. Queries & Deviations
  if (cleanEndpoint === '/queries') return MOCK_QUERIES;
  if (cleanEndpoint.startsWith('/queries/') && cleanEndpoint.endsWith('/resolve') && method === 'POST') {
    return { message: 'Query resolved successfully' };
  }
  if (cleanEndpoint === '/deviations') return MOCK_DEVIATIONS;
  if (cleanEndpoint.startsWith('/deviations/') && cleanEndpoint.endsWith('/capa') && method === 'POST') {
    return { message: 'CAPA plan recorded successfully' };
  }

  // 10. Monitoring
  if (cleanEndpoint === '/monitoring/visits') return MOCK_MONITORING;

  // 11. Tasks
  if (cleanEndpoint === '/tasks') {
    if (method === 'POST') {
      let newTask: OperationalTask = {
        id: `t-${Date.now()}`,
        title: 'New Clinical Task',
        owner_name: 'Lead Investigator',
        priority: 'MEDIUM',
        status: 'OPEN',
        due_date: new Date(Date.now() + 7 * 86400 * 1000).toISOString(),
        study_id: 's-003',
        source_module: 'PORTFOLIO',
        created_at: new Date().toISOString(),
      };
      if (options.body) {
        try {
          newTask = { ...newTask, ...JSON.parse(options.body as string) };
        } catch {}
      }
      MOCK_TASKS.unshift(newTask);
      return newTask;
    }
    return MOCK_TASKS;
  }
  if (cleanEndpoint.startsWith('/tasks/') && cleanEndpoint.endsWith('/toggle') && method === 'POST') {
    const taskId = cleanEndpoint.split('/')[2];
    const task = MOCK_TASKS.find((t) => t.id === taskId);
    if (task) {
      task.status = task.status === 'COMPLETED' ? 'OPEN' : 'COMPLETED';
    }
    return { message: 'Task status toggled', task };
  }

  // 12. Audit Trail
  if (cleanEndpoint === '/audit') {
    return MOCK_AUDIT_LOGS;
  }

  // 13. Participants
  if (cleanEndpoint === '/participants') {
    return Array.from({ length: 30 }, (_, i) => ({
      id: `p-${i + 1}`,
      synthetic_id: `SYN-P${String(i + 1).padStart(5, '0')}`,
      study_id: 's-003',
      site_id: 'site-del-01',
      enrollment_date: '2025-08-10',
      status: i === 0 ? 'ADVERSE_EVENT' : (i % 5 === 0 ? 'COMPLETED' : 'ACTIVE'),
      age: 26 + (i % 40),
      gender: i % 2 === 0 ? 'M' : 'F',
      consent_status: 'SIGNED',
      consent_date: '2025-08-08',
    }));
  }

  // 14. Ethics & Regulatory
  if (cleanEndpoint === '/ethics/submissions') {
    return [
      {
        id: 'eth-001',
        submission_code: 'IEC-AIIA-2025-089',
        study_id: 's-003',
        submission_date: '2025-10-15',
        version: 'Protocol v2.1',
        submission_type: 'Full Committee Review (Major Amendment)',
        decision: 'APPROVED',
        decision_date: '2025-11-12',
        validity_expiry_date: '2027-11-12',
        conditions: 'Standard SAE 24h expedited notification mandate under NDCT 2019.',
      },
    ];
  }
  if (cleanEndpoint === '/ethics/milestones') {
    return [
      {
        id: 'mil-001',
        study_id: 's-003',
        milestone_name: 'CTRI 6-Monthly Progress Report',
        due_date: new Date(Date.now() + 9 * 86400 * 1000).toISOString().split('T')[0],
        status: 'PENDING',
        risk_level: 'WATCH',
      },
      {
        id: 'mil-002',
        study_id: 's-003',
        milestone_name: 'Annual Ethics Continuing Review (AIIA IEC)',
        due_date: '2026-11-12',
        status: 'PENDING',
        risk_level: 'HEALTHY',
      },
    ];
  }

  // 15. Interoperability & Sandboxes
  if (cleanEndpoint === '/interop/status') {
    return {
      edc_adapter: { status: 'ONLINE', pending_records: 0, last_sync: new Date().toISOString() },
      his_bridge: { status: 'ONLINE', connected_sites: 40, encounters_ingested: 3840 },
      abdm_sandbox: { status: 'SANDBOX_ACTIVE', milestones_certified: ['M1', 'M2', 'M3'], gateway_latency_ms: 42 },
      meddra_dictionary: { version: 'MedDRA v27.0', total_pts: 26840, cache_status: 'HOT' },
    };
  }
  if (cleanEndpoint.startsWith('/interop/fhir/')) {
    const [, , , resourceType, entityId] = cleanEndpoint.split('/');
    if (resourceType === 'ResearchStudy') {
      return {
        resourceType: 'ResearchStudy',
        id: entityId || 'AYU-003',
        status: 'active',
        title: 'Guduchi-Pippali Formulation in Metabolic Syndrome and Post-Viral Fatigue',
        protocol: [{ reference: 'Protocol/AYU-003-v2.1' }],
        sponsor: { display: 'All India Institute of Ayurveda (AIIA)' },
        category: [{ coding: [{ system: 'http://ayush.gov.in/standards', code: 'ASU-CLINICAL-TRIAL', display: 'Good Clinical Practice for ASU Drugs' }] }],
      };
    }
    if (resourceType === 'AdverseEvent') {
      return {
        resourceType: 'AdverseEvent',
        id: entityId || 'PV-2026-0031',
        actuality: 'actual',
        category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/adverse-event-category', code: 'product-use-error' }] }],
        event: { coding: [{ system: 'https://www.meddra.org', code: '10046735', display: 'Urticaria acute with hepatic transaminitis' }] },
        subject: { reference: 'Patient/SYN-P00219' },
        date: new Date().toISOString(),
        seriousness: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/adverse-event-seriousness', code: 'Serious' }] },
      };
    }
    return {
      resourceType: 'Patient',
      id: entityId || 'SYN-P00219',
      identifier: [{ system: 'https://aiia.gov.in/tokenized-subjects', value: entityId || 'SYN-P00219' }],
      active: true,
      gender: 'female',
      meta: { profile: ['http://hl7.org/fhir/StructureDefinition/Patient'], security: [{ code: 'DPDP-2023-SYNTHETIC' }] },
    };
  }
  if (cleanEndpoint === '/interop/edc/sync' || cleanEndpoint.startsWith('/interop/abdm/demo-flow')) {
    return { success: true, timestamp: new Date().toISOString(), records_processed: 14 };
  }
  if (cleanEndpoint.startsWith('/ethics/ctri/')) {
    return {
      ctri_number: 'CTRI/2025/11/074829',
      status: 'VERIFIED_ACTIVE',
      last_sync: new Date().toISOString(),
      recruitment_verified: 105,
      next_report_due_days: 9,
    };
  }

  // Fallback default response
  return { message: 'Operation executed successfully in standalone mode', timestamp: new Date().toISOString() };
}
