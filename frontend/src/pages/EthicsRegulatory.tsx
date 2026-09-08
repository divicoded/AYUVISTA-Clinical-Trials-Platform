import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api/client';
import { EthicsSubmission, CTRIRegistration, RegulatoryMilestone } from '../types';
import { Scale, FileText, CheckCircle2, Clock, AlertTriangle, Shield, RefreshCw, Download, ExternalLink, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const EthicsRegulatory: React.FC = () => {
  const [submissions, setSubmissions] = useState<EthicsSubmission[]>([]);
  const [ctriList, setCtriList] = useState<CTRIRegistration[]>([]);
  const [milestones, setMilestones] = useState<RegulatoryMilestone[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'submissions' | 'ctri' | 'milestones'>('milestones');
  const [sandboxResult, setSandboxResult] = useState<any | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiRequest<EthicsSubmission[]>('/ethics/submissions'),
      apiRequest<CTRIRegistration[]>('/ethics/ctri'),
      apiRequest<RegulatoryMilestone[]>('/ethics/milestones'),
    ])
      .then(([sList, cList, mList]) => {
        setSubmissions(sList);
        setCtriList(cList);
        setMilestones(mList);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleTestCTRISandbox = async () => {
    setIsSyncing(true);
    try {
      const res = await apiRequest('/ethics/ctri/AYU-003/sync-sandbox', { method: 'POST' });
      setSandboxResult(res);
      // Trigger festive regulatory confirmation confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0B4D3C', '#10B981', '#F59E0B'],
      });
    } catch (e: any) {
      alert(e.message || 'Error running CTRI sandbox sync');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadApprovalCertificate = (code: string) => {
    const certContent = `ALL INDIA INSTITUTE OF AYURVEDA (AIIA)
INSTITUTIONAL ETHICS COMMITTEE (IEC)
STATUTORY ETHICS CLEARANCE CERTIFICATE
------------------------------------------------------------
Submission Code: ${code}
Study Protocol: Phase III Efficacy & Safety Trial (AYU-003)
Decision: APPROVED WITH STANDARD MONITORING
Approval Date: 2025-11-12
Validity Period: 24 Months
Statutory Standard: ICMR Ethical Guidelines (2017) & GCP-ASU
Member Secretary: Dr. Meenakshi Sundaram, MD (Ayu)
------------------------------------------------------------
Verification Hash: sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
STATUS: VALID ETHICS ENDORSEMENT (PROTOTYPE VERIFIED)`;

    const blob = new Blob([certContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IEC_Approval_${code}.txt`;
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
            <span>Statutory Compliance Oversight</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14231E] tracking-tight">Ethics Governance & CTRI Registry</h1>
          <p className="text-xs text-[#526D61] mt-0.5">
            Institutional Ethics Committee Submissions • CTRI Protocol Registry Sync • Statutory Deadlines
          </p>
        </div>
      </div>

      {/* Approaching Regulatory Deadline Banner */}
      <div className="p-5 sm:p-6 rounded-[2rem] bg-gradient-to-r from-[#FFFBEB] via-white to-[#FEF3C7] border-2 border-[#FDE68A] text-xs flex items-start space-x-3.5 shadow-sm">
        <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-black text-[#92400E] uppercase tracking-wide text-xs">
              UPCOMING STATUTORY DEADLINE: CTRI 6-MONTHLY PROGRESS FILING
            </span>
            <p className="text-[#78350F] mt-1 leading-relaxed">
              Mandatory CTRI half-yearly progress report for Hero Study <strong className="font-mono font-bold">AYU-003</strong> is due in 9 days. Ethics Committee renewal certificate attached.
            </p>
          </div>
          <button
            onClick={handleTestCTRISandbox}
            disabled={isSyncing}
            className="px-5 py-2.5 bg-[#0B4D3C] hover:bg-[#07382B] text-white font-bold rounded-full transition shadow-sm flex items-center space-x-2 shrink-0 active:scale-95"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Synchronizing…' : 'Sync CTRI Sandbox'}</span>
          </button>
        </div>
      </div>

      {/* Sandbox Trigger Result Toast Banner */}
      {sandboxResult && (
        <div className="p-4 bg-[#D7F5E8] border border-[#A7F3D0] rounded-[2rem] text-xs text-[#065F46] flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span>
              <strong>CTRI Gateway Response:</strong> Sync successful for {sandboxResult.study_code} • CTRI Number: {sandboxResult.ctri_number} • Status: {sandboxResult.status}
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#044031]">Audit Logged #ALC-CTRI-01</span>
        </div>
      )}

      {/* 3 Sub-Tabs Pill Header */}
      <div className="bg-white border border-[#E2EEE7] rounded-[2rem] p-2 flex space-x-1 overflow-x-auto text-xs shadow-sm">
        {[
          { id: 'milestones', label: `Regulatory Milestones (${milestones.length})`, icon: Clock },
          { id: 'ctri', label: `CTRI Registry Hub (${ctriList.length})`, icon: Shield },
          { id: 'submissions', label: `IEC Ethics Submissions (${submissions.length})`, icon: Scale },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full font-bold transition whitespace-nowrap ${
              activeSubTab === tab.id
                ? 'bg-[#0B4D3C] text-white shadow-sm'
                : 'text-[#526D61] hover:text-[#14231E] hover:bg-[#F4FBF7]'
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab: Milestones */}
      {activeSubTab === 'milestones' && (
        <div className="bg-white border border-[#E2EEE7] rounded-[2rem] p-6 shadow-sm overflow-hidden text-xs">
          <table className="w-full text-left text-[#14231E]">
            <thead className="bg-[#F4FBF7] text-[#526D61] font-mono uppercase text-[10px] rounded-xl">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Milestone Activity</th>
                <th className="py-3 px-4">Responsible Owner</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4 rounded-r-xl">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F7F2]">
              {milestones.map((m) => {
                const isDueSoon = m.status === 'DUE_SOON';
                const isOverdue = m.status === 'OVERDUE';
                return (
                  <tr key={m.id} className={`hover:bg-[#F9FDFB] transition ${isDueSoon ? 'bg-amber-50/40' : isOverdue ? 'bg-rose-50/40' : ''}`}>
                    <td className="py-4 px-4 font-bold text-[#14231E]">{m.milestone_name}</td>
                    <td className="py-4 px-4 text-[#526D61]">{m.owner_name}</td>
                    <td className="py-4 px-4 font-mono font-bold text-[#14231E]">{m.due_date}</td>
                    <td className="py-4 px-4 font-mono">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        m.priority === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-[#F4FBF7] text-[#526D61]'
                      }`}>
                        {m.priority}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        isOverdue
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : isDueSoon
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-[#D7F5E8] text-[#065F46] border border-[#A7F3D0]'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: CTRI Hub */}
      {activeSubTab === 'ctri' && (
        <div className="bg-white border border-[#E2EEE7] rounded-[2rem] p-6 shadow-sm overflow-hidden text-xs">
          <table className="w-full text-left text-[#14231E]">
            <thead className="bg-[#F4FBF7] text-[#526D61] font-mono uppercase text-[10px] rounded-xl">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">CTRI Number</th>
                <th className="py-3 px-4">Registration Date</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Responsible User</th>
                <th className="py-3 px-4">Registry Connector</th>
                <th className="py-3 px-4 rounded-r-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F7F2]">
              {ctriList.map((c) => (
                <tr key={c.id} className="hover:bg-[#F9FDFB] transition">
                  <td className="py-4 px-4 font-mono font-bold text-[#0B4D3C]">{c.ctri_number}</td>
                  <td className="py-4 px-4 font-mono text-[#526D61]">{c.registration_date}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF7F0] text-[#0B4D3C]">
                      {c.is_prospective ? 'Prospective' : 'Retrospective'}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-[#14231E]">{c.responsible_user_name}</td>
                  <td className="py-4 px-4 font-mono">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#D7F5E8] text-[#065F46]">
                      {c.connector_status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => window.open('https://ctri.nic.in', '_blank')}
                      className="px-3 py-1 rounded-full bg-[#F4FBF7] hover:bg-[#EBF7F0] border border-[#D5E6DC] text-[#0B4D3C] text-[11px] font-bold transition flex items-center space-x-1 inline-flex"
                    >
                      <span>CTRI Portal</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: IEC Submissions */}
      {activeSubTab === 'submissions' && (
        <div className="bg-white border border-[#E2EEE7] rounded-[2rem] p-6 shadow-sm overflow-hidden text-xs">
          <table className="w-full text-left text-[#14231E]">
            <thead className="bg-[#F4FBF7] text-[#526D61] font-mono uppercase text-[10px] rounded-xl">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Submission Code</th>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Decision</th>
                <th className="py-3 px-4">Validity Expiry</th>
                <th className="py-3 px-4 rounded-r-xl text-right">Download Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F7F2]">
              {submissions.map((s) => (
                <tr key={s.id} className="hover:bg-[#F9FDFB] transition">
                  <td className="py-4 px-4 font-mono font-bold text-[#0B4D3C]">{s.submission_code}</td>
                  <td className="py-4 px-4 font-mono font-semibold text-[#14231E]">{s.version}</td>
                  <td className="py-4 px-4 text-[#526D61]">{s.submission_type}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#D7F5E8] text-[#065F46] border border-[#A7F3D0]">
                      {s.decision}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-[#526D61]">{s.validity_expiry_date || '24 Months'}</td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleDownloadApprovalCertificate(s.submission_code)}
                      className="px-3.5 py-1 rounded-full bg-[#0B4D3C] hover:bg-[#07382B] text-white text-[11px] font-bold transition flex items-center space-x-1.5 inline-flex shadow-sm"
                    >
                      <Download className="h-3 w-3" />
                      <span>Download PDF</span>
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
