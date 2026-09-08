import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client';
import { Study, Site, Participant, DataQuery, ProtocolDeviation, MonitoringVisit, SafetyCase } from '../types';
import {
  FlaskConical,
  Building2,
  Users,
  Eye,
  CheckSquare,
  ShieldAlert,
  Scale,
  History,
  TrendingUp,
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export const StudyWorkspace: React.FC = () => {
  const { studyCode } = useParams<{ studyCode: string }>();
  const [study, setStudy] = useState<Study | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [curveData, setCurveData] = useState<any[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [queries, setQueries] = useState<DataQuery[]>([]);
  const [deviations, setDeviations] = useState<ProtocolDeviation[]>([]);
  const [safetyCases, setSafetyCases] = useState<SafetyCase[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const lifecycleStages = [
    'PROTOCOL',
    'IEC_SUBMISSION',
    'IEC_APPROVAL',
    'CTRI_REGISTRATION',
    'SITE_ACTIVATION',
    'RECRUITMENT',
    'TREATMENT',
    'FOLLOW_UP',
    'DATABASE_LOCK',
    'CLOSE_OUT',
  ];

  useEffect(() => {
    if (!studyCode) return;
    setLoading(true);

    apiRequest<Study>(`/studies/${studyCode}`)
      .then((st) => {
        setStudy(st);
        return Promise.all([
          apiRequest<any[]>(`/studies/${st.id}/recruitment-curve`),
          apiRequest<Site[]>('/sites'),
          apiRequest<DataQuery[]>(`/queries?study_id=${st.id}`),
          apiRequest<ProtocolDeviation[]>(`/deviations?study_id=${st.id}`),
          apiRequest<SafetyCase[]>(`/safety/cases?study_id=${st.id}`),
        ]);
      })
      .then(([curve, sList, qList, dList, scList]) => {
        setCurveData(curve);
        setSites(sList);
        setQueries(qList);
        setDeviations(dList);
        setSafetyCases(scList);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [studyCode]);

  const handleStageAdvance = async (nextStage: string) => {
    if (!study) return;
    try {
      const updated = await apiRequest<Study>(`/studies/${study.id}/transition`, {
        method: 'POST',
        body: JSON.stringify({ target_stage: nextStage, reason: 'Advanced stage in Study Workspace' }),
      });
      setStudy(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to advance lifecycle stage');
    }
  };

  if (loading || !study) {
    return (
      <div className="flex items-center justify-center h-80 text-[#526D61] text-xs font-mono">
        <div className="flex items-center space-x-3 bg-white px-6 py-4 rounded-3xl shadow-sm border border-[#E2EEE7]">
          <div className="h-5 w-5 rounded-full border-2 border-[#0B4D3C] border-t-transparent animate-spin"></div>
          <span>Loading Clinical Study Workspace for {studyCode}...</span>
        </div>
      </div>
    );
  }

  const currentStageIndex = lifecycleStages.indexOf(study.lifecycle_stage);
  const isHero = study.study_code === 'AYU-003';

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-[2rem] border border-[#E2EEE7] shadow-sm">
        <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 min-w-0">
          <button
            onClick={() => navigate('/studies')}
            className="p-2 sm:p-2.5 rounded-full bg-[#F4FBF7] hover:bg-[#EBF7F0] text-[#526D61] hover:text-[#0B4D3C] transition border border-[#D5E6DC] shrink-0"
            title="Return to Studies Portfolio"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-lg sm:text-xl font-black text-[#0B4D3C]">{study.study_code}</span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#EBF7F0] text-[#0B4D3C] font-mono font-bold border border-[#D1F2E2]">
                {study.protocol_version}
              </span>
              {isHero && (
                <span className="px-2.5 py-0.5 text-[10px] bg-rose-100 text-rose-800 border border-rose-200 font-bold rounded-full animate-pulse">
                  HERO DEMO STUDY • AT RISK
                </span>
              )}
            </div>
            <h1 className="text-xs sm:text-sm font-bold text-[#14231E] mt-0.5 line-clamp-2">{study.title}</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs shrink-0">
          <div className="px-3.5 py-1.5 rounded-full bg-[#F4FBF7] border border-[#D5E6DC] font-mono text-xs">
            <span className="text-[#526D61] font-semibold">Risk Score: </span>
            <strong className={study.risk_score > 60 ? 'text-rose-600 font-extrabold' : 'text-[#0B4D3C] font-extrabold'}>
              {study.risk_score.toFixed(1)} / 100
            </strong>
          </div>
          <button
            onClick={() => navigate('/reports')}
            className="px-4 py-1.5 rounded-full bg-[#0B4D3C] hover:bg-[#07382B] text-white font-bold transition shadow-sm text-xs"
          >
            CDISC Export
          </button>
        </div>
      </div>

      {/* Visual 10-Stage Lifecycle Stepper */}
      <div className="bg-white border border-[#E2EEE7] rounded-[2rem] p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 text-xs font-bold text-[#14231E] gap-2">
          <span className="flex items-center space-x-2">
            <Layers className="h-4 w-4 text-[#0B4D3C]" />
            <span>Clinical Trial Lifecycle Pipeline</span>
          </span>
          <span className="font-mono text-[#0B4D3C] text-[11px] bg-[#EBF7F0] px-3 py-1 rounded-full border border-[#D1F2E2] self-start sm:self-auto">
            Current Stage: {study.lifecycle_stage}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {lifecycleStages.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            return (
              <button
                key={stage}
                onClick={() => handleStageAdvance(stage)}
                className={`py-2 px-1.5 sm:py-2.5 sm:px-2 text-center rounded-2xl text-[10px] font-mono transition border ${
                  isCurrent
                    ? 'bg-[#0B4D3C] text-white border-[#0B4D3C] font-bold shadow-sm'
                    : isCompleted
                    ? 'bg-[#D7F5E8] text-[#065F46] border-[#A7F3D0] font-bold'
                    : 'bg-[#F4FBF7] text-[#718E81] border-[#D5E6DC] hover:border-[#0B4D3C]'
                }`}
                title={`Click to set stage to ${stage}`}
              >
                <div className={`text-[9px] ${isCurrent ? 'text-[#D1F2E2]' : 'text-[#718E81]'}`}>{idx + 1}</div>
                <div className="truncate font-bold mt-0.5">{stage.replace(/_/g, ' ')}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Workspace Tabs Header */}
      <div className="bg-white border border-[#E2EEE7] rounded-[2rem] p-2 flex space-x-1 overflow-x-auto text-xs shadow-sm max-w-full whitespace-nowrap [-webkit-overflow-scrolling:touch]">
        {[
          { id: 'overview', label: 'Overview & S-Curve', icon: TrendingUp },
          { id: 'sites', label: `Sites (${sites.length})`, icon: Building2 },
          { id: 'queries', label: `Data Queries (${queries.length})`, icon: CheckSquare },
          { id: 'deviations', label: `Deviations (${deviations.length})`, icon: AlertTriangle },
          { id: 'safety', label: `Safety / SAE (${safetyCases.length})`, icon: ShieldAlert },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full font-bold transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#0B4D3C] text-white shadow-sm'
                : 'text-[#526D61] hover:text-[#14231E] hover:bg-[#F4FBF7]'
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Overview & S-Curve */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-[#E2EEE7] rounded-[2rem] p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#14231E] mb-1">Recruitment Trajectory: Planned vs Actual</h3>
            <p className="text-xs text-[#526D61] mb-4">
              Monitoring enrollment velocity against protocol targets.
            </p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={curveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="studyTarget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0B4D3C" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0B4D3C" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="studyActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284C7" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F7F2" />
                  <XAxis dataKey="month" stroke="#718E81" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#718E81" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D5E6DC', borderRadius: '0.75rem', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="monotone" dataKey="target" stroke="#0B4D3C" strokeWidth={2} fillOpacity={1} fill="url(#studyTarget)" name="Target Enrollment" />
                  <Area type="monotone" dataKey="actual" stroke="#0284C7" strokeWidth={2} fillOpacity={1} fill="url(#studyActual)" name="Actual Enrollment" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {isHero && (
              <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 flex items-start space-x-2.5">
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
                <div>
                  <strong className="font-bold text-rose-950">Critical Recruitment Lag Alert:</strong>
                  <span> Current enrollment (105) is lagging target trajectory (190) by 85 subjects (-44.7% velocity). Site activation acceleration required at regional extension sites.</span>
                </div>
              </div>
            )}
          </div>

          {/* Protocol Dossier Sidebar */}
          <div className="space-y-4">
            <div className="bg-white border border-[#E2EEE7] rounded-[2rem] p-6 text-xs space-y-3.5 shadow-sm">
              <h4 className="font-bold text-[#14231E] border-b border-[#F0F7F2] pb-2 text-sm">Protocol Dossier Summary</h4>
              <div>
                <span className="text-[#526D61] font-semibold">Therapeutic Area:</span>
                <div className="font-bold text-[#14231E] mt-0.5">{study.therapeutic_area}</div>
              </div>
              <div>
                <span className="text-[#526D61] font-semibold">Investigational Formulation:</span>
                <div className="font-bold text-[#0B4D3C] mt-0.5">{study.intervention_type}</div>
              </div>
              <div>
                <span className="text-[#526D61] font-semibold">Target Cohort:</span>
                <div className="font-bold text-[#14231E] mt-0.5">{study.population}</div>
              </div>
              <div>
                <span className="text-[#526D61] font-semibold">Primary Endpoint:</span>
                <div className="text-[#364F44] mt-1 leading-relaxed bg-[#F4FBF7] p-3 rounded-2xl border border-[#D5E6DC]">
                  {study.primary_objective || 'Not specified'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Sites */}
      {activeTab === 'sites' && (
        <div className="bg-white border border-[#E2EEE7] rounded-[2rem] p-6 shadow-sm overflow-hidden text-xs">
          <table className="w-full text-left text-[#14231E]">
            <thead className="bg-[#F4FBF7] text-[#526D61] font-mono uppercase text-[10px] rounded-xl">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Site Code</th>
                <th className="py-3 px-4">Institutional Site Name</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Target vs Enrolled</th>
                <th className="py-3 px-4">Monitoring Status</th>
                <th className="py-3 px-4 rounded-r-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F7F2]">
              {sites.slice(0, 6).map((site) => {
                const isBlr = site.site_code === 'SITE-BLR-02';
                return (
                  <tr
                    key={site.id}
                    onClick={() => navigate('/sites')}
                    className={`hover:bg-[#F9FDFB] cursor-pointer transition ${isBlr ? 'bg-rose-50/40 font-medium' : ''}`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0B4D3C] flex items-center space-x-2">
                      <span>{site.site_code}</span>
                      {isBlr && <span className="text-[9px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">DEFICIENT</span>}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#14231E]">{site.site_name}</td>
                    <td className="py-3.5 px-4 text-[#526D61]">{site.city}, {site.state}</td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      {isBlr ? <span className="text-rose-700">48 / 100 (Lagging)</span> : <span className="text-[#0B4D3C]">50 / 50 (Target Met)</span>}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        site.monitoring_status === 'OVERDUE_ACTION'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-[#D7F5E8] text-[#065F46] border border-[#A7F3D0]'
                      }`}>
                        {site.monitoring_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <ChevronRight className="h-4 w-4 text-[#526D61] inline" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Queries */}
      {activeTab === 'queries' && (
        <div className="bg-white border border-[#E2EEE7] rounded-[2rem] p-6 shadow-sm overflow-hidden text-xs">
          <table className="w-full text-left text-[#14231E]">
            <thead className="bg-[#F4FBF7] text-[#526D61] font-mono uppercase text-[10px] rounded-xl">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Query Code</th>
                <th className="py-3 px-4">eCRF Field</th>
                <th className="py-3 px-4">Discrepancy Issue</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 rounded-r-xl text-right">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F7F2]">
              {queries.map((q) => (
                <tr key={q.id} className="hover:bg-[#F9FDFB] transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0B4D3C]">{q.query_code}</td>
                  <td className="py-3.5 px-4 font-bold text-[#0284C7]">{q.field_name}</td>
                  <td className="py-3.5 px-4 max-w-md text-[#364F44]">{q.issue}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      q.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {q.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold">{q.status}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-[#526D61]">{q.due_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 4: Deviations */}
      {activeTab === 'deviations' && (
        <div className="space-y-4">
          {deviations.length > 0 && (
            <div className="p-4 bg-white border border-[#E2EEE7] rounded-[2rem] flex flex-wrap gap-3 text-xs shadow-sm">
              {[
                { label: 'Total', value: deviations.length, color: 'text-[#14231E]' },
                { label: 'Critical', value: deviations.filter(d => d.severity === 'CRITICAL').length, color: 'text-rose-700' },
                { label: 'Major', value: deviations.filter(d => d.severity === 'MAJOR').length, color: 'text-amber-800' },
                { label: 'CAPA Required', value: deviations.filter(d => d.status === 'CAPA_REQUIRED').length, color: 'text-orange-700' },
                { label: 'Closed', value: deviations.filter(d => d.status === 'CLOSED').length, color: 'text-emerald-800' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center space-x-2 bg-[#F4FBF7] border border-[#D5E6DC] rounded-full px-4 py-1.5 font-medium">
                  <span className="text-[#526D61]">{stat.label}:</span>
                  <span className={`font-mono font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="bg-white border border-[#E2EEE7] rounded-[2rem] p-6 shadow-sm overflow-hidden text-xs">
            <table className="w-full text-left text-[#14231E]">
              <thead className="bg-[#F4FBF7] text-[#526D61] font-mono uppercase text-[10px] rounded-xl">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Deviation Code</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Incident Description</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">CAPA Action</th>
                  <th className="py-3 px-4 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F7F2]">
                {deviations.map((d) => (
                  <tr key={d.id} className={`hover:bg-[#F9FDFB] transition ${d.severity === 'CRITICAL' ? 'bg-rose-50/40' : ''}`}>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0B4D3C] whitespace-nowrap">{d.deviation_code}</td>
                    <td className="py-3.5 px-4 font-bold text-[#14231E] whitespace-nowrap">{d.category}</td>
                    <td className="py-3.5 px-4 max-w-xs text-[#364F44]">{d.description}</td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        d.severity === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : d.severity === 'MAJOR'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-[#F4FBF7] text-[#526D61] border border-[#D5E6DC]'
                      }`}>
                        {d.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-[200px] truncate text-[#0B4D3C] font-medium">
                      {d.corrective_action || <span className="text-[#889E93] italic">No CAPA logged</span>}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        d.status === 'CLOSED'
                          ? 'bg-[#D7F5E8] text-[#065F46] border border-[#A7F3D0]'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Safety */}
      {activeTab === 'safety' && (
        <div className="bg-white border border-[#E2EEE7] rounded-[2rem] p-6 shadow-sm overflow-hidden text-xs">
          <table className="w-full text-left text-[#14231E]">
            <thead className="bg-[#F4FBF7] text-[#526D61] font-mono uppercase text-[10px] rounded-xl">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Case #</th>
                <th className="py-3 px-4">Event Term</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Workflow State</th>
                <th className="py-3 px-4 rounded-r-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F7F2]">
              {safetyCases.map((sc) => (
                <tr key={sc.id} onClick={() => navigate('/safety')} className="hover:bg-[#F9FDFB] cursor-pointer transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0B4D3C]">{sc.case_number}</td>
                  <td className="py-3.5 px-4 font-bold text-[#14231E]">{sc.adverse_event_term}</td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      sc.is_serious ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-[#EBF7F0] text-[#0B4D3C] border border-[#D1F2E2]'
                    }`}>
                      {sc.is_serious ? 'SAE (Expedited)' : 'Non-Serious AE'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold">{sc.severity}</td>
                  <td className="py-3.5 px-4 font-mono text-[#0B4D3C] font-bold">{sc.workflow_state}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="px-3 py-1 rounded-full bg-[#F4FBF7] hover:bg-[#EBF7F0] border border-[#D5E6DC] text-[#0B4D3C] text-[11px] font-bold transition">
                      Inspect Clock →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
