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
from app.services.solution_fusion import fuse_solutions


def test_solution_fusion_engine():
    inp = ProblemInput(
        problem="Off-grid moisture desiccation for grain storage",
        constraints=Constraints(budget="low")
    )
    analysis = analyze_problem(inp)
    candidates = retrieve_candidates(analysis, inp.constraints)
    matches = match_mechanisms(candidates, analysis, inp.constraints)

    fused = fuse_solutions(matches, analysis)
    assert len(fused) > 0
    first_fused = fused[0]
    assert len(first_fused.fused_patent_ids) == 2
    assert "Hybrid" in first_fused.title
    assert first_fused.fusion_confidence > 0
