"""
FastAPI route definitions for the Open-Patent to Real Problem Bridge.
"""
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Query, Body
from app.models.schemas import (
    ProblemInput, SearchResponse, ReverseSearchInput, ReverseSearchOutput,
    DemandSignal, PatentDocument, ProblemAnalysis, MechanismMatch,
    StructuredSolution, EvidenceItem, ExpectedOutcomeItem
)
from app.services.problem_analyzer import analyze_problem
from app.services.retrieval_engine import retrieve_candidates
from app.services.mechanism_matcher import match_mechanisms
from app.services.solution_fusion import fuse_solutions
from app.services.provenance_engine import build_evidence_graph
from app.services.prototype_generator import generate_prototype_recommendations
from app.services.reverse_search import perform_reverse_prior_art_search
from app.services.demand_signal import calculate_demand_signal, get_popular_demand_signals
from app.services.solution_builder import build_structured_solution
from app.services.outcome_engine import generate_expected_outcomes
from app.services.evidence_validator import build_verified_evidence_items, validate_source
from app.db.patent_corpus import get_all_patents, get_patent_by_id

router = APIRouter()


@router.post("/search", response_model=SearchResponse, summary="Bridge problem to patent mechanisms & recipes")
def search_problem_bridge(input_data: ProblemInput):
    """
    Core pipeline: Problem Input -> Decomposition -> Mechanism Match -> Solution Fusion ->
    Constraint Adaptation -> Structured Solution + Provenance.
    """
    if not input_data.problem or len(input_data.problem.strip()) < 5:
        raise HTTPException(status_code=400, detail="Problem description must be at least 5 characters long.")

    # 1. Problem Understanding & Decomposition
    analysis = analyze_problem(input_data)

    # 2. Multi-Strategy Patent Retrieval
    candidates = retrieve_candidates(analysis, input_data.constraints)

    # 3. Mechanism-Level Matching & Cross-Domain Discovery
    matches = match_mechanisms(candidates, analysis, input_data.constraints)

    # 4. Multi-Patent Solution Fusion
    fused_solutions = fuse_solutions(matches, analysis)

    # 5. Trust & Provenance Evidence Graph
    evidence_graph = build_evidence_graph(matches, analysis.problem_raw)

    # 6. Constraint-Aware Prototype Recommendation Generation
    recommendations = generate_prototype_recommendations(
        matches=matches,
        analysis=analysis,
        constraints=input_data.constraints,
        evidence_graph=evidence_graph
    )

    # 7. Unsolved Demand Signal Calculation
    demand = calculate_demand_signal(analysis, len(matches))

    # 8. Assemble Full Structured Solution with Outcomes & Evidence
    structured_pack = build_structured_solution(analysis, matches, input_data.constraints)

    return SearchResponse(
        problem_analysis=analysis,
        matches=matches,
        fused_solutions=fused_solutions,
        recommendations=recommendations,
        evidence_graph=evidence_graph,
        demand_signal=demand,
        solution=structured_pack["solution"],
        evidence=structured_pack["evidence"],
        outcomes=structured_pack["outcomes"],
        alternatives=structured_pack["alternatives"]
    )


@router.post("/problem/analyze", response_model=ProblemAnalysis, summary="Analyze and decompose operational problem")
def api_analyze_problem(input_data: ProblemInput):
    """
    Decomposes problem into functional requirements and underlying mechanisms.
    """
    return analyze_problem(input_data)


@router.post("/search/patents", response_model=List[MechanismMatch], summary="Search and rank patent mechanism candidates")
def api_search_patents(input_data: ProblemInput):
    """
    Retrieves and ranks public patent mechanism matches.
    """
    analysis = analyze_problem(input_data)
    candidates = retrieve_candidates(analysis, input_data.constraints)
    return match_mechanisms(candidates, analysis, input_data.constraints)


@router.post("/search/research", response_model=List[EvidenceItem], summary="Search verified academic and institutional research")
def api_search_research(input_data: ProblemInput):
    """
    Returns verified research paper evidence items supporting the problem's mechanisms.
    """
    analysis = analyze_problem(input_data)
    candidates = retrieve_candidates(analysis, input_data.constraints)
    matches = match_mechanisms(candidates, analysis, input_data.constraints)
    evidence_items = build_verified_evidence_items(matches, analysis)
    return [e for e in evidence_items if e.type == "paper"] or evidence_items


@router.post("/match/mechanisms", response_model=List[MechanismMatch], summary="Match mechanisms against corpus")
def api_match_mechanisms(payload: Dict[str, Any] = Body(...)):
    """
    Direct mechanism matching given an analysis and constraints.
    """
    analysis_data = payload.get("analysis", {})
    analysis = ProblemAnalysis(**analysis_data)
    constraints_data = payload.get("constraints", {})
    from app.models.schemas import Constraints
    constraints = Constraints(**constraints_data)
    candidates = retrieve_candidates(analysis, constraints)
    return match_mechanisms(candidates, analysis, constraints)


@router.post("/generate/solution", response_model=StructuredSolution, summary="Generate structured solution architecture")
def api_generate_solution(input_data: ProblemInput):
    """
    Generates an end-to-end structured solution with components, evidence, and outcomes.
    """
    analysis = analyze_problem(input_data)
    candidates = retrieve_candidates(analysis, input_data.constraints)
    matches = match_mechanisms(candidates, analysis, input_data.constraints)
    pack = build_structured_solution(analysis, matches, input_data.constraints)
    return pack["solution"]


@router.post("/generate/outcomes", response_model=List[ExpectedOutcomeItem], summary="Generate estimated outcomes")
def api_generate_outcomes(input_data: ProblemInput):
    """
    Generates classified expected outcomes grounded in retrieved evidence.
    """
    analysis = analyze_problem(input_data)
    candidates = retrieve_candidates(analysis, input_data.constraints)
    matches = match_mechanisms(candidates, analysis, input_data.constraints)
    return generate_expected_outcomes(matches, analysis, input_data.constraints)


@router.post("/validate/evidence", summary="Validate source authenticity and existence")
def api_validate_evidence(payload: Dict[str, str] = Body(...)):
    """
    Validates a source identifier against the ground-truth corpus.
    """
    identifier = payload.get("identifier", "")
    return validate_source(identifier)


@router.get("/sources/{source_id}", summary="Get source document by ID")
def api_get_source(source_id: str):
    """
    Fetches full verified source metadata and claims by identifier.
    """
    patent = get_patent_by_id(source_id)
    if not patent:
        raise HTTPException(status_code=404, detail=f"Source '{source_id}' not found.")
    return patent


@router.post("/prior-art", response_model=ReverseSearchOutput, summary="Reverse Prior-Art search for user prototypes")
def reverse_prior_art(input_data: ReverseSearchInput):
    """
    Evaluates a user-provided idea/prototype against existing prior art patents.
    """
    if not input_data.idea_title or not input_data.description:
        raise HTTPException(status_code=400, detail="Both idea_title and description are required.")

    return perform_reverse_prior_art_search(input_data)


@router.get("/demand-signals", response_model=List[DemandSignal], summary="Get trending demand signals")
def get_demand_signals():
    """
    Surfaces real-world operational problems with high demand and patent opportunities.
    """
    return get_popular_demand_signals()


@router.get("/patents", summary="List all open patent disclosures in curated corpus")
def list_patents():
    """
    Returns full curated patent corpus documents.
    """
    return get_all_patents()


@router.get("/patents/{patent_id}", summary="Get patent by ID")
def get_patent(patent_id: str):
    """
    Returns specific patent disclosure details.
    """
    patent = get_patent_by_id(patent_id)
    if not patent:
        raise HTTPException(status_code=404, detail=f"Patent {patent_id} not found in corpus.")
    return patent


@router.get("/health", summary="Health check endpoint")
def health_check():
    return {
        "status": "healthy",
        "service": "Open-Patent to Real Problem Bridge API",
        "version": "1.1.0"
    }
