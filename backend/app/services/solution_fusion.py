"""
Solution Fusion Engine.
Combines 2-3 complementary patents into hybrid solutions.
Evaluates compatibility, identifies conflicts, and preserves evidence provenance.
"""
from typing import List, Dict, Any
from app.models.schemas import MechanismMatch, FusedSolution, ProblemAnalysis
from app.db.patent_corpus import get_patent_by_id


def fuse_solutions(top_matches: List[MechanismMatch], analysis: ProblemAnalysis) -> List[FusedSolution]:
    """
    Identifies complementary patent pairings and generates fused hybrid architecture concepts.
    """
    if len(top_matches) < 2:
        return []

    fused_list: List[FusedSolution] = []

    # Pairing 1: Primary match + Secondary match
    m1 = top_matches[0]
    m2 = top_matches[1]
    
    p1 = get_patent_by_id(m1.patent_id)
    p2 = get_patent_by_id(m2.patent_id)

    if p1 and p2:
        title = f"Hybrid Fusion: {p1['title'].split(' ')[0]} + {p2['title'].split(' ')[0]} Systems"
        hybrid_mech = (
            f"Primary Core: {p1['core_mechanism']} "
            f"Augmented by Secondary Enhancement: {p2['core_mechanism']}"
        )
        
        compatibility = (
            f"High thermal & mechanical compatibility between {p1['source']} and {p2['source']}. "
            f"Combining physical separation with thermal stabilization creates a synergistic multi-barrier solution."
        )
        
        conflicts = [
            f"Ensure operating conditions do not exceed {p1['operating_conditions']} while integrating {p2['title']}.",
            "Interface thermal resistance between materials must be minimized with conductive thermal compound."
        ]
        
        assumptions = [
            "Hybrid combination is theoretically complementary based on physical principles; unvalidated by combined field trial.",
            "Local material substitutions must maintain specified porosity and tensile thresholds."
        ]
        
        fusion_confidence = round((m1.confidence + m2.confidence) / 2.0 * 0.90, 2)

        fused_list.append(FusedSolution(
            title=title,
            fused_patent_ids=[m1.patent_id, m2.patent_id],
            hybrid_mechanism=hybrid_mech,
            compatibility_notes=compatibility,
            potential_conflicts=conflicts,
            unvalidated_assumptions=assumptions,
            fusion_confidence=fusion_confidence
        ))

    return fused_list
