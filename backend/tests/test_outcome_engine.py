import pytest
from app.models.schemas import ProblemInput, Constraints, ProblemAnalysis
from app.services.problem_analyzer import analyze_problem
from app.services.retrieval_engine import retrieve_candidates
from app.services.mechanism_matcher import match_mechanisms
from app.services.outcome_engine import generate_expected_outcomes


def test_outcome_engine_elder_care_grounding():
    problem = ProblemInput(
        problem="Sole earners living in different cities struggle to coordinate the daily care of aging parents living elsewhere.",
        desired_outcome="Coordinate reliable remote elder care, medication, and status updates.",
        domain="Elder Care / Telehealth",
        constraints=Constraints(budget="low", scale="household")
    )
    analysis = analyze_problem(problem)
    candidates = retrieve_candidates(analysis, problem.constraints)
    matches = match_mechanisms(candidates, analysis, problem.constraints)
    outcomes = generate_expected_outcomes(matches, analysis, problem.constraints)

    assert len(outcomes) >= 3
    
    # Check that outcomes have valid evidence levels
    valid_levels = {
        "Evidence-backed", "Evidence-derived estimate", 
        "Engineering estimate", "Qualitative expectation", 
        "Unknown / insufficient evidence"
    }
    for item in outcomes:
        assert item.evidence_level in valid_levels
        assert len(item.potential_benefit) > 5
        assert len(item.basis) > 10
        assert item.confidence in ["High", "Medium", "Low"]

    # Check for quantitative claims: must be supported by basis and sources
    estimated_outcomes = [o for o in outcomes if o.quantitative_estimate]
    assert len(estimated_outcomes) > 0
    for eo in estimated_outcomes:
        assert len(eo.sources) > 0
        assert len(eo.basis) > 10


def test_outcome_engine_no_invented_numbers_on_unsupported_claim():
    analysis = ProblemAnalysis(
        problem_raw="Exotic quantum anti-gravity levitation widget for household kitchen",
        target_user="General public",
        domain="Exotic Physics",
        operational_context="Unknown laboratory",
        functional_requirements=["Levitation"],
        underlying_mechanisms=["Superconducting gravito-magnetic flux"],
        keywords=["quantum", "levitation"],
        constraint_vector={"budget": "low"}
    )
    matches = []
    outcomes = generate_expected_outcomes(matches, analysis, Constraints())
    
    # Should include unknown/insufficient evidence or qualitative expectation with no fabricated numbers
    insufficient = [o for o in outcomes if o.evidence_level == "Unknown / insufficient evidence"]
    assert len(insufficient) > 0
    assert insufficient[0].quantitative_estimate is None
    assert "cannot be reliably estimated" in insufficient[0].basis
