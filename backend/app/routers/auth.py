from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.rate_limiter import limiter
from app.core.security import create_access_token, verify_password
from app.dependencies.auth import require_admin, token_payload
from app.models import Admin, RevokedToken
from app.schemas.auth import AdminRead, LoginRequest, LoginResponse

router = APIRouter(prefix="/api/auth", tags=["authentication"])


@router.post("/login", response_model=LoginResponse)
@limiter.limit("5/minute")
def login(request: Request, payload: LoginRequest, db: Session = Depends(get_db)) -> LoginResponse:
    admin = db.query(Admin).filter(Admin.email == payload.email.lower()).first()
    if admin is None or not verify_password(payload.password, admin.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    token, _, expires_at = create_access_token(admin.email)
    return LoginResponse(access_token=token, expires_at=expires_at, admin=admin)


@router.post("/logout")
def logout(token_data: tuple[str, object] = Depends(token_payload), db: Session = Depends(get_db)) -> dict[str, str]:
    token_id, expires_at = token_data
    if db.get(RevokedToken, token_id) is None:
        db.add(RevokedToken(jti=token_id, expires_at=expires_at))
        db.commit()
    return {"message": "Logged out"}


@router.get("/me", response_model=AdminRead)
def me(admin: Admin = Depends(require_admin)) -> Admin:
    return admin

