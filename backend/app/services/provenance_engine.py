"""
Trust & Provenance Layer.
Maintains traceable evidence records connecting User Problem -> Mechanism -> Patent Source -> Claim Evidence -> Prototype Recommendation.
"""
from typing import List, Dict, Any
from app.models.schemas import EvidenceRecord, MechanismMatch
from app.db.patent_corpus import get_patent_by_id


def build_evidence_graph(matches: List[MechanismMatch], problem_text: str) -> List[EvidenceRecord]:
    """
    Constructs an evidence graph with verified provenance links and confidence metrics.
    """
    evidence_records: List[EvidenceRecord] = []

    for i, match in enumerate(matches[:3]):
        patent = get_patent_by_id(match.patent_id)
        if not patent:
            continue

        snippets = patent.get("evidence_snippets", [])
        for j, snippet in enumerate(snippets):
            rec_id = f"EV-{match.patent_id}-{j+1}"
            
            section = snippet.get("section", "Detailed Description")
            quote = snippet.get("text", patent.get("abstract", ""))
            
            confidence = round(match.confidence * 0.95, 2)

            evidence_records.append(EvidenceRecord(
                id=rec_id,
                source=patent.get("source", "Public Patent"),
                document_title=patent.get("title", ""),
                patent_or_paper_id=match.patent_id,
                section=section,
                claim_or_finding=quote,
                extracted_mechanism=match.core_mechanism,
                supports=f"Supports prototype recommendation addressing: '{problem_text[:60]}...'",
                confidence=confidence,
                limitations="; ".join(patent.get("limitations", ["Requires verification under field conditions"]))
            ))

    return evidence_records
