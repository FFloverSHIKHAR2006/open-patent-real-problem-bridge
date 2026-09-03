# pyrefly: ignore [missing-import]
import pytest
# pyrefly: ignore [missing-import]
from app.models.schemas import Constraints
# pyrefly: ignore [missing-import]
from app.services.constraint_engine import adapt_to_constraints


def test_constraint_adaptation():
    raw_mats = ["Silica gel grade 62", "3D-printed blade housing", "Paraffin wax PCM"]
    raw_steps = ["Assemble 3D-printed or machined housing.", "Fill chamber with silica gel."]
    constraints = Constraints(budget="low", materials=["clay"], manufacturing_capability="basic")

    res = adapt_to_constraints(raw_mats, raw_steps, constraints)

    assert len(res["bill_of_materials"]) == 3
    assert len(res["constraint_adaptations"]) > 0
    assert any("PVC" in step or "hand" in step for step in res["step_by_step_instructions"])
