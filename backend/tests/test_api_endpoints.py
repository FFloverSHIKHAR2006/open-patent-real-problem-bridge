# pyrefly: ignore [missing-import]
import pytest
# pyrefly: ignore [missing-import]
from fastapi.testclient import TestClient
# pyrefly: ignore [missing-import]
from app.main import app

client = TestClient(app)


def test_health_check_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_list_patents_endpoint():
    response = client.get("/api/patents")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 5


def test_demand_signals_endpoint():
    response = client.get("/api/demand-signals")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 3


def test_search_endpoint_valid():
    payload = {
        "problem": "Low cost moisture desiccant for grain storage in humid climate",
        "desired_outcome": "Prevent grain mold and crop loss",
        "constraints": {
            "budget": "low",
            "materials": ["clay", "silica"],
            "location": "rural humid",
            "scale": "farm"
        }
    }
    response = client.post("/api/search", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "problem_analysis" in data
    assert "matches" in data
    assert "recommendations" in data
    assert "evidence_graph" in data
    assert len(data["matches"]) > 0


def test_prior_art_endpoint_valid():
    payload = {
        "idea_title": "Desiccant Grain Silo Sleeve",
        "description": "A porous sleeve filled with desiccant clay hanging inside grain storage silos to absorb water vapor.",
        "materials": ["Bentoclay", "Canvas fabric"]
    }
    response = client.post("/api/prior-art", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "idea_summary" in data
    assert "matched_prior_art" in data
    assert "mechanism_overlaps" in data


def test_modular_problem_analyze_endpoint():
    payload = {"problem": "Passive cooling for medications without power"}
    res = client.post("/api/problem/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "underlying_mechanisms" in data
    assert len(data["underlying_mechanisms"]) > 0


def test_modular_search_patents_endpoint():
    payload = {"problem": "Moisture desiccant for grain storage"}
    res = client.post("/api/search/patents", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_modular_search_research_endpoint():
    payload = {"problem": "Remote patient monitoring sensor systems"}
    res = client.post("/api/search/research", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_modular_generate_solution_endpoint():
    payload = {
        "problem": "Elder care daily routine and medication monitoring",
        "constraints": {"budget": "low", "scale": "household"}
    }
    res = client.post("/api/generate/solution", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "components" in data
    assert len(data["components"]) > 0
    assert "sources" in data
    assert "expected_outcomes" in data


def test_modular_validate_evidence_endpoint():
    payload = {"identifier": "US-PAT-7733224-B2"}
    res = client.post("/api/validate/evidence", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["exists"] is True
    assert data["verified"] is True
    assert data["url_valid"] is True


def test_modular_get_source_endpoint():
    res = client.get("/api/sources/US-PAT-7158011-B2")
    assert res.status_code == 200
    data = res.json()
    assert data["patent_id"] == "US-PAT-7158011-B2"
    assert "Medication" in data["title"]

