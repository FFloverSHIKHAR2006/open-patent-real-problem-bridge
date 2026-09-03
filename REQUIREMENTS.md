# Requirements

## Functional Requirements

### FR-01 — Problem Input
Accept natural-language descriptions of real-world problems.

### FR-02 — Problem Understanding
Identify user need, operational context, constraints, desired outcome, relevant domain, and key mechanisms.

### FR-03 — Patent Retrieval
Retrieve relevant public patents and technical disclosures.

Potential sources:
- Google Patents
- NASA Technology Transfer
- USPTO
- Research publications
- University technology-transfer repositories

### FR-04 — Mechanism Matching
Identify underlying technical mechanisms rather than relying solely on keyword similarity.

### FR-05 — Technical Extraction
Extract mechanism, materials, processes, operating conditions, technical limitations, and evidence.

### FR-06 — Translation
Convert technical/legal language into understandable engineering guidance.

### FR-07 — Prototype Recipe
Where supported, provide mechanism summary, materials, steps, feasibility, constraints, and source.

### FR-08 — Multi-Patent Fusion
Support combining complementary technical approaches.

### FR-09 — Constraint Adaptation
Support constraints such as budget, materials, scale, location, and manufacturing capability.

### FR-10 — Provenance
Preserve source references for generated recommendations.

### FR-11 — Confidence
Provide confidence estimates based on evidence quality and relevance.

### FR-12 — Reverse Search
Allow users to provide an existing idea/prototype and discover relevant prior art.

### FR-13 — Impact Statement
Include a concise real-world impact explanation.

## Non-Functional Requirements

- Accuracy
- Explainability
- Traceability
- Efficiency
- Scalability
- Reliability
- Security

## Safety / Legal Requirements

Clearly distinguish technical information, prior art, patent status, and legal advice. Do not claim freedom-to-operate without appropriate legal analysis.
