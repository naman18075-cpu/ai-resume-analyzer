from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[2]
ROOT_DIR = BASE_DIR.parent


class Settings(BaseSettings):
    project_name: str = "AI Resume Analyzer API"
    api_v1_prefix: str = "/api/v1"
    debug: bool = False

    secret_key: str = "change-me-in-production"
    access_token_expire_minutes: int = 60 * 24 * 7
    algorithm: str = "HS256"

    postgres_server: str = "localhost"
    postgres_port: int = 5432
    postgres_user: str = "postgres"
    postgres_password: str = "Naman%400304"
    postgres_db: str = "resume_db"
    database_url: str = "postgresql://postgres:Naman%400304@localhost:5432/resume_db"

# postgres_server: str = "localhost"
# postgres_port: int = 5432
# postgres_user: str = "postgres"
# postgres_password: str = "Naman%400304"
# postgres_db: str = "resume_db"

    frontend_url: str = "http://localhost:5173"
    allowed_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    openai_api_key: str | None = None
    openai_model: str = "gpt-4o-mini"

    rate_limit_default: str = "30/minute"
    rate_limit_auth: str = "10/minute"
    rate_limit_analysis: str = "5/minute"

    admin_emails: str = "admin@resumeai.dev"

    max_resume_size_mb: int = 5
    max_jd_size_mb: int = 2

    model_config = SettingsConfigDict(
        env_file=(BASE_DIR / ".env", ROOT_DIR / ".env"),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def sqlalchemy_database_uri(self) -> str:
        if self.database_url:
            return self.database_url
        return (
            f"postgresql+psycopg2://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_server}:{self.postgres_port}/{self.postgres_db}"
        )

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]

    @property
    def admin_email_list(self) -> list[str]:
        return [email.strip().lower() for email in self.admin_emails.split(",") if email.strip()]

    @property
    def storage_dir(self) -> Path:
        return BASE_DIR / "storage"

    @property
    def resume_dir(self) -> Path:
        return self.storage_dir / "resumes"

    @property
    def export_dir(self) -> Path:
        return self.storage_dir / "exports"

    @property
    def job_description_dir(self) -> Path:
        return self.storage_dir / "job_descriptions"


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    settings.storage_dir.mkdir(parents=True, exist_ok=True)
    settings.resume_dir.mkdir(parents=True, exist_ok=True)
    settings.export_dir.mkdir(parents=True, exist_ok=True)
    settings.job_description_dir.mkdir(parents=True, exist_ok=True)
    return settings


settings = get_settings()
