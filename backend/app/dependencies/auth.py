from datetime import datetime, timezone

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import get_db
from app.models import Admin, RevokedToken

bearer_scheme = HTTPBearer(auto_error=False)


def get_optional_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Admin | None:
    if credentials is None:
        return None
    try:
        payload = jwt.decode(credentials.credentials, get_settings().jwt_secret_key, algorithms=["HS256"])
        subject = payload.get("sub")
        token_id = payload.get("jti")
        if not subject or not token_id or db.get(RevokedToken, token_id):
            raise ValueError("Invalid token")
        return db.query(Admin).filter(Admin.email == subject).first() or None
    except (jwt.PyJWTError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired access token")


def require_admin(admin: Admin | None = Depends(get_optional_admin)) -> Admin:
    if admin is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    return admin


def token_payload(credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme)) -> tuple[str, datetime]:
    try:
        if credentials is None:
            raise ValueError("Missing token")
        payload = jwt.decode(credentials.credentials, get_settings().jwt_secret_key, algorithms=["HS256"])
        token_id = payload.get("jti")
        expires_at = datetime.fromtimestamp(payload["exp"], tz=timezone.utc)
        if not token_id:
            raise ValueError("Missing token id")
        return token_id, expires_at
    except (jwt.PyJWTError, ValueError, KeyError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired access token")

