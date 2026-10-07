```python
import logging

from alembic import command
from alembic.config import Config
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded

from app.core.config import get_settings
from app.core.rate_limiter import limiter
from app.routers import auth, messages, projects, services

settings = get_settings()

app = FastAPI(title="Impullssee Portfolio API", version="1.0.0")
app.state.limiter = limiter


@app.on_event("startup")
def run_database_migrations() -> None:
    logging.getLogger(__name__).info("Running database migrations...")

    alembic_config = Config("alembic.ini")
    command.upgrade(alembic_config, "head")

    logging.getLogger(__name__).info("Database migrations completed.")


@app.exception_handler(RateLimitExceeded)
async def rate_limit_error_handler(
    request: Request,
    exc: RateLimitExceeded,
) -> JSONResponse:
    return JSONResponse(
        status_code=429,
        content={"detail": "Too many requests. Please try again later."},
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(auth.router)
app.include_router(messages.router)
app.include_router(projects.router)
app.include_router(services.router)


@app.get("/api/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok", "message": "API is running"}


@app.exception_handler(Exception)
async def unexpected_error_handler(
    request: Request,
    exc: Exception,
) -> JSONResponse:
    logging.getLogger(__name__).exception(
        "Unhandled API error",
        exc_info=exc,
    )
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected server error occurred"},
    )
```