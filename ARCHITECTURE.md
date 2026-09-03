# Architecture

## High-Level Architecture

User
↓
Problem Understanding Layer
↓
Problem Decomposition
↓
Mechanism Identification
↓
Retrieval Engine
↓
Candidate Ranking
↓
Technical Document Analysis
↓
Evidence Extraction
↓
Solution Fusion
↓
Constraint Adaptation
↓
Prototype Generation
↓
Trust & Provenance Layer
↓
Final Result

## Core Components

### 1. Input Layer
Understands problem, budget, scale, materials, location, and constraints.

### 2. Problem Analyzer
Converts natural language into a structured problem representation.

Example:
```json
{
  "problem": "",
  "domain": "",
  "desired_outcome": "",
  "constraints": [],
  "mechanisms": [],
  "keywords": []
}
```

### 3. Retrieval Engine
Searches public technical sources.

### 4. Mechanism Extraction Engine
Identifies the underlying physical, chemical, mechanical, biological, or computational principle.

### 5. Matching Engine
Ranks candidates using semantic similarity, mechanism similarity, technical relevance, evidence quality, and applicability.

### 6. Solution Fusion Engine
Combines complementary approaches.

### 7. Constraint Engine
Filters/adapts solutions according to cost, materials, scale, environment, and manufacturing capability.

### 8. Provenance Engine
Maintains source → evidence → mechanism → recommendation relationships.

### 9. Generation Engine
Produces the final explanation and prototype recipe.

### 10. Validation Engine
Checks generated output against retrieved evidence.

### 11. Client-Server API Architecture
Decoupled frontend-backend communication using centralized endpoint mapping:
- **Base URL**: Driven by `VITE_API_URL` environment variable.
- **Local Development**: When `VITE_API_URL` is omitted, defaults to relative paths using Vite's development proxy to `http://localhost:8000`.
- **Production (Vercel / Cloud)**: Points directly to the deployed FastAPI service (e.g. on Render, Railway, AWS, Fly.io) with cross-origin resource sharing (CORS) enabled, avoiding reliance on static hosting proxy rewrites.

## Design Principle

Every generated technical recommendation should have a traceable evidence path.

