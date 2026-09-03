# pyrefly: ignore [missing-import]
import pytest
# pyrefly: ignore [missing-import]
from app.models.schemas import ReverseSearchInput
# pyrefly: ignore [missing-import]
from app.services.reverse_search import perform_reverse_prior_art_search


def test_reverse_prior_art_search():
    rev_in = ReverseSearchInput(
        idea_title="Solar powered vaccine chiller with paraffin wax PCM",
        description="A portable insulated box using peltier modules and paraffin wax PCM heat sink to keep vaccines cold off-grid.",
        materials=["Peltier module", "Paraffin wax", "Styrofoam box"]
    )
    res = perform_reverse_prior_art_search(rev_in)

    assert "Solar powered" in res.idea_summary
    assert len(res.matched_prior_art) > 0
    assert len(res.mechanism_overlaps) > 0
    assert len(res.technical_risks) > 0
    assert len(res.recommended_improvements) > 0
