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
# pyrefly: ignore [missing-import]
from app.services.provenance_engine import build_evidence_graph


def test_evidence_provenance_graph():
    inp = ProblemInput(problem="Solar thermoelectric water chiller", constraints=Constraints())
    analysis = analyze_problem(inp)
    candidates = retrieve_candidates(analysis, inp.constraints)
    matches = match_mechanisms(candidates, analysis, inp.constraints)

    graph = build_evidence_graph(matches, inp.problem)
    assert len(graph) > 0
    first_ev = graph[0]
    assert first_ev.patent_or_paper_id != ""
    assert first_ev.claim_or_finding != ""
    assert first_ev.confidence > 0
