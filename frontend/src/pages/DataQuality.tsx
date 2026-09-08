import React, { useState, useEffect } from "react";
import { apiRequest } from "../api/client";
import { DataQuery } from "../types";
import { Search, CheckCircle2, X, Sparkles, RefreshCw, Filter } from "lucide-react";

const SEVERITY_OPTS = ["ALL", "CRITICAL", "MAJOR", "MINOR"] as const;
const STATUS_OPTS = ["ALL", "OPEN", "ANSWERED", "CLOSED"] as const;

const SEVERITY_STYLE: Record<string, string> = {
  CRITICAL: "bg-rose-100 text-rose-800 border-rose-200",
  MAJOR: "bg-amber-100 text-amber-800 border-amber-200",
  MINOR: "bg-sky-100 text-sky-800 border-sky-200",
};

export const DataQuality: React.FC = () => {
  const [queries, setQueries] = useState<DataQuery[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [selectedQuery, setSelectedQuery] = useState<DataQuery | null>(null);
  const [resolutionText, setResolutionText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      apiRequest<DataQuery[]>("/queries"),
      apiRequest<any>("/queries/summary"),
    ])
      .then(([qList, sum]) => {
        setQueries(qList);
        setSummary(sum);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleAnswerQuery = async () => {
    if (!selectedQuery || !resolutionText.trim()) return;
    setSubmitting(true);
    try {
      await apiRequest(`/queries/${selectedQuery.id}/answer`, {
        method: "PUT",
        body: JSON.stringify({ resolution: resolutionText }),
      });
      setSelectedQuery(null);
      setResolutionText("");
      loadData();
    } catch (e: any) {
      alert(e.message || "Error answering query");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseQuery = async (queryId: string) => {
    try {
      await apiRequest(`/queries/${queryId}/close`, { method: "PUT" });
      loadData();
    } catch (e: any) {
      alert(e.message || "Error closing query");
    }
  };

  const filtered = queries.filter((q) => {
    const matchesSearch =
      q.query_code.toLowerCase().includes(search.toLowerCase()) ||
      q.field_name.toLowerCase().includes(search.toLowerCase()) ||
      q.issue.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || q.status === statusFilter;
    const matchesSeverity = severityFilter === "ALL" || q.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const hasFilters = search || statusFilter !== "ALL" || severityFilter !== "ALL";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-[#E2EEE7] shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#EBF7F0] text-[#0B4D3C] text-[11px] font-bold mb-1">
            <Sparkles className="h-3 w-3" />
            <span>eCRF Discrepancy Governance</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14231E] tracking-tight">Clinical Data Quality & Queries</h1>
          <p className="text-xs text-[#526D61] mt-0.5">Real-Time eCRF Discrepancy Management • Site Queries • Resolution Audit Tracking</p>
        </div>
        <button onClick={loadData} disabled={loading} className="h-10 w-10 rounded-full bg-[#F4FBF7] border border-[#D5E6DC] flex items-center justify-center text-[#0B4D3C] hover:bg-[#EBF7F0] transition active:scale-95 shrink-0" title="Refresh">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Queries", value: summary?.total_queries ?? queries.length, bg: "bg-[#F4FBF7]", border: "border-[#D5E6DC]", color: "text-[#0B4D3C]" },
          { label: "Open Queries", value: summary?.open_queries ?? queries.filter(q => q.status === "OPEN").length, bg: "bg-[#FFEDD5]", border: "border-[#FED7AA]", color: "text-[#C2410C]" },
          { label: "Critical", value: summary?.critical_queries ?? queries.filter(q => q.severity === "CRITICAL").length, bg: "bg-[#FFF1F2]", border: "border-[#FECDD3]", color: "text-rose-700" },
          { label: "Resolved & Closed", value: summary?.closed_queries ?? queries.filter(q => q.status === "CLOSED").length, bg: "bg-[#D7F5E8]", border: "border-[#A7F3D0]", color: "text-emerald-800" },
        ].map((kpi) => (
          <div key={kpi.label} className={`p-5 rounded-[2rem] ${kpi.bg} border ${kpi.border} shadow-sm`}>
            <div className="text-xs font-semibold text-[#526D61]">{kpi.label}</div>
            <div className={`text-3xl font-black font-mono mt-1 ${kpi.color}`}>{kpi.value}</div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border border-[#E2EEE7] rounded-[2rem] space-y-3 shadow-sm">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-4 top-3 text-[#526D61]" />
          <input type="text" placeholder="Search by Query Code, Field Name, or Discrepancy issue..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#F4FBF7] border border-[#D5E6DC] text-xs text-[#14231E] placeholder-[#7D9A8D] focus:outline-none focus:border-[#0B4D3C] focus:bg-white transition" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1">
            <Filter className="h-3.5 w-3.5 text-[#526D61]" />
            <span className="text-[11px] font-bold text-[#526D61]">Status:</span>
          </div>
          {STATUS_OPTS.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3.5 py-1 rounded-full text-[11px] font-bold transition ${statusFilter === s ? "bg-[#0B4D3C] text-white shadow-sm" : "bg-[#F4FBF7] text-[#526D61] hover:bg-[#EBF7F0] border border-[#D5E6DC]"}`}>{s}</button>
          ))}
          <div className="h-4 w-px bg-[#D5E6DC] mx-1" />
          <span className="text-[11px] font-bold text-[#526D61]">Severity:</span>
          {SEVERITY_OPTS.map((s) => (
            <button key={s} onClick={() => setSeverityFilter(s)} className={`px-3.5 py-1 rounded-full text-[11px] font-bold transition ${severityFilter === s ? "bg-[#0B4D3C] text-white shadow-sm" : "bg-[#F4FBF7] text-[#526D61] hover:bg-[#EBF7F0] border border-[#D5E6DC]"}`}>{s}</button>
          ))}
          {hasFilters && (
            <button onClick={() => { setSearch(""); setStatusFilter("ALL"); setSeverityFilter("ALL"); }} className="ml-auto px-3 py-1 rounded-full text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition flex items-center space-x-1">
              <X className="h-3 w-3" /><span>Clear</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-[#E2EEE7] rounded-[2rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#14231E]">
            <thead className="bg-[#F4FBF7] text-[#526D61] font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Query Code</th>
                <th className="py-3 px-4">eCRF Field</th>
                <th className="py-3 px-4">Discrepancy Issue</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 rounded-r-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F7F2]">
              {loading ? (
                <tr><td colSpan={7} className="py-12 text-center"><div className="flex items-center justify-center space-x-3 text-[#526D61] font-mono text-xs"><div className="h-5 w-5 rounded-full border-2 border-[#0B4D3C] border-t-transparent animate-spin" /><span>Loading Data Discrepancies...</span></div></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-10 text-center text-xs text-[#526D61] font-mono">{hasFilters ? "No queries match current filters." : "No queries found."}</td></tr>
              ) : (
                filtered.map((q) => (
                  <tr key={q.id} className="hover:bg-[#F4FBF7] transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-[#0B4D3C] whitespace-nowrap">{q.query_code}</td>
                    <td className="py-4 px-4 font-bold text-[#0284C7] whitespace-nowrap">{q.field_name}</td>
                    <td className="py-4 px-4 max-w-md text-[#364F44] leading-relaxed">{q.issue}</td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${SEVERITY_STYLE[q.severity] || "bg-[#F4FBF7] text-[#526D61] border-[#D5E6DC]"}`}>{q.severity}</span>
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${q.status === "CLOSED" ? "bg-[#D7F5E8] text-[#065F46]" : q.status === "ANSWERED" ? "bg-sky-100 text-sky-800" : "bg-[#FFEDD5] text-[#C2410C]"}`}>{q.status}</span>
                    </td>
                    <td className="py-4 px-4 font-mono text-[#526D61] whitespace-nowrap">{q.due_date}</td>
                    <td className="py-4 px-4 text-right whitespace-nowrap space-x-2">
                      {q.status !== "CLOSED" ? (
                        <>
                          <button onClick={() => setSelectedQuery(q)} className="px-3 py-1 bg-[#0B4D3C] hover:bg-[#07382B] text-white text-[11px] font-bold rounded-full transition shadow-sm">Answer</button>
                          <button onClick={() => handleCloseQuery(q.id)} className="px-3 py-1 bg-[#F4FBF7] hover:bg-[#EBF7F0] border border-[#D5E6DC] text-[#0B4D3C] text-[11px] font-bold rounded-full transition">Close</button>
                        </>
                      ) : (
                        <span className="text-emerald-800 font-bold text-[11px] flex items-center justify-end space-x-1"><CheckCircle2 className="h-3.5 w-3.5" /><span>Closed</span></span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-[#F0F7F2] text-[10px] font-mono text-[#526D61] flex items-center justify-between">
            <span>Showing {filtered.length} of {queries.length} queries</span>
            <span className="text-[#0B4D3C] font-bold">{queries.filter(q => q.status === "OPEN").length} open · {queries.filter(q => q.status === "CLOSED").length} closed</span>
          </div>
        )}
      </div>

      {selectedQuery && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedQuery(null)}>
          <div className="bg-white rounded-[2rem] border border-[#D5E6DC] max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#F0F7F2] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#14231E]">Answer Query {selectedQuery.query_code}</h3>
                <p className="text-[11px] text-[#526D61]">Field: <span className="font-bold text-[#0284C7]">{selectedQuery.field_name}</span></p>
              </div>
              <button onClick={() => setSelectedQuery(null)} className="p-1.5 rounded-full hover:bg-[#F4FBF7] text-[#526D61]"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-3 bg-[#F4FBF7] rounded-2xl border border-[#D5E6DC] text-xs text-[#14231E] leading-relaxed">
              <strong className="text-[#0B4D3C]">Discrepancy:</strong> {selectedQuery.issue}
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#364F44] mb-1.5">Resolution Justification (ALCOA+ Required)</label>
              <textarea rows={4} placeholder="Provide a detailed resolution justification referencing source data, visit notes, or corrected values..." value={resolutionText} onChange={(e) => setResolutionText(e.target.value)} className="w-full p-3 rounded-2xl bg-[#F4FBF7] border border-[#D5E6DC] text-xs text-[#14231E] focus:outline-none focus:border-[#0B4D3C] focus:bg-white resize-none" />
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setSelectedQuery(null)} className="px-4 py-2 rounded-full border border-[#D5E6DC] text-xs font-bold text-[#526D61] hover:bg-[#F4FBF7] transition">Cancel</button>
              <button onClick={handleAnswerQuery} disabled={submitting || !resolutionText.trim()} className="px-5 py-2 rounded-full bg-[#0B4D3C] hover:bg-[#07382B] disabled:opacity-50 text-white text-xs font-bold shadow-sm flex items-center space-x-2 transition">
                {submitting && <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />}
                <span>{submitting ? "Submitting..." : "Submit Resolution"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
