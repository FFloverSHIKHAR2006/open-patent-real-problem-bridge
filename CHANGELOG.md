# Changelog

## [1.1.0] - 2026-09-03

### Added
- **UI Simplification & Progressive Disclosure**: Replaced complex form layouts with a clean, progressive disclosure pattern; collapsible constraints drawer; updated primary CTA to "Find Solutions".
- **Real-Time Step Progress Tracker**: Added animated visual progression through pipeline stages (Problem -> Mechanisms -> Research -> Patents -> Evidence -> Solution).
- **7-Section Result Hierarchy**: Restructured results page into clear, prioritized sections: Problem Understanding, Proposed Solution Hero, Expected Outcomes, Evidence Map, Ground-Truth Sources, Limitations, and Alternatives.
- **Authentic Elder-Care Ground-Truth Corpus**: Added verified USPTO patents (`US-PAT-7733224-B2`, `US-PAT-7158011-B2`, `US-PAT-7138902-B2`) and peer-reviewed papers (`PAPER-10.1007/s11042-018-7134-7`, `PAPER-10.1007/s12652-017-0598-x`) with active Google Patents and DOI URLs.
- **Outcome Estimation Engine**: Classified expected outcomes into 5 certainty tiers with zero fabricated quantitative metrics and rigorous citation attribution.
- **Modular Backend Endpoints**: Added dedicated routes for `/api/problem/analyze`, `/api/search/patents`, `/api/search/research`, `/api/match/mechanisms`, `/api/generate/solution`, `/api/generate/outcomes`, and `/api/validate/evidence`.
- **Root & API Health Check Routes**: Added `/health` and enhanced `/api/health` endpoints returning service status, version, environment, and corpus verification metadata for cloud orchestrators and uptime monitors.
- **Automated Test Expansion**: Added tests for outcome engine and end-to-end elder care scenario; expanded suite to 28 passing pytest tests.

## [1.0.0] - 2026-09-03

### Added
- **Backend Core**: FastAPI async Python service with Pydantic v2 schemas and Gemini API integration.
- **Problem Understanding Layer**: Problem decomposition into target user, operational context, functional requirements, and core physical/chemical mechanisms.
- **Retrieval Engine**: Multi-strategy patent retrieval engine across USPTO, NASA Tech Transfer, and academic disclosures.
- **Mechanism-Level Matching Engine**: Calculates mechanism similarity, applicability, and identifies cross-domain solution transfers.
- **Solution Fusion Engine**: Combines 2-3 complementary patents into hybrid solutions with compatibility validation and conflict checking.
- **Constraint Adaptation Engine**: Adapts recipes against budget, local materials, scale, location, and manufacturing capability.
- **Trust & Provenance Layer**: Traceable evidence graph connecting `Problem -> Mechanism -> Patent Source -> Claim -> Prototype Recommendation`.
- **Prototype Recommendation Generator**: Produces plain-language build steps, Bill of Materials with local alternatives, feasibility score, risk factors, and real-world impact statement.
- **Reverse Prior-Art Search Engine**: Accepts user prototype ideas, discovers overlapping prior art, flags legal/technical risks, and suggests improvements.
- **Unsolved Demand Signal Board**: Aggregates community operational problems and surfaces high-demand patent opportunities.
- **Frontend UI**: Modern Vite React Web Application with dark glassmorphism design system, interactive tab navigation, evidence graph viewer, prototype recipe exporter, and developer API explorer.
- **Test Suite**: Automated `pytest` suite covering 12 unit and integration tests (100% pass rate).
