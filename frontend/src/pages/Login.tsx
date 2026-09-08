import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, AlertCircle, ArrowRight, UserCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('pi@aiia.demo');
  const [password, setPassword] = useState('Nexus@AIIA2026');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { label: 'Principal Investigator', email: 'pi@aiia.demo', role: 'PI / Protocol Oversight', bg: 'bg-[#D7F5E8]', border: 'border-[#A7F3D0]', text: 'text-[#065F46]' },
    { label: 'Study Coordinator', email: 'coordinator@aiia.demo', role: 'Recruitment & Visits', bg: 'bg-[#E0F2FE]', border: 'border-[#BAE6FD]', text: 'text-[#0369A1]' },
    { label: 'Clinical Monitor (CRA)', email: 'monitor@aiia.demo', role: 'Monitoring Visits & SDV', bg: 'bg-[#FEF3C7]', border: 'border-[#FDE68A]', text: 'text-[#92400E]' },
    { label: 'Pharmacovigilance Officer', email: 'pv@aiia.demo', role: 'AE/SAE 24h Clock & Coding', bg: 'bg-[#FCE7F3]', border: 'border-[#FBCFE8]', text: 'text-[#BE185D]' },
    { label: 'Ethics Committee (IEC)', email: 'ethics@aiia.demo', role: 'Protocol & IEC Approvals', bg: 'bg-[#EDE9FE]', border: 'border-[#DDD6FE]', text: 'text-[#6D28D9]' },
    { label: 'Institutional Leadership', email: 'leadership@aiia.demo', role: 'Portfolio & Risk Intelligence', bg: 'bg-[#D1F2E2]', border: 'border-[#A3E5C8]', text: 'text-[#0B4D3C]' },
    { label: 'Regulatory Auditor', email: 'regulator@aiia.demo', role: 'Read-Only Audit & Compliance', bg: 'bg-[#F1F5F9]', border: 'border-[#CBD5E1]', text: 'text-[#334155]' },
    { label: 'System Administrator', email: 'admin@aiia.demo', role: 'Full Administrative Controls', bg: 'bg-[#E2E8F0]', border: 'border-[#94A3B8]', text: 'text-[#1E293B]' },
  ];

  const quickSelect = async (accountEmail: string) => {
    setEmail(accountEmail);
    setPassword('Nexus@AIIA2026');
    setError(null);
    setLoading(true);
    try {
      await login(accountEmail, 'Nexus@AIIA2026');
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B4D3C] via-[#0D5B47] to-[#043427] flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden">
      {/* Decorative Organic M3 Curves (inspired by Image 4) */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-[#D1F2E2]/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,40,25,0.25)] border border-white/40 overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* Left Visual Area (Forest Green Brand Identity) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#0B4D3C] to-[#06372A] p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-bold tracking-wide text-[#D1F2E2]">
              <Sparkles className="h-3 w-3" />
              <span>Ministry of Ayush • AIIA / NPvCC</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              AYUVISTA
            </h1>
            <p className="text-xs text-[#C5E3D2] leading-relaxed font-medium">
              Unified Clinical Research &amp; Pharmacovigilance Platform for AYUSH (GCP-ASU • CDISC • FHIR • DPDP 2023).
            </p>
          </div>

          {/* Standards Pills */}
          <div className="space-y-3 my-6 sm:my-8 relative z-10">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#8BBBA0] font-bold">
              Standard Conformance
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] font-bold">
              <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white">CDISC SDTM / ADaM</span>
              <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white">HL7 FHIR R4</span>
              <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white">GCP-ASU & ICMR</span>
              <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white">DPDP 2023 Compliant</span>
            </div>
          </div>

          <div className="text-[11px] text-[#A3D0B7] font-medium pt-4 border-t border-white/15 relative z-10">
            © 2026 All India Institute of Ayurveda • National Pharmacovigilance Centre
          </div>
        </div>

        {/* Right Form Area (Clean M3 Light Mode) */}
        <div className="lg:col-span-7 p-5 sm:p-10 lg:p-12 bg-white flex flex-col justify-center space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-[#14231E] tracking-tight">Institutional Login</h2>
            <p className="text-xs text-[#526D61] mt-1">
              Authenticate via role credentials or select an instant demo session profile below.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold text-[#364F44] mb-1">
                Institutional Email ID
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full bg-[#F4FBF7] border border-[#D5E6DC] px-4 py-2.5 text-xs text-[#14231E] focus:bg-white focus:border-[#0B4D3C] focus:ring-2 focus:ring-[#0B4D3C]/20 focus:outline-none transition font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#364F44] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-full bg-[#F4FBF7] border border-[#D5E6DC] px-4 py-2.5 text-xs text-[#14231E] focus:bg-white focus:border-[#0B4D3C] focus:ring-2 focus:ring-[#0B4D3C]/20 focus:outline-none transition font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#0B4D3C] hover:bg-[#07382B] text-white text-xs font-bold shadow-md shadow-[#0B4D3C]/20 transition flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Verifying Session...</span>
              ) : (
                <>
                  <span>Authenticate & Enter CTMS</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* 1-Click Instant Demo Role Profiles */}
          <div className="pt-4 border-t border-[#E2EEE7]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#688578] font-mono mb-3">
              Instant Demo Presets (1-Click Switch)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => quickSelect(acc.email)}
                  className={`p-2.5 rounded-2xl border ${acc.bg} ${acc.border} text-left transition hover:scale-[1.02] shadow-sm`}
                >
                  <div className={`text-[11px] font-bold ${acc.text} truncate`}>{acc.label}</div>
                  <div className="text-[9px] text-[#526D61] truncate mt-0.5">{acc.role}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
