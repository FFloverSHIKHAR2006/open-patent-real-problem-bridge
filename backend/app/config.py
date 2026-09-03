"""
Configuration settings for the application.
"""
# pyrefly: ignore [missing-import]
import os
from pathlib import Path
# pyrefly: ignore [missing-import]
from pydantic import BaseModel

try:
    from dotenv import load_dotenv
    # Check current directory, backend directory, and repo root
    for candidate in [
        Path.cwd() / ".env",
        Path(__file__).resolve().parent.parent / ".env",
        Path(__file__).resolve().parent.parent.parent / ".env",
    ]:
        if candidate.is_file():
            load_dotenv(candidate, override=True)
            break
    else:
        load_dotenv()
except ImportError:
    pass

class Settings(BaseModel):
    PROJECT_NAME: str = "Open-Patent to Real Problem Bridge"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")


settings = Settings()
