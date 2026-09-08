from datetime import datetime, timezone
from typing import Dict, Any, List

class IntegrationSandboxHub:
    """
    Central hub managing external regulatory and clinical integration sandbox adapters.
    Explicitly labelled as Sandbox / Prototype / Non-Production.
    """
    def __init__(self):
        self.edc_state = {
            "status": "Connected (Sandbox)",
            "adapter_type": "Electronic Data Capture (EDC) Connector",
            "last_sync": "2026-09-05T10:15:00Z",
            "records_imported": 1420,
            "records_exported": 850,
            "discrepancies_flagged": 14,
            "errors": 0,
            "warnings": 2,
            "sync_history": [
                {"timestamp": "2026-09-05T10:15:00Z", "records": 42, "status": "Success", "latency_ms": 140},
                {"timestamp": "2026-09-04T18:00:00Z", "records": 115, "status": "Success", "latency_ms": 220},
                {"timestamp": "2026-09-04T06:00:00Z", "records": 89, "status": "Success", "latency_ms": 180},
            ]
        }

        self.his_state = {
            "status": "Active (Demo Mock)",
            "adapter_type": "AIIA Ayurvedic Hospital EMR / HIS Bridge",
            "last_sync": "2026-09-05T11:30:00Z",
            "active_encounters": 38,
            "lab_records_synced": 412,
            "mock_transactions": [
                {"type": "Patient_Encounter", "dept": "Kayachikitsa OPD", "synthetic_ref": "SYN-P00219", "timestamp": "2026-09-05T11:28:10Z"},
                {"type": "Diagnostic_Lab", "test": "Liver Function Panel (ALT/AST)", "synthetic_ref": "SYN-P00219", "result": "ALT: 84 U/L (High)", "timestamp": "2026-09-05T11:29:45Z"},
                {"type": "Pharmacy_Dispensation", "formulation": "Guduchi Ghanavati 500mg", "synthetic_ref": "SYN-P00220", "timestamp": "2026-09-05T11:30:00Z"}
            ]
        }

        self.abdm_state = {
            "status": "Sandbox Mode (Milestone M1/M2/M3)",
            "adapter_type": "Ayushman Bharat Digital Mission (ABDM) Gateway",
            "environment": "National Health Authority (NHA) Sandbox",
            "last_sync": "2026-09-05T09:00:00Z",
            "abha_lookups_completed": 1500,
            "consent_artefacts_active": 1420,
            "fhir_bundles_pushed": 890,
            "recent_events": [
                {"event": "ABHA_ID_LINKING", "status": "200 OK", "timestamp": "2026-09-05T08:50:00Z", "note": "Synthetic ABHA mapped to SYN-P00219"},
                {"event": "CONSENT_REQUEST_NOTIFY", "status": "200 OK", "timestamp": "2026-09-05T08:55:00Z", "note": "Patient consented to clinical research record sharing"},
                {"event": "HIP_HEALTH_DATA_TRANSFER", "status": "200 OK", "timestamp": "2026-09-05T09:00:00Z", "note": "FHIR CareContext bundle encrypted and transferred"}
            ]
        }

    def trigger_edc_sync(self) -> Dict[str, Any]:
        now_str = datetime.now(timezone.utc).isoformat()
        new_batch_count = 18
        self.edc_state["last_sync"] = now_str
        self.edc_state["records_imported"] += new_batch_count
        self.edc_state["sync_history"].insert(0, {
            "timestamp": now_str,
            "records": new_batch_count,
            "status": "Success (Simulated)",
            "latency_ms": 165
        })
        return self.edc_state

    def trigger_abdm_demo_flow(self, participant_synthetic_id: str) -> Dict[str, Any]:
        now_str = datetime.now(timezone.utc).isoformat()
        event = {
            "event": "CONSENT_ARTEFACT_VERIFIED",
            "status": "200 OK (Sandbox)",
            "timestamp": now_str,
            "note": f"Decrypted ABDM Consent Artefact for {participant_synthetic_id} verified via sandbox public key."
        }
        self.abdm_state["recent_events"].insert(0, event)
        self.abdm_state["last_sync"] = now_str
        return event

sandbox_hub = IntegrationSandboxHub()
