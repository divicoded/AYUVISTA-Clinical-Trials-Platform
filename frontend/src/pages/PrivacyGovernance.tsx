import React from 'react';
import { Lock, Shield, EyeOff, FileCheck, Sparkles } from 'lucide-react';

export const PrivacyGovernance: React.FC = () => {
  const controls = [
    {
      title: 'De-Identification by Design',
      desc: 'All human trial subjects utilize synthetic tokens (SYN-P00001 through SYN-P01500+). No Real-World Personal Identifiable Information (PII) or Aadhaar/ABHA actual credentials exist in this environment.',
      icon: EyeOff,
      bg: 'bg-[#D7F5E8]',
      text: 'text-[#065F46]',
    },
    {
      title: 'Digital Consent Lifecycle',
      desc: 'Participant consent states (Obtained, Superseded, Withdrawn) are tracked per protocol version, preventing data processing following consent revocation.',
      icon: FileCheck,
      bg: 'bg-[#E0F2FE]',
      text: 'text-[#0369A1]',
    },
    {
      title: 'Role-Based Data Minimization',
      desc: 'Granular backend role authorization restricts demographic and case data visibility strictly to authorized investigator and pharmacovigilance roles.',
      icon: Lock,
      bg: 'bg-[#FEF3C7]',
      text: 'text-[#92400E]',
    },
    {
      title: 'Statutory Data Export Safeguards',
      desc: 'Exports to CDISC SDTM and HL7 FHIR strip local institutional database keys and apply submission-standard pseudo-identifiers (e.g., AYU-003-SYN-P00219).',
      icon: Shield,
      bg: 'bg-[#EDE9FE]',
      text: 'text-[#6D28D9]',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-[#E2EEE7] shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#EBF7F0] text-[#0B4D3C] text-[11px] font-bold mb-1">
            <Sparkles className="h-3 w-3" />
            <span>DPDP Act 2023 Statutory Compliance</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14231E] tracking-tight">Privacy & Data Governance Controls</h1>
          <p className="text-xs text-[#526D61] mt-0.5">
            Architectural safeguards aligned with India's Digital Personal Data Protection (DPDP) Act and Good Clinical Practice.
          </p>
        </div>
        <div>
          <span className="px-3.5 py-1.5 rounded-full bg-[#D7F5E8] text-[#065F46] border border-[#A7F3D0] text-xs font-bold font-mono">
            DPDP ALIGNED
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {controls.map((c) => (
          <div key={c.title} className="p-6 bg-white border border-[#E2EEE7] rounded-[2rem] space-y-3 shadow-sm hover:shadow-md transition">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-2xl ${c.bg} ${c.text}`}>
                <c.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-[#14231E]">{c.title}</h3>
            </div>
            <p className="text-xs text-[#526D61] leading-relaxed font-medium">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
