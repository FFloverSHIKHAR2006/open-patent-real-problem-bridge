"""
Technical Document Extraction Engine.
Extracts mechanisms, materials, operating conditions, process steps, limitations, and evidence.
"""
from typing import Dict, Any, List
from app.db.patent_corpus import get_patent_by_id


def extract_patent_technical_details(patent_id: str) -> Dict[str, Any]:
    patent = get_patent_by_id(patent_id)
    if not patent:
        return {
            "patent_id": patent_id,
            "error": "Patent document not found in corpus"
        }

    return {
        "patent_id": patent["patent_id"],
        "title": patent["title"],
        "source": patent["source"],
        "core_mechanism": patent["core_mechanism"],
        "materials": patent["materials"],
        "process_steps": patent["process_steps"],
        "operating_conditions": patent["operating_conditions"],
        "limitations": patent["limitations"],
        "claims": patent["claims"],
        "evidence_snippets": patent["evidence_snippets"]
    }
