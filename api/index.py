"""
Unified entrypoint for FastAPI backend supporting both Vercel Serverless and Render web services.
"""
import os
import sys
from pathlib import Path

# Resolve directory roots
ROOT = Path(__file__).resolve().parent.parent
BACKEND = ROOT / "backend"

# Ensure backend and root paths are available in sys.path
for path_entry in [str(BACKEND), str(ROOT)]:
    if path_entry not in sys.path and Path(path_entry).exists():
        sys.path.insert(0, path_entry)

# Import the FastAPI application with resilient fallback
try:
    # pyrefly: ignore [missing-import]
    from app.main import app  # noqa: E402
except ImportError:
    from backend.app.main import app  # noqa: E402

# Export standard ASGI symbols for Vercel, Uvicorn, and Gunicorn
handler = app

if __name__ == "__main__":
    # Support direct execution on Render, Docker, or local environments
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    uvicorn.run("api.index:app", host=host, port=port, reload=False)

__all__ = ["app", "handler"]
