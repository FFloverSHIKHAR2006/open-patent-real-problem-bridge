# Evidence Graph & Confidence Model

## Purpose

Maintain a rigorous, mathematically grounded, and fully traceable relationship between:

```
User Problem
     ↓
Decomposed Operational Context
     ↓
Underlying Physical / Computational Mechanism
     ↓
Ground-Truth Source Document (USPTO / NASA / Peer-Reviewed Paper)
     ↓
Extracted Technical Claims & Evidence Snippets
     ↓
Synthesized Solution Architecture & Components
     ↓
Expected / Estimated Outcomes
```

---

## Confidence Scoring Model

Confidence is calculated using a multi-factor weighted equation rather than arbitrary percentages:

$$\text{Confidence} = 0.35 \cdot S_{\text{mech}} + 0.25 \cdot A_{\text{source}} + 0.20 \cdot E_{\text{strength}} + 0.10 \cdot V_{\text{status}} + 0.10 \cdot C_{\text{fit}}$$

### Factor Definitions

1. **Mechanism Similarity ($S_{\text{mech}}$) — Weight: 35%**
   Measures cosine token overlap between extracted physical/computational mechanism and the patent's core mechanism claim.
2. **Source Authority ($A_{\text{source}}$) — Weight: 25%**
   - Official Patent (USPTO, WIPO, NASA Tech Transfer): $1.0$
   - Peer-Reviewed Academic Research Paper (IEEE, Springer, PubMed): $0.90$
   - Institutional Technical Whitepaper: $0.75$
   - Unverified / Secondary Disclosure: $0.40$
3. **Evidence Extraction Strength ($E_{\text{strength}}$) — Weight: 20%**
   Presence of explicit quantitative claims, formal patent claims (Claim 1/independent claims), or measured experimental paragraphs in the specification.
4. **Verification Status ($V_{\text{status}}$) — Weight: 10%**
   Binary check: Does the source resolve to an authentic external record (Google Patents canonical URL, official DOI, or NASA Tech Transfer page)?
5. **Constraint Fit ($C_{\text{fit}}$) — Weight: 10%**
   Compatibility with user's specified budget, locally available materials, scale, and tooling.

---

## Evidence Certainty Levels

Every estimated outcome in the system is strictly classified into one of five levels:

1. **Evidence-backed**
   Direct empirical measurement or formal legal claim in the source text (e.g. *"Cellulose triacetate FO membranes achieved >99.99% pathogen rejection in Table 2"*).
2. **Evidence-derived estimate**
   Mathematically extrapolated from reported values or empirical evaluations (e.g. *~20–30% faster anomaly detection derived from passive sensor studies*). Marked with `~` and `is_estimated = true`.
3. **Engineering estimate**
   Derived from physical first-principles and standard material properties (e.g. latent heat buffer duration under 12V DC loads).
4. **Qualitative expectation**
   Directional functional advantage without numerical claims (e.g. *"Non-invasive ambient sensors preserve resident privacy without camera feeds"*).
5. **Unknown / insufficient evidence**
   Used when retrieved sources lack evidentiary support. Clearly states: *"Quantitative improvement cannot be reliably estimated from the retrieved evidence without localized bench testing."*

---

## Provenance Rules

- **Zero-Fabrication Mandate:** Never invent patent numbers, authors, DOIs, URLs, or experimental measurements.
- **Traceability:** Every component in the generated prototype recipe must link to at least one verified source identifier (`[P1]`, `[R1]`).
- **External Redirection:** Every displayed link must open directly to the official Google Patent, DOI resolver, or institutional archive in a new tab with security attributes (`target="_blank" rel="noopener noreferrer"`).
