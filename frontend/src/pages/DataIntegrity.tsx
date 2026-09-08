import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export const DataIntegrity: React.FC = () => {
  const alcoaPrinciples = [
    {
      code: 'A',
      title: 'Attributable',
      desc: 'Every clinical write operation records immutable actor ID, role, and IP address in the append-only audit trail.',
      status: 'Implemented in Prototype',
      bg: 'bg-[#D7F5E8]',
      text: 'text-[#065F46]',
    },
    {
      code: 'L',
      title: 'Legible',
      desc: 'Data models use standardized human-readable field schemas and structured JSON state transitions.',
      status: 'Implemented in Prototype',
      bg: 'bg-[#E0F2FE]',
      text: 'text-[#0369A1]',
    },
    {
      code: 'C',
      title: 'Contemporaneous',
      desc: 'All audit events and visit records are timestamped with high-resolution UTC ISO-8601 timestamps at execution.',
      status: 'Implemented in Prototype',
      bg: 'bg-[#FEF3C7]',
      text: 'text-[#92400E]',
    },
    {
      code: 'O',
      title: 'Original',
      desc: 'Source eCRF values and before-state records are permanently retained prior to modification or query resolution.',
      status: 'Implemented in Prototype',
      bg: 'bg-[#FFEDD5]',
      text: 'text-[#C2410C]',
    },
    {
      code: 'A',
      title: 'Accurate',
      desc: 'Data validation rules at Pydantic schema level ensure range checks, mandatory fields, and type consistency.',
      status: 'Implemented in Prototype',
      bg: 'bg-[#EDE9FE]',
      text: 'text-[#6D28D9]',
    },
    {
      code: '+',
      title: 'Complete, Consistent, Enduring, Available',
      desc: 'CDISC-aligned data exports (SDTM/ADaM/Define-XML) and HL7 FHIR R4 interoperability layer preserve durability and cross-system accessibility.',
      status: 'Implemented in Prototype',
      bg: 'bg-[#FCE7F3]',
      text: 'text-[#BE185D]',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-[#E2EEE7] shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#EBF7F0] text-[#0B4D3C] text-[11px] font-bold mb-1">
            <Sparkles className="h-3 w-3" />
            <span>Good Clinical Practice Standards</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14231E] tracking-tight">ALCOA+ Data Integrity Framework</h1>
          <p className="text-xs text-[#526D61] mt-0.5">
            Operational controls implemented to demonstrate compliance with international clinical trial data integrity expectations.
          </p>
        </div>
      </div>

      <div className="p-5 bg-white border border-[#E2EEE7] rounded-[2rem] space-y-2 text-xs shadow-sm">
        <div className="font-bold text-[#14231E] flex items-center space-x-2 text-sm">
          <AlertCircle className="h-5 w-5 text-[#0B4D3C]" />
          <span>Regulatory Compliance Transparency Statement</span>
        </div>
        <p className="text-[#526D61] leading-relaxed">
          This system is an enterprise-grade prototype designed for innovation and hackathon demonstration. While architectural patterns reflect 21 CFR Part 11 and GCP ALCOA+ principles (append-only ledger, user attribution, contemporaneous logging, before/after diffs), it is designed specifically for research and evaluation environments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alcoaPrinciples.map((item) => (
          <div key={item.title} className="p-6 bg-white border border-[#E2EEE7] rounded-[2rem] space-y-3 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className={`h-8 w-8 rounded-full ${item.bg} ${item.text} flex items-center justify-center font-mono font-black text-sm shadow-sm`}>
                {item.code}
              </span>
              <span className="text-[10px] font-bold font-mono text-[#0B4D3C] bg-[#EBF7F0] px-3 py-1 rounded-full border border-[#D1F2E2]">
                {item.status}
              </span>
            </div>
            <h3 className="text-base font-bold text-[#14231E]">{item.title}</h3>
            <p className="text-xs text-[#526D61] leading-relaxed font-medium">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
