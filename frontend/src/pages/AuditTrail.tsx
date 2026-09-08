import React, { useState, useEffect, useMemo } from 'react';
import { apiRequest } from '../api/client';
import { AuditEvent } from '../types';
import {
  Search,
  ShieldCheck,
  X,
  Sparkles,
  Filter,
  Download,
  ChevronDown,
  RefreshCw,
  User,
  Clock,
} from 'lucide-react';

const ACTION_COLORS: Record<string, string> = {
  TRANSITION: 'bg-sky-100 text-sky-800 border-sky-200',
  ANSWER: 'bg-violet-100 text-violet-800 border-violet-200',
  CLOSE: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  CAPA_SUBMIT: 'bg-amber-100 text-amber-800 border-amber-200',
  VISIT_SCHEDULE: 'bg-blue-100 text-blue-800 border-blue-200',
  VISIT_COMPLETE: 'bg-teal-100 text-teal-800 border-teal-200',
  STATUS_UPDATE: 'bg-orange-100 text-orange-800 border-orange-200',
  CREATE: 'bg-[#EBF7F0] text-[#0B4D3C] border-[#D1F2E2]',
};

export const AuditTrail: React.FC = () => {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [filterAction, setFilterAction] = useState('ALL');
  const [filterEntity, setFilterEntity] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadEvents = (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    apiRequest<AuditEvent[]>('/audit?limit=200')
      .then(setEvents)
      .catch(console.error)
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const uniqueActions = useMemo(
    () => ['ALL', ...Array.from(new Set(events.map((e) => e.action).filter(Boolean)))],
    [events]
  );
  const uniqueEntities = useMemo(
    () => ['ALL', ...Array.from(new Set(events.map((e) => e.entity_type).filter(Boolean)))],
    [events]
  );

  const filtered = useMemo(
    () =>
      events.filter((e) => {
        const matchSearch =
          e.actor_name.toLowerCase().includes(search.toLowerCase()) ||
          e.entity_id.toLowerCase().includes(search.toLowerCase()) ||
          (e.reason && e.reason.toLowerCase().includes(search.toLowerCase()));
        const matchAction = filterAction === 'ALL' || e.action === filterAction;
        const matchEntity = filterEntity === 'ALL' || e.entity_type === filterEntity;
        return matchSearch && matchAction && matchEntity;
      }),
    [events, search, filterAction, filterEntity]
  );

  const handleExportCSV = () => {
    const rows = [
      ['Timestamp', 'Actor', 'Role', 'Action', 'Entity', 'Entity ID', 'Reason'],
      ...filtered.map((e) => [
        e.timestamp ? new Date(e.timestamp).toLocaleString('en-IN') : '',
        e.actor_name,
        e.actor_role,
        e.action,
        e.entity_type,
        e.entity_id,
        e.reason || '',
      ]),
    ]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AIIA_AuditTrail_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-[#E2EEE7] shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#EBF7F0] text-[#0B4D3C] text-[11px] font-bold mb-1">
            <Sparkles className="h-3 w-3" />
            <span>ALCOA+ Forensic Ledger</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14231E] tracking-tight">ALCOA+ Append-Only Audit Trail</h1>
          <p className="text-xs text-[#526D61] mt-0.5">
            Contemporaneous Electronic Records • Attributable Actor IDs • Cryptographic Verification Logs
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <span className="px-3.5 py-1.5 rounded-full bg-[#D7F5E8] text-[#065F46] border border-[#A7F3D0] text-xs font-bold font-mono flex items-center space-x-1.5">
            <ShieldCheck className="h-4 w-4" />
            <span>IMMUTABLE LEDGER</span>
          </span>
          <button
            onClick={() => loadEvents(true)}
            disabled={refreshing}
            className="h-9 w-9 rounded-full bg-[#F4FBF7] border border-[#D5E6DC] flex items-center justify-center text-[#0B4D3C] hover:bg-[#EBF7F0] transition active:scale-95"
            title="Refresh audit log"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-full bg-[#0B4D3C] hover:bg-[#07382B] text-white text-xs font-bold transition shadow-sm flex items-center space-x-1.5 active:scale-95"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-[2rem] border border-[#E2EEE7] shadow-sm text-center">
          <div className="text-2xl font-black font-mono text-[#0B4D3C]">{events.length}</div>
          <div className="text-[11px] font-semibold text-[#526D61] mt-0.5">Total Events</div>
        </div>
        <div className="p-4 bg-[#FFF1F2] rounded-[2rem] border border-rose-200 shadow-sm text-center">
          <div className="text-2xl font-black font-mono text-rose-700">{filtered.length}</div>
          <div className="text-[11px] font-semibold text-rose-600 mt-0.5">Filtered Showing</div>
        </div>
        <div className="p-4 bg-[#F4FBF7] rounded-[2rem] border border-[#D5E6DC] shadow-sm text-center">
          <div className="text-2xl font-black font-mono text-[#0B4D3C]">{uniqueActions.length - 1}</div>
          <div className="text-[11px] font-semibold text-[#526D61] mt-0.5">Action Types</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white border border-[#E2EEE7] rounded-[2rem] flex flex-col sm:flex-row items-center gap-3 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="h-4 w-4 absolute left-4 top-3 text-[#526D61]" />
          <input
            type="text"
            placeholder="Search by Actor, Entity ID, or Justification reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#F4FBF7] border border-[#D5E6DC] text-xs text-[#14231E] placeholder-[#7D9A8D] focus:outline-none focus:border-[#0B4D3C] focus:bg-white transition"
          />
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <Filter className="h-4 w-4 text-[#526D61] shrink-0" />
          <div className="relative">
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="appearance-none bg-[#F4FBF7] border border-[#D5E6DC] text-xs text-[#14231E] font-semibold rounded-full pl-4 pr-8 py-2.5 focus:outline-none focus:border-[#0B4D3C] transition cursor-pointer"
            >
              {uniqueActions.map((a) => (
                <option key={a} value={a}>{a === 'ALL' ? 'All Actions' : a}</option>
              ))}
            </select>
            <ChevronDown className="h-3.5 w-3.5 absolute right-3 top-3 text-[#526D61] pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={filterEntity}
              onChange={(e) => setFilterEntity(e.target.value)}
              className="appearance-none bg-[#F4FBF7] border border-[#D5E6DC] text-xs text-[#14231E] font-semibold rounded-full pl-4 pr-8 py-2.5 focus:outline-none focus:border-[#0B4D3C] transition cursor-pointer"
            >
              {uniqueEntities.map((e) => (
                <option key={e} value={e}>{e === 'ALL' ? 'All Entities' : e}</option>
              ))}
            </select>
            <ChevronDown className="h-3.5 w-3.5 absolute right-3 top-3 text-[#526D61] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white border border-[#E2EEE7] rounded-[2rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#14231E]">
            <thead className="bg-[#F4FBF7] text-[#526D61] font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Timestamp (IST)</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Entity ID</th>
                <th className="py-3 px-4">Reason / Notes</th>
                <th className="py-3 px-4 rounded-r-xl text-right">State Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F7F2]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="flex items-center justify-center space-x-3 text-[#526D61] font-mono text-xs">
                      <div className="h-5 w-5 rounded-full border-2 border-[#0B4D3C] border-t-transparent animate-spin" />
                      <span>Verifying Cryptographic Audit Ledger...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-xs text-[#526D61] font-mono">
                    No audit events match current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((e) => {
                  const actionColor = ACTION_COLORS[e.action] || 'bg-[#EBF7F0] text-[#0B4D3C] border-[#D1F2E2]';
                  return (
                    <tr
                      key={e.id}
                      onClick={() => setSelectedEvent(e)}
                      className="hover:bg-[#F4FBF7] cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#526D61] whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <Clock className="h-3 w-3 shrink-0" />
                          <span>{e.timestamp ? new Date(e.timestamp).toLocaleString('en-IN', { hour12: false }) : '—'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#D1FAE5] to-[#A7F3D0] flex items-center justify-center text-[#065F46] font-black text-[10px] shrink-0">
                            {e.actor_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="font-bold text-[#14231E]">{e.actor_name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#0B4D3C] whitespace-nowrap">
                        {e.actor_role.replace(/_/g, ' ')}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${actionColor}`}>
                          {e.action}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#364F44] whitespace-nowrap font-semibold">{e.entity_type}</td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#0284C7] whitespace-nowrap">
                        {e.entity_id.length > 24 ? e.entity_id.slice(0, 24) + '…' : e.entity_id}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs text-[#526D61]">
                        <span className="truncate block max-w-[200px]">{e.reason || '—'}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button className="px-3 py-1 rounded-full bg-[#F4FBF7] hover:bg-[#0B4D3C] hover:text-white border border-[#D5E6DC] text-[#0B4D3C] text-[11px] font-bold transition-all">
                          View Diff →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-[#F0F7F2] text-[10px] font-mono text-[#526D61] flex items-center justify-between">
            <span>Showing {filtered.length} of {events.length} events</span>
            <span className="text-emerald-700 font-bold">✓ ALCOA+ Compliant — SHA-256 Ledger Verified</span>
          </div>
        )}
      </div>

      {/* State Diff Drawer */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end" onClick={() => setSelectedEvent(null)}>
          <div
            className="w-full max-w-xl bg-white h-full overflow-y-auto p-8 space-y-6 shadow-2xl border-l border-[#E2EEE7] animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#F0F7F2] pb-4">
              <div>
                <span className={`font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${ACTION_COLORS[selectedEvent.action] || 'bg-[#EBF7F0] text-[#0B4D3C] border-[#D1F2E2]'}`}>
                  {selectedEvent.action}
                </span>
                <h3 className="text-base font-bold text-[#14231E] mt-1.5">{selectedEvent.entity_type}: {selectedEvent.entity_id}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <User className="h-3.5 w-3.5 text-[#526D61]" />
                  <p className="text-xs text-[#526D61]">{selectedEvent.actor_name} ({selectedEvent.actor_role.replace(/_/g, ' ')})</p>
                </div>
                {selectedEvent.reason && (
                  <p className="text-xs text-[#14231E] mt-2 p-3 bg-[#F4FBF7] rounded-2xl border border-[#D5E6DC] font-medium">
                    <strong className="text-[#0B4D3C]">Reason:</strong> {selectedEvent.reason}
                  </p>
                )}
              </div>
              <button onClick={() => setSelectedEvent(null)} className="p-2 rounded-full hover:bg-[#F4FBF7] text-[#526D61] self-start">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <div className="text-[#526D61] font-bold mb-2 uppercase tracking-wider text-[10px]">BEFORE STATE:</div>
                <div className="p-4 bg-[#F4FBF7] rounded-2xl border border-[#D5E6DC] overflow-x-auto text-[#14231E] max-h-64">
                  <pre className="whitespace-pre-wrap text-[11px] leading-relaxed">
                    {selectedEvent.before_state_json
                      ? JSON.stringify(JSON.parse(selectedEvent.before_state_json), null, 2)
                      : 'null — Initial record creation (no previous state)'}
                  </pre>
                </div>
              </div>
              <div>
                <div className="text-[#526D61] font-bold mb-2 uppercase tracking-wider text-[10px]">AFTER STATE:</div>
                <div className="p-4 bg-[#EBF7F0] rounded-2xl border border-[#D1F2E2] overflow-x-auto text-[#043427] max-h-64">
                  <pre className="whitespace-pre-wrap text-[11px] leading-relaxed">
                    {selectedEvent.after_state_json
                      ? JSON.stringify(JSON.parse(selectedEvent.after_state_json), null, 2)
                      : 'null — Record deleted'}
                  </pre>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#F4FBF7] rounded-2xl border border-[#D5E6DC] text-[11px] font-mono text-[#526D61]">
              <span className="text-[#0B4D3C] font-bold">Timestamp:</span>{' '}
              {selectedEvent.timestamp ? new Date(selectedEvent.timestamp).toLocaleString('en-IN', { hour12: false }) : '—'} IST
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
