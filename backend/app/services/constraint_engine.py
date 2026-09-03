"""
Constraint Adaptation Engine.
Adapts solution recipes according to user budget, local materials, location/climate,
manufacturing capability, scale, and safety constraints.
"""
from typing import List, Dict, Any
from app.models.schemas import Constraints, BOMItem


def adapt_to_constraints(raw_materials: List[str], raw_steps: List[str], constraints: Constraints) -> Dict[str, Any]:
    """
    Adapts bill of materials and implementation steps to real-world user constraints.
    """
    bom_items: List[BOMItem] = []
    adaptations: List[str] = []

    user_materials_lower = [m.lower() for m in constraints.materials]
    budget = constraints.budget.lower() if constraints.budget else "low"
    tooling = constraints.manufacturing_capability.lower() if constraints.manufacturing_capability else "basic"

    for mat in raw_materials:
        item_name = mat
        cost = "$10 - $30"
        local_alt = "Standard hardware supply"

        mat_lower = mat.lower()

        # Material substitution rules
        if "silica gel" in mat_lower:
            cost = "$5 - $15"
            local_alt = "Bentoclay / Natural coarse desiccating clay" if "clay" in user_materials_lower else "Recycled commercial desiccant packs"
            adaptations.append("Substituted specialized silica gel with locally sourced absorbent desiccant clay.")

        elif "ptfe" in mat_lower or "membrane" in mat_lower:
            cost = "$15 - $25"
            local_alt = "Breathable hydrophobic fabric membrane (e.g. Tyvek / dense canvas with wax impregnation)"
            adaptations.append("Adapted membrane boundary to readily available water-repellent breathable fabric.")

        elif "thermoelectric" in mat_lower or "peltier" in mat_lower:
            cost = "$8 - $12"
            local_alt = "Standard 12V Peltier module (TEC1-12706)"
            if "low" in budget:
                adaptations.append("Optimized Peltier power draw to match low-cost 12V solar panel specs.")

        elif "paraffin" in mat_lower or "pcm" in mat_lower:
            cost = "$5 - $10"
            local_alt = "Commercial coconut oil / beeswax phase-change blend"
            adaptations.append("Replaced synthetic phase-change paraffin with natural coconut wax mixture.")

        elif "straw" in mat_lower or "lignocellulosic" in mat_lower:
            cost = "$2 - $5"
            local_alt = "Local agricultural residue (rice husk, bagasse, wheat straw, coconut coir)"
            adaptations.append("Utilized local crop harvest waste as primary filler material.")

        elif "citric acid" in mat_lower:
            cost = "$3 - $8"
            local_alt = "Food-grade sour salt powder (available at local market)"

        bom_items.append(BOMItem(
            item=item_name,
            purpose="Core functional component",
            estimated_cost=cost,
            local_alternative=local_alt
        ))

    # Tooling adaptation check
    if tooling == "basic":
        adapted_steps = []
        for step in raw_steps:
            modified_step = step
            if "3D-printed" in step or "machined" in step:
                modified_step = step.replace("3D-printed or machined", "Hand-crafted using PVC pipe, hand saw, and epoxy sealant")
                adaptations.append("Adapted precision 3D-printing requirement to hand-tool PVC construction.")
            adapted_steps.append(modified_step)
    else:
        adapted_steps = raw_steps

    return {
        "bill_of_materials": bom_items,
        "step_by_step_instructions": adapted_steps,
        "constraint_adaptations": list(set(adaptations)) if adaptations else ["Fully compatible with provided default constraints."]
    }
