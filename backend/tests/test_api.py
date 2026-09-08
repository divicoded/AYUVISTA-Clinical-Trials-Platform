import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.enums import UserRole

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["platform"] == "AYUVISTA"

def test_login_and_roles():
    # Login as PI
    res = client.post("/api/v1/auth/login", json={"email": "pi@aiia.demo", "password": "Nexus@AIIA2026"})
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["role"] == UserRole.PRINCIPAL_INVESTIGATOR.value
    token = data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Verify Command Center metrics
    res = client.get("/api/v1/command-center/metrics", headers=headers)
    assert res.status_code == 200
    metrics = res.json()
    assert metrics["active_studies"] >= 25
    assert metrics["active_sites"] >= 40
    assert metrics["total_participants"] >= 1500
    assert metrics["studies_at_risk"] >= 1

    # Verify Hero Study AYU-003
    res = client.get("/api/v1/studies/AYU-003", headers=headers)
    assert res.status_code == 200
    study = res.json()
    assert study["study_code"] == "AYU-003"
    assert study["risk_score"] > 60.0

    # Verify FHIR R4 Interop export
    res = client.get("/api/v1/interop/fhir/ResearchStudy/AYU-003", headers=headers)
    assert res.status_code == 200
    fhir_data = res.json()
    assert fhir_data["resourceType"] == "ResearchStudy"

    # Verify CDISC SDTM export
    res = client.get("/api/v1/exports/cdisc/AYU-003/dm", headers=headers)
    assert res.status_code == 200
    assert "text/csv" in res.headers["content-type"]
    assert "USUBJID" in res.text

    # Verify Audit Trail
    res = client.get("/api/v1/audit", headers=headers)
    assert res.status_code == 200
    audit_events = res.json()
    assert len(audit_events) > 0
