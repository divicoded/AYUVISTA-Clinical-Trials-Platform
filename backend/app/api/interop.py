from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.study import Study
from app.models.participant import Participant
from app.models.safety import SafetyCase
from app.services.sandboxes import sandbox_hub
from app.services.fhir_transformer import fhir_transformer

router = APIRouter(prefix="/interop", tags=["Interoperability & Sandboxes"])

@router.get("/status")
def get_interop_status(current_user: User = Depends(get_current_user)):
    return {
        "edc_sandbox": sandbox_hub.edc_state,
        "his_sandbox": sandbox_hub.his_state,
        "abdm_sandbox": sandbox_hub.abdm_state,
        "standards": {
            "fhir_version": "HL7 FHIR R4 (4.0.1)",
            "cdisc_standard": "SDTM-IG v3.3 & ADaM v2.1 (Prototype)",
            "ctri_connector": "Sandbox Mock Bridge"
        }
    }

@router.post("/edc/sync")
def trigger_edc_sync(current_user: User = Depends(get_current_user)):
    return sandbox_hub.trigger_edc_sync()

@router.post("/abdm/demo-flow")
def trigger_abdm_flow(participant_id: str = "SYN-P00219", current_user: User = Depends(get_current_user)):
    return sandbox_hub.trigger_abdm_demo_flow(participant_id)

@router.get("/fhir/{resource_type}/{entity_id}")
def get_fhir_resource(
    resource_type: str,
    entity_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    rtype = resource_type.lower()
    if rtype in ["researchstudy", "study"]:
        st = db.query(Study).filter((Study.id == entity_id) | (Study.study_code == entity_id)).first()
        if not st:
            raise HTTPException(status_code=404, detail="Study not found")
        return fhir_transformer.to_research_study(st)

    elif rtype in ["patient", "participant"]:
        p = db.query(Participant).filter((Participant.id == entity_id) | (Participant.synthetic_id == entity_id)).first()
        if not p:
            raise HTTPException(status_code=404, detail="Participant not found")
        return fhir_transformer.to_patient(p)

    elif rtype in ["adverseevent", "safetycase", "safety"]:
        c = db.query(SafetyCase).filter((SafetyCase.id == entity_id) | (SafetyCase.case_number == entity_id)).first()
        if not c:
            raise HTTPException(status_code=404, detail="Safety case not found")
        return fhir_transformer.to_adverse_event(c)

    else:
        raise HTTPException(
            status_code=400,
            detail=f"Resource type '{resource_type}' not supported. Supported types: ResearchStudy, Patient, AdverseEvent"
        )
