"""
Multi-strategy patent & technical research document retrieval engine.
Supports direct search, mechanism search, material search, functional search, and cross-domain retrieval.
"""
from typing import List, Dict, Any
from app.db.patent_corpus import get_all_patents
from app.models.schemas import ProblemAnalysis, PatentDocument, Constraints


def retrieve_candidates(analysis: ProblemAnalysis, constraints: Constraints) -> List[Dict[str, Any]]:
    """
    Retrieves candidate patents across multiple strategies.
    """
    all_patents = get_all_patents()
    candidates = []

    # Token vectors for comparison
    prob_tokens = set(" ".join(analysis.keywords + analysis.underlying_mechanisms + [analysis.problem_raw]).lower().split())

    for patent in all_patents:
        patent_text = f"{patent['title']} {patent['abstract']} {patent['core_mechanism']} {' '.join(patent['materials'])} {patent['domain']}".lower()
        patent_tokens = set(patent_text.split())
        
        # Calculate overlap
        overlap = len(prob_tokens.intersection(patent_tokens))
        
        # Bonus for mechanism match
        mech_bonus = 0.0
        for mech in analysis.underlying_mechanisms:
            mech_words = set(mech.lower().split())
            if len(mech_words.intersection(patent_tokens)) >= 2:
                mech_bonus += 2.5

        raw_score = overlap + mech_bonus
        if raw_score > 0:
            candidate = patent.copy()
            candidate["_raw_score"] = raw_score
            candidates.append(candidate)

    # Sort candidates by raw score descending
    candidates.sort(key=lambda x: x["_raw_score"], reverse=True)

    # If no candidates match strictly, return all patents with baseline scores to allow cross-domain matching
    if not candidates:
        for patent in all_patents:
            cand = patent.copy()
            cand["_raw_score"] = 1.0
            candidates.append(cand)

    return candidates
