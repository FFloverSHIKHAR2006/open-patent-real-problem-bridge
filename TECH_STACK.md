# Technology Stack

## AI & Intelligence Engine

Primary reasoning & generation model:
- **Gemini**: Used for problem decomposition, mechanism extraction, patent translation, solution fusion, and prototype generation.

## Retrieval & Corpus

Curated & Dynamic Retrieval Sources:
- **NASA Technology Transfer Program** disclosures
- **USPTO** patent disclosures
- **Google Patents** public records
- **Academic Research Repositories** (arXiv, bioRxiv/medRxiv)

## Backend

- **Language**: Python 3.10+
- **Framework**: FastAPI (high-performance async web framework)
- **Validation**: Pydantic v2
- **Server**: Uvicorn
- **Testing**: Pytest

## Frontend

- **Framework**: Vite + React
- **Styling**: Modern Vanilla CSS (Design system with HSL variables, dark glassmorphism, responsive CSS grid/flexbox)
- **API Client**: Centralized environment-aware configuration (`VITE_API_URL`), enabling seamless transitions between local development (Vite dev proxy) and production CDN deployments (Vercel) connecting to deployed FastAPI services.
- **Icons & Graphics**: SVG dynamic icons & Mermaid/SVG canvas graph visualizations

## Search & Embeddings

- **Mechanism Vector Matching**: TF-IDF & Cosine Similarity vector engine over normalized mechanism tokens
- **Semantic Expansion**: Domain-to-mechanism taxonomy transformation

## Storage & Provenance

- **Corpus Database**: Local high-performance structured JSON/SQLite index storing patent metadata, sections, claims, mechanisms, and evidence snippets.

## Observability & Quality

- **Metrics tracked**: Retrieval precision, mechanism match confidence, evidence coverage, hallucination safety, latency.
