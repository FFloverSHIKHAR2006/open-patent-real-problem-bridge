"""
Data schemas for the Open-Patent to Real Problem Bridge.
"""
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field


class Constraints(BaseModel):
    budget: Optional[str] = Field(default="low", description="Target budget (e.g. low, < $500, medium)")
    materials: List[str] = Field(default_factory=list, description="Locally available materials or preferences")
    location: Optional[str] = Field(default="", description="Geographic or climate context (e.g. humid tropical, off-grid rural)")
    scale: Optional[str] = Field(default="pilot", description="Deployment scale (e.g. household, small farm, community)")
    manufacturing_capability: Optional[str] = Field(default="basic", description="Available tools (e.g. hand tools, 3D printer, machine shop)")
    climate: Optional[str] = Field(default="", description="Environmental conditions")


class ProblemInput(BaseModel):
    problem: str = Field(..., description="Natural language problem description")
    desired_outcome: Optional[str] = Field(default="", description="Target outcome or functional goal")
    domain: Optional[str] = Field(default="", description="Industry or functional domain if known")
    constraints: Constraints = Field(default_factory=Constraints, description="Operational constraints")


class ProblemAnalysis(BaseModel):
    problem_raw: str
    target_user: str
    domain: str
    operational_context: str
    functional_requirements: List[str]
    underlying_mechanisms: List[str]
    keywords: List[str]
    constraint_vector: Dict[str, Any]


class EvidenceRecord(BaseModel):
    id: str
    source: str
    document_title: str
    patent_or_paper_id: str
    section: str
    claim_or_finding: str
    extracted_mechanism: str
    supports: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    limitations: str


class PatentDocument(BaseModel):
    patent_id: str
    title: str
    source: str  # NASA Tech Transfer, USPTO, Google Patents, etc.
    publication_date: str
    assignee: str
    abstract: str
    core_mechanism: str
    materials: List[str]
    process_steps: List[str]
    operating_conditions: str
    limitations: List[str]
    evidence_snippets: List[Dict[str, str]]
    claims: List[str]
    domain: str


class MechanismMatch(BaseModel):
    patent_id: str
    title: str
    source: str
    score: float = Field(..., ge=0.0, le=1.0)
    mechanism_similarity: float = Field(..., ge=0.0, le=1.0)
    semantic_similarity: float = Field(..., ge=0.0, le=1.0)
    technical_applicability: float = Field(..., ge=0.0, le=1.0)
    cross_domain_flag: bool = False
    cross_domain_explanation: str = ""
    confidence: float = Field(..., ge=0.0, le=1.0)
    core_mechanism: str
    evidence_snippets: List[Dict[str, str]]


class FusedSolution(BaseModel):
    title: str
    fused_patent_ids: List[str]
    hybrid_mechanism: str
    compatibility_notes: str
    potential_conflicts: List[str]
    unvalidated_assumptions: List[str]
    fusion_confidence: float = Field(..., ge=0.0, le=1.0)


class BOMItem(BaseModel):
    item: str
    purpose: str
    estimated_cost: str
    local_alternative: str


class PrototypeRecipe(BaseModel):
    recipe_id: str
    title: str
    problem_addressed: str
    underlying_mechanism: str
    source_technologies: List[str]
    bill_of_materials: List[BOMItem]
    step_by_step_instructions: List[str]
    feasibility_score: int = Field(..., ge=0, le=100)
    risk_factors: List[str]
    constraint_adaptations: List[str]
    real_world_impact_statement: str
    evidence_provenance: List[EvidenceRecord]
    confidence_score: float = Field(..., ge=0.0, le=1.0)


class ReverseSearchInput(BaseModel):
    idea_title: str
    description: str
    intended_mechanism: Optional[str] = ""
    materials: List[str] = Field(default_factory=list)


class ReverseSearchOutput(BaseModel):
    idea_summary: str
    matched_prior_art: List[MechanismMatch]
    mechanism_overlaps: List[str]
    novel_aspects: List[str]
    technical_risks: List[str]
    recommended_improvements: List[str]


class DemandSignal(BaseModel):
    problem_topic: str
    frequency_count: int
    affected_sectors: List[str]
    underlying_unmet_mechanism: str
    candidate_patent_matches_count: int
    priority_level: str


class EvidenceItem(BaseModel):
    id: str  # e.g. "P1", "R1"
    type: str  # "patent" or "paper"
    title: str
    identifier: str  # e.g. "US-PAT-7733224-B2" or "DOI: 10.1007/..."
    url: str
    source: str
    date: str
    authors: str = ""
    mechanism: str
    relevance: str
    used_for: List[str] = Field(default_factory=list)
    evidence: str
    confidence: float = Field(default=0.85, ge=0.0, le=1.0)
    verified: bool = True


class SolutionComponent(BaseModel):
    id: str
    title: str
    what_it_does: str
    why_needed: str
    supporting_evidence: List[str] = Field(default_factory=list)
    materials: List[str] = Field(default_factory=list)
    tools_required: str = "basic"
    estimated_cost: str = "< $20"


class ExpectedOutcomeItem(BaseModel):
    potential_benefit: str
    evidence_level: str  # "Evidence-backed", "Evidence-derived estimate", "Engineering estimate", "Qualitative expectation", "Unknown / insufficient evidence"
    quantitative_estimate: Optional[str] = None
    basis: str
    sources: List[str] = Field(default_factory=list)
    confidence: str = "Medium"
    is_estimated: bool = True


class AlternativeSolution(BaseModel):
    id: str
    title: str
    focus: str
    summary: str
    cost: str
    complexity: str
    evidence_strength: str
    expected_benefit: str
    trade_offs: List[str] = Field(default_factory=list)


class StructuredSolution(BaseModel):
    problem: str
    title: str
    summary: str
    mechanisms: List[str]
    components: List[SolutionComponent]
    sources: List[EvidenceItem]
    expected_outcomes: List[ExpectedOutcomeItem]
    constraints: Dict[str, Any]
    confidence: float
    confidence_basis: str
    limitations: List[str]
    validation_steps: List[str]
    alternatives: List[AlternativeSolution] = Field(default_factory=list)


class SearchResponse(BaseModel):
    problem_analysis: ProblemAnalysis
    matches: List[MechanismMatch]
    fused_solutions: List[FusedSolution]
    recommendations: List[PrototypeRecipe]
    evidence_graph: List[EvidenceRecord]
    demand_signal: DemandSignal
    solution: Optional[StructuredSolution] = None
    evidence: List[EvidenceItem] = Field(default_factory=list)
    outcomes: List[ExpectedOutcomeItem] = Field(default_factory=list)
    alternatives: List[AlternativeSolution] = Field(default_factory=list)

