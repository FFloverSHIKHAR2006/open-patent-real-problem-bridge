# pyrefly: ignore [missing-import]
import pytest
# pyrefly: ignore [missing-import]
from app.models.schemas import ProblemInput, Constraints
# pyrefly: ignore [missing-import]
from app.services.problem_analyzer import analyze_problem


def test_analyze_grain_storage_problem():
    inp = ProblemInput(
        problem="We need a low-cost, food-safe moisture desiccant for bulk grain storage in high humidity.",
        desired_outcome="Prevent mold and grain loss without electricity",
        constraints=Constraints(budget="low", location="rural humid", scale="small farm")
    )
    analysis = analyze_problem(inp)

    assert analysis.problem_raw == inp.problem
    assert len(analysis.underlying_mechanisms) > 0
    assert any("sorption" in m.lower() or "desiccation" in m.lower() for m in analysis.underlying_mechanisms)
    assert len(analysis.functional_requirements) > 0


def test_analyze_cooling_problem():
    inp = ProblemInput(
        problem="Off-grid cooling box for vaccine storage in rural health clinics.",
        constraints=Constraints(budget="medium", scale="clinic")
    )
    analysis = analyze_problem(inp)

    mechanisms_str = " ".join(analysis.underlying_mechanisms).lower()
    assert any(term in mechanisms_str for term in ["peltier", "phase-change", "thermoelectric", "thermal", "cooling", "heat pump", "solid-state", "refrigerat"])
    assert any(term in analysis.domain.lower() for term in ["thermal", "cold", "health", "logistics", "cooling", "energy", "medical"])
