import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client';
import { Study } from '../types';
import { Search, Filter, FlaskConical, AlertCircle, ArrowUpRight, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

export const Studies: React.FC = () => {
  const [studies, setStudies] = useState<Study[]>([]);
  const [search, setSearch] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    apiRequest<Study[]>('/studies')
      .then(setStudies)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredStudies = studies.filter((st) => {
    const matchesSearch =
      st.study_code.toLowerCase().includes(search.toLowerCase()) ||
      st.title.toLowerCase().includes(search.toLowerCase()) ||
      st.therapeutic_area.toLowerCase().includes(search.toLowerCase());
    const matchesPhase = selectedPhase === 'ALL' || st.phase.includes(selectedPhase);
    return matchesSearch && matchesPhase;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-[#E2EEE7] shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#EBF7F0] text-[#0B4D3C] text-[11px] font-bold mb-1">
            <Sparkles className="h-3 w-3" />
            <span>Master Registry</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14231E] tracking-tight">Clinical Studies Portfolio</h1>
          <p className="text-xs text-[#526D61] mt-0.5">
            AIIA Master Clinical Trials Registry • Classical Formulations & Integrative Investigations ({studies.length} Protocols)
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white border border-[#E2EEE7] rounded-[2rem] flex flex-col sm:flex-row items-center gap-3 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="h-4 w-4 absolute left-4 top-3 text-[#526D61]" />
          <input
            type="text"
            placeholder="Search by Study Code, Title, or Therapeutic Area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#F4FBF7] border border-[#D5E6DC] text-xs text-[#14231E] placeholder-[#7D9A8D] focus:outline-none focus:border-[#0B4D3C] focus:bg-white transition"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-[#526D61]" />
          <select
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value)}
            className="bg-[#F4FBF7] border border-[#D5E6DC] text-xs text-[#14231E] font-semibold rounded-full px-4 py-2.5 focus:outline-none focus:border-[#0B4D3C] transition"
          >
            <option value="ALL">All Clinical Phases</option>
            <option value="Phase II">Phase II</option>
            <option value="Phase III">Phase III</option>
            <option value="Observational">Observational / Registry</option>
          </select>
        </div>
      </div>

      {/* Studies Data Table */}
      <div className="bg-white border border-[#E2EEE7] rounded-[2rem] p-6 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#14231E]">
            <thead className="bg-[#F4FBF7] text-[#526D61] font-mono uppercase text-[10px] rounded-xl">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Code</th>
                <th className="py-3 px-4">Title & Objectives</th>
                <th className="py-3 px-4">Therapeutic Area</th>
                <th className="py-3 px-4">Lifecycle Stage</th>
                <th className="py-3 px-4">Enrollment</th>
                <th className="py-3 px-4 text-center">Risk Score</th>
                <th className="py-3 px-4 rounded-r-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F7F2]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#526D61] font-mono">
                    Loading Clinical Protocols...
                  </td>
                </tr>
              ) : (
                filteredStudies.map((st) => {
                  const isHero = st.study_code === 'AYU-003';
                  const pct = Math.round((st.current_enrollment / (st.target_enrollment || 1)) * 100);
                  return (
                    <tr
                      key={st.id}
                      onClick={() => navigate(`/studies/${st.study_code}`)}
                      className={`hover:bg-[#F9FDFB] cursor-pointer transition ${
                        isHero ? 'bg-rose-50/40 font-medium' : ''
                      }`}
                    >
                      <td className="py-4 px-4 font-mono font-bold text-[#0B4D3C] whitespace-nowrap flex items-center space-x-2">
                        <span>{st.study_code}</span>
                        {isHero && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] bg-rose-100 text-rose-800 border border-rose-200 font-sans font-bold">
                            HERO TRIAL
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 max-w-md">
                        <div className="font-bold text-[#14231E] leading-snug">{st.title}</div>
                        <div className="text-[11px] text-[#526D61] mt-0.5">{st.short_title} • {st.phase}</div>
                      </td>
                      <td className="py-4 px-4 font-medium text-[#364F44] whitespace-nowrap">
                        {st.therapeutic_area}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#D7F5E8] text-[#065F46] border border-[#A7F3D0]">
                          {st.lifecycle_stage}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-[#14231E]">{st.current_enrollment} / {st.target_enrollment}</span>
                          <span className="text-[10px] text-[#526D61]">({pct}%)</span>
                        </div>
                        <div className="w-24 h-1.5 bg-[#E2EEE7] rounded-full overflow-hidden mt-1.5">
                          <div
                            className={`h-full rounded-full ${pct < 50 ? 'bg-amber-500' : 'bg-[#0B4D3C]'}`}
                            style={{ width: `${Math.min(100, pct)}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center font-mono font-bold">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          st.risk_score > 60
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : st.risk_score > 40
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {st.risk_score.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <button className="px-3 py-1.5 rounded-full bg-[#F4FBF7] hover:bg-[#EBF7F0] border border-[#D5E6DC] text-[#0B4D3C] text-xs font-bold transition">
                          Workspace →
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
    </div>
  );
};
