"""Application configuration loaded from environment variables."""

from pydantic_settings import BaseSettings
from pydantic import Field
from typing import Optional
import os


class Settings(BaseSettings):
    """All settings are loaded from environment variables or .env file."""

    # Supabase
    supabase_url: str = Field(..., env="SUPABASE_URL")
    supabase_service_role_key: str = Field(..., env="SUPABASE_SERVICE_ROLE_KEY")
    supabase_db_url: Optional[str] = Field(None, env="SUPABASE_DB_URL")

    # OpenAI
    openai_api_key: str = Field(..., env="OPENAI_API_KEY")
    openai_embedding_model: str = Field("text-embedding-3-small", env="OPENAI_EMBEDDING_MODEL")
    openai_chat_model: str = Field("gpt-4o", env="OPENAI_CHAT_MODEL")

    # Google Gemini (free alternative for supervisor/routing tasks)
    gemini_api_key: Optional[str] = Field(None, env="GEMINI_API_KEY")
    gemini_model: str = Field("gemini-2.0-flash", env="GEMINI_MODEL")

    # GitHub
    github_token: Optional[str] = Field(None, env="GITHUB_TOKEN")

    # LangSmith
    langsmith_api_key: Optional[str] = Field(None, env="LANGSMITH_API_KEY")
    langsmith_project: str = Field("neuroclass", env="LANGSMITH_PROJECT")
    langchain_tracing_v2: bool = Field(False, env="LANGCHAIN_TRACING_V2")

    # Auth
    ai_service_secret: Optional[str] = Field(None, env="AI_SERVICE_SECRET")

    # Notifications — Resend (free tier)
    resend_api_key: Optional[str] = Field(None, env="RESEND_API_KEY")

    # Web Search — Serper (optional, falls back to DuckDuckGo)
    serper_api_key: Optional[str] = Field(None, env="SERPER_API_KEY")

    # App
    port: int = Field(8080, env="PORT")
    environment: str = Field("development", env="ENVIRONMENT")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


def get_settings() -> Settings:
    """Returns a cached Settings instance."""
    return Settings()  # type: ignore


# Singleton
settings = get_settings()
