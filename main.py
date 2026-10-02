"""
Root entrypoint for ASGI servers (Render, Railway, Docker, Uvicorn).
Delegates to api.index to provide a unified runtime across Vercel and Render.
"""
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BACKEND = ROOT / "backend"

for path_entry in [str(BACKEND), str(ROOT)]:
    if path_entry not in sys.path and Path(path_entry).exists():
        sys.path.insert(0, path_entry)

from api.index import app, handler  # noqa: E402

if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    uvicorn.run("main:app", host=host, port=port, reload=False)

__all__ = ["app", "handler"]
