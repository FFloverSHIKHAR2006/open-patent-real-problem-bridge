# pyrefly: ignore [missing-import]
import pytest   
# pyrefly: ignore [missing-import]
from app.models.schemas import ProblemInput, Constraints
# pyrefly: ignore [missing-import]
from app.services.problem_analyzer import analyze_problem
# pyrefly: ignore [missing-import]
from app.services.retrieval_engine import retrieve_candidates
# pyrefly: ignore [missing-import]
from app.services.mechanism_matcher import match_mechanisms


def test_retrieval_and_cross_domain_matching():
    inp = ProblemInput(
        problem="High humidity grain storage protection in tropical climate",
        constraints=Constraints(budget="low", location="off-grid")
    )
    analysis = analyze_problem(inp)
    candidates = retrieve_candidates(analysis, inp.constraints)
    matches = match_mechanisms(candidates, analysis, inp.constraints)

    assert len(matches) > 0
    top_match = matches[0]
    assert top_match.score >= 0.4
    assert top_match.confidence > 0
    assert len(top_match.evidence_snippets) > 0
