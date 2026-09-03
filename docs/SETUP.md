# Setup & Installation Guide

## Prerequisites

- **Python 3.10+**
- **Node.js 18+** & **npm**
- **Git**
- **Gemini API Key** (Optional for live LLM enhancement; built-in intelligence fallback works offline)

## Environment Setup

1. Configure environment variables in `.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=8000
   ENVIRONMENT=development
   ```

## Installation

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# (Optional for local dev) Configure frontend environment:
# If connecting directly to a remote backend instead of local Vite proxy:
cp .env.example .env
# Set VITE_API_URL=http://localhost:8000 (or your deployed FastAPI backend URL on Vercel)
```

## Production Deployment (Vercel)

When deploying the frontend to Vercel:
1. Set the Environment Variable in your Vercel Project Settings:
   - `VITE_API_URL`: URL of your deployed FastAPI backend (e.g. `https://your-backend.onrender.com`)
2. Deploy as a standard Vite project (Build Command: `npm run build`, Output Directory: `dist`).

## Running the Application

### Backend API Server

```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```
API Documentation will be available at: http://localhost:8000/docs

### Frontend Web Server

```bash
cd frontend
npm run dev
```
Web Application will be available at: http://localhost:5173

## Testing

Run backend automated tests:

```bash
cd backend
pytest tests/ -v
```

Run frontend build verification:

```bash
cd frontend
npm run build
```
