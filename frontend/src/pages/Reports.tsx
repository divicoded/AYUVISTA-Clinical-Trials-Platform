import React, { useState } from 'react';
import { FileSpreadsheet, Download, Code, CheckCircle2, ChevronRight, Database, FileText, Sparkles } from 'lucide-react';

type Domain = 'DM' | 'AE' | 'DS' | 'SV' | 'ADSL' | 'DEFINE';

export const Reports: React.FC = () => {
  const [selectedStudy, setSelectedStudy] = useState('AYU-003');
  const [activePreview, setActivePreview] = useState<Domain>('DM');
  const [downloading, setDownloading] = useState<string | null>(null);

  const downloadDataset = (domain: string) => {
    const apiDomain = domain === 'ADSL' ? 'adam' : domain === 'DEFINE' ? 'define-xml' : domain.toLowerCase();
    setDownloading(domain);
    window.open(`/api/v1/exports/cdisc/${selectedStudy}/${apiDomain}`, '_blank');
    setTimeout(() => setDownloading(null), 1500);
  };

  const domains: { code: Domain; name: string; count: string; desc: string; bg: string; border: string; text: string; variables: string[] }[] = [
    {
      code: 'DM',
      name: 'Demographics (DM.csv)',
      count: '105 Subjects',
      desc: 'Baseline subject-level demographics — one record per subject',
      bg: 'bg-[#D7F5E8]',
      border: 'border-[#A7F3D0]',
      text: 'text-[#065F46]',
      variables: ['STUDYID', 'DOMAIN', 'USUBJID', 'SUBJID', 'RFSTDTC', 'ARMCD', 'ARM', 'SEX', 'AGE', 'AGEU', 'COUNTRY'],
    },
    {
      code: 'AE',
      name: 'Adverse Events (AE.csv)',
      count: '80+ Cases',
      desc: 'Safety events with MedDRA coding and causality assessments',
      bg: 'bg-[#FFF1F2]',
      border: 'border-[#FECDD3]',
      text: 'text-rose-700',
      variables: ['STUDYID', 'DOMAIN', 'USUBJID', 'AETERM', 'AEDECOD', 'AEBODSYS', 'AESER', 'AESEV', 'AEREL', 'AESTDTC'],
    },
    {
      code: 'DS',
      name: 'Disposition (DS.csv)',
      count: '105 Rows',
      desc: 'Subject disposition events — completed, withdrawn, screen failed',
      bg: 'bg-[#EDE9FE]',
      border: 'border-[#DDD6FE]',
      text: 'text-[#6D28D9]',
      variables: ['STUDYID', 'DOMAIN', 'USUBJID', 'DSSEQ', 'DSTERM', 'DSDECOD', 'DSCAT', 'EPOCH', 'DSSTDTC'],
    },
    {
      code: 'SV',
      name: 'Subject Visits (SV.csv)',
      count: '500+ Visits',
      desc: 'Protocol visit schedule tracking from screening through follow-up',
      bg: 'bg-[#E0F2FE]',
      border: 'border-[#BAE6FD]',
      text: 'text-[#0369A1]',
      variables: ['STUDYID', 'DOMAIN', 'USUBJID', 'VISITNUM', 'VISIT', 'SVSTDTC', 'SVSTATUS'],
    },
    {
      code: 'ADSL',
      name: 'ADaM ADSL (ADSL.csv)',
      count: '105 Rows',
      desc: 'Subject-level analysis dataset with SAFFL, ITTFL, COMPLFL flags',
      bg: 'bg-[#FEF3C7]',
      border: 'border-[#FDE68A]',
      text: 'text-[#92400E]',
      variables: ['STUDYID', 'USUBJID', 'SUBJID', 'TRT01P', 'SAFFL', 'ITTFL', 'COMPLFL', 'AGE', 'SEX'],
    },
  ];

  const activeDomain = domains.find((d) => d.code === activePreview);

  const sampleRows: Record<Domain, string[][]> = {
    DM: [
      ['AYU-003', 'DM', 'AYU-003-SYN-P00001', 'SYN-P00001', '2025-08-15', 'TRT', 'Guduchi-Pippali Standard Arm', 'M', '42', 'YEARS', 'IND'],
      ['AYU-003', 'DM', 'AYU-003-SYN-P00002', 'SYN-P00002', '2025-08-18', 'CTRL', 'Placebo Control Arm', 'F', '38', 'YEARS', 'IND'],
      ['AYU-003', 'DM', 'AYU-003-SYN-P00003', 'SYN-P00003', '2025-09-02', 'TRT', 'Guduchi-Pippali Standard Arm', 'F', '55', 'YEARS', 'IND'],
    ],
    AE: [
      ['AYU-003', 'AE', 'AYU-003-SYN-P00001', 'Urticaria', 'Urticaria', 'Skin and subcutaneous tissue disorders', 'Y', 'SEVERE', 'POSSIBLE', '2025-10-12'],
      ['AYU-003', 'AE', 'AYU-003-SYN-P00002', 'Nausea', 'Nausea', 'Gastrointestinal disorders', 'N', 'MILD', 'PROBABLE', '2025-10-14'],
    ],
    DS: [
      ['AYU-003', 'DS', 'AYU-003-SYN-P00001', '1', 'Ongoing - Treatment', 'ONGOING', 'PROTOCOL MILESTONE', 'TREATMENT', '2025-08-15'],
      ['AYU-003', 'DS', 'AYU-003-SYN-P00015', '15', 'Withdrawn by Subject', 'WITHDRAWN BY SUBJECT', 'DISPOSITION EVENT', 'SCREENING', '2025-09-10'],
      ['AYU-003', 'DS', 'AYU-003-SYN-P00022', '22', 'Screen Failure', 'SCREEN FAILURE', 'PROTOCOL MILESTONE', 'SCREENING', '2025-09-01'],
    ],
    SV: [
      ['AYU-003', 'SV', 'AYU-003-SYN-P00001', '1', 'Screening Visit', '2025-08-01', 'COMPLETED'],
      ['AYU-003', 'SV', 'AYU-003-SYN-P00001', '2', 'Baseline Visit D0', '2025-08-15', 'COMPLETED'],
      ['AYU-003', 'SV', 'AYU-003-SYN-P00001', '3', 'Treatment Visit D14', '2025-08-29', 'COMPLETED'],
    ],
    ADSL: [
      ['AYU-003', 'AYU-003-SYN-P00001', 'SYN-P00001', 'Guduchi-Pippali Standard Arm', 'Y', 'Y', 'N', '42', 'M'],
      ['AYU-003', 'AYU-003-SYN-P00002', 'SYN-P00002', 'Placebo Control Arm', 'Y', 'Y', 'N', '38', 'F'],
    ],
    DEFINE: [['See Define-XML preview below']],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-[#E2EEE7] shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#EBF7F0] text-[#0B4D3C] text-[11px] font-bold mb-1">
            <Sparkles className="h-3 w-3" />
            <span>Regulatory Standards Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14231E] tracking-tight">CDISC Regulatory Data Export & Reports</h1>
          <p className="text-xs text-[#526D61] mt-0.5">
            Standardized Clinical Data Tabulation Model (SDTM v3.3) Domain Packages & Define-XML Specification
          </p>
        </div>
      </div>

      {/* Target Study & Status */}
      <div className="p-5 bg-white border border-[#E2EEE7] rounded-[2rem] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3 text-xs">
          <span className="text-[#526D61] font-bold">Target Study:</span>
          <select
            value={selectedStudy}
            onChange={(e) => setSelectedStudy(e.target.value)}
            className="bg-[#F4FBF7] border border-[#D5E6DC] text-[#0B4D3C] font-mono font-bold rounded-full px-4 py-2 focus:outline-none focus:border-[#0B4D3C]"
          >
            <option value="AYU-003">AYU-003 — Hero Trial (Guduchi-Pippali, Post-Viral Fatigue)</option>
            <option value="AYU-001">AYU-001 — Ashwagandha Adaptogen RCT</option>
            <option value="AYU-002">AYU-002 — Curcuma-Shallaki Joint Inflammation</option>
          </select>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="px-3.5 py-1.5 rounded-full bg-[#D7F5E8] text-[#065F46] border border-[#A7F3D0] flex items-center space-x-1.5 font-bold">
            <CheckCircle2 className="h-4 w-4" />
            <span>CDISC Conformance: READY</span>
          </span>
          <span className="px-3 py-1.5 rounded-full bg-[#F4FBF7] text-[#526D61] border border-[#D5E6DC] font-semibold">
            SYNTHETIC DATA
          </span>
        </div>
      </div>

      {/* 5 Expressive Domain Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {domains.map((d) => (
          <div
            key={d.code}
            onClick={() => setActivePreview(d.code)}
            className={`p-5 rounded-[2rem] border space-y-3 flex flex-col justify-between cursor-pointer transition shadow-sm hover:shadow-md ${
              activePreview === d.code
                ? `${d.bg} ${d.border} ring-2 ring-[#0B4D3C]/20 shadow-md`
                : 'bg-white border-[#E2EEE7] hover:border-[#0B4D3C]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between font-mono">
                <span className={`text-xs font-black ${d.text}`}>{d.code}</span>
                <span className="text-[10px] text-[#526D61] font-semibold">{d.count}</span>
              </div>
              <h4 className="text-xs font-bold text-[#14231E] mt-2 leading-tight">{d.name}</h4>
              <p className="text-[11px] text-[#526D61] mt-1 leading-normal">{d.desc}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); downloadDataset(d.code); }}
              className="w-full py-2 bg-white hover:bg-[#F4FBF7] border border-[#D5E6DC] text-[#14231E] text-xs font-bold rounded-full transition flex items-center justify-center space-x-1.5 shadow-sm"
            >
              {downloading === d.code ? (
                <span className="animate-pulse">Generating…</span>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5 text-[#0B4D3C]" />
                  <span>Download</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Domain Preview Table */}
      {activeDomain && activeDomain.code !== 'DEFINE' && (
        <div className="bg-white border border-[#E2EEE7] rounded-[2rem] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0F7F2] pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-[#0B4D3C]" />
                <h3 className="text-base font-bold text-[#14231E]">{activeDomain.name} — Dataset Preview</h3>
              </div>
              <p className="text-xs text-[#526D61] mt-0.5">{activeDomain.desc}</p>
            </div>
            <button
              onClick={() => downloadDataset(activeDomain.code)}
              className="px-5 py-2 rounded-full bg-[#0B4D3C] hover:bg-[#07382B] text-white text-xs font-bold flex items-center space-x-2 transition shadow-sm"
            >
              <Download className="h-4 w-4" />
              <span>Download CSV</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {activeDomain.variables.map((v) => (
              <span key={v} className="px-3 py-1 rounded-full bg-[#F4FBF7] border border-[#D5E6DC] font-mono text-[10px] font-bold text-[#0B4D3C]">
                {v}
              </span>
            ))}
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#E2EEE7]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#F4FBF7] text-[#526D61] border-b border-[#E2EEE7]">
                <tr>
                  {activeDomain.variables.map((v) => (
                    <th key={v} className="py-3 px-3.5 whitespace-nowrap font-bold text-[11px]">{v}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F7F2]">
                {(sampleRows[activeDomain.code] || []).map((row, i) => (
                  <tr key={i} className="hover:bg-[#F9FDFB]">
                    {row.map((cell, j) => (
                      <td key={j} className={`py-3 px-3.5 whitespace-nowrap ${j === 0 ? 'text-[#0B4D3C] font-bold' : 'text-[#14231E]'}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-[#718E81] font-mono">
            Showing sample preview rows • Full dataset exported on download • All synthetic & de-identified
          </p>
        </div>
      )}

      {/* Define-XML */}
      <div className="bg-white border border-[#E2EEE7] rounded-[2rem] p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#F0F7F2] pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-[#EDE9FE] text-[#6D28D9]">
              <Code className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#14231E]">Define-XML v2.0 Specification Metadata</h3>
              <p className="text-xs text-[#526D61]">Machine-readable dataset schema for regulatory submission packages (ICH M11)</p>
            </div>
          </div>
          <button
            onClick={() => downloadDataset('DEFINE')}
            className="px-5 py-2 rounded-full bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-bold flex items-center space-x-2 transition shadow-sm"
          >
            <Download className="h-4 w-4" />
            <span>Download Define-XML</span>
          </button>
        </div>
        <div className="bg-[#14231E] rounded-2xl p-4 font-mono text-xs text-[#A7F3D0] max-h-72 overflow-y-auto">
          <pre>{`<?xml version="1.0" encoding="UTF-8"?>
<ODM xmlns="http://www.cdisc.org/ns/odm/v1.3"
     xmlns:def="http://www.cdisc.org/ns/def/v2.0"
     FileOID="AYUVISTA.${selectedStudy}.DEFINE"
     CreationDateTime="2026-09-06T12:00:00Z"
     FileType="Snapshot">
  <Study OID="${selectedStudy}">
    <GlobalVariables>
      <StudyName>Clinical Trial ${selectedStudy}</StudyName>
      <ProtocolName>${selectedStudy} v1.0 (AYUVISTA Platform)</ProtocolName>
    </GlobalVariables>
    <MetaDataVersion OID="MDV.${selectedStudy}" Name="SDTM-IG v3.3" def:StandardName="SDTM-IG" def:StandardVersion="3.3">
      <!-- DM: Demographics -->
      <ItemGroupDef OID="IG.DM" Name="DM" Domain="DM" Purpose="Tabulation">
        <ItemRef ItemOID="IT.STUDYID" Mandatory="Yes"/>
        <ItemRef ItemOID="IT.USUBJID" Mandatory="Yes"/>
        <ItemRef ItemOID="IT.ARM"     Mandatory="Yes"/>
        <ItemRef ItemOID="IT.AGE"     Mandatory="Yes"/>
        <ItemRef ItemOID="IT.SEX"     Mandatory="Yes"/>
      </ItemGroupDef>
      <!-- AE: Adverse Events -->
      <ItemGroupDef OID="IG.AE" Name="AE" Domain="AE" Purpose="Tabulation">
        <ItemRef ItemOID="IT.AETERM"  Mandatory="Yes"/>
        <ItemRef ItemOID="IT.AEDECOD" Mandatory="Yes"/>
        <ItemRef ItemOID="IT.AESER"   Mandatory="Yes"/>
        <ItemRef ItemOID="IT.AESEV"   Mandatory="Yes"/>
      </ItemGroupDef>
      <!-- DS: Disposition -->
      <ItemGroupDef OID="IG.DS" Name="DS" Domain="DS" Purpose="Tabulation">
        <ItemRef ItemOID="IT.DSTERM"  Mandatory="Yes"/>
        <ItemRef ItemOID="IT.DSDECOD" Mandatory="Yes"/>
      </ItemGroupDef>
    </MetaDataVersion>
  </Study>
</ODM>`}</pre>
        </div>
      </div>
    </div>
  );
};
