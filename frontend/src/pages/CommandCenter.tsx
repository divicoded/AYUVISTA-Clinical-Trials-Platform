import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client';
import { PortfolioMetrics, HealthMatrixItem } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  FlaskConical,
  Users,
  Building2,
  AlertOctagon,
  ShieldAlert,
  FileQuestion,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Activity,
  Calendar,
  Clock,
  Sparkles,
  ArrowUpRight,
  HeartPulse,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
} from 'recharts';
import gsap from 'gsap';

export const CommandCenter: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null);
  const [healthMatrix, setHealthMatrix] = useState<HealthMatrixItem[]>([]);
  const [recruitmentTrend, setRecruitmentTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const alertCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      apiRequest<PortfolioMetrics>('/command-center/metrics'),
      apiRequest<HealthMatrixItem[]>('/command-center/health-matrix'),
      apiRequest<any[]>('/command-center/recruitment-trend'),
    ])
      .then(([m, hm, rt]) => {
        setMetrics(m);
        setHealthMatrix(hm);
        setRecruitmentTrend(rt);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Trigger GSAP entrance animations once content loads
  useEffect(() => {
    if (!loading) {
      if (bannerRef.current) {
        gsap.fromTo(
          bannerRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );
      }
      if (alertCardRef.current) {
        gsap.fromTo(
          alertCardRef.current,
          { opacity: 0, scale: 0.98 },
          { opacity: 1, scale: 1, duration: 0.5, delay: 0.15, ease: 'power2.out' }
        );
      }
      if (cardsContainerRef.current) {
        gsap.fromTo(
          cardsContainerRef.current.children,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.45, delay: 0.25, ease: 'back.out(1.2)' }
        );
      }
    }
  }, [loading]);

  const getStatusPill = (status: string) => {
    switch (status) {
      case 'Healthy':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#D7F5E8] text-[#065F46] border border-[#A7F3D0]">
            Healthy
          </span>
        );
      case 'Watch':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
            Watch
          </span>
        );
      case 'At Risk':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FFEDD5] text-[#C2410C] border border-[#FED7AA] animate-pulse">
            At Risk
          </span>
        );
      case 'Critical':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FCE7F3] text-[#BE185D] border border-[#FBCFE8] animate-pulse">
            Critical
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#E8F1EC] text-[#364F44]">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80 text-[#526D61] text-xs font-mono">
        <div className="flex items-center space-x-3 bg-white px-6 py-4 rounded-3xl shadow-sm border border-[#E2EEE7]">
          <div className="h-5 w-5 rounded-full border-2 border-[#0B4D3C] border-t-transparent animate-spin"></div>
          <span>Loading Clinical Portfolio Analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* M3 Expressive Welcome Header Banner */}
      <div
        ref={bannerRef}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-[2rem] border border-[#E2EEE7] shadow-[0_4px_20px_rgba(0,40,25,0.03)]"
      >
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EBF7F0] border border-[#D1F2E2] text-xs font-bold text-[#0B4D3C] mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>National Ayurveda Clinical Surveillance Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14231E] tracking-tight">
            Good day, {user?.full_name || 'Investigator'}
          </h1>
          <p className="text-xs sm:text-sm text-[#526D61] mt-1 font-medium">
            AYUVISTA portfolio intelligence: 25 active clinical protocols, 40 trial sites nationwide, and 1 expedited safety surveillance clock.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => navigate('/studies')}
            className="px-4 py-2.5 rounded-full bg-[#F4FBF7] hover:bg-[#EBF7F0] border border-[#D5E6DC] text-[#0B4D3C] text-xs font-bold transition shadow-sm active:scale-95"
          >
            Explore Studies
          </button>
          <button
            onClick={() => navigate('/studies/AYU-003')}
            className="px-5 py-2.5 rounded-full bg-[#0B4D3C] hover:bg-[#07382B] text-white text-xs font-bold shadow-md shadow-[#0B4D3C]/20 transition flex items-center space-x-1.5 active:scale-95"
          >
            <span>Hero Study AYU-003</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Hero Operational Alert Card */}
      <div
        ref={alertCardRef}
        className="p-4 sm:p-6 rounded-[2rem] bg-gradient-to-r from-[#FFF1F2] via-white to-[#FDF2F8] border-2 border-[#FECDD3] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div className="flex items-start space-x-3 sm:space-x-4">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-[#FFE4E6] text-[#BE123C] shrink-0 shadow-sm">
            <AlertOctagon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-[#E11D48]">
                OPERATIONAL JEOPARDY DETECTED: STUDY AYU-003
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold font-mono bg-[#FFE4E6] text-[#BE123C] rounded-full border border-[#FECDD3]">
                RISK INDEX: 78.5 / 100
              </span>
            </div>
            <h2 className="text-sm font-bold text-[#14231E] mt-1">
              Formulation Trial in Post-Viral Fatigue (Guduchi-Pippali)
            </h2>
            <p className="text-xs text-[#526D61] mt-0.5 leading-relaxed">
              Recruitment lag (42% of target), 1 overdue CRA monitoring visit &amp; 14 open queries at Bengaluru site, and an active expedited 24h SAE reporting clock.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/studies/AYU-003')}
          className="shrink-0 w-full sm:w-auto px-5 py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-full text-xs font-bold shadow-md transition flex items-center justify-center space-x-1.5 active:scale-95"
        >
          <span>Open Workspace</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* M3 Expressive Pastel Metric Cards with GSAP Stagger */}
      <div ref={cardsContainerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Active Trials (Pastel Mint) */}
        <div
          onClick={() => navigate('/studies')}
          className="p-5 rounded-[2rem] bg-[#D7F5E8] border border-[#B6EAD2] flex flex-col justify-between shadow-sm hover:shadow-md transition cursor-pointer hover:-translate-y-1 duration-200"
        >
          <div className="flex items-center justify-between text-[#0B4D3C]">
            <span className="text-xs font-bold uppercase tracking-wider">Active Protocols</span>
            <div className="p-2 rounded-full bg-white/60 text-[#0B4D3C]">
              <FlaskConical className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-[#0B4D3C] font-mono">
              {metrics?.active_studies || 25}
            </div>
            <div className="text-[11px] font-semibold text-[#044031] mt-1 flex items-center space-x-1">
              <span>100% Onboarded CTRI</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Enrolled (Pastel Blue) */}
        <div
          onClick={() => navigate('/participants')}
          className="p-5 rounded-[2rem] bg-[#E0F2FE] border border-[#BAE6FD] flex flex-col justify-between shadow-sm hover:shadow-md transition cursor-pointer hover:-translate-y-1 duration-200"
        >
          <div className="flex items-center justify-between text-[#0369A1]">
            <span className="text-xs font-bold uppercase tracking-wider">Enrolled Subjects</span>
            <div className="p-2 rounded-full bg-white/60 text-[#0369A1]">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-[#0369A1] font-mono">
              {metrics?.total_participants?.toLocaleString() || '1,520'}
            </div>
            <div className="text-[11px] font-semibold text-[#075985] mt-1">
              {metrics?.recruitment_progress_pct}% of Portfolio Target
            </div>
          </div>
        </div>

        {/* Card 3: Active Trial Sites (Pastel Yellow) */}
        <div
          onClick={() => navigate('/sites')}
          className="p-5 rounded-[2rem] bg-[#FEF3C7] border border-[#FDE68A] flex flex-col justify-between shadow-sm hover:shadow-md transition cursor-pointer hover:-translate-y-1 duration-200"
        >
          <div className="flex items-center justify-between text-[#92400E]">
            <span className="text-xs font-bold uppercase tracking-wider">Active Sites</span>
            <div className="p-2 rounded-full bg-white/60 text-[#92400E]">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-[#92400E] font-mono">
              {metrics?.active_sites || 40}
            </div>
            <div className="text-[11px] font-semibold text-[#78350F] mt-1">
              Pan-India Ayush Network
            </div>
          </div>
        </div>

        {/* Card 4: Open Queries (Pastel Orange) */}
        <div
          onClick={() => navigate('/data-quality')}
          className="p-5 rounded-[2rem] bg-[#FFEDD5] border border-[#FED7AA] flex flex-col justify-between shadow-sm hover:shadow-md transition cursor-pointer hover:-translate-y-1 duration-200"
        >
          <div className="flex items-center justify-between text-[#C2410C]">
            <span className="text-xs font-bold uppercase tracking-wider">Data Queries</span>
            <div className="p-2 rounded-full bg-white/60 text-[#C2410C]">
              <FileQuestion className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-[#C2410C] font-mono">
              {metrics?.open_queries || 14}
            </div>
            <div className="text-[11px] font-semibold text-[#9A3412] mt-1">
              2 Critical Discrepancies
            </div>
          </div>
        </div>

        {/* Card 5: Safety AE / SAE (Pastel Pink) */}
        <div
          onClick={() => navigate('/safety')}
          className="p-5 rounded-[2rem] bg-[#FCE7F3] border border-[#FBCFE8] flex flex-col justify-between shadow-sm hover:shadow-md transition cursor-pointer hover:-translate-y-1 duration-200"
        >
          <div className="flex items-center justify-between text-[#BE185D]">
            <span className="text-xs font-bold uppercase tracking-wider">Safety Events</span>
            <div className="p-2 rounded-full bg-white/60 text-[#BE185D]">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="space-x-1.5 font-mono text-3xl font-extrabold text-[#BE185D]">
              <span>{metrics?.ae_cases || 65}</span>
              <span className="text-sm font-normal text-[#9D174D]">/</span>
              <span className="text-rose-700">{metrics?.sae_cases || 15}</span>
            </div>
            <div className="text-[11px] font-bold text-rose-800 mt-1">
              24h Expedited Clock Active
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Study Health Matrix & Recruitment S-Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study Health Matrix (Takes 2 columns) */}
        <div className="lg:col-span-2 bg-white border border-[#E2EEE7] rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,40,25,0.02)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F0F7F2] gap-2 mb-4">
            <div>
              <h3 className="text-base font-bold text-[#14231E]">Study Health Matrix</h3>
              <p className="text-xs text-[#526D61]">Multidimensional surveillance across 8 regulatory and operational vectors</p>
            </div>
            <button
              onClick={() => navigate('/studies')}
              className="text-xs font-bold text-[#0B4D3C] hover:underline self-start sm:self-auto"
            >
              View All 25 Studies →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#14231E]">
              <thead className="bg-[#F4FBF7] text-[#526D61] font-mono uppercase text-[10px] rounded-xl">
                <tr>
                  <th className="py-3 px-3 rounded-l-xl">Study Code</th>
                  <th className="py-3 px-3">Recruitment</th>
                  <th className="py-3 px-3">IEC / Ethics</th>
                  <th className="py-3 px-3">CTRI</th>
                  <th className="py-3 px-3">Sites</th>
                  <th className="py-3 px-3">Quality</th>
                  <th className="py-3 px-3">Safety</th>
                  <th className="py-3 px-3">Monitoring</th>
                  <th className="py-3 px-3 rounded-r-xl text-right">Risk Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F7F2]">
                {healthMatrix.slice(0, 8).map((item) => {
                  const isHero = item.study_code === 'AYU-003';
                  return (
                    <tr
                      key={item.study_code}
                      onClick={() => navigate(`/studies/${item.study_code}`)}
                      className={`hover:bg-[#F9FDFB] cursor-pointer transition rounded-xl ${
                        isHero ? 'bg-rose-50/40 font-semibold' : ''
                      }`}
                    >
                      <td className="py-3.5 px-3 font-mono font-bold text-[#0B4D3C] flex items-center space-x-2">
                        <span>{item.study_code}</span>
                        {isHero && <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>}
                      </td>
                      <td className="py-3.5 px-3">{getStatusPill(item.recruitment_status)}</td>
                      <td className="py-3.5 px-3">{getStatusPill(item.iec_status)}</td>
                      <td className="py-3.5 px-3">{getStatusPill(item.ctri_status)}</td>
                      <td className="py-3.5 px-3">{getStatusPill(item.sites_status)}</td>
                      <td className="py-3.5 px-3">{getStatusPill(item.dq_status)}</td>
                      <td className="py-3.5 px-3">{getStatusPill(item.safety_status)}</td>
                      <td className="py-3.5 px-3">{getStatusPill(item.monitoring_status)}</td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold">
                        <span className={item.risk_score > 60 ? 'text-rose-600 font-extrabold' : 'text-[#0B4D3C]'}>
                          {item.risk_score.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recruitment Trajectory S-Curve Chart (Right Column) */}
        <div className="bg-white border border-[#E2EEE7] rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,40,25,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-[#14231E]">Recruitment Trajectory</h3>
              <div className="p-2 rounded-full bg-[#EBF7F0] text-[#0B4D3C]">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs text-[#526D61] mb-4">Cumulative planned vs actual participant enrollment</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={recruitmentTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0B4D3C" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0B4D3C" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284C7" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F7F2" />
                  <XAxis dataKey="month" stroke="#718E81" textAnchor="end" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#718E81" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D5E6DC', borderRadius: '1rem', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Area type="monotone" dataKey="planned" stroke="#0B4D3C" strokeWidth={2} fillOpacity={1} fill="url(#colorPlanned)" name="Target S-Curve" />
                  <Area type="monotone" dataKey="actual" stroke="#0284C7" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" name="Actual Enrolled" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 p-3.5 bg-[#FEF3C7] rounded-2xl border border-[#FDE68A] text-xs flex items-center justify-between">
            <span className="text-[#92400E] font-medium">Estimated Portfolio Lag:</span>
            <span className="text-[#78350F] font-mono font-bold">-180 Participants</span>
          </div>
        </div>
      </div>

      {/* Portfolio Risk Score Heatmap */}
      <div className="bg-white border border-[#E2EEE7] rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,40,25,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F0F7F2] gap-2 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-[#D97706]" />
              <h3 className="text-base font-bold text-[#14231E]">Portfolio Risk Index Heatmap</h3>
            </div>
            <p className="text-xs text-[#526D61]">Deterministic composite risk evaluation across all active trials (0-100)</p>
          </div>
          <div className="flex items-center space-x-3 text-[11px] font-medium">
            <span className="flex items-center space-x-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#10B981] inline-block" /><span className="text-[#526D61]">Low (&lt;40)</span></span>
            <span className="flex items-center space-x-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B] inline-block" /><span className="text-[#526D61]">Watch (40-60)</span></span>
            <span className="flex items-center space-x-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#EF4444] inline-block" /><span className="text-[#526D61]">At Risk (&gt;60)</span></span>
          </div>
        </div>

        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[...healthMatrix].sort((a, b) => b.risk_score - a.risk_score).slice(0, 15)}
              margin={{ top: 5, right: 10, left: -20, bottom: 20 }}
              onClick={(data) => {
                if (data?.activePayload?.[0]?.payload?.study_code) {
                  navigate(`/studies/${data.activePayload[0].payload.study_code}`);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F7F2" />
              <XAxis
                dataKey="study_code"
                stroke="#718E81"
                tick={{ fontSize: 10 }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis stroke="#718E81" tick={{ fontSize: 10 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D5E6DC', borderRadius: '0.75rem', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                formatter={(v: any) => [`${v.toFixed(1)} / 100`, 'Risk Score']}
              />
              <Bar dataKey="risk_score" name="Risk Score" radius={[6, 6, 0, 0]} cursor="pointer">
                {[...healthMatrix].sort((a, b) => b.risk_score - a.risk_score).slice(0, 15).map((entry) => (
                  <Cell
                    key={entry.study_code}
                    fill={entry.risk_score > 60 ? '#EF4444' : entry.risk_score > 40 ? '#F59E0B' : '#10B981'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[11px] text-[#718E81] font-mono mt-2">
          Click any bar to open the study workspace • Showing top 15 by risk score • Hero study AYU-003 highlighted in red
        </p>
      </div>

      {/* Portfolio Status Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Healthy Protocols', value: healthMatrix.filter(h => h.risk_score <= 40).length, color: 'text-emerald-700', bg: 'bg-[#D7F5E8]', border: 'border-[#B6EAD2]', icon: CheckCircle2 },
          { label: 'Watch Protocols', value: healthMatrix.filter(h => h.risk_score > 40 && h.risk_score <= 60).length, color: 'text-amber-800', bg: 'bg-[#FEF3C7]', border: 'border-[#FDE68A]', icon: AlertTriangle },
          { label: 'At Risk (>60)', value: healthMatrix.filter(h => h.risk_score > 60).length, color: 'text-rose-700', bg: 'bg-[#FCE7F3]', border: 'border-[#FBCFE8]', icon: AlertOctagon },
          { label: 'Portfolio Avg Risk', value: healthMatrix.length ? (healthMatrix.reduce((s, h) => s + h.risk_score, 0) / healthMatrix.length).toFixed(1) : ' - ', color: 'text-[#0B4D3C]', bg: 'bg-[#EBF7F0]', border: 'border-[#D1F2E2]', icon: TrendingUp },
        ].map((kpi) => (
          <div key={kpi.label} className={`p-5 ${kpi.bg} border ${kpi.border} rounded-[2rem] flex items-center space-x-3.5 shadow-sm`}>
            <kpi.icon className={`h-8 w-8 ${kpi.color} shrink-0`} />
            <div>
              <div className={`text-2xl font-black font-mono ${kpi.color}`}>{kpi.value}</div>
              <div className="text-xs font-semibold text-[#526D61] mt-0.5">{kpi.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
