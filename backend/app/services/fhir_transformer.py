from typing import Dict, Any, Optional

class FHIRTransformer:
    """
    Transforms internal AYUVISTA clinical entities into standard HL7 FHIR R4 JSON resources.
    Supports ResearchStudy, Patient, Consent, Encounter, Observation, AdverseEvent.
    """

    @staticmethod
    def to_research_study(study) -> Dict[str, Any]:
        return {
            "resourceType": "ResearchStudy",
            "id": f"study-{study.study_code.lower()}",
            "identifier": [
                {
                    "system": "https://aiia.gov.in/studies",
                    "value": study.study_code
                }
            ],
            "title": study.title,
            "status": "active" if study.status.value == "ACTIVE" else "completed",
            "category": [
                {
                    "coding": [
                        {
                            "system": "http://terminology.hl7.org/CodeSystem/research-study-category",
                            "code": study.study_type.lower(),
                            "display": study.study_type
                        }
                    ]
                }
            ],
            "focus": [
                {
                    "text": study.intervention_type
                }
            ],
            "sponsor": {
                "display": study.sponsor
            },
            "description": study.primary_objective or study.short_title,
            "period": {
                "start": study.start_date.isoformat() if study.start_date else None,
                "end": study.expected_completion.isoformat() if study.expected_completion else None
            },
            "enrollment": [
                {
                    "display": f"Target: {study.target_enrollment}, Current: {study.current_enrollment}"
                }
            ]
        }

    @staticmethod
    def to_patient(participant) -> Dict[str, Any]:
        return {
            "resourceType": "Patient",
            "id": f"pat-{participant.synthetic_id.lower()}",
            "identifier": [
                {
                    "use": "official",
                    "system": "https://aiia.gov.in/synthetic-participants",
                    "value": participant.synthetic_id
                }
            ],
            "active": participant.participant_status.value == "ACTIVE",
            "gender": participant.gender.lower() if participant.gender else "unknown",
            "extension": [
                {
                    "url": "https://aiia.gov.in/fhir/StructureDefinition/de-identification-badge",
                    "valueString": "Synthetic Clinical Research Subject (DPDP Compliant)"
                }
            ]
        }

    @staticmethod
    def to_adverse_event(case) -> Dict[str, Any]:
        return {
            "resourceType": "AdverseEvent",
            "id": f"ae-{case.case_number.lower()}",
            "identifier": {
                "system": "https://aiia.gov.in/safety-cases",
                "value": case.case_number
            },
            "actuality": "actual",
            "category": [
                {
                    "coding": [
                        {
                            "system": "http://terminology.hl7.org/CodeSystem/adverse-event-category",
                            "code": "serious-adverse-event" if case.is_serious else "adverse-event",
                            "display": "Serious Adverse Event" if case.is_serious else "Adverse Event"
                        }
                    ]
                }
            ],
            "event": {
                "coding": [
                    {
                        "system": "https://aiia.gov.in/demo-meddra",
                        "code": case.meddra_code or "10000000",
                        "display": case.meddra_preferred_term or case.adverse_event_term
                    }
                ],
                "text": case.adverse_event_term
            },
            "subject": {
                "reference": f"Patient/{case.participant_id}"
            },
            "date": case.onset_date.isoformat() if case.onset_date else None,
            "seriousness": {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/adverse-event-seriousness",
                        "code": "serious" if case.is_serious else "non-serious"
                    }
                ]
            },
            "severity": {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/adverse-event-severity",
                        "code": case.severity.value.lower()
                    }
                ]
            }
        }

fhir_transformer = FHIRTransformer()
