import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_end_to_end_elder_care_problem():
    """
    End-to-end verification using the exact prompt problem statement:
    - Problem understanding
    - Mechanisms
    - Proposed solution & components
    - Evidence
    - Patents & Papers with direct links
    - Expected outcomes
    - Confidence
    - Limitations
    - Validation steps
    """
    payload = {
        "problem": (
            "Sole earners living in different cities struggle to coordinate the daily care of aging parents "
            "who live elsewhere. Medical appointments, medicines, emergencies, home assistance, transportation, "
            "and updates are handled through fragmented phone calls, family members, and local services."
        ),
        "desired_outcome": (
            "Coordinate reliable remote elder care, medication, appointments, emergencies, and regular "
            "health/status updates from one system."
        ),
        "domain": "Elder Care / Remote Telehealth",
        "constraints": {
            "budget": "low",
            "materials": ["microcontroller", "PIR sensor", "reed switch", "pills tray"],
            "location": "Urban / semi-urban",
            "scale": "Household",
            "manufacturing_capability": "basic"
        }
    }

    response = client.post("/api/search", json=payload)
    assert response.status_code == 200
    data = response.json()

    # 1. Problem Understanding
    analysis = data["problem_analysis"]
    assert "elder" in analysis["problem_raw"].lower() or "care" in analysis["problem_raw"].lower()
    assert len(analysis["underlying_mechanisms"]) > 0

    # 2. Mechanisms Identified
    assert len(data["matches"]) >= 2
    for m in data["matches"]:
        assert len(m["core_mechanism"]) > 10
        assert m["score"] > 0

    # 3. Proposed Solution
    solution = data["solution"]
    assert solution is not None
    assert "title" in solution
    assert "summary" in solution
    assert len(solution["components"]) >= 3

    # 4. Solution Components
    for comp in solution["components"]:
        assert "what_it_does" in comp and len(comp["what_it_does"]) > 10
        assert "why_needed" in comp and len(comp["why_needed"]) > 10
        assert len(comp["supporting_evidence"]) > 0

    # 5. Evidence & Provenance
    evidence = data["evidence"]
    assert len(evidence) >= 2
    for ev in evidence:
        assert ev["id"].startswith("P") or ev["id"].startswith("R")
        assert ev["type"] in ["patent", "paper"]
        assert ev["url"].startswith("http")
        assert ev["verified"] is True
        assert len(ev["mechanism"]) > 0

    # 6. Direct Links Check: Google Patents or DOI URLs
    urls = [ev["url"] for ev in evidence]
    assert any("patents.google.com" in u or "doi.org" in u or "nasa.gov" in u for u in urls)

    # 7. Expected Outcomes
    outcomes = data["outcomes"]
    assert len(outcomes) >= 3
    valid_levels = {
        "Evidence-backed", "Evidence-derived estimate", 
        "Engineering estimate", "Qualitative expectation", 
        "Unknown / insufficient evidence"
    }
    for out in outcomes:
        assert out["evidence_level"] in valid_levels
        assert out["confidence"] in ["High", "Medium", "Low"]
        assert len(out["basis"]) > 10

    # 8. Confidence
    assert solution["confidence"] > 0.60
    assert len(solution["confidence_basis"]) > 20

    # 9. Limitations & Validation Steps
    assert len(solution["limitations"]) >= 2
    assert len(solution["validation_steps"]) >= 2

    # 10. Alternatives
    assert len(data["alternatives"]) >= 2
    for alt in data["alternatives"]:
        assert alt["cost"]
        assert alt["complexity"]
        assert alt["expected_benefit"]
