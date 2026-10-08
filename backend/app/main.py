import logging

from sqlalchemy.exc import IntegrityError

from alembic import command
from alembic.config import Config
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded

from app.core.config import get_settings
from app.core.database import SessionLocal
from app.core.rate_limiter import limiter
from app.core.security import hash_password
from app.models import Admin
from app.routers import auth, messages, projects, services


settings = get_settings()

app = FastAPI(title="Impullssee Portfolio API", version="1.0.0")

app.state.limiter = limiter


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


@app.on_event("startup")
def run_database_migrations() -> None:
    logging.getLogger(__name__).info("Running database migrations...")

    alembic_config = Config("alembic.ini")
    command.upgrade(alembic_config, "head")

    logging.getLogger(__name__).info("Database migrations completed.")
    create_initial_admin()


def create_initial_admin() -> None:
    admin_email = settings.admin_email
    admin_password = settings.admin_password
    if admin_email is None or admin_password is None:
        logging.getLogger(__name__).info("Initial admin credentials are not configured; skipping admin bootstrap.")
        return

    email = str(admin_email).lower()
    logger = logging.getLogger(__name__)
    with SessionLocal() as db:
        if db.query(Admin).filter(Admin.email == email).first() is not None:
            logger.info("Initial admin already exists; skipping admin bootstrap.")
            return

        db.add(Admin(email=email, password_hash=hash_password(admin_password.get_secret_value())))
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
            if db.query(Admin).filter(Admin.email == email).first() is None:
                raise
            logger.info("Initial admin already exists; skipping admin bootstrap.")
            return

    logger.info("Initial admin created successfully.")


@app.get("/api/health", tags=["health"])
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "message": "API is running",
    }


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
