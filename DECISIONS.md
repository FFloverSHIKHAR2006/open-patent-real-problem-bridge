# Architecture & Product Decisions

## Decision 001 — Technology Stack Selection

**Date:** 2026-09-03

### Decision
Select Python 3.10+ with FastAPI, Pydantic v2, and Pytest for the Backend Intelligence Service, combined with Vite + React and a Vanilla CSS design system for the Frontend Web Application.

### Context
The application requires high-performance text handling, AI reasoning, document parsing, mechanism extraction, and vector similarity math, paired with a visual UI for builders, hardware innovators, and impact organizations.

### Alternatives
- **Node.js / Express**: Good web performance, but weaker native ecosystem for scientific vector math and mechanism matching algorithms.
- **Next.js Fullstack**: Great SSR, but splitting Python AI reasoning into external scripts or microservices adds deployment complexity.
- **Python FastAPI + Vite React**: Python provides rich data manipulation, Pydantic validation, and direct AI SDK access; Vite React provides instant live feedback, reactive evidence graphs, and rich aesthetics.

### Selected Option
Python FastAPI backend + Vite React frontend.

### Reason
Combines Python's strengths in AI processing, data parsing, and pytest verification with React's component hierarchy for dynamic graph visualization and prototype recipe presentation.

### Trade-offs
- **Advantages**: Clean separation of concerns, fast backend API development, strong typing with Pydantic, rapid interactive UI build with Vite.
- **Disadvantages**: Requires running two processes (backend API server + frontend dev server) during development.

---

## Decision 002 — Patent Corpus Retrieval Engine Architecture

**Date:** 2026-09-03

### Decision
Implement a dual retrieval engine combining a high-precision curated patent database (USPTO, NASA Tech Transfer disclosures, academic repositories with structured mechanism annotations) with dynamic fallback and multi-strategy vector/semantic query expansion.

### Context
Public patent databases (Google Patents, USPTO, NASA) contain millions of dense disclosures. For reliable zero-hallucination mechanism extraction and immediate prototype recommendations, a high-trust curated index with verified mechanism tags guarantees reproducible evidence provenance while supporting open-ended queries.

### Alternatives
- **Pure Live Scraping**: High latency, unreliable response structure, rate limits from external patent APIs.
- **Pure Static JSON**: Limited to pre-indexed patents, cannot expand to novel query terms.
- **Dual Architecture (Curated Index + Strategy-Based Query Expansion)**: Provides instant high-confidence evidence from verified disclosures, while allowing dynamic LLM query normalization across cross-domain mechanisms.

### Selected Option
Dual Architecture.

### Reason
Guarantees strict evidence provenance (`Problem -> Mechanism -> Patent Claim -> Recipe`) without risk of hallucinated patent numbers or claims, while allowing flexible natural language problem input.

---

## Decision 003 — Evidence Provenance Guarantee

**Date:** 2026-09-03

### Decision
Every generated prototype recommendation, material selection, operating step, and constraint adaptation must maintain a explicit pointer to an evidence record containing patent number, title, section/claim text, extracted mechanism, and confidence score.

### Context
Rule in `AGENTS.md`: "Never fabricate patent numbers, claims, experimental results, material properties, feasibility estimates, or citations."

### Consequences
If evidence for a specific claim is missing or inferred, the system explicitly labels the claim as `INFERENCE` or `UNVALIDATED HYPOTHESIS` and reduces confidence score accordingly.

---

## Decision 004 — Outcome Estimation Engine & 7-Section Result Hierarchy

**Date:** 2026-09-03

### Decision
Segregate the evaluation results into 5 rigorous certainty tiers (Evidence-backed, Evidence-derived estimate, Engineering estimate, Qualitative expectation, Unknown/insufficient evidence) and render outputs in a 7-section progressive disclosure hierarchy. Prohibit numerical generation unless explicitly supported by cited evidence text.

### Context
Product requirement to distinguish expected/estimated outcomes from validated/measured facts and prevent any hallucinated quantitative performance claims.

### Consequences
- Prevents misleading builders with fabricated precision (e.g. invented efficiency percentages).
- Empowers builders with authentic Google Patents and DOI URLs directly traceable to each component.

