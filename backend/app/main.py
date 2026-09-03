"""
Main FastAPI application entrypoint.
"""
# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.routes import router as api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="An open-innovation matching engine bridging natural language operational problems to public patent disclosures."
)

# Enable CORS for frontend integration
# pyrefly: ignore [missing-import]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {
        "message": "Welcome to Open-Patent to Real Problem Bridge API",
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health"
    }


if __name__ == "__main__":
    # pyrefly: ignore [missing-import]
    import uvicorn
    # pyrefly: ignore [missing-import]
    uvicorn.run("app.main:app", host="[IP_ADDRESS]", port=8000, reload=True)
