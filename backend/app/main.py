"""
Main FastAPI application entrypoint.
Configured for production hosting, container deployment, and local development.
"""
import os
import logging
from pathlib import Path
from typing import Optional

# pyrefly: ignore [missing-import]
from fastapi import FastAPI, Request, HTTPException
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from fastapi.staticfiles import StaticFiles
# pyrefly: ignore [missing-import]
from fastapi.responses import FileResponse, JSONResponse

from app.config import settings
from app.api.routes import router as api_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("open_patent_bridge")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="An open-innovation matching engine bridging natural language operational problems to public patent disclosures."
)

# Universal CORS for frontend & API integration across any host
# pyrefly: ignore [missing-import]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    """
    Catch-all global exception handler to prevent unhandled server crashes.
    Returns a clean, structured JSON response with status 500.
    """
    logger.error(f"Unhandled error on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An internal server error occurred while processing the request.",
            "error_type": type(exc).__name__,
            "message": str(exc)
        }
    )


# Include API Router under /api
app.include_router(api_router, prefix=settings.API_V1_STR)


def get_frontend_dist_path() -> Optional[Path]:
    """
    Locates the built frontend dist directory across local and containerized environments.
    """
    candidates = [
        Path(os.environ.get("FRONTEND_DIST_DIR", "")),
        Path(__file__).resolve().parent.parent.parent / "frontend" / "dist",
        Path(__file__).resolve().parent.parent / "dist",
        Path(__file__).resolve().parent.parent / "static",
        Path.cwd() / "frontend" / "dist",
        Path.cwd() / "dist",
    ]
    for p in candidates:
        if p and p.exists() and (p / "index.html").exists():
            return p
    return None


# Mount static assets if frontend/dist exists
_dist_path = get_frontend_dist_path()
if _dist_path:
    assets_dir = _dist_path / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")
        logger.info(f"Mounted frontend static assets from {assets_dir}")


@app.get("/")
def root():
    """
    Serves the compiled React frontend application when built,
    or falls back to API status and documentation metadata.
    """
    dist_path = get_frontend_dist_path()
    if dist_path and (dist_path / "index.html").exists():
        return FileResponse(dist_path / "index.html")

    return {
        "message": "Welcome to Open-Patent to Real Problem Bridge API",
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health",
        "frontend_status": "Built frontend not found. Run 'npm run build' in frontend/ to bundle the UI."
    }


@app.get("/favicon.svg")
def favicon():
    """
    Serves favicon from frontend dist if present.
    """
    dist_path = get_frontend_dist_path()
    if dist_path and (dist_path / "favicon.svg").exists():
        return FileResponse(dist_path / "favicon.svg")
    raise HTTPException(status_code=404, detail="Favicon not found")


@app.get("/{full_path:path}")
async def serve_spa_fallback(full_path: str):
    """
    SPA catch-all route: serves static files or index.html for client-side routing,
    while safeguarding API and documentation routes.
    """
    # Safeguard API endpoints and documentation from catch-all
    if full_path.startswith("api") or full_path in ("docs", "redoc", "openapi.json"):
        raise HTTPException(status_code=404, detail=f"Endpoint '/{full_path}' not found.")

    dist_path = get_frontend_dist_path()
    if dist_path:
        # Check if an exact static file exists in dist (e.g. manifest, icons)
        potential_file = dist_path / full_path
        if potential_file.exists() and potential_file.is_file():
            return FileResponse(potential_file)

        # Fallback to index.html for React SPA navigation
        index_file = dist_path / "index.html"
        if index_file.exists():
            return FileResponse(index_file)

    raise HTTPException(status_code=404, detail="Page not found.")


if __name__ == "__main__":
    # pyrefly: ignore [missing-import]
    import uvicorn
    # Support cloud environment PORT (e.g. Render, Railway, Heroku, Cloud Run)
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    uvicorn.run("app.main:app", host=host, port=port, reload=False)

