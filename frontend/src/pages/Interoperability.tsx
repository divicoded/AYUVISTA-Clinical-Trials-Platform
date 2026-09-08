import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api/client';
import { Network, Database, RefreshCw, CheckCircle2, Shield, Code, Server, Check, Sparkles, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Interoperability: React.FC = () => {
  const [interopStatus, setInteropStatus] = useState<any>(null);
  const [resourceType, setResourceType] = useState('ResearchStudy');
  const [entityId, setEntityId] = useState('AYU-003');
  const [fhirJson, setFhirJson] = useState<any>(null);
  const [syncingEdc, setSyncingEdc] = useState(false);
  const [syncingAbdm, setSyncingAbdm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadStatus = () => {
    apiRequest<any>('/interop/status')
      .then(setInteropStatus)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const loadFhir = () => {
    apiRequest<any>(`/interop/fhir/${resourceType}/${entityId}`)
      .then(setFhirJson)
      .catch((e) => setFhirJson({ error: e.message }));
  };

  useEffect(() => {
    loadStatus();
  }, []);

  useEffect(() => {
    loadFhir();
  }, [resourceType, entityId]);

  const handleEdcSync = async () => {
    setSyncingEdc(true);
    try {
      await apiRequest('/interop/edc/sync', { method: 'POST' });
      loadStatus();
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#0B4D3C', '#0284C7', '#10B981'],
      });
    } catch (e: any) {
      alert(e.message || 'Error executing EDC sync');
    } finally {
      setSyncingEdc(false);
    }
  };

  const handleAbdmDemo = async () => {
    setSyncingAbdm(true);
    try {
      await apiRequest('/interop/abdm/demo-flow?participant_id=SYN-P00219', { method: 'POST' });
      loadStatus();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D97706', '#10B981', '#0B4D3C'],
      });
    } catch (e: any) {
      alert(e.message || 'Error running ABDM transaction');
    } finally {
      setSyncingAbdm(false);
    }
  };

  const copyToClipboard = () => {
    if (!fhirJson) return;
    navigator.clipboard.writeText(JSON.stringify(fhirJson, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-[#E2EEE7] shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#EBF7F0] text-[#0B4D3C] text-[11px] font-bold mb-1">
            <Sparkles className="h-3 w-3" />
            <span>Healthcare Data Exchange Gateway</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14231E] tracking-tight">Interoperability & External Sandboxes</h1>
          <p className="text-xs text-[#526D61] mt-0.5">
            HL7 FHIR R4 Micro-Transformations • Electronic Data Capture (EDC) • Ayushman Bharat Digital Mission (ABDM)
          </p>
        </div>
      </div>

      {/* 3 Sandbox Adapters Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* EDC Card */}
        <div className="p-6 bg-white border border-[#E2EEE7] rounded-[2rem] space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-[#E0F2FE] text-[#0369A1]">
                <Database className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#D7F5E8] text-[#065F46] border border-[#A7F3D0]">
                SANDBOX ACTIVE
              </span>
            </div>
            <h3 className="text-base font-bold text-[#14231E] mt-3">Electronic Data Capture (EDC)</h3>
            <p className="text-xs text-[#526D61] mt-1 leading-relaxed">
              OpenClinica / Castor simulated API bridge. Ingests eCRF entries and calculates discrepancy metrics.
            </p>
          </div>
          <button
            onClick={handleEdcSync}
            disabled={syncingEdc}
            className="w-full py-2.5 bg-[#0B4D3C] hover:bg-[#07382B] text-white text-xs font-bold rounded-full transition shadow-sm flex items-center justify-center space-x-2 active:scale-95"
          >
            <RefreshCw className={`h-4 w-4 ${syncingEdc ? 'animate-spin' : ''}`} />
            <span>{syncingEdc ? 'Syncing Ingest…' : 'Trigger EDC Sync'}</span>
          </button>
        </div>

        {/* ABDM Gateway Card */}
        <div className="p-6 bg-white border border-[#E2EEE7] rounded-[2rem] space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-[#FEF3C7] text-[#92400E]">
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#D7F5E8] text-[#065F46] border border-[#A7F3D0]">
                M1 / M2 / M3 READY
              </span>
            </div>
            <h3 className="text-base font-bold text-[#14231E] mt-3">Ayushman Bharat (ABDM)</h3>
            <p className="text-xs text-[#526D61] mt-1 leading-relaxed">
              ABHA token validation & digital consent manager for clinical research subject authorization under DPDP.
            </p>
          </div>
          <button
            onClick={handleAbdmDemo}
            disabled={syncingAbdm}
            className="w-full py-2.5 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold rounded-full transition shadow-sm flex items-center justify-center space-x-2 active:scale-95"
          >
            <RefreshCw className={`h-4 w-4 ${syncingAbdm ? 'animate-spin' : ''}`} />
            <span>{syncingAbdm ? 'Transacting…' : 'Test ABDM Flow'}</span>
          </button>
        </div>

        {/* HIS Hospital Connector */}
        <div className="p-6 bg-white border border-[#E2EEE7] rounded-[2rem] space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-[#EDE9FE] text-[#6D28D9]">
                <Server className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#D7F5E8] text-[#065F46] border border-[#A7F3D0]">
                FHIR R4 READY
              </span>
            </div>
            <h3 className="text-base font-bold text-[#14231E] mt-3">AYUVISTA Hospital HIS Connector</h3>
            <p className="text-xs text-[#526D61] mt-1 leading-relaxed">
              Integrates hospital laboratory analyzers and EHR prescriptions via HL7 FHIR DiagnosticReport payloads.
            </p>
          </div>
          <div className="p-2.5 bg-[#F4FBF7] rounded-full border border-[#D5E6DC] text-[11px] font-mono font-bold text-[#0B4D3C] text-center">
            HIS Socket: 127.0.0.1:8000/api/v1/fhir
          </div>
        </div>
      </div>

      {/* Interactive FHIR Transformer & Live JSON Inspector */}
      <div className="bg-white border border-[#E2EEE7] rounded-[2rem] p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0F7F2] pb-4">
          <div>
            <h3 className="text-base font-bold text-[#14231E]">HL7 FHIR R4 Transformer &amp; Schema Inspector</h3>
            <p className="text-xs text-[#526D61]">Live serialization of CTMS records into FHIR R4 standard JSON</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value)}
              className="px-4 py-2 bg-[#F4FBF7] border border-[#D5E6DC] text-[#0B4D3C] font-mono font-bold rounded-full focus:outline-none"
            >
              <option value="ResearchStudy">FHIR ResearchStudy</option>
              <option value="Patient">FHIR Patient (Synthetic)</option>
              <option value="AdverseEvent">FHIR AdverseEvent</option>
            </select>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-[#F4FBF7] hover:bg-[#EBF7F0] border border-[#D5E6DC] text-[#0B4D3C] font-bold rounded-full transition flex items-center space-x-1.5 shadow-sm active:scale-95"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
            </button>
          </div>
        </div>

        {/* JSON Viewer */}
        <div className="bg-[#14231E] rounded-2xl p-4 font-mono text-xs text-[#A7F3D0] max-h-80 overflow-y-auto shadow-inner">
          <pre>{JSON.stringify(fhirJson, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};
