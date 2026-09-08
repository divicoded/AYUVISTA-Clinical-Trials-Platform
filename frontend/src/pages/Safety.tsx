import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api/client';
import { SafetyCase, SafetySignal, SafetyWorkflowState } from '../types';
import {
  ShieldAlert,
  Clock,
  Search,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  X,
  Activity,
  BarChart2,
  Zap,
  Sparkles,
  CheckCircle2,
  Lock,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  FileCheck,
  ShieldCheck,
  Award,
  Info,
  Check,
  FileText,
  User,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ScatterChart,
  Scatter,
  ZAxis,
  Legend,
} from 'recharts';
import confetti from 'canvas-confetti';

interface WorkflowStageInfo {
  state: SafetyWorkflowState;
  stepNumber: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  checklist: string[];
  actionPrompt: string;
}

const WORKFLOW_STAGES: WorkflowStageInfo[] = [
  {
    state: 'REPORTED',
    stepNumber: 1,
    title: 'Adverse Event Intake & Triage',
    shortTitle: '1. Intake',
    subtitle: 'Initial Site Capture & Seriousness Triage',
    description:
      'Initial AE report received from clinical investigator. Triage whether event meets Serious Adverse Event (SAE) criteria (death, life-threatening, hospitalization, disability, congenital anomaly) to trigger the mandatory 24-hour statutory reporting clock under NDCT Rules 2019.',
    checklist: [
      'Adverse event signs & symptoms captured',
      'Patient synthetic subject identifier linked',
      'Seriousness classification verified (SAE vs AE)',
    ],
    actionPrompt: 'Confirm initial clinical triage and advance to ICH-GCP Validation.',
  },
  {
    state: 'VALIDATED',
    stepNumber: 2,
    title: 'ICH-GCP 4-Criteria Validation',
    shortTitle: '2. Validation',
    subtitle: 'Mandatory Minimum Regulatory Criteria Verification',
    description:
      'Safety Officer verifies the 4 mandatory ICH-GCP minimum reporting criteria before clinical review: identifiable patient, identifiable reporter, suspect Ayurvedic formulation, and adverse clinical event.',
    checklist: [
      'Identifiable Subject ID confirmed',
      'Reporting Investigator / Site CRA recorded',
      'Suspect Ayurvedic formulation identified',
      'Adverse reaction onset documented',
    ],
    actionPrompt: 'Validate regulatory completeness and route to Ayurveda Medical Review.',
  },
  {
    state: 'MEDICAL_REVIEW',
    stepNumber: 3,
    title: 'Ayurveda Clinical Medical Review',
    shortTitle: '3. Medical Review',
    subtitle: 'Clinical Chronology & Dosha Imbalance Evaluation',
    description:
      'Senior Ayurveda Medical Monitor reviews patient baseline, Prakriti/Vikriti, Agni state, concomitant medications, onset chronobiology, and dechallenge response.',
    checklist: [
      'Clinical chronology & time-to-onset evaluated',
      'Ayurveda dosha / Agni state assessed',
      'Action taken with study intervention documented',
    ],
    actionPrompt: 'Approve medical evaluation and advance to Standard MedDRA Coding.',
  },
  {
    state: 'CODING',
    stepNumber: 4,
    title: 'Standard MedDRA Terminology Coding',
    shortTitle: '4. MedDRA Coding',
    subtitle: 'Preferred Term (PT) & SOC Dictionary Assignment',
    description:
      'HARD GATE: Adverse event terms must be mapped to standard Medical Dictionary for Regulatory Activities (MedDRA) Preferred Term (PT) and System Organ Class (SOC). A valid MedDRA code is required before Causality Review can proceed.',
    checklist: [
      'MedDRA Preferred Term (PT) assigned',
      'System Organ Class (SOC) mapped',
      'MedDRA 8-digit international concept code registered',
    ],
    actionPrompt: 'Assign MedDRA coding to unlock Causality Assessment.',
  },
  {
    state: 'CAUSALITY_REVIEW',
    stepNumber: 5,
    title: 'WHO-UMC & Ayush Causality Assessment',
    shortTitle: '5. Causality',
    subtitle: 'Standardized Causal Relationship Scoring',
    description:
      'HARD GATE: Evaluation of drug-event relationship using WHO-UMC and Ayush Pharmacovigilance criteria (Certain, Probable, Possible, Unlikely, Conditional, Not Assessable). Standard causality rating must be selected to advance.',
    checklist: [
      'Standardized causality category assigned',
      'Plausible temporal sequence confirmed',
      'Alternative etiology (concomitant drugs/disease) evaluated',
    ],
    actionPrompt: 'Select causality rating to proceed to Regulatory Filing Assessment.',
  },
  {
    state: 'REGULATORY_ASSESSMENT',
    stepNumber: 6,
    title: 'Regulatory Assessment & ICSR Dossier',
    shortTitle: '6. Regulatory Gate',
    subtitle: 'CDSCO & NDCT Rules 2019 Statutory Compliance',
    description:
      'Verify compliance against statutory reporting timelines (24-hour clock for SAE initial notification; 14-day complete detailed report). Central Ethics Committee notification and CDSCO SUGAM Form 44 annexure compiled.',
    checklist: [
      '24-Hour Expedited Regulatory Clock verified compliant',
      'Institutional Ethics Committee notification prepared',
      'CDSCO ICSR dossier compiled',
    ],
    actionPrompt: 'Sign off regulatory assessment and transmit to CDSCO/NPvCC gateway.',
  },
  {
    state: 'SUBMITTED',
    stepNumber: 7,
    title: 'Regulatory Gateway Submission',
    shortTitle: '7. Submitted',
    subtitle: 'Official Dispatch to CDSCO & NPvCC at AIIA',
    description:
      'Official electronic submission dispatched to Central Drugs Standard Control Organisation and National Pharmacovigilance Coordination Centre. Digital regulatory hash and submission timestamp generated.',
    checklist: [
      'Electronic submission transmission receipt generated',
      'Regulatory filing transaction hash recorded',
      'Statutory 24-hour compliance requirement satisfied',
    ],
    actionPrompt: 'Dossier successfully submitted. Monitor patient clinical resolution.',
  },
  {
    state: 'CLOSED',
    stepNumber: 8,
    title: 'Follow-Up Resolution & Final Case Archival',
    shortTitle: '8. Closed',
    subtitle: 'Patient Recovery Verification & Permanent Case Lock',
    description:
      'Final clinical outcome documented (e.g. Recovered without sequelae). ALCOA+ electronic audit trail verified and permanent case lock executed.',
    checklist: [
      'Patient clinical outcome documented (Resolved)',
      'Safety Officer electronic signoff complete',
      'Case permanently archived in PV repository',
    ],
    actionPrompt: 'Case successfully closed and archived.',
  },
];

const CAUSALITY_DEFINITIONS = [
  {
    value: 'CERTAIN',
    label: 'Certain',
    desc: 'Event with plausible time relationship to drug intake; cannot be explained by disease or other drugs; positive dechallenge.',
    badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  },
  {
    value: 'PROBABLE',
    label: 'Probable / Likely',
    desc: 'Event with reasonable time sequence to drug; unlikely attributed to disease or other drugs; clinically reasonable dechallenge response.',
    badgeBg: 'bg-teal-100 text-teal-900 border-teal-300',
  },
  {
    value: 'POSSIBLE',
    label: 'Possible',
    desc: 'Event with reasonable time sequence to drug; could also be explained by concurrent disease or other drugs; dechallenge info lacking or unclear.',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  {
    value: 'UNLIKELY',
    label: 'Unlikely',
    desc: 'Event with temporal relationship to drug that makes a causal relationship improbable, and concurrent disease provides plausible explanation.',
    badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
  },
  {
    value: 'CONDITIONAL',
    label: 'Conditional / Unclassified',
    desc: 'More data needed for proper assessment, or additional clinical data under examination.',
    badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-300',
  },
  {
    value: 'NOT_ASSESSABLE',
    label: 'Unassessable / Unclassifiable',
    desc: 'Report suggesting adverse reaction which cannot be judged because information is insufficient or contradictory.',
    badgeBg: 'bg-gray-100 text-gray-800 border-gray-300',
  },
];

export const Safety: React.FC = () => {
  const [cases, setCases] = useState<SafetyCase[]>([]);
  const [signals, setSignals] = useState<SafetySignal[]>([]);
  const [selectedCase, setSelectedCase] = useState<SafetyCase | null>(null);
  const [countdown, setCountdown] = useState<string>('09h : 42m : 18s');
  const [showCodingModal, setShowCodingModal] = useState<boolean>(false);
  const [codingQuery, setCodingQuery] = useState<string>('');
  const [codingResults, setCodingResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSeriousness, setFilterSeriousness] = useState<'ALL' | 'SAE' | 'AE'>('ALL');
  const [drawerTab, setDrawerTab] = useState<'WORKFLOW' | 'CLINICAL' | 'REGULATORY'>('WORKFLOW');
  const [transitionReason, setTransitionReason] = useState<string>('');
  const [transitioning, setTransitioning] = useState<boolean>(false);

  // Active step view inside drawer
  const [viewStepIndex, setViewStepIndex] = useState<number>(0);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      apiRequest<SafetyCase[]>('/safety/cases'),
      apiRequest<SafetySignal[]>('/safety/signals'),
    ])
      .then(([cList, sList]) => {
        setCases(cList);
        setSignals(sList);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync viewStepIndex whenever selectedCase changes
  useEffect(() => {
    if (selectedCase) {
      const idx = WORKFLOW_STAGES.findIndex((s) => s.state === selectedCase.workflow_state);
      setViewStepIndex(idx !== -1 ? idx : 0);
      setTransitionReason('');
    }
  }, [selectedCase?.id, selectedCase?.workflow_state]);

  // Expedited SAE countdown
  useEffect(() => {
    const startRef = Date.now();
    const initialSeconds = 9 * 3600 + 42 * 60 + 18;
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startRef) / 1000);
      const remaining = Math.max(0, initialSeconds - elapsed);
      const h = Math.floor(remaining / 3600);
      const m = Math.floor((remaining % 3600) / 60);
      const s = remaining % 60;
      setCountdown(
        `${String(h).padStart(2, '0')}h : ${String(m).padStart(2, '0')}m : ${String(s).padStart(2, '0')}s`
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchCoding = async (q: string) => {
    setCodingQuery(q);
    try {
      const res = await apiRequest<any>(`/safety/coding/lookup?q=${encodeURIComponent(q)}`);
      setCodingResults(res.results || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleApplyTerm = async (term: any) => {
    if (!selectedCase) return;
    try {
      const updated = await apiRequest<SafetyCase>(`/safety/cases/${selectedCase.id}/transition`, {
        method: 'POST',
        body: JSON.stringify({
          target_state: selectedCase.workflow_state,
          meddra_preferred_term: term.preferred_term,
          meddra_soc_term: term.soc_term,
          meddra_code: term.code,
          reason: `Assigned Standard MedDRA PT ${term.code}: ${term.preferred_term}`,
        }),
      });
      setSelectedCase(updated);
      setShowCodingModal(false);
      loadData();
    } catch (e: any) {
      alert(e.message || 'Error updating coding');
    }
  };

  const handleApplyCausality = async (causalityVal: any) => {
    if (!selectedCase) return;
    try {
      const updated = await apiRequest<SafetyCase>(`/safety/cases/${selectedCase.id}/transition`, {
        method: 'POST',
        body: JSON.stringify({
          target_state: selectedCase.workflow_state,
          causality: causalityVal,
          reason: `Assigned WHO-UMC / Ayush causality assessment: ${causalityVal}`,
        }),
      });
      setSelectedCase(updated);
      loadData();
    } catch (e: any) {
      alert(e.message || 'Error updating causality');
    }
  };

  // Sequential Step Advancement with Gating
  const handleAdvanceStep = async () => {
    if (!selectedCase) return;
    const currentIdx = WORKFLOW_STAGES.findIndex((s) => s.state === selectedCase.workflow_state);
    if (currentIdx >= WORKFLOW_STAGES.length - 1) return;

    const currentStage = WORKFLOW_STAGES[currentIdx];
    const nextStage = WORKFLOW_STAGES[currentIdx + 1];

    // Check Gating Rules
    if (currentStage.state === 'CODING') {
      if (!selectedCase.meddra_code || !selectedCase.meddra_preferred_term) {
        alert('MedDRA Coding Gate: You must assign a MedDRA Preferred Term (PT) before advancing to Causality Review.');
        setShowCodingModal(true);
        handleSearchCoding('');
        return;
      }
    }
    if (currentStage.state === 'CAUSALITY_REVIEW') {
      if (!selectedCase.causality) {
        alert('Causality Gate: Please select a WHO-UMC / Ayush Causality rating before advancing to Regulatory Assessment.');
        return;
      }
    }

    setTransitioning(true);
    try {
      const defaultReason = `Advanced from ${currentStage.title} to ${nextStage.title}`;
      const updated = await apiRequest<SafetyCase>(`/safety/cases/${selectedCase.id}/transition`, {
        method: 'POST',
        body: JSON.stringify({
          target_state: nextStage.state,
          reason: transitionReason.trim() || defaultReason,
        }),
      });
      setSelectedCase(updated);
      setTransitionReason('');
      loadData();

      // Trigger Confetti on submission or closure
      if (nextStage.state === 'SUBMITTED' || nextStage.state === 'CLOSED') {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    } catch (e: any) {
      alert(e.message || 'Error advancing safety workflow');
    } finally {
      setTransitioning(false);
    }
  };

  // Step Rollback
  const handleRollbackStep = async () => {
    if (!selectedCase) return;
    const currentIdx = WORKFLOW_STAGES.findIndex((s) => s.state === selectedCase.workflow_state);
    if (currentIdx <= 0) return;

    const prevStage = WORKFLOW_STAGES[currentIdx - 1];
    const reasonPrompt = window.prompt(
      `Enter rationale for rolling back to Step ${prevStage.stepNumber} (${prevStage.title}):`,
      'Safety Officer requested additional clinical clarification from investigator.'
    );
    if (!reasonPrompt) return;

    setTransitioning(true);
    try {
      const updated = await apiRequest<SafetyCase>(`/safety/cases/${selectedCase.id}/transition`, {
        method: 'POST',
        body: JSON.stringify({
          target_state: prevStage.state,
          reason: reasonPrompt,
        }),
      });
      setSelectedCase(updated);
      loadData();
    } catch (e: any) {
      alert(e.message || 'Error rolling back safety workflow');
    } finally {
      setTransitioning(false);
    }
  };

  const filteredCases = cases.filter((c) => {
    if (filterSeriousness === 'SAE') return c.is_serious;
    if (filterSeriousness === 'AE') return !c.is_serious;
    return true;
  });

  const severityBreakdown = (() => {
    const counts: Record<string, { AE: number; SAE: number }> = {};
    for (const c of cases) {
      const sev = c.severity || 'UNKNOWN';
      if (!counts[sev]) counts[sev] = { AE: 0, SAE: 0 };
      if (c.is_serious) counts[sev].SAE++;
      else counts[sev].AE++;
    }
    return Object.entries(counts).map(([name, v]) => ({ name, ...v }));
  })();

  const signalBubbleData = signals.map((s) => ({
    x: parseFloat(s.observed_frequency?.toString() || '0'),
    y: parseFloat(s.expected_frequency?.toString() || '0'),
    z: parseFloat(s.relative_risk?.toString() || '1') * 20,
    name: s.pattern_description,
    state: s.signal_state,
  }));

  // Selected case workflow helpers
  const currentActualIdx = selectedCase
    ? WORKFLOW_STAGES.findIndex((s) => s.state === selectedCase.workflow_state)
    : 0;
  const progressPercent = Math.round(((currentActualIdx + 1) / 8) * 100);
  const activeViewingStage = WORKFLOW_STAGES[viewStepIndex] || WORKFLOW_STAGES[currentActualIdx];

  // Gating status check for current actual stage
  const isCoded = Boolean(selectedCase?.meddra_code);
  const isCausalitySet = Boolean(selectedCase?.causality);
  const isAtCoding = selectedCase?.workflow_state === 'CODING';
  const isAtCausality = selectedCase?.workflow_state === 'CAUSALITY_REVIEW';
  const isNextBlocked = (isAtCoding && !isCoded) || (isAtCausality && !isCausalitySet);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80 text-[#526D61] text-xs font-mono">
        <div className="flex items-center space-x-3 bg-white px-6 py-4 rounded-3xl shadow-sm border border-[#E2EEE7]">
          <div className="h-5 w-5 rounded-full border-2 border-rose-600 border-t-transparent animate-spin" />
          <span>Loading Pharmacovigilance Surveillance Center...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[2.5rem] border border-[#E2EEE7] shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#FCE7F3] text-rose-800 text-[11px] font-bold mb-1">
            <Sparkles className="h-3 w-3" />
            <span>National Pharmacovigilance Coordination Centre (NPvCC)</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14231E] tracking-tight">Pharmacovigilance & Safety Surveillance</h1>
          <p className="text-xs text-[#526D61] mt-0.5">
            Sequential 8-Stage Safety Workflow • MedDRA Dictionary Adapter • Expedited 24-Hour Clock • Disproportionality Feed
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 text-xs">
          {(['ALL', 'SAE', 'AE'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilterSeriousness(f)}
              className={`px-4 py-2 rounded-full font-bold transition ${
                filterSeriousness === f
                  ? 'bg-[#0B4D3C] text-white shadow-sm'
                  : 'bg-[#F4FBF7] text-[#526D61] hover:bg-[#EBF7F0] border border-[#D5E6DC]'
              }`}
            >
              {f === 'ALL'
                ? `All Events (${cases.length})`
                : f === 'SAE'
                ? `SAE Serious (${cases.filter((c) => c.is_serious).length})`
                : `Non-Serious AE (${cases.filter((c) => !c.is_serious).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Hero SAE Expedited Clock Banner (Material 3 Expressive Rose Container) */}
      <div className="p-6 rounded-[2.5rem] bg-gradient-to-r from-[#FFF1F2] via-white to-[#FFF1F2] border-2 border-rose-300 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-4">
          <div className="p-3.5 rounded-2xl bg-rose-500 text-white shrink-0 shadow-md shadow-rose-500/20 animate-pulse">
            <Clock className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-rose-700">
                ACTIVE EXPEDITED 24-HOUR REGULATORY REPORTING CLOCK
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-bold font-mono bg-rose-100 text-rose-800 rounded-full border border-rose-200">
                CASE PV-2026-0031
              </span>
            </div>
            <h2 className="text-base font-bold text-[#14231E] mt-1">
              Severe Acute Urticaria & Hepatic Transaminitis Spike (Study AYU-003)
            </h2>
            <p className="text-xs text-[#526D61] mt-0.5">
              Synthetic Subject: <strong className="font-mono text-[#0B4D3C] font-bold">SYN-P00219</strong> • Hospitalization overnight • Statutory filing deadline:
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 shrink-0">
          <div className="text-right">
            <div className="text-[10px] uppercase font-mono font-bold text-[#526D61]">Regulatory Clock</div>
            <div className="text-2xl sm:text-3xl font-mono font-black text-rose-600 tracking-wider">
              {countdown}
            </div>
          </div>
          <button
            onClick={() => {
              const hero = cases.find((c) => c.case_number === 'PV-2026-0031') || cases[0];
              if (hero) setSelectedCase(hero);
            }}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-full transition shadow-md shadow-rose-600/20"
          >
            Review & Advance Workflow →
          </button>
        </div>
      </div>

      {/* KPI Pastel Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Adverse Cases', value: cases.length, bg: 'bg-[#F4FBF7]', border: 'border-[#D5E6DC]', color: 'text-[#0B4D3C]', icon: ShieldAlert },
          { label: 'Serious Adverse Events (SAE)', value: cases.filter((c) => c.is_serious).length, bg: 'bg-[#FFF1F2]', border: 'border-[#FECDD3]', color: 'text-rose-700', icon: AlertTriangle },
          { label: 'Active PV Signals', value: signals.filter((s) => s.signal_state === 'DETECTED' || s.signal_state === 'UNDER_REVIEW').length, bg: 'bg-[#FEF3C7]', border: 'border-[#FDE68A]', color: 'text-amber-800', icon: Zap },
          { label: 'Closed & Archived Cases', value: cases.filter((c) => c.workflow_state === 'CLOSED').length, bg: 'bg-[#D7F5E8]', border: 'border-[#A7F3D0]', color: 'text-emerald-800', icon: Activity },
        ].map((kpi) => (
          <div key={kpi.label} className={`p-5 rounded-[2rem] ${kpi.bg} border ${kpi.border} shadow-sm`}>
            <div className="flex items-center justify-between text-[#526D61] text-xs mb-1 font-semibold">
              <span>{kpi.label}</span>
              <kpi.icon className="h-4 w-4" />
            </div>
            <div className={`text-3xl font-black font-mono ${kpi.color}`}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Severity Breakdown */}
        <div className="bg-white border border-[#E2EEE7] rounded-[2.5rem] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#14231E]">AE Severity Breakdown</h3>
              <p className="text-xs text-[#526D61]">Distribution of Non-Serious vs Serious AEs by severity grading</p>
            </div>
            <div className="p-2 rounded-full bg-[#FCE7F3] text-rose-700">
              <BarChart2 className="h-4 w-4" />
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityBreakdown} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F7F2" />
                <XAxis dataKey="name" stroke="#718E81" tick={{ fontSize: 10 }} />
                <YAxis stroke="#718E81" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#D5E6DC',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="AE" name="Non-Serious AE" fill="#0284C7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="SAE" name="Serious AE" fill="#E11D48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Signal Disproportionality Scatter */}
        <div className="bg-white border border-[#E2EEE7] rounded-[2.5rem] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#14231E]">Disproportionality Signal Map</h3>
              <p className="text-xs text-[#526D61]">Observed vs Expected incidence rate • Bubble = Relative Risk (RR×)</p>
            </div>
            <div className="p-2 rounded-full bg-[#FEF3C7] text-amber-800">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F7F2" />
                <XAxis dataKey="x" name="Observed %" stroke="#718E81" tick={{ fontSize: 10 }} />
                <YAxis dataKey="y" name="Expected %" stroke="#718E81" tick={{ fontSize: 10 }} />
                <ZAxis dataKey="z" range={[40, 240]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#D5E6DC',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  }}
                />
                <Scatter data={signalBubbleData} fill="#D97706" fillOpacity={0.75} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Grid: Cases Table & Signals Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className="lg:col-span-2 bg-white border border-[#E2EEE7] rounded-[2.5rem] p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-[#F0F7F2] mb-4">
            <div>
              <h3 className="text-base font-bold text-[#14231E]">Adverse Events Repository</h3>
              <p className="text-xs text-[#526D61]">{filteredCases.length} clinical safety events recorded</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#14231E]">
              <thead className="bg-[#F4FBF7] text-[#526D61] font-mono uppercase text-[10px] rounded-2xl">
                <tr>
                  <th className="py-3 px-3 rounded-l-2xl">Case #</th>
                  <th className="py-3 px-3">Adverse Term</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Severity</th>
                  <th className="py-3 px-3">Causality</th>
                  <th className="py-3 px-3">Workflow State</th>
                  <th className="py-3 px-3 rounded-r-2xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F7F2]">
                {filteredCases.map((c) => {
                  const isHero = c.case_number === 'PV-2026-0031';
                  const stageNum = WORKFLOW_STAGES.findIndex((s) => s.state === c.workflow_state) + 1;
                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCase(c)}
                      className={`hover:bg-[#F9FDFB] cursor-pointer transition ${
                        isHero ? 'bg-rose-50/40 font-semibold' : ''
                      }`}
                    >
                      <td className="py-3.5 px-3 font-mono font-bold text-[#0B4D3C] whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <span>{c.case_number}</span>
                          {isHero && <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 max-w-xs truncate font-medium text-[#14231E]">
                        {c.adverse_event_term}
                        {c.meddra_preferred_term && (
                          <div className="text-[10px] text-[#0B4D3C] font-mono font-bold">
                            PT: {c.meddra_preferred_term}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-3 font-mono whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            c.is_serious
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-[#EBF7F0] text-[#0B4D3C] border border-[#D1F2E2]'
                          }`}
                        >
                          {c.is_serious ? 'SAE' : 'AE'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-semibold">{c.severity}</td>
                      <td className="py-3.5 px-3 font-mono text-[#526D61]">{c.causality || 'UNASSESSED'}</td>
                      <td className="py-3.5 px-3 font-mono text-[#0B4D3C] whitespace-nowrap text-[11px] font-bold">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#EBF7F0] text-[#0B4D3C] border border-[#D1F2E2]">
                          Step {stageNum}/8
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button className="px-3.5 py-1 rounded-full bg-[#F4FBF7] hover:bg-[#EBF7F0] border border-[#D5E6DC] text-[#0B4D3C] text-[11px] font-bold transition">
                          Workflow →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signals Feed */}
        <div className="bg-white border border-[#E2EEE7] rounded-[2.5rem] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-[#14231E]">PV Signal Feed</h3>
              <div className="p-2 rounded-full bg-[#FEF3C7] text-amber-800">
                <Zap className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs text-[#526D61] mb-4">Observed vs expected disproportionality alerts</p>

            <div className="space-y-3 overflow-y-auto max-h-[420px] pr-1">
              {signals.map((sig) => (
                <div key={sig.id} className="p-3.5 bg-[#F4FBF7] rounded-2xl border border-[#D5E6DC] text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#0B4D3C]">{sig.signal_code}</span>
                    <span
                      className={`px-2 py-0.5 text-[9px] font-bold font-mono rounded-full ${
                        sig.signal_state === 'DETECTED'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {sig.signal_state}
                    </span>
                  </div>
                  <div className="font-semibold text-[#14231E] leading-snug">{sig.pattern_description}</div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#526D61]">
                    <span>Obs: <strong>{sig.observed_frequency}%</strong></span>
                    <span>Exp: <strong>{sig.expected_frequency}%</strong></span>
                    <span className="text-rose-700 font-bold">RR: {sig.relative_risk}×</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Spacious 8-Stage Sequential Safety Workflow Drawer (max-w-4xl, Material 3 Expressive) */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-full sm:max-w-4xl bg-[#F4FBF7] h-full overflow-y-auto flex flex-col shadow-2xl border-l border-[#D5E6DC] animate-in slide-in-from-right duration-300">
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 sm:px-8 py-4 sm:py-5 border-b border-[#E2EEE7] flex items-center justify-between shadow-xs">
              <div className="min-w-0 pr-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs sm:text-sm font-black px-2.5 py-1 rounded-full bg-[#EBF7F0] text-[#0B4D3C] border border-[#D1F2E2]">
                    {selectedCase.case_number}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-bold font-mono ${
                      selectedCase.is_serious
                        ? 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse'
                        : 'bg-[#EBF7F0] text-[#0B4D3C] border border-[#D1F2E2]'
                    }`}
                  >
                    {selectedCase.is_serious ? 'EXPEDITED SAE' : 'NON-SERIOUS AE'}
                  </span>
                  <span className="text-[11px] font-mono text-[#526D61]">
                    Onset: {selectedCase.onset_date?.slice(0, 10)}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-[#14231E] mt-1 truncate">{selectedCase.adverse_event_term}</h2>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#526D61] mt-0.5">
                  <span>
                    Subject: <strong className="font-mono text-[#0B4D3C]">SYN-P00219</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Reporter: <strong className="text-[#14231E]">{selectedCase.reporter_name}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Action: <strong className="text-[#14231E]">{selectedCase.action_taken}</strong>
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedCase(null)}
                className="p-2 rounded-full hover:bg-[#F4FBF7] text-[#526D61] hover:text-[#14231E] transition border border-[#E2EEE7] shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 sm:p-8 space-y-6 flex-1">
              {/* Progress Rate Visual Indicator */}
              <div className="p-4 sm:p-6 bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-[#E2EEE7] shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="text-[11px] font-mono uppercase font-bold text-[#526D61]">
                      Pharmacovigilance 8-Stage Gated Lifecycle
                    </div>
                    <div className="text-base font-bold text-[#14231E]">
                      Current Stage {currentActualIdx + 1} of 8: {WORKFLOW_STAGES[currentActualIdx].title}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-[#0B4D3C]">
                      {progressPercent}% Safety Review Completed
                    </span>
                    <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-[#EBF7F0] text-[#0B4D3C] border border-[#D1F2E2]">
                      {selectedCase.workflow_state}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#E2EEE7] h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#0B4D3C] via-[#10B981] to-[#059669] h-full rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* 8-Stage Sequential Stepper Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
                  {WORKFLOW_STAGES.map((step, idx) => {
                    const isCompleted = idx < currentActualIdx;
                    const isCurrent = idx === currentActualIdx;
                    const isViewing = idx === viewStepIndex;
                    const isFuture = idx > currentActualIdx;

                    return (
                      <button
                        key={step.state}
                        onClick={() => {
                          if (isCompleted || isCurrent) {
                            setViewStepIndex(idx);
                          } else {
                            alert(
                              `Stage Locked: You must complete Stage ${currentActualIdx + 1} (${WORKFLOW_STAGES[currentActualIdx].title}) before viewing or advancing to Stage ${idx + 1}.`
                            );
                          }
                        }}
                        className={`p-2.5 rounded-2xl text-left border transition relative flex flex-col justify-between ${
                          isViewing
                            ? 'ring-2 ring-[#0B4D3C] bg-white'
                            : ''
                        } ${
                          isCurrent
                            ? 'bg-[#0B4D3C] text-white border-[#0B4D3C] shadow-sm'
                            : isCompleted
                            ? 'bg-[#D7F5E8] text-[#065F46] border-[#A7F3D0]'
                            : 'bg-white text-[#718E81] border-[#E2EEE7] opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[10px] font-black">
                            {idx + 1}
                          </span>
                          {isCompleted ? (
                            <Check className="h-3 w-3 text-[#065F46]" />
                          ) : isCurrent ? (
                            <span className="h-2 w-2 rounded-full bg-emerald-300 animate-ping" />
                          ) : (
                            <Lock className="h-2.5 w-2.5 text-slate-400" />
                          )}
                        </div>
                        <div className="text-[10px] font-bold leading-tight line-clamp-2">
                          {step.shortTitle}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Three Drawer Content Tabs */}
              <div className="flex items-center space-x-2 border-b border-[#D5E6DC] pb-2 overflow-x-auto max-w-full whitespace-nowrap [-webkit-overflow-scrolling:touch]">
                {[
                  { id: 'WORKFLOW', label: 'Active Stage Workspace', icon: FileCheck },
                  { id: 'CLINICAL', label: 'Patient & Clinical Narrative', icon: User },
                  { id: 'REGULATORY', label: 'Regulatory Dossier & Audit', icon: ShieldCheck },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setDrawerTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition ${
                      drawerTab === tab.id
                        ? 'bg-[#0B4D3C] text-white shadow-sm'
                        : 'text-[#526D61] hover:text-[#14231E] hover:bg-white'
                    }`}
                  >
                    <tab.icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab 1: WORKFLOW ENGINE */}
              {drawerTab === 'WORKFLOW' && (
                <div className="space-y-6">
                  {/* Selected Stage Workspace Card */}
                  <div className="p-6 bg-white rounded-[2.5rem] border border-[#E2EEE7] shadow-sm space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F0F7F2] gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#EBF7F0] text-[#0B4D3C]">
                            STEP {activeViewingStage.stepNumber} OF 8
                          </span>
                          <span className="text-xs font-mono text-[#526D61] font-bold">
                            {activeViewingStage.subtitle}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-[#14231E] mt-1">{activeViewingStage.title}</h3>
                      </div>

                      {viewStepIndex !== currentActualIdx && (
                        <button
                          onClick={() => setViewStepIndex(currentActualIdx)}
                          className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition self-start sm:self-auto"
                        >
                          Jump to Current Stage ({currentActualIdx + 1}) →
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-[#526D61] leading-relaxed">
                      {activeViewingStage.description}
                    </p>

                    {/* Checklist Requirements */}
                    <div className="p-4 bg-[#F4FBF7] rounded-2xl border border-[#D5E6DC] space-y-2.5">
                      <div className="text-[10px] font-mono font-bold text-[#526D61] uppercase tracking-wider">
                        Stage Regulatory Checklist & Criteria
                      </div>
                      <div className="space-y-2">
                        {activeViewingStage.checklist.map((item, cIdx) => (
                          <div key={cIdx} className="flex items-center space-x-2.5 text-xs text-[#14231E]">
                            <div className="h-4 w-4 rounded-full bg-[#D7F5E8] text-[#065F46] flex items-center justify-center shrink-0">
                              <Check className="h-2.5 w-2.5" />
                            </div>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Step-Specific Interactive Workspace */}

                    {/* 1) MEDDRA CODING WORKSPACE (Step 4) */}
                    {activeViewingStage.state === 'CODING' && (
                      <div className="p-5 bg-gradient-to-r from-[#F4FBF7] to-white rounded-[2rem] border border-[#D5E6DC] space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <BookOpen className="h-5 w-5 text-[#0B4D3C]" />
                            <h4 className="text-sm font-bold text-[#14231E]">
                              MedDRA Concept Dictionary Adapter
                            </h4>
                          </div>
                          <button
                            onClick={() => {
                              handleSearchCoding('');
                              setShowCodingModal(true);
                            }}
                            className="px-4 py-2 rounded-full bg-[#0B4D3C] hover:bg-[#08382B] text-white text-xs font-bold transition shadow-xs flex items-center space-x-1.5"
                          >
                            <Search className="h-3.5 w-3.5" />
                            <span>Lookup / Change MedDRA Term</span>
                          </button>
                        </div>

                        {selectedCase.meddra_code ? (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div className="p-3.5 bg-white rounded-2xl border border-[#E2EEE7]">
                              <span className="text-[10px] font-mono text-[#526D61] uppercase font-bold">Preferred Term (PT)</span>
                              <div className="font-bold text-[#14231E] text-sm mt-0.5">
                                {selectedCase.meddra_preferred_term}
                              </div>
                            </div>
                            <div className="p-3.5 bg-white rounded-2xl border border-[#E2EEE7]">
                              <span className="text-[10px] font-mono text-[#526D61] uppercase font-bold">System Organ Class (SOC)</span>
                              <div className="font-bold text-[#14231E] text-sm mt-0.5">
                                {selectedCase.meddra_soc_term}
                              </div>
                            </div>
                            <div className="p-3.5 bg-white rounded-2xl border border-[#E2EEE7]">
                              <span className="text-[10px] font-mono text-[#526D61] uppercase font-bold">Concept Code</span>
                              <div className="font-bold font-mono text-[#0B4D3C] text-sm mt-0.5">
                                {selectedCase.meddra_code}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-3">
                            <AlertTriangle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                            <div>
                              <strong className="font-bold">MedDRA Term Unassigned:</strong> This case does not have a registered MedDRA Preferred Term. Click "Lookup / Change MedDRA Term" above to map the clinical term from the dictionary.
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 2) CAUSALITY ASSESSMENT WORKSPACE (Step 5) */}
                    {activeViewingStage.state === 'CAUSALITY_REVIEW' && (
                      <div className="p-5 bg-gradient-to-r from-[#F4FBF7] to-white rounded-[2rem] border border-[#D5E6DC] space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <ShieldAlert className="h-5 w-5 text-[#0B4D3C]" />
                            <h4 className="text-sm font-bold text-[#14231E]">
                              WHO-UMC & Ayush Pharmacovigilance Causality Rating
                            </h4>
                          </div>
                          {selectedCase.causality && (
                            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#EBF7F0] text-[#0B4D3C] border border-[#D1F2E2]">
                              Current: {selectedCase.causality}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {CAUSALITY_DEFINITIONS.map((cDef) => {
                            const isSelected = selectedCase.causality === cDef.value;
                            return (
                              <button
                                key={cDef.value}
                                onClick={() => handleApplyCausality(cDef.value)}
                                className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                                  isSelected
                                    ? 'border-[#0B4D3C] bg-white ring-2 ring-[#0B4D3C] shadow-sm'
                                    : 'border-[#E2EEE7] bg-white hover:bg-[#F4FBF7] hover:border-[#D5E6DC]'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${cDef.badgeBg}`}>
                                    {cDef.label}
                                  </span>
                                  {isSelected && <CheckCircle2 className="h-4 w-4 text-[#0B4D3C]" />}
                                </div>
                                <p className="text-[11px] text-[#526D61] leading-relaxed mt-1">
                                  {cDef.desc}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 3) REGULATORY ASSESSMENT WORKSPACE (Step 6) */}
                    {activeViewingStage.state === 'REGULATORY_ASSESSMENT' && (
                      <div className="p-5 bg-gradient-to-r from-[#F4FBF7] to-white rounded-[2rem] border border-[#D5E6DC] space-y-4">
                        <div className="flex items-center space-x-2">
                          <Award className="h-5 w-5 text-[#0B4D3C]" />
                          <h4 className="text-sm font-bold text-[#14231E]">
                            CDSCO & NDCT Rules 2019 Statutory Audit
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div className="p-4 bg-white rounded-2xl border border-[#E2EEE7]">
                            <div className="text-[10px] font-mono text-[#526D61] uppercase font-bold">24h Clock Status</div>
                            <div className="text-sm font-bold text-emerald-700 mt-0.5">COMPLIANT (10h Remaining)</div>
                            <div className="text-[10px] text-[#526D61] mt-1">Within statutory NDCT window</div>
                          </div>
                          <div className="p-4 bg-white rounded-2xl border border-[#E2EEE7]">
                            <div className="text-[10px] font-mono text-[#526D61] uppercase font-bold">Ethics Notification</div>
                            <div className="text-sm font-bold text-[#14231E] mt-0.5">Generated (IEC/2026/04)</div>
                            <div className="text-[10px] text-[#526D61] mt-1">Ready for dispatch</div>
                          </div>
                          <div className="p-4 bg-white rounded-2xl border border-[#E2EEE7]">
                            <div className="text-[10px] font-mono text-[#526D61] uppercase font-bold">Form 44 Annexure</div>
                            <div className="text-sm font-bold text-[#0B4D3C] mt-0.5">ICSR XML Formatted</div>
                            <div className="text-[10px] text-[#526D61] mt-1">E2B(R3) Interoperable</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 4) SUBMISSION WORKSPACE (Step 7) */}
                    {activeViewingStage.state === 'SUBMITTED' && (
                      <div className="p-5 bg-[#D7F5E8] rounded-[2rem] border border-[#A7F3D0] space-y-2 text-xs">
                        <div className="flex items-center space-x-2 text-[#065F46] font-bold">
                          <ShieldCheck className="h-5 w-5" />
                          <span>Official Regulatory Submission Dispatched</span>
                        </div>
                        <p className="text-[#14231E]">
                          Successfully transmitted to CDSCO SUGAM & NPvCC Gateway. Digital Receipt Token: <strong className="font-mono">SUB-PV-2026-X992A-SECURE</strong>
                        </p>
                      </div>
                    )}

                    {/* 5) CLOSED WORKSPACE (Step 8) */}
                    {activeViewingStage.state === 'CLOSED' && (
                      <div className="p-5 bg-[#D7F5E8] rounded-[2rem] border border-[#A7F3D0] space-y-2 text-xs">
                        <div className="flex items-center space-x-2 text-[#065F46] font-bold">
                          <Award className="h-5 w-5" />
                          <span>Pharmacovigilance Dossier Locked & Archived</span>
                        </div>
                        <p className="text-[#14231E]">
                          Clinical follow-up verified complete. Patient status: Recovered without sequelae. Electronic signoff locked under 21 CFR Part 11.
                        </p>
                      </div>
                    )}

                    {/* Stage Transition Controls (Only visible on current actual stage) */}
                    {viewStepIndex === currentActualIdx && (
                      <div className="pt-4 border-t border-[#F0F7F2] space-y-4">
                        {/* Gating Alert Banner if blocked */}
                        {isNextBlocked && (
                          <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start space-x-3 text-xs text-amber-900 animate-pulse">
                            <AlertTriangle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                            <div>
                              <strong className="font-bold">Next Stage Gate Blocked:</strong>{' '}
                              {isAtCoding && !isCoded
                                ? 'Please assign a MedDRA Preferred Term (PT) before advancing to Causality Review.'
                                : 'Please select a Causality category before advancing to Regulatory Assessment.'}
                            </div>
                          </div>
                        )}

                        {/* Optional Rationale Input for ALCOA+ Audit */}
                        <div>
                          <label className="block text-[11px] font-bold text-[#526D61] uppercase tracking-wider font-mono mb-1">
                            ALCOA+ Audit Transition Rationale (Optional):
                          </label>
                          <input
                            type="text"
                            value={transitionReason}
                            onChange={(e) => setTransitionReason(e.target.value)}
                            placeholder={`e.g. Clinical review verified by Dr. Rajesh; ${activeViewingStage.actionPrompt}`}
                            className="w-full px-4 py-2 text-xs rounded-full bg-[#F4FBF7] border border-[#D5E6DC] text-[#14231E] focus:outline-none focus:border-[#0B4D3C]"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                          <div>
                            {currentActualIdx > 0 && (
                              <button
                                onClick={handleRollbackStep}
                                disabled={transitioning}
                                className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5"
                              >
                                <ArrowLeft className="h-3.5 w-3.5" />
                                <span>Revert to Step {currentActualIdx}</span>
                              </button>
                            )}
                          </div>

                          <div className="flex items-center space-x-3">
                            {currentActualIdx < WORKFLOW_STAGES.length - 1 && (
                              <button
                                onClick={handleAdvanceStep}
                                disabled={transitioning || isNextBlocked}
                                className={`px-6 py-2.5 rounded-full text-xs font-bold transition shadow-sm flex items-center space-x-2 ${
                                  isNextBlocked
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    : 'bg-[#0B4D3C] hover:bg-[#08382B] text-white shadow-emerald-900/10'
                                }`}
                              >
                                <span>{transitioning ? 'Advancing...' : `Advance to Step ${currentActualIdx + 2}: ${WORKFLOW_STAGES[currentActualIdx + 1].shortTitle}`}</span>
                                <ArrowRight className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: CLINICAL CASE DETAILS & NARRATIVE */}
              {drawerTab === 'CLINICAL' && (
                <div className="space-y-6">
                  <div className="p-6 bg-white rounded-[2.5rem] border border-[#E2EEE7] shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-[#14231E] uppercase font-mono">
                      Clinical Safety Narrative
                    </h3>
                    <div className="p-5 bg-[#F4FBF7] rounded-2xl border border-[#D5E6DC] text-xs text-[#14231E] leading-relaxed">
                      {selectedCase.narrative || 'No clinical narrative provided.'}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                      <div className="p-4 bg-[#F4FBF7] rounded-2xl border border-[#D5E6DC]">
                        <div className="text-[10px] uppercase font-mono font-bold text-[#526D61]">Action with Drug</div>
                        <div className="font-bold text-[#14231E] mt-0.5">{selectedCase.action_taken}</div>
                      </div>
                      <div className="p-4 bg-[#F4FBF7] rounded-2xl border border-[#D5E6DC]">
                        <div className="text-[10px] uppercase font-mono font-bold text-[#526D61]">Severity Grading</div>
                        <div className="font-bold text-rose-700 mt-0.5">{selectedCase.severity}</div>
                      </div>
                      <div className="p-4 bg-[#F4FBF7] rounded-2xl border border-[#D5E6DC]">
                        <div className="text-[10px] uppercase font-mono font-bold text-[#526D61]">Expectedness</div>
                        <div className="font-bold text-[#14231E] mt-0.5">{selectedCase.expectedness}</div>
                      </div>
                      <div className="p-4 bg-[#F4FBF7] rounded-2xl border border-[#D5E6DC]">
                        <div className="text-[10px] uppercase font-mono font-bold text-[#526D61]">Reporting Investigator</div>
                        <div className="font-bold text-[#14231E] mt-0.5">{selectedCase.reporter_name}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: REGULATORY DOSSIER & AUDIT */}
              {drawerTab === 'REGULATORY' && (
                <div className="space-y-6">
                  <div className="p-6 bg-white rounded-[2.5rem] border border-[#E2EEE7] shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-[#14231E] uppercase font-mono">
                      Regulatory Audit & Statutory Compliance
                    </h3>
                    <div className="space-y-3 text-xs text-[#14231E]">
                      <div className="flex justify-between py-2 border-b border-[#F0F7F2]">
                        <span className="text-[#526D61]">Statutory Guideline:</span>
                        <span className="font-bold font-mono text-[#0B4D3C]">NDCT Rules 2019 / GCP-ASU / CDSCO SUGAM</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-[#F0F7F2]">
                        <span className="text-[#526D61]">Expedited 24h Reporting Deadline:</span>
                        <span className="font-mono font-bold text-rose-700">
                          {selectedCase.reporting_deadline || '24 Hours from Onset'}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-[#F0F7F2]">
                        <span className="text-[#526D61]">National Pharmacovigilance Centre:</span>
                        <span className="font-bold text-[#14231E]">NPvCC, All India Institute of Ayurveda (AIIA)</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-[#526D61]">Digital Signature Token:</span>
                        <span className="font-mono text-[#0B4D3C] font-bold">
                          SHA256: 4a9f...e291 (GCP-ASU Compliant)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MedDRA Coding Dictionary Modal */}
      {showCodingModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] border border-[#D5E6DC] max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#F0F7F2] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#14231E]">MedDRA Coding Lookup</h3>
                <p className="text-xs text-[#526D61]">WHO-Drug & MedDRA Concept Dictionary</p>
              </div>
              <button
                onClick={() => setShowCodingModal(false)}
                className="p-1.5 rounded-full hover:bg-[#F4FBF7] text-[#526D61]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="h-4 w-4 absolute left-4 top-3 text-[#526D61]" />
              <input
                type="text"
                placeholder="Search preferred terms (e.g., Urticaria, Hepatic, Rash)..."
                value={codingQuery}
                onChange={(e) => handleSearchCoding(e.target.value)}
                className="w-full pl-11 pr-4 py-2 rounded-full bg-[#F4FBF7] border border-[#D5E6DC] text-xs text-[#14231E] focus:outline-none focus:border-[#0B4D3C] focus:bg-white transition"
              />
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {codingResults.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#526D61]">
                  Type in the box above to search the MedDRA dictionary.
                </div>
              ) : (
                codingResults.map((t) => (
                  <div
                    key={t.code}
                    onClick={() => handleApplyTerm(t)}
                    className="p-3.5 rounded-2xl bg-[#F4FBF7] hover:bg-[#EBF7F0] border border-[#D5E6DC] hover:border-[#0B4D3C] cursor-pointer text-xs transition flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-[#14231E]">{t.preferred_term}</div>
                      <div className="text-[11px] text-[#526D61]">{t.soc_term}</div>
                    </div>
                    <span className="font-mono text-[11px] text-[#0B4D3C] font-bold bg-white px-2.5 py-1 rounded-full border border-[#D5E6DC]">
                      {t.code}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

