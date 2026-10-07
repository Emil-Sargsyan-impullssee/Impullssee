from datetime import datetime, timedelta, timezone
from uuid import uuid4

import jwt
from pwdlib import PasswordHash

from app.core.config import get_settings

password_hash = PasswordHash.recommended()
ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, encoded: str) -> bool:
    return password_hash.verify(password, encoded)


def create_access_token(subject: str) -> tuple[str, str, datetime]:
    settings = get_settings()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_access_token_minutes)
    token_id = str(uuid4())
    token = jwt.encode(
        {"sub": subject, "jti": token_id, "iat": datetime.now(timezone.utc), "exp": expires_at},
        settings.jwt_secret_key,
        algorithm=ALGORITHM,
    )
    return token, token_id, expires_at

