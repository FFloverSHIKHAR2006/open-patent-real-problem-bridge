# AGENTS.md

## Mission

Build and continuously improve the Open-Patent to Real Problem Bridge.

The system must bridge the gap between real-world operational problems and existing publicly available technical knowledge.

## Primary Objective

Convert:

Natural-language problem
→ Problem understanding
→ Underlying mechanism
→ Patent/research retrieval
→ Technical extraction
→ Plain-language translation
→ Constraint adaptation
→ Prototype recommendation
→ Evidence + provenance

## Agent Rules

### Understand Before Implementing

Before changing code:
- Read PROJECT.md
- Read REQUIREMENTS.md
- Check TASKS.md
- Read relevant architecture documentation
- Inspect existing implementation
- Check DECISIONS.md

### Evidence First

Technical claims must be supported by reliable sources whenever possible.

Prefer:
1. Original patent
2. Official research paper
3. NASA / USPTO / university source
4. Official technology-transfer disclosure
5. High-quality secondary source

Never fabricate patent numbers, claims, experimental results, material properties, feasibility estimates, or citations.

### Mechanism Over Keywords

Prioritize underlying physical, chemical, engineering, biological, or computational mechanisms over exact wording or industry similarity.

### Preserve Provenance

Maintain source → evidence → mechanism → recommendation relationships.

### Solution Fusion

When combining sources:
- Identify each source's contribution.
- Explain compatibility.
- Identify conflicts.
- Explain assumptions.
- Do not claim an untested fusion is experimentally validated.

### Constraint Awareness

Consider budget, materials, geography, manufacturing capability, scale, safety, environment, and maintenance.

### Quality Over Quantity

Prefer a small number of relevant, novel, feasible, evidence-backed, actionable solutions.

### Legal Boundary

Prior art discovery is not legal advice. Do not claim that a solution is legally safe to commercialize without appropriate legal analysis.

## Research Loop

RESEARCH → UNDERSTAND → RETRIEVE → EXTRACT → MATCH → CHALLENGE → VALIDATE → REFINE → RESEARCH AGAIN IF NECESSARY → SYNTHESIZE

Stop when additional research produces diminishing returns.

## Completion Checklist

- Requirements satisfied
- Tests completed
- No unnecessary duplication
- Documentation updated
- Important claims supported
- Existing functionality preserved
