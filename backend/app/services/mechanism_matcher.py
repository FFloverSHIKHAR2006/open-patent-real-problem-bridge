"""
Mechanism-Level Matching Engine.
Calculates mechanism similarity, semantic similarity, technical applicability,
and identifies cross-domain solution transfers.
"""
from typing import List, Dict, Any
from app.models.schemas import ProblemAnalysis, MechanismMatch, Constraints


def match_mechanisms(candidates: List[Dict[str, Any]], analysis: ProblemAnalysis, constraints: Constraints) -> List[MechanismMatch]:
    """
    Ranks candidates by mechanism similarity, applicability, and cross-domain transfer potential.
    """
    matches: List[MechanismMatch] = []

    for candidate in candidates:
        cand_mech = candidate.get("core_mechanism", "").lower()
        cand_domain = candidate.get("domain", "")
        cand_title = candidate.get("title", "")
        cand_id = candidate.get("patent_id", "")
        
        # 1. Mechanism similarity calculation
        mech_sim = _calculate_mechanism_similarity(analysis.underlying_mechanisms, cand_mech)
        
        # 2. Semantic similarity calculation
        sem_sim = _calculate_semantic_similarity(analysis.problem_raw, candidate.get("abstract", ""))
        
        # 3. Technical applicability score
        tech_app = (mech_sim * 0.6) + (sem_sim * 0.4)
        
        # 4. Cross-domain detection
        is_cross_domain = False
        cross_domain_explanation = ""
        
        prob_domain_lower = analysis.domain.lower()
        cand_domain_lower = cand_domain.lower()
        
        # Check if domains differ significantly but mechanism similarity is high
        if mech_sim >= 0.45 and not _domains_overlap(prob_domain_lower, cand_domain_lower):
            is_cross_domain = True
            cross_domain_explanation = (
                f"Cross-domain solution transfer: Adapting mechanism '{cand_mech[:80]}...' "
                f"from '{cand_domain}' to solve problem in '{analysis.domain}'."
            )
            # Cross-domain bonus to reward innovative transfer
            tech_app = min(1.0, tech_app + 0.15)

        # Calculate composite score
        composite_score = round(min(1.0, (mech_sim * 0.45) + (sem_sim * 0.35) + (tech_app * 0.20)), 2)
        confidence = round(min(0.98, composite_score * 0.95), 2)

        matches.append(MechanismMatch(
            patent_id=cand_id,
            title=cand_title,
            source=candidate.get("source", "Public Patent"),
            score=composite_score,
            mechanism_similarity=round(mech_sim, 2),
            semantic_similarity=round(sem_sim, 2),
            technical_applicability=round(tech_app, 2),
            cross_domain_flag=is_cross_domain,
            cross_domain_explanation=cross_domain_explanation,
            confidence=confidence,
            core_mechanism=candidate.get("core_mechanism", ""),
            evidence_snippets=candidate.get("evidence_snippets", [])
        ))

    # Sort matches by overall score descending
    matches.sort(key=lambda m: m.score, reverse=True)
    return matches


def _calculate_mechanism_similarity(problem_mechanisms: List[str], candidate_mechanism: str) -> float:
    if not problem_mechanisms or not candidate_mechanism:
        return 0.2

    max_sim = 0.0
    cand_words = set(candidate_mechanism.lower().split())

    for mech in problem_mechanisms:
        mech_words = set(mech.lower().split())
        stop_words = {"via", "and", "or", "the", "in", "of", "with", "across", "by", "to", "for", "a", "an"}
        filtered_mech = {w for w in mech_words if w not in stop_words and len(w) > 2}
        filtered_cand = {w for w in cand_words if w not in stop_words and len(w) > 2}

        if not filtered_mech:
            continue

        overlap = len(filtered_mech.intersection(filtered_cand))
        sim = overlap / max(1, len(filtered_mech))
        
        # Keyword concept matching rules
        cand_mech_low = candidate_mechanism.lower()
        mech_low = mech.lower()

        # Software & Computing Systems Concepts
        if "consistent hashing" in cand_mech_low and any(k in mech_low for k in ["hash", "cache", "partition", "key-value", "invalidation"]):
            sim += 0.45
        if "cache invalidation" in cand_mech_low and any(k in mech_low for k in ["cache", "stale", "invalidation", "lease", "ttl"]):
            sim += 0.45
        if "circuit" in cand_mech_low and any(k in mech_low for k in ["circuit", "failure", "resilience", "microservice", "timeout", "cascading"]):
            sim += 0.45
        if "token-bucket" in cand_mech_low and any(k in mech_low for k in ["rate limit", "token bucket", "throttl", "traffic", "quota"]):
            sim += 0.45
        if "consensus" in cand_mech_low and any(k in mech_low for k in ["consensus", "raft", "paxos", "log replication", "quorum", "leader"]):
            sim += 0.45
        if "graph" in cand_mech_low and any(k in mech_low for k in ["vector", "nearest neighbor", "ann", "embedding", "proximity", "hnsw"]):
            sim += 0.45
        if "zero-knowledge" in cand_mech_low and any(k in mech_low for k in ["zero-knowledge", "zk-snark", "cryptograph", "pairing", "circuit"]):
            sim += 0.45
        if "commit log" in cand_mech_low and any(k in mech_low for k in ["stream", "kafka", "pub-sub", "commit log", "event bus"]):
            sim += 0.45

        # Physical & Hardware Concepts
        if "sorption" in cand_mech_low and "desiccation" in mech_low:
            sim += 0.35
        if "peltier" in cand_mech_low and "cooling" in mech_low:
            sim += 0.35
        if "osmotic" in cand_mech_low and "water" in mech_low:
            sim += 0.35
        if "vortex" in cand_mech_low and "power" in mech_low:
            sim += 0.35
        if "polyesterification" in cand_mech_low and "straw" in mech_low:
            sim += 0.35
        if "mesh" in cand_mech_low and any(k in mech_low for k in ["mesh", "sensor", "elder", "activity", "monitoring"]):
            sim += 0.35
        if "compliance" in cand_mech_low and any(k in mech_low for k in ["medication", "pill", "compartment"]):
            sim += 0.35

        max_sim = max(max_sim, min(1.0, sim))

    return max_sim if max_sim > 0 else 0.10


def _calculate_semantic_similarity(problem_text: str, abstract: str) -> float:
    prob_words = set(problem_text.lower().split())
    abs_words = set(abstract.lower().split())
    
    stop = {"the", "a", "an", "and", "or", "for", "to", "in", "on", "with", "is", "are", "we", "need", "it", "from", "how", "what"}
    filtered_prob = {w for w in prob_words if w not in stop and len(w) > 3}
    filtered_abs = {w for w in abs_words if w not in stop and len(w) > 3}

    if not filtered_prob:
        return 0.20

    overlap = len(filtered_prob.intersection(filtered_abs))
    if overlap == 0:
        return 0.12
    sim = overlap / len(filtered_prob)
    return min(0.95, sim + 0.20)


def _domains_overlap(d1: str, d2: str) -> bool:
    words1 = set(d1.split())
    words2 = set(d2.split())
    return len(words1.intersection(words2)) > 0
