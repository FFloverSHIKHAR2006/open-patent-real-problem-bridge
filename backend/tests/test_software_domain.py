# pyrefly: ignore [missing-import]
import pytest
from app.models.schemas import ProblemInput, Constraints
from app.services.problem_analyzer import analyze_problem
from app.services.retrieval_engine import retrieve_candidates
from app.services.mechanism_matcher import match_mechanisms
from app.services.solution_builder import build_structured_solution


def test_software_problem_decomposition_cache():
    """Verifies that a distributed caching problem extracts computational mechanisms and software domain."""
    inp = ProblemInput(
        problem="Distributed cache invalidation across microservices causing stale reads and database stampedes.",
        desired_outcome="Eliminate stale reads under high concurrency without dropping database connections",
        constraints=Constraints(budget="medium", scale="50k req/s")
    )
    analysis = analyze_problem(inp)

    assert any(term in analysis.domain.lower() for term in ["distributed", "cache", "software", "in-memory"])
    assert len(analysis.underlying_mechanisms) > 0
    mechs_str = " ".join(analysis.underlying_mechanisms).lower()
    assert any(term in mechs_str for term in ["consistent hashing", "lease", "invalidation", "keyspace", "xfetch"])


def test_software_patent_retrieval_and_high_confidence():
    """Verifies that software queries retrieve authentic computing patents with high dynamic confidence."""
    inp = ProblemInput(
        problem="High traffic microservice caching with consistent hash ring and lease-based invalidation",
        constraints=Constraints(budget="medium", scale="enterprise")
    )
    analysis = analyze_problem(inp)
    candidates = retrieve_candidates(analysis, inp.constraints)
    matches = match_mechanisms(candidates, analysis, inp.constraints)

    assert len(matches) > 0
    top_match = matches[0]
    # Top match should be Amazon Dynamo consistent hashing or SIGMOD cache invalidation paper
    assert top_match.patent_id in ["US-PAT-7774431-B2", "PAPER-10.1145/3318464.3389700"]
    assert top_match.score >= 0.65
    # Dynamic confidence should be high, well above 0.65
    assert top_match.confidence >= 0.70


def test_circuit_breaker_retrieval():
    """Verifies that microservice cascading failure queries retrieve Netflix circuit breaker patent."""
    inp = ProblemInput(
        problem="Prevent cascading failure and thread starvation across distributed microservices using circuit breaker",
        constraints=Constraints(budget="low", scale="10k req/s")
    )
    analysis = analyze_problem(inp)
    candidates = retrieve_candidates(analysis, inp.constraints)
    matches = match_mechanisms(candidates, analysis, inp.constraints)

    assert len(matches) > 0
    top_match = matches[0]
    assert top_match.patent_id == "US-PAT-10148530-B2"
    assert "circuit" in top_match.core_mechanism.lower()
    assert top_match.confidence >= 0.70


def test_rate_limiting_retrieval():
    """Verifies that API rate limiting queries retrieve Akamai token bucket patent."""
    inp = ProblemInput(
        problem="Distributed API gateway rate limiting with token bucket and leaky bucket traffic shaping",
        constraints=Constraints(budget="low", scale="100k req/s")
    )
    analysis = analyze_problem(inp)
    candidates = retrieve_candidates(analysis, inp.constraints)
    matches = match_mechanisms(candidates, analysis, inp.constraints)

    assert len(matches) > 0
    top_match = matches[0]
    assert top_match.patent_id == "US-PAT-8683057-B2"
    assert "token-bucket" in top_match.core_mechanism.lower() or "token bucket" in top_match.core_mechanism.lower()


def test_dynamic_confidence_not_clamped_to_65():
    """Verifies that solution builder calculates dynamic confidence and does not clamp to 65%."""
    # 1. High match query should have confidence > 0.75
    strong_inp = ProblemInput(
        problem="Distributed consistent hashing key-value store with virtual nodes and gossip membership",
        constraints=Constraints(budget="medium")
    )
    analysis_strong = analyze_problem(strong_inp)
    candidates_strong = retrieve_candidates(analysis_strong, strong_inp.constraints)
    matches_strong = match_mechanisms(candidates_strong, analysis_strong, strong_inp.constraints)
    sol_strong = build_structured_solution(analysis_strong, matches_strong, strong_inp.constraints)
    
    assert sol_strong["solution"].confidence > 0.75
    assert sol_strong["solution"].confidence != 0.65

    # 2. Weak/irrelevant query should have confidence < 0.50 (never forced up to 0.65)
    weak_inp = ProblemInput(
        problem="quantum teleportation of gravitational waves through subspace wormholes",
        constraints=Constraints(budget="none")
    )
    analysis_weak = analyze_problem(weak_inp)
    candidates_weak = retrieve_candidates(analysis_weak, weak_inp.constraints)
    matches_weak = match_mechanisms(candidates_weak, analysis_weak, weak_inp.constraints)
    sol_weak = build_structured_solution(analysis_weak, matches_weak, weak_inp.constraints)

    # Confidence must honestly reflect poor grounding, strictly below 0.50 and NOT clamped to 0.65!
    assert sol_weak["solution"].confidence < 0.50
    assert sol_weak["solution"].confidence != 0.65


def test_software_solution_components_not_physical_materials():
    """Verifies that software solution components contain software tech stack and zero physical silica/pipes."""
    inp = ProblemInput(
        problem="High traffic distributed cache invalidation across microservices",
        constraints=Constraints(budget="medium", scale="production")
    )
    analysis = analyze_problem(inp)
    candidates = retrieve_candidates(analysis, inp.constraints)
    matches = match_mechanisms(candidates, analysis, inp.constraints)
    res = build_structured_solution(analysis, matches, inp.constraints)
    sol = res["solution"]

    assert len(sol.components) >= 2
    # Ensure all components talk about software architecture
    all_materials = " ".join([m for c in sol.components for m in c.materials]).lower()
    assert any(term in all_materials for term in ["redis", "hash", "algorithm", "pub-sub", "cache", "socket", "ring"])
    
    # Must NOT contain physical hardware from unrelated patents
    assert "silica gel" not in all_materials
    assert "pvc pipe" not in all_materials
    assert "straw" not in all_materials
    assert "peltier" not in all_materials
