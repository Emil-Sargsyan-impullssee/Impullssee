from functools import lru_cache

from pydantic import EmailStr, SecretStr, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str
    jwt_secret_key: str
    jwt_access_token_minutes: int = 720
    frontend_url: str = "http://localhost:5173,http://localhost:5174"
    resend_api_key: str | None = None
    contact_email: str | None = None
    resend_from_email: str = "Impullssee Portfolio <onboarding@resend.dev>"
    environment: str = "development"
    admin_email: EmailStr | None = None
    admin_password: SecretStr | None = None

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @field_validator("jwt_secret_key")
    @classmethod
    def validate_secret(cls, value: str) -> str:
        if len(value) < 32:
            raise ValueError("JWT_SECRET_KEY must contain at least 32 characters")
        return value

    @model_validator(mode="after")
    def validate_admin_bootstrap(self) -> "Settings":
        if (self.admin_email is None) != (self.admin_password is None):
            raise ValueError("ADMIN_EMAIL and ADMIN_PASSWORD must be configured together")
        if self.admin_password is not None:
            password_length = len(self.admin_password.get_secret_value())
            if not 12 <= password_length <= 128:
                raise ValueError("ADMIN_PASSWORD must contain between 12 and 128 characters")
        return self

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip().rstrip("/") for origin in self.frontend_url.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()

