import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api/client';
import { Site, DataQuery, ProtocolDeviation, MonitoringVisit } from '../types';
import {
  Building2,
  Search,
  AlertTriangle,
  CheckCircle2,
  X,
  Sparkles,
  UserCheck,
  Calendar,
  ShieldCheck,
  Plus,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Sites: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLIANT' | 'PENDING_VISIT' | 'OVERDUE_ACTION'>('ALL');
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'QUERIES' | 'DEVIATIONS' | 'MONITORING'>('OVERVIEW');
  const [siteQueries, setSiteQueries] = useState<DataQuery[]>([]);
  const [siteDeviations, setSiteDeviations] = useState<ProtocolDeviation[]>([]);
  const [siteVisits, setSiteVisits] = useState<MonitoringVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerLoading, setDrawerLoading] = useState(false);

  // Query Resolution Form State
  const [answeringQueryId, setAnsweringQueryId] = useState<string | null>(null);
  const [queryResolutionText, setQueryResolutionText] = useState('');
  const [submittingQuery, setSubmittingQuery] = useState(false);

  // CAPA Form State
  const [capaDevId, setCapaDevId] = useState<string | null>(null);
  const [correctiveText, setCorrectiveText] = useState('');
  const [preventiveText, setPreventiveText] = useState('');
  const [submittingCapa, setSubmittingCapa] = useState(false);

  // Monitoring Schedule Form State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleMonitorName, setScheduleMonitorName] = useState('Mr. Rajesh Nair (Lead CRA)');
  const [scheduleVisitType, setScheduleVisitType] = useState('Interim Monitoring Visit #3');
  const [scheduleDate, setScheduleDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [submittingSchedule, setSubmittingSchedule] = useState(false);

  // Query Filter inside drawer
  const [queryStatusFilter, setQueryStatusFilter] = useState<'ALL' | 'OPEN' | 'ANSWERED' | 'CLOSED'>('ALL');

  const loadSites = () => {
    setLoading(true);
    apiRequest<Site[]>('/sites')
      .then(setSites)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSites();
  }, []);

  const openSiteDetail = async (site: Site) => {
    setSelectedSite(site);
    setActiveTab('OVERVIEW');
    setDrawerLoading(true);
    setAnsweringQueryId(null);
    setCapaDevId(null);
    try {
      const [q, d, m] = await Promise.all([
        apiRequest<DataQuery[]>(`/queries?site_id=${site.id}`),
        apiRequest<ProtocolDeviation[]>(`/deviations?site_id=${site.id}`),
        apiRequest<MonitoringVisit[]>(`/monitoring?site_id=${site.id}`),
      ]);
      setSiteQueries(q);
      setSiteDeviations(d);
      setSiteVisits(m);
    } catch (e) {
      console.error('Error fetching site details', e);
    } finally {
      setDrawerLoading(false);
    }
  };

  // Submit query resolution
  const handleAnswerQuery = async (queryId: string) => {
    if (!queryResolutionText.trim()) return;
    setSubmittingQuery(true);
    try {
      const updated = await apiRequest<DataQuery>(`/queries/${queryId}/answer`, {
        method: 'PUT',
        body: JSON.stringify({ resolution: queryResolutionText.trim() }),
      });
      setSiteQueries((prev) => prev.map((q) => (q.id === queryId ? updated : q)));
      setAnsweringQueryId(null);
      setQueryResolutionText('');
      if (selectedSite) {
        setSelectedSite({ ...selectedSite, query_count: Math.max(0, selectedSite.query_count - 1) });
        setSites((prev) =>
          prev.map((s) => (s.id === selectedSite.id ? { ...s, query_count: Math.max(0, s.query_count - 1) } : s))
        );
      }
    } catch (err: any) {
      alert(err.message || 'Error answering query');
    } finally {
      setSubmittingQuery(false);
    }
  };

  // Close query
  const handleCloseQuery = async (queryId: string) => {
    try {
      const updated = await apiRequest<DataQuery>(`/queries/${queryId}/close`, {
        method: 'PUT',
      });
      setSiteQueries((prev) => prev.map((q) => (q.id === queryId ? updated : q)));
    } catch (err: any) {
      alert(err.message || 'Error closing query');
    }
  };

  // Submit CAPA
  const handleRecordCapa = async (devId: string) => {
    if (!correctiveText.trim() || !preventiveText.trim()) {
      alert('Please provide both corrective and preventive actions.');
      return;
    }
    setSubmittingCapa(true);
    try {
      const updated = await apiRequest<ProtocolDeviation>(`/deviations/${devId}/capa`, {
        method: 'PUT',
        body: JSON.stringify({
          corrective_action: correctiveText.trim(),
          preventive_action: preventiveText.trim(),
          status: 'RESOLVED',
        }),
      });
      setSiteDeviations((prev) => prev.map((d) => (d.id === devId ? updated : d)));
      setCapaDevId(null);
      setCorrectiveText('');
      setPreventiveText('');
      if (selectedSite) {
        setSelectedSite({ ...selectedSite, deviations_count: Math.max(0, selectedSite.deviations_count - 1) });
        setSites((prev) =>
          prev.map((s) => (s.id === selectedSite.id ? { ...s, deviations_count: Math.max(0, s.deviations_count - 1) } : s))
        );
      }
    } catch (err: any) {
      alert(err.message || 'Error submitting CAPA');
    } finally {
      setSubmittingCapa(false);
    }
  };

  // Schedule Monitoring Visit
  const handleScheduleVisit = async () => {
    if (!selectedSite) return;
    setSubmittingSchedule(true);
    try {
      const newVisit = await apiRequest<MonitoringVisit>('/monitoring', {
        method: 'POST',
        body: JSON.stringify({
          site_id: selectedSite.id,
          monitor_name: scheduleMonitorName,
          visit_type: scheduleVisitType,
          planned_date: scheduleDate,
          findings: `Interim audit scheduled to inspect Source Data Verification (SDV) and close open cold-chain discrepancies.`,
        }),
      });
      setSiteVisits((prev) => [newVisit, ...prev]);
      setShowScheduleModal(false);

      const updatedSite = { ...selectedSite, monitoring_status: 'PENDING_VISIT' };
      setSelectedSite(updatedSite);
      setSites((prev) => prev.map((s) => (s.id === selectedSite.id ? updatedSite : s)));

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      alert(err.message || 'Error scheduling monitoring visit');
    } finally {
      setSubmittingSchedule(false);
    }
  };

  const filteredSites = sites.filter((s) => {
    const matchesSearch =
      s.site_code.toLowerCase().includes(search.toLowerCase()) ||
      s.site_name.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase()) ||
      s.state.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.monitoring_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const displayedQueries = siteQueries.filter((q) => {
    if (queryStatusFilter === 'ALL') return true;
    return q.status === queryStatusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[2.5rem] border border-[#E2EEE7] shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#EBF7F0] text-[#0B4D3C] text-[11px] font-bold mb-1">
            <Sparkles className="h-3 w-3" />
            <span>Site Performance Operations</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14231E] tracking-tight">Institutional Site Network</h1>
          <p className="text-xs text-[#526D61] mt-0.5">
            AIIA Collaborative Clinical Trial Centers across India ({sites.length} Active Centers)
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
          {(['ALL', 'COMPLIANT', 'PENDING_VISIT', 'OVERDUE_ACTION'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-full font-bold transition whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-[#0B4D3C] text-white shadow-sm'
                  : 'bg-[#F4FBF7] text-[#526D61] hover:bg-[#EBF7F0] border border-[#D5E6DC]'
              }`}
            >
              {st === 'ALL'
                ? `All Centers (${sites.length})`
                : st === 'COMPLIANT'
                ? `Compliant (${sites.filter((s) => s.monitoring_status === 'COMPLIANT').length})`
                : st === 'PENDING_VISIT'
                ? `Pending Visit (${sites.filter((s) => s.monitoring_status === 'PENDING_VISIT').length})`
                : `Overdue Action (${sites.filter((s) => s.monitoring_status === 'OVERDUE_ACTION').length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white border border-[#E2EEE7] rounded-[2rem] flex items-center shadow-sm">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-4 top-3 text-[#526D61]" />
          <input
            type="text"
            placeholder="Search by Site Code (e.g. SITE-BLR-02), Institution Name, City, or State..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#F4FBF7] border border-[#D5E6DC] text-xs text-[#14231E] placeholder-[#7D9A8D] focus:outline-none focus:border-[#0B4D3C] focus:bg-white transition"
          />
        </div>
      </div>

      {/* Site Performance Data Table */}
      <div className="bg-white border border-[#E2EEE7] rounded-[2.5rem] p-6 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#14231E]">
            <thead className="bg-[#F4FBF7] text-[#526D61] font-mono uppercase text-[10px] rounded-2xl">
              <tr>
                <th className="py-3.5 px-4 rounded-l-2xl">Site Code</th>
                <th className="py-3.5 px-4">Institution & City</th>
                <th className="py-3.5 px-4">State</th>
                <th className="py-3.5 px-4">Enrolled / Target</th>
                <th className="py-3.5 px-4 text-center">Open Queries</th>
                <th className="py-3.5 px-4 text-center">Deviations</th>
                <th className="py-3.5 px-4">Monitoring Status</th>
                <th className="py-3.5 px-4 rounded-r-2xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F7F2]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#526D61] font-mono">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-4 w-4 rounded-full border-2 border-[#0B4D3C] border-t-transparent animate-spin" />
                      <span>Loading Institutional Clinical Sites...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredSites.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#526D61] font-mono">
                    No clinical trial sites matching criteria.
                  </td>
                </tr>
              ) : (
                filteredSites.map((site) => {
                  const isOverdue = site.monitoring_status === 'OVERDUE_ACTION';
                  const pct = Math.round((site.enrolled_count / (site.target_enrollment || 1)) * 100);
                  return (
                    <tr
                      key={site.id}
                      onClick={() => openSiteDetail(site)}
                      className={`hover:bg-[#F9FDFB] cursor-pointer transition ${
                        isOverdue ? 'bg-rose-50/50 font-medium' : ''
                      }`}
                    >
                      <td className="py-4 px-4 font-mono font-bold text-[#0B4D3C] whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span>{site.site_code}</span>
                          {isOverdue && (
                            <span className="flex h-2 w-2 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-[#14231E]">{site.site_name}</div>
                        <div className="text-[11px] text-[#526D61] mt-0.5">{site.institution} • {site.city}</div>
                      </td>
                      <td className="py-4 px-4 text-[#526D61]">{site.state}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-[#14231E]">
                          {site.enrolled_count} / {site.target_enrollment}{' '}
                          <span className="text-[10px] text-[#526D61] font-normal">({pct}%)</span>
                        </div>
                        <div className="w-24 bg-[#E2EEE7] h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className="bg-[#0B4D3C] h-full rounded-full transition-all"
                            style={{ width: `${Math.min(100, pct)}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center font-mono font-bold">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] ${
                            site.query_count > 10
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-[#F4FBF7] text-[#526D61] border border-[#D5E6DC]'
                          }`}
                        >
                          {site.query_count}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center font-mono font-bold">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] ${
                            site.deviations_count > 2
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-[#F4FBF7] text-[#526D61] border border-[#D5E6DC]'
                          }`}
                        >
                          {site.deviations_count}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold inline-flex items-center space-x-1 ${
                            isOverdue
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : site.monitoring_status === 'PENDING_VISIT'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-[#D7F5E8] text-[#065F46] border border-[#A7F3D0]'
                          }`}
                        >
                          {isOverdue && <AlertTriangle className="h-3 w-3 mr-1 text-rose-700" />}
                          <span>{site.monitoring_status.replace(/_/g, ' ')}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <button className="px-3.5 py-1.5 rounded-full bg-[#F4FBF7] hover:bg-[#EBF7F0] border border-[#D5E6DC] text-[#0B4D3C] text-xs font-bold transition shadow-xs">
                          Inspect Site →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Spacious, Tabbed Site Detail Drawer (max-w-4xl, Material 3 Expressive) */}
      {selectedSite && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-full sm:max-w-4xl bg-[#F4FBF7] h-full overflow-y-auto flex flex-col shadow-2xl border-l border-[#D5E6DC] animate-in slide-in-from-right duration-300">
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 sm:px-8 py-4 sm:py-5 border-b border-[#E2EEE7] flex items-center justify-between shadow-xs">
              <div className="min-w-0 pr-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-black px-2.5 py-1 rounded-full bg-[#EBF7F0] text-[#0B4D3C] border border-[#D1F2E2]">
                    {selectedSite.site_code}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      selectedSite.monitoring_status === 'OVERDUE_ACTION'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse'
                        : selectedSite.monitoring_status === 'PENDING_VISIT'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-[#D7F5E8] text-[#065F46] border border-[#A7F3D0]'
                    }`}
                  >
                    {selectedSite.monitoring_status.replace(/_/g, ' ')}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-[#14231E] mt-1 truncate">{selectedSite.site_name}</h2>
                <p className="text-xs text-[#526D61] mt-0.5 truncate">
                  {selectedSite.institution} • {selectedSite.city}, {selectedSite.state}
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => openSiteDetail(selectedSite)}
                  title="Refresh Site Data"
                  className="p-2 rounded-full hover:bg-[#F4FBF7] text-[#526D61] hover:text-[#14231E] transition border border-[#E2EEE7]"
                >
                  <RefreshCw className={`h-4 w-4 ${drawerLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => setSelectedSite(null)}
                  className="p-2 rounded-full hover:bg-[#F4FBF7] text-[#526D61] hover:text-[#14231E] transition border border-[#E2EEE7]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-8 space-y-6 flex-1">
              {/* Critical Overdue Action Callout (Specifically addressing Bengaluru & Overdue sites) */}
              {selectedSite.monitoring_status === 'OVERDUE_ACTION' && (
                <div className="p-4 sm:p-6 bg-gradient-to-r from-[#FFF1F2] via-white to-[#FFF1F2] border-2 border-rose-300 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3.5 min-w-0">
                    <div className="p-2.5 sm:p-3 bg-rose-500 text-white rounded-2xl shrink-0 shadow-md shadow-rose-500/20">
                      <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold font-mono uppercase tracking-wider text-rose-700">
                          CRITICAL MONITORING DEFICIENCY
                        </span>
                        <span className="px-2 py-0.5 text-[9px] font-bold font-mono bg-rose-200 text-rose-900 rounded-full">
                          14 DAYS OVERDUE
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#14231E] mt-0.5">
                        Interim CRA Source Data Verification (SDV) Required
                      </h4>
                      <p className="text-xs text-[#526D61] mt-1 leading-relaxed">
                        Source data verification is delayed for 18 enrolled participants. 1 critical cold-chain drug storage excursion (DEV-2026-002) and {siteQueries.length} open discrepancy queries require resolution.
                      </p>
                    </div>
                  </div>

                  <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                    <button
                      onClick={() => setShowScheduleModal(true)}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-full transition shadow-md shadow-rose-600/20 text-center"
                    >
                      Schedule CRA Audit Visit Now
                    </button>
                    <button
                      onClick={() => setActiveTab('QUERIES')}
                      className="px-3.5 py-2 bg-white hover:bg-[#F4FBF7] text-rose-800 border border-rose-200 text-xs font-bold rounded-full transition text-center"
                    >
                      Resolve Queries →
                    </button>
                  </div>
                </div>
              )}

              {/* Four Spacious Material 3 Tabs */}
              <div className="flex items-center space-x-2 border-b border-[#D5E6DC] pb-2 overflow-x-auto max-w-full whitespace-nowrap [-webkit-overflow-scrolling:touch]">
                {[
                  { id: 'OVERVIEW', label: 'Overview & Leadership', icon: Building2 },
                  { id: 'QUERIES', label: `Data Queries (${siteQueries.length})`, icon: HelpCircle },
                  { id: 'DEVIATIONS', label: `Protocol Deviations (${siteDeviations.length})`, icon: AlertTriangle },
                  { id: 'MONITORING', label: `CRA Monitoring (${siteVisits.length})`, icon: Calendar },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition ${
                      activeTab === tab.id
                        ? 'bg-[#0B4D3C] text-white shadow-sm'
                        : 'text-[#526D61] hover:text-[#14231E] hover:bg-white'
                    }`}
                  >
                    <tab.icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab 1: OVERVIEW & LEADERSHIP */}
              {activeTab === 'OVERVIEW' && (
                <div className="space-y-6">
                  {/* KPI Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="p-5 bg-white rounded-[2rem] border border-[#E2EEE7] shadow-sm">
                      <div className="text-xs text-[#526D61] font-semibold mb-1">Target Enrollment</div>
                      <div className="text-2xl font-black font-mono text-[#0B4D3C]">
                        {selectedSite.enrolled_count} <span className="text-xs text-[#526D61] font-normal">/ {selectedSite.target_enrollment}</span>
                      </div>
                      <div className="text-[11px] text-[#526D61] mt-1">
                        {Math.round((selectedSite.enrolled_count / (selectedSite.target_enrollment || 1)) * 100)}% of target met
                      </div>
                    </div>

                    <div className="p-5 bg-white rounded-[2rem] border border-[#E2EEE7] shadow-sm">
                      <div className="text-xs text-[#526D61] font-semibold mb-1">Active Subjects</div>
                      <div className="text-2xl font-black font-mono text-[#0284C7]">
                        {selectedSite.active_participants_count || selectedSite.enrolled_count}
                      </div>
                      <div className="text-[11px] text-[#526D61] mt-1">
                        {selectedSite.screening_count || Math.round(selectedSite.enrolled_count * 1.2)} Total Screened
                      </div>
                    </div>

                    <div className="p-5 bg-white rounded-[2rem] border border-[#E2EEE7] shadow-sm">
                      <div className="text-xs text-[#526D61] font-semibold mb-1">Open Discrepancies</div>
                      <div className="text-2xl font-black font-mono text-amber-700">
                        {siteQueries.length}
                      </div>
                      <div className="text-[11px] text-[#526D61] mt-1">
                        {siteQueries.filter((q) => q.severity === 'CRITICAL').length} Critical Queries
                      </div>
                    </div>

                    <div className="p-5 bg-white rounded-[2rem] border border-[#E2EEE7] shadow-sm">
                      <div className="text-xs text-[#526D61] font-semibold mb-1">Deviations Logged</div>
                      <div className="text-2xl font-black font-mono text-rose-700">
                        {siteDeviations.length}
                      </div>
                      <div className="text-[11px] text-[#526D61] mt-1">
                        {siteDeviations.filter((d) => d.severity === 'CRITICAL').length} Critical Cold Chain
                      </div>
                    </div>
                  </div>

                  {/* Site Leadership & Governance */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white rounded-[2.5rem] border border-[#E2EEE7] shadow-sm space-y-4">
                      <div className="flex items-center space-x-3 pb-3 border-b border-[#F0F7F2]">
                        <div className="p-2.5 rounded-2xl bg-[#EBF7F0] text-[#0B4D3C]">
                          <UserCheck className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#14231E]">Site Leadership Team</h3>
                          <p className="text-xs text-[#526D61]">GCP-ASU Certified Key Personnel</p>
                        </div>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="p-3 bg-[#F4FBF7] rounded-2xl border border-[#D5E6DC]">
                          <div className="text-[10px] uppercase font-mono font-bold text-[#526D61]">
                            Principal Investigator (PI)
                          </div>
                          <div className="font-bold text-[#14231E] text-sm mt-0.5">
                            {selectedSite.principal_investigator_name || 'Dr. Lead Investigator'}
                          </div>
                          <div className="text-[#526D61] text-[11px] mt-0.5">
                            Professor & Head of Clinical Research • MD (Ayurveda), Kayachikitsa
                          </div>
                          <div className="text-[10px] font-mono text-[#0B4D3C] mt-1 font-bold">
                            GCP Certificate: GCP-ASU/2024/9811 (Valid to Dec 2027)
                          </div>
                        </div>

                        <div className="p-3 bg-[#F4FBF7] rounded-2xl border border-[#D5E6DC]">
                          <div className="text-[10px] uppercase font-mono font-bold text-[#526D61]">
                            Clinical Research Coordinator (CRC)
                          </div>
                          <div className="font-bold text-[#14231E] text-sm mt-0.5">
                            {selectedSite.site_coordinator_name || 'Coordinator Lead'}
                          </div>
                          <div className="text-[#526D61] text-[11px] mt-0.5">
                            Department of Pharmacovigilance & Clinical Coordination
                          </div>
                          <div className="text-[10px] font-mono text-[#0284C7] mt-1">
                            Contact: coordinator.{selectedSite.city.toLowerCase()}@aiia.gov.in
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-white rounded-[2.5rem] border border-[#E2EEE7] shadow-sm space-y-4">
                      <div className="flex items-center space-x-3 pb-3 border-b border-[#F0F7F2]">
                        <div className="p-2.5 rounded-2xl bg-[#E0F2FE] text-[#0284C7]">
                          <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#14231E]">Regulatory & Infrastructure</h3>
                          <p className="text-xs text-[#526D61]">Ethics Committee & Clinical Trial Accreditation</p>
                        </div>
                      </div>

                      <div className="space-y-2.5 text-xs text-[#14231E]">
                        <div className="flex justify-between py-2 border-b border-[#F0F7F2]">
                          <span className="text-[#526D61]">Institutional Ethics Registration:</span>
                          <span className="font-mono font-bold text-[#0B4D3C]">CDSCO EC/2024/0981 (Active)</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[#F0F7F2]">
                          <span className="text-[#526D61]">CTRI Institutional Center ID:</span>
                          <span className="font-mono font-bold text-[#14231E]">CTRI-CTR-INST-{selectedSite.site_code.slice(-2)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[#F0F7F2]">
                          <span className="text-[#526D61]">Cold Chain Refrigerator:</span>
                          <span className="font-mono font-bold text-rose-700">Digital Temp Log (2°C - 8°C Monitored)</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-[#526D61]">Site Activation Date:</span>
                          <span className="font-mono font-bold text-[#14231E]">
                            {selectedSite.activation_date || '2025-01-15'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: DATA DISCREPANCIES & QUERIES */}
              {activeTab === 'QUERIES' && (
                <div className="space-y-4">
                  {/* Status Pills */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs">
                      {(['ALL', 'OPEN', 'ANSWERED', 'CLOSED'] as const).map((qs) => (
                        <button
                          key={qs}
                          onClick={() => setQueryStatusFilter(qs)}
                          className={`px-3 py-1 rounded-full font-bold transition ${
                            queryStatusFilter === qs
                              ? 'bg-[#0B4D3C] text-white'
                              : 'bg-white text-[#526D61] border border-[#D5E6DC] hover:bg-[#F4FBF7]'
                          }`}
                        >
                          {qs === 'ALL'
                            ? `All Queries (${siteQueries.length})`
                            : qs === 'OPEN'
                            ? `Open (${siteQueries.filter((q) => q.status === 'OPEN').length})`
                            : qs === 'ANSWERED'
                            ? `Answered (${siteQueries.filter((q) => q.status === 'ANSWERED').length})`
                            : `Closed (${siteQueries.filter((q) => q.status === 'CLOSED').length})`}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-[#526D61] font-mono">
                      Showing {displayedQueries.length} of {siteQueries.length}
                    </span>
                  </div>

                  {displayedQueries.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-[2rem] border border-[#E2EEE7] text-xs text-[#526D61]">
                      <CheckCircle2 className="h-8 w-8 text-[#0B4D3C] mx-auto mb-2 opacity-50" />
                      No discrepancies matching the selected filter.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {displayedQueries.map((q) => {
                        const isAnswering = answeringQueryId === q.id;
                        const isClosed = q.status === 'CLOSED';
                        const isAnswered = q.status === 'ANSWERED';
                        return (
                          <div
                            key={q.id}
                            className={`p-5 rounded-[2rem] bg-white border transition shadow-xs ${
                              q.severity === 'CRITICAL'
                                ? 'border-rose-300 bg-rose-50/20'
                                : q.severity === 'HIGH'
                                ? 'border-amber-300 bg-amber-50/20'
                                : 'border-[#E2EEE7]'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-mono font-bold text-xs text-[#0B4D3C]">{q.query_code}</span>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]">
                                  {q.field_name}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${
                                    q.severity === 'CRITICAL'
                                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                      : q.severity === 'HIGH'
                                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                      : 'bg-[#F4FBF7] text-[#526D61] border border-[#D5E6DC]'
                                  }`}
                                >
                                  {q.severity} SEVERITY
                                </span>
                              </div>

                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono self-start sm:self-auto ${
                                  isClosed
                                    ? 'bg-[#D7F5E8] text-[#065F46] border border-[#A7F3D0]'
                                    : isAnswered
                                    ? 'bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]'
                                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                                }`}
                              >
                                {q.status}
                              </span>
                            </div>

                            <div className="mt-2 text-xs font-semibold text-[#14231E] leading-relaxed">
                              {q.issue}
                            </div>

                            {/* Resolution Details */}
                            {q.resolution && (
                              <div className="mt-3 p-3 bg-[#EBF7F0] rounded-2xl border border-[#D1F2E2] text-xs">
                                <div className="text-[10px] font-mono font-bold text-[#0B4D3C] uppercase">
                                  Investigator Resolution Response:
                                </div>
                                <div className="text-[#14231E] mt-0.5">{q.resolution}</div>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="mt-3 pt-3 border-t border-[#F0F7F2] flex items-center justify-between text-xs">
                              <div className="text-[11px] text-[#526D61] font-mono">
                                Due: {q.due_date}
                              </div>

                              <div className="flex items-center space-x-2">
                                {!isClosed && (
                                  <>
                                    {!isAnswering ? (
                                      <button
                                        onClick={() => {
                                          setAnsweringQueryId(q.id);
                                          setQueryResolutionText(
                                            `Source data verified against hospital clinic note; eCRF adjusted accordingly.`
                                          );
                                        }}
                                        className="px-3 py-1 rounded-full bg-[#0B4D3C] hover:bg-[#08382B] text-white text-[11px] font-bold transition shadow-xs"
                                      >
                                        Answer / Provide Evidence
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => setAnsweringQueryId(null)}
                                        className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold"
                                      >
                                        Cancel
                                      </button>
                                    )}

                                    {isAnswered && (
                                      <button
                                        onClick={() => handleCloseQuery(q.id)}
                                        className="px-3 py-1 rounded-full bg-[#D7F5E8] hover:bg-[#BFF0DB] text-[#065F46] border border-[#A7F3D0] text-[11px] font-bold transition"
                                      >
                                        Close Query ✓
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Expandable Answer Form */}
                            {isAnswering && (
                              <div className="mt-3 p-4 bg-[#F4FBF7] rounded-2xl border border-[#D5E6DC] space-y-3 animate-in fade-in duration-200">
                                <label className="block text-[11px] font-bold text-[#14231E]">
                                  Investigator Clarification & Source Data Resolution Evidence:
                                </label>
                                <textarea
                                  value={queryResolutionText}
                                  onChange={(e) => setQueryResolutionText(e.target.value)}
                                  rows={2}
                                  className="w-full p-3 text-xs rounded-xl bg-white border border-[#D5E6DC] text-[#14231E] focus:outline-none focus:border-[#0B4D3C]"
                                  placeholder="Document verified source information, hospital log, or medical justification..."
                                />
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => handleAnswerQuery(q.id)}
                                    disabled={submittingQuery}
                                    className="px-4 py-1.5 rounded-full bg-[#0B4D3C] hover:bg-[#08382B] text-white text-xs font-bold transition disabled:opacity-50"
                                  >
                                    {submittingQuery ? 'Submitting...' : 'Submit Resolution Response'}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: PROTOCOL DEVIATIONS & CAPA */}
              {activeTab === 'DEVIATIONS' && (
                <div className="space-y-4">
                  {siteDeviations.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-[2rem] border border-[#E2EEE7] text-xs text-[#526D61]">
                      <CheckCircle2 className="h-8 w-8 text-[#0B4D3C] mx-auto mb-2 opacity-50" />
                      No protocol deviations recorded for this center.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {siteDeviations.map((dev) => {
                        const isResolved = dev.status === 'RESOLVED' || dev.status === 'CLOSED';
                        const isFormOpen = capaDevId === dev.id;
                        return (
                          <div
                            key={dev.id}
                            className={`p-6 rounded-[2.5rem] bg-white border shadow-sm transition ${
                              dev.severity === 'CRITICAL'
                                ? 'border-rose-300'
                                : dev.severity === 'MAJOR'
                                ? 'border-amber-300'
                                : 'border-[#E2EEE7]'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-mono font-bold text-xs text-[#0B4D3C]">{dev.deviation_code}</span>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F4FBF7] text-[#526D61] border border-[#D5E6DC]">
                                  {dev.category}
                                </span>
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                                    dev.severity === 'CRITICAL'
                                      ? 'bg-rose-100 text-rose-800 border border-rose-200 font-black'
                                      : dev.severity === 'MAJOR'
                                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                      : 'bg-[#F4FBF7] text-[#526D61] border border-[#D5E6DC]'
                                  }`}
                                >
                                  {dev.severity}
                                </span>
                              </div>

                              <span
                                className={`px-3 py-0.5 rounded-full text-[10px] font-bold font-mono self-start sm:self-auto ${
                                  isResolved
                                    ? 'bg-[#D7F5E8] text-[#065F46] border border-[#A7F3D0]'
                                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                                }`}
                              >
                                {dev.status}
                              </span>
                            </div>

                            <div className="mt-3 text-xs font-bold text-[#14231E] leading-relaxed">
                              {dev.description}
                            </div>

                            {dev.impact && (
                              <div className="mt-2 text-xs text-[#526D61]">
                                <strong className="text-[#14231E]">Protocol Impact:</strong> {dev.impact}
                              </div>
                            )}

                            {/* Recorded CAPA */}
                            {dev.corrective_action && (
                              <div className="mt-4 p-4 bg-[#F4FBF7] rounded-2xl border border-[#D5E6DC] space-y-1.5 text-xs">
                                <div>
                                  <span className="font-bold text-[#0B4D3C]">Corrective Action (CA):</span>{' '}
                                  <span className="text-[#14231E]">{dev.corrective_action}</span>
                                </div>
                                {dev.preventive_action && (
                                  <div>
                                    <span className="font-bold text-[#0284C7]">Preventive Action (PA):</span>{' '}
                                    <span className="text-[#14231E]">{dev.preventive_action}</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* CAPA Trigger Button */}
                            {!isResolved && !isFormOpen && (
                              <div className="mt-4 pt-3 border-t border-[#F0F7F2] flex justify-end">
                                <button
                                  onClick={() => {
                                    setCapaDevId(dev.id);
                                    setCorrectiveText(
                                      `Backup UPS installed for pharmacy refrigerator; affected batch quarantined and discarded. Re-calibrated digital datalogger.`
                                    );
                                    setPreventiveText(
                                      `Installed automated GSM SMS alert system for cold chain temperature excursions; retrained site pharmacy staff on SOP-CC-04.`
                                    );
                                  }}
                                  className="px-4 py-1.5 rounded-full bg-[#0B4D3C] hover:bg-[#08382B] text-white text-xs font-bold transition shadow-xs"
                                >
                                  Record CAPA Plan & Resolve →
                                </button>
                              </div>
                            )}

                            {/* Expandable CAPA Submission Form */}
                            {isFormOpen && (
                              <div className="mt-4 p-5 bg-[#F4FBF7] rounded-2xl border border-[#D5E6DC] space-y-3 animate-in fade-in duration-200">
                                <h4 className="text-xs font-bold text-[#14231E] uppercase font-mono">
                                  Submit Corrective & Preventive Action (CAPA) Plan
                                </h4>
                                <div>
                                  <label className="block text-[11px] font-semibold text-[#526D61] mb-1">
                                    Corrective Action (Immediate mitigation):
                                  </label>
                                  <textarea
                                    value={correctiveText}
                                    onChange={(e) => setCorrectiveText(e.target.value)}
                                    rows={2}
                                    className="w-full p-2.5 text-xs rounded-xl bg-white border border-[#D5E6DC] text-[#14231E] focus:outline-none focus:border-[#0B4D3C]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-[#526D61] mb-1">
                                    Preventive Action (Systemic recurrence prevention):
                                  </label>
                                  <textarea
                                    value={preventiveText}
                                    onChange={(e) => setPreventiveText(e.target.value)}
                                    rows={2}
                                    className="w-full p-2.5 text-xs rounded-xl bg-white border border-[#D5E6DC] text-[#14231E] focus:outline-none focus:border-[#0B4D3C]"
                                  />
                                </div>
                                <div className="flex justify-end space-x-2 pt-1">
                                  <button
                                    onClick={() => setCapaDevId(null)}
                                    className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleRecordCapa(dev.id)}
                                    disabled={submittingCapa}
                                    className="px-4 py-1.5 rounded-full bg-[#0B4D3C] hover:bg-[#08382B] text-white text-xs font-bold transition disabled:opacity-50 shadow-xs"
                                  >
                                    {submittingCapa ? 'Saving CAPA...' : 'Submit CAPA & Mark Resolved'}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: MONITORING AUDITS & ACTION PLAN */}
              {activeTab === 'MONITORING' && (
                <div className="space-y-6">
                  {/* Action Header */}
                  <div className="flex items-center justify-between bg-white p-5 rounded-[2rem] border border-[#E2EEE7] shadow-sm">
                    <div>
                      <h3 className="text-sm font-bold text-[#14231E]">CRA Monitoring Visit Schedule</h3>
                      <p className="text-xs text-[#526D61]">Clinical Research Associate On-Site & Remote Audit Log</p>
                    </div>
                    <button
                      onClick={() => setShowScheduleModal(true)}
                      className="px-4 py-2 rounded-full bg-[#0B4D3C] hover:bg-[#08382B] text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Schedule On-Site Audit Visit</span>
                    </button>
                  </div>

                  {/* Monitoring Visits List */}
                  {siteVisits.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-[2rem] border border-[#E2EEE7] text-xs text-[#526D61]">
                      <Calendar className="h-8 w-8 text-[#0B4D3C] mx-auto mb-2 opacity-50" />
                      No monitoring visits logged for this center yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {siteVisits.map((v) => {
                        const isOverdue = v.status === 'OVERDUE';
                        const isCompleted = v.status === 'COMPLETED';
                        return (
                          <div
                            key={v.id}
                            className={`p-5 rounded-[2rem] bg-white border shadow-sm transition ${
                              isOverdue ? 'border-rose-300 bg-rose-50/20' : 'border-[#E2EEE7]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="font-mono font-bold text-xs text-[#0B4D3C]">{v.visit_code}</span>
                                <span className="font-bold text-xs text-[#14231E]">{v.visit_type}</span>
                              </div>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                                  isOverdue
                                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                    : isCompleted
                                    ? 'bg-[#D7F5E8] text-[#065F46] border border-[#A7F3D0]'
                                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                                }`}
                              >
                                {v.status}
                              </span>
                            </div>

                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#526D61]">
                              <div>
                                <strong>Lead CRA Monitor:</strong> {v.monitor_name || 'Mr. Rajesh Nair (CRA)'}
                              </div>
                              <div className="font-mono">
                                <strong>Planned Date:</strong> {v.planned_date}
                              </div>
                            </div>

                            {v.findings && (
                              <div className="mt-2.5 p-3 bg-[#F4FBF7] rounded-xl border border-[#D5E6DC] text-xs text-[#14231E]">
                                <div className="text-[10px] font-mono font-bold text-[#0B4D3C] uppercase mb-0.5">
                                  Findings & Action Plan:
                                </div>
                                {v.findings}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Schedule Monitoring Visit Dialog Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] border border-[#D5E6DC] max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#F0F7F2] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#14231E]">Schedule CRA Monitoring Visit</h3>
                <p className="text-xs text-[#526D61]">{selectedSite?.site_name} ({selectedSite?.site_code})</p>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-1.5 rounded-full hover:bg-[#F4FBF7] text-[#526D61]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#14231E] mb-1">Assigned CRA Monitor:</label>
                <input
                  type="text"
                  value={scheduleMonitorName}
                  onChange={(e) => setScheduleMonitorName(e.target.value)}
                  className="w-full px-4 py-2 rounded-full bg-[#F4FBF7] border border-[#D5E6DC] text-xs text-[#14231E] focus:outline-none focus:border-[#0B4D3C]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#14231E] mb-1">Monitoring Visit Type:</label>
                <select
                  value={scheduleVisitType}
                  onChange={(e) => setScheduleVisitType(e.target.value)}
                  className="w-full px-4 py-2 rounded-full bg-[#F4FBF7] border border-[#D5E6DC] text-xs text-[#14231E] focus:outline-none focus:border-[#0B4D3C]"
                >
                  <option value="Interim Monitoring Visit #3">Interim Monitoring Visit #3 (SDV Audit)</option>
                  <option value="Targeted For-Cause Audit">Targeted For-Cause Audit (Cold Chain Investigation)</option>
                  <option value="Routine Surveillance Visit">Routine Surveillance Visit</option>
                  <option value="Site Close-Out Audit">Site Close-Out Audit</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#14231E] mb-1">Planned On-Site Date:</label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-full bg-[#F4FBF7] border border-[#D5E6DC] text-xs text-[#14231E] focus:outline-none focus:border-[#0B4D3C]"
                />
              </div>

              <div className="p-3 bg-[#EBF7F0] rounded-2xl border border-[#D1F2E2] text-[11px] text-[#0B4D3C]">
                <strong>Compliance Effect:</strong> Scheduling this monitoring visit will immediately clear the site's <code className="font-mono">OVERDUE_ACTION</code> flag and transition it to <code className="font-mono">PENDING_VISIT</code>, notifying the Principal Investigator.
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-[#F0F7F2]">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleVisit}
                disabled={submittingSchedule}
                className="px-5 py-2 rounded-full bg-[#0B4D3C] hover:bg-[#08382B] text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
              >
                {submittingSchedule ? 'Scheduling...' : 'Confirm & Schedule Visit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

