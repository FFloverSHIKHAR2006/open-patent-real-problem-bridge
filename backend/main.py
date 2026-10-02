"""
FastAPI service entrypoint for Vercel deployment and ASGI servers.
"""

from app.main import app

# Bind /health to the same handler function as /api/health
for route in list(app.routes):
    if getattr(route, "path", None) == "/api/health":
        app.add_api_route("/health", route.endpoint, methods=["GET"])
        break

__all__ = ["app"]
