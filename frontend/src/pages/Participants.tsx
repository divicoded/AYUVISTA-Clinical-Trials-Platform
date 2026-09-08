import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api/client';
import { Participant, Visit } from '../types';
import { Users, Search, Calendar, ShieldCheck, X, CheckCircle, Clock, Sparkles } from 'lucide-react';

export const Participants: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [search, setSearch] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [visitsLoading, setVisitsLoading] = useState(false);

  useEffect(() => {
    apiRequest<Participant[]>('/participants?limit=150')
      .then(setParticipants)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openVisitsModal = async (p: Participant) => {
    setSelectedParticipant(p);
    setVisitsLoading(true);
    try {
      const vList = await apiRequest<Visit[]>(`/participants/${p.id}/visits`);
      setVisits(vList);
    } catch (e) {
      console.error(e);
    } finally {
      setVisitsLoading(false);
    }
  };

  const handleCompleteVisit = async (vId: string) => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const updated = await apiRequest<Visit>(`/participants/visits/${vId}/complete`, {
        method: 'PUT',
        body: JSON.stringify({ actual_date: todayStr, notes: 'Completed in prototype demo interface' }),
      });
      setVisits((prev) => prev.map((v) => (v.id === vId ? updated : v)));
    } catch (e: any) {
      alert(e.message || 'Error updating visit');
    }
  };

  const filtered = participants.filter((p) =>
    p.synthetic_id.toLowerCase().includes(search.toLowerCase()) ||
    p.treatment_arm.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & DPDP Synthetic Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-[#E2EEE7] shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#EBF7F0] text-[#0B4D3C] text-[11px] font-bold mb-1">
            <Sparkles className="h-3 w-3" />
            <span>DPDP 2023 Compliant Subject Registry</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14231E] tracking-tight">Synthetic Participant Registry</h1>
          <p className="text-xs text-[#526D61] mt-0.5">
            Synthetic De-Identified Subject Cohort (SYN-P Tokenized) • Protocol Visit Compliance Tracking
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3.5 py-1.5 rounded-full bg-[#D7F5E8] text-[#065F46] border border-[#A7F3D0] text-xs font-bold font-mono flex items-center space-x-1.5">
            <ShieldCheck className="h-4 w-4" />
            <span>SYN-P DE-IDENTIFIED</span>
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white border border-[#E2EEE7] rounded-[2rem] flex items-center shadow-sm">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-4 top-3 text-[#526D61]" />
          <input
            type="text"
            placeholder="Search by Synthetic Subject ID (e.g. SYN-P00219) or Treatment Arm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#F4FBF7] border border-[#D5E6DC] text-xs text-[#14231E] placeholder-[#7D9A8D] focus:outline-none focus:border-[#0B4D3C] focus:bg-white transition"
          />
        </div>
      </div>

      {/* Participants Table */}
      <div className="bg-white border border-[#E2EEE7] rounded-[2rem] p-6 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#14231E]">
            <thead className="bg-[#F4FBF7] text-[#526D61] font-mono uppercase text-[10px] rounded-xl">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Subject Token</th>
                <th className="py-3 px-4">Demographics</th>
                <th className="py-3 px-4">Investigational Arm</th>
                <th className="py-3 px-4">Randomization</th>
                <th className="py-3 px-4">Consent Status</th>
                <th className="py-3 px-4">Participant Status</th>
                <th className="py-3 px-4 rounded-r-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F7F2]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#526D61] font-mono">
                    Loading De-Identified Synthetic Participants...
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} onClick={() => openVisitsModal(p)} className="hover:bg-[#F9FDFB] cursor-pointer transition">
                    <td className="py-4 px-4 font-mono font-bold text-[#0B4D3C] whitespace-nowrap">
                      {p.synthetic_id}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-[#14231E] font-medium">
                      {p.age_years} yrs • {p.gender}
                    </td>
                    <td className="py-4 px-4 font-bold text-[#14231E] max-w-xs truncate">
                      {p.treatment_arm}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs">
                      <span className="px-2.5 py-1 rounded-full bg-[#E0F2FE] text-[#0369A1] font-bold">
                        {p.randomization_status}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        p.consent_status === 'OBTAINED' ? 'bg-[#D7F5E8] text-[#065F46]' : 'bg-[#FEF3C7] text-[#92400E]'
                      }`}>
                        {p.consent_status}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F4FBF7] text-[#0B4D3C] border border-[#D5E6DC]">
                        {p.participant_status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <button className="px-3 py-1 rounded-full bg-[#F4FBF7] hover:bg-[#EBF7F0] border border-[#D5E6DC] text-[#0B4D3C] text-xs font-bold transition">
                        Visits ({'>'})
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visits Schedule Drawer */}
      {selectedParticipant && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full overflow-y-auto p-8 space-y-6 shadow-2xl border-l border-[#E2EEE7] animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-[#F0F7F2] pb-4">
              <div>
                <span className="font-mono text-xl font-bold text-[#0B4D3C]">{selectedParticipant.synthetic_id}</span>
                <h3 className="text-base font-bold text-[#14231E] mt-1">{selectedParticipant.treatment_arm}</h3>
                <p className="text-xs text-[#526D61] mt-0.5">{selectedParticipant.age_years} yrs • {selectedParticipant.gender}</p>
              </div>
              <button
                onClick={() => setSelectedParticipant(null)}
                className="p-2 rounded-full hover:bg-[#F4FBF7] text-[#526D61] hover:text-[#14231E]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#526D61] font-mono">
                Protocol Visit Compliance Schedule
              </h4>
              <div className="space-y-3">
                {visits.map((v) => (
                  <div key={v.id} className="p-4 bg-[#F4FBF7] rounded-2xl border border-[#D5E6DC] text-xs flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#14231E]">{v.sequence_order}. {v.visit_name}</div>
                      <div className="text-[11px] text-[#526D61] font-mono mt-0.5">Target: {v.target_date} • Window: ±{v.window_days_max}d</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        v.status === 'COMPLETED' ? 'bg-[#D7F5E8] text-[#065F46]' : 'bg-[#FEF3C7] text-[#92400E]'
                      }`}>
                        {v.status}
                      </span>
                      {v.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleCompleteVisit(v.id)}
                          className="px-3 py-1 bg-[#0B4D3C] hover:bg-[#07382B] text-white text-[11px] font-bold rounded-full transition shadow-sm"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
