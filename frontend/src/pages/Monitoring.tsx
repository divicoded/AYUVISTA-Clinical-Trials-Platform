import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api/client';
import { MonitoringVisit } from '../types';
import {
  Eye,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  Search,
  Sparkles,
  Download,
  X,
  ChevronDown,
  Activity,
} from 'lucide-react';

const STATUS_TABS = ['ALL', 'PLANNED', 'SCHEDULED', 'COMPLETED', 'OVERDUE'] as const;

const STATUS_STYLE: Record<string, string> = {
  OVERDUE: 'bg-rose-100 text-rose-800 border border-rose-200',
  COMPLETED: 'bg-[#D7F5E8] text-[#065F46] border border-[#A7F3D0]',
  PLANNED: 'bg-sky-100 text-sky-800 border border-sky-200',
  SCHEDULED: 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]',
};

export const Monitoring: React.FC = () => {
  const [visits, setVisits] = useState<MonitoringVisit[]>([]);
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<MonitoringVisit[]>('/monitoring')
      .then(setVisits)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleExportMonitoringLog = () => {
    const csvContent = [
      ['VISIT_CODE', 'TYPE', 'MONITOR_CRA', 'PLANNED_DATE', 'ACTUAL_DATE', 'STATUS', 'OPEN_ACTIONS'],
      ...visits.map((v) => [
        v.visit_code,
        v.visit_type,
        v.monitor_name || 'CRA Unit',
        v.planned_date,
        v.actual_date || 'PENDING',
        v.status,
        v.open_actions_count,
      ]),
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AIIA_Monitoring_Visits_Log_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = visits.filter((v) => {
    const matchSearch =
      v.visit_code.toLowerCase().includes(search.toLowerCase()) ||
      v.visit_type.toLowerCase().includes(search.toLowerCase()) ||
      (v.monitor_name && v.monitor_name.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusTab === 'ALL' || v.status === statusTab;
    return matchSearch && matchStatus;
  });

  const overdue = visits.filter((v) => v.status === 'OVERDUE').length;
  const completed = visits.filter((v) => v.status === 'COMPLETED').length;
  const pending = visits.filter((v) => v.status === 'PLANNED' || v.status === 'SCHEDULED').length;
  const totalActions = visits.reduce((s, v) => s + (v.open_actions_count || 0), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-[#E2EEE7] shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#EBF7F0] text-[#0B4D3C] text-[11px] font-bold mb-1">
            <Sparkles className="h-3 w-3" />
            <span>CRA Clinical Surveillance</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14231E] tracking-tight">Clinical Monitoring & Site Oversight</h1>
          <p className="text-xs text-[#526D61] mt-0.5">
            CRA Monitoring Visits â€¢ Source Data Verification (SDV) â€¢ Corrective Action Tracking
          </p>
        </div>
        <button
          onClick={handleExportMonitoringLog}
          className="px-5 py-2.5 bg-[#0B4D3C] hover:bg-[#07382B] text-white text-xs font-bold rounded-full transition shadow-sm flex items-center space-x-2 shrink-0 active:scale-95"
        >
          <Download className="h-4 w-4" />
          <span>Export Monitoring Log (CSV)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Visits', value: visits.length, bg: 'bg-[#F4FBF7]', border: 'border-[#D5E6DC]', color: 'text-[#0B4D3C]', icon: Calendar },
          { label: 'Overdue', value: overdue, bg: 'bg-[#FFF1F2]', border: 'border-rose-200', color: 'text-rose-700', icon: AlertTriangle },
          { label: 'Pending / Scheduled', value: pending, bg: 'bg-[#FFFBEB]', border: 'border-amber-200', color: 'text-amber-700', icon: Clock },
          { label: 'Completed', value: completed, bg: 'bg-[#D7F5E8]', border: 'border-[#A7F3D0]', color: 'text-[#065F46]', icon: CheckCircle2 },
        ].map((kpi) => (
          <div key={kpi.label} className={`p-5 rounded-[2rem] ${kpi.bg} border ${kpi.border} shadow-sm`}>
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-[#526D61]">{kpi.label}</div>
              <kpi.icon className={`h-4 w-4 ${kpi.color} opacity-60`} />
            </div>
            <div className={`text-3xl font-black font-mono mt-1 ${kpi.color}`}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Overdue Monitoring Alert Banner */}
      {overdue > 0 && (
        <div className="p-5 sm:p-6 rounded-[2rem] bg-gradient-to-r from-[#FFF1F2] via-white to-[#FFE4E6] border-2 border-rose-300 text-xs flex items-start space-x-3.5 shadow-sm">
          <AlertTriangle className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-black text-rose-900 uppercase tracking-wide text-xs">
              CRITICAL MONITORING DEFICIENCY DETECTED: VISIT MON-2026-001
            </span>
            <p className="text-[#526D61] mt-1 leading-relaxed">
              Interim Monitoring Visit for Study <strong className="font-mono text-[#0B4D3C] font-bold">AYU-003</strong> at Bengaluru Site (<code className="bg-rose-100 px-1.5 py-0.5 rounded text-rose-900 font-bold">SITE-BLR-02</code>) is overdue by 14 days. SDV pending for 18 participants and 5 open corrective actions. Total open actions across all sites: <strong>{totalActions}</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Status Filter Tabs + Search */}
      <div className="space-y-3">
        <div className="bg-white border border-[#E2EEE7] rounded-[2rem] p-2 flex items-center space-x-1 overflow-x-auto shadow-sm">
          {STATUS_TABS.map((tab) => {
            const count = tab === 'ALL' ? visits.length : visits.filter((v) => v.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setStatusTab(tab)}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-full font-bold text-xs transition whitespace-nowrap ${
                  statusTab === tab
                    ? 'bg-[#0B4D3C] text-white shadow-sm'
                    : 'text-[#526D61] hover:text-[#14231E] hover:bg-[#F4FBF7]'
                }`}
              >
                <span>{tab}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${statusTab === tab ? 'bg-white/20' : 'bg-[#F4FBF7]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="p-4 bg-white border border-[#E2EEE7] rounded-[2rem] flex items-center shadow-sm">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-4 top-3 text-[#526D61]" />
            <input
              type="text"
              placeholder="Search monitoring visits by code, type, or CRA monitor name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#F4FBF7] border border-[#D5E6DC] text-xs text-[#14231E] placeholder-[#7D9A8D] focus:outline-none focus:border-[#0B4D3C] focus:bg-white transition"
            />
          </div>
        </div>
      </div>

      {/* Monitoring Visits Table */}
      <div className="bg-white border border-[#E2EEE7] rounded-[2rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#14231E]">
            <thead className="bg-[#F4FBF7] text-[#526D61] font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Visit Code</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Monitor (CRA)</th>
                <th className="py-3 px-4">Planned Date</th>
                <th className="py-3 px-4">Actual Execution</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 rounded-r-xl">Open Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F7F2]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex items-center justify-center space-x-3 text-[#526D61] font-mono text-xs">
                      <div className="h-5 w-5 rounded-full border-2 border-[#0B4D3C] border-t-transparent animate-spin" />
                      <span>Loading Clinical Monitoring Visits...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-xs text-[#526D61] font-mono">
                    No monitoring visits match current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((v) => {
                  const isOverdue = v.status === 'OVERDUE';
                  const isExpanded = expandedId === v.id;
                  const statusStyle = STATUS_STYLE[v.status] || 'bg-[#F4FBF7] text-[#526D61] border border-[#D5E6DC]';
                  return (
                    <React.Fragment key={v.id}>
                      <tr
                        className={`hover:bg-[#F4FBF7] transition-colors cursor-pointer ${isOverdue ? 'bg-rose-50/30' : ''}`}
                        onClick={() => setExpandedId(isExpanded ? null : v.id)}
                      >
                        <td className="py-4 px-4 font-mono font-bold text-[#0B4D3C] whitespace-nowrap">
                          {v.visit_code}
                        </td>
                        <td className="py-4 px-4 font-bold text-[#14231E]">{v.visit_type}</td>
                        <td className="py-4 px-4 text-[#526D61] whitespace-nowrap font-medium">
                          {v.monitor_name || 'CRA Unit'}
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-[#14231E] whitespace-nowrap">{v.planned_date}</td>
                        <td className="py-4 px-4 font-mono text-[#526D61] whitespace-nowrap">
                          {v.actual_date || 'â€”'}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap font-mono">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusStyle} ${isOverdue ? 'animate-pulse' : ''}`}>
                            {v.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono font-bold">
                          <div className="flex items-center space-x-2">
                            <span className={v.open_actions_count > 0 ? 'text-amber-700 font-extrabold' : 'text-[#526D61]'}>
                              {v.open_actions_count} Actions
                            </span>
                            <ChevronDown className={`h-3.5 w-3.5 text-[#526D61] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="px-6 pb-5 pt-0 bg-[#F4FBF7]/60">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                              <div className="p-3 bg-white rounded-2xl border border-[#E2EEE7] text-xs">
                                <div className="text-[#526D61] font-mono uppercase text-[10px] tracking-wider mb-1">Visit Code</div>
                                <div className="font-bold text-[#0B4D3C] font-mono">{v.visit_code}</div>
                              </div>
                              <div className="p-3 bg-white rounded-2xl border border-[#E2EEE7] text-xs">
                                <div className="text-[#526D61] font-mono uppercase text-[10px] tracking-wider mb-1">Visit Type</div>
                                <div className="font-bold text-[#14231E]">{v.visit_type}</div>
                              </div>
                              <div className="p-3 bg-white rounded-2xl border border-[#E2EEE7] text-xs">
                                <div className="text-[#526D61] font-mono uppercase text-[10px] tracking-wider mb-1">Planned Date</div>
                                <div className="font-bold text-[#14231E] font-mono">{v.planned_date}</div>
                              </div>
                              <div className="p-3 bg-white rounded-2xl border border-[#E2EEE7] text-xs">
                                <div className="text-[#526D61] font-mono uppercase text-[10px] tracking-wider mb-1">Open Actions</div>
                                <div className={`font-extrabold text-lg font-mono ${v.open_actions_count > 0 ? 'text-amber-700' : 'text-[#065F46]'}`}>
                                  {v.open_actions_count}
                                </div>
                              </div>
                            </div>
                            {v.findings && (
                              <div className="mt-3 p-3 bg-white rounded-2xl border border-[#E2EEE7] text-xs">
                                <div className="text-[#526D61] font-mono uppercase text-[10px] tracking-wider mb-1">Findings / Notes</div>
                                <p className="text-[#14231E] leading-relaxed">{v.findings}</p>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-[#F0F7F2] text-[10px] font-mono text-[#526D61] flex items-center justify-between">
            <span>Showing {filtered.length} of {visits.length} visits</span>
            <span className="flex items-center space-x-1.5">
              <Activity className="h-3 w-3 text-amber-600" />
              <span className="text-amber-700 font-bold">{totalActions} total open corrective actions</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
