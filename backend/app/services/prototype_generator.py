"""
Prototype Recommendation Generator.
Generates structured prototype recipes with plain-language engineering steps,
bill of materials, feasibility scores, risk factors, impact statements, and full provenance.
"""
from typing import List, Dict, Any
from app.models.schemas import (
    PrototypeRecipe, MechanismMatch, ProblemAnalysis,
    Constraints, EvidenceRecord
)
from app.services.constraint_engine import adapt_to_constraints
from app.db.patent_corpus import get_patent_by_id


def generate_prototype_recommendations(
    matches: List[MechanismMatch],
    analysis: ProblemAnalysis,
    constraints: Constraints,
    evidence_graph: List[EvidenceRecord]
) -> List[PrototypeRecipe]:
    """
    Translates top patent mechanism matches into concrete, actionable prototype recipes.
    """
    recipes: List[PrototypeRecipe] = []

    for i, match in enumerate(matches[:2]):
        patent = get_patent_by_id(match.patent_id)
        if not patent:
            continue

        raw_materials = patent.get("materials", ["Standard structural frame", "Fasteners", "Sealant"])
        raw_steps = patent.get("process_steps", ["Assemble structural components according to layout."])

        # Adapt through constraint engine
        adaptation_result = adapt_to_constraints(raw_materials, raw_steps, constraints)

        # Calculate feasibility score (0-100)
        feasibility = int(match.score * 85 + 10)
        if constraints.budget == "low":
            feasibility = min(98, feasibility + 5)

        # Filter related evidence for this recipe
        recipe_evidence = [e for e in evidence_graph if e.patent_or_paper_id == match.patent_id]

        # Formulate real-world impact statement
        impact_statement = (
            f"By adapting {patent['source']} mechanism ({match.patent_id}), "
            f"builders can deploy a {match.score*100:.0f}% technically-aligned solution for {analysis.domain} "
            f"using locally available materials at a fraction of commercial R&D cost."
        )

        risks = patent.get("limitations", ["Perform field validation before full deployment."])
        if match.cross_domain_flag:
            risks.append("Cross-domain mechanism transfer: Validate material thermal/chemical tolerances in new environment.")

        recipe_title = f"Prototype Recipe: {patent['title']}"

        recipes.append(PrototypeRecipe(
            recipe_id=f"RECIPE-{match.patent_id}",
            title=recipe_title,
            problem_addressed=analysis.problem_raw,
            underlying_mechanism=match.core_mechanism,
            source_technologies=[f"{patent['source']} ({match.patent_id}) - {patent['title']}"],
            bill_of_materials=adaptation_result["bill_of_materials"],
            step_by_step_instructions=adaptation_result["step_by_step_instructions"],
            feasibility_score=feasibility,
            risk_factors=risks,
            constraint_adaptations=adaptation_result["constraint_adaptations"],
            real_world_impact_statement=impact_statement,
            evidence_provenance=recipe_evidence,
            confidence_score=match.confidence
        ))

    return recipes
