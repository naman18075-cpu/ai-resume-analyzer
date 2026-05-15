from datetime import timedelta

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.limiter import limiter
from app.core.security import create_access_token
from app.db.session import get_db
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.user import UserCreate, UserPublic
from app.services.auth_service import authenticate_user, create_user


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=TokenResponse)
@limiter.limit(settings.rate_limit_auth)
async def signup(
    request: Request,
    payload: UserCreate,
    db: Session = Depends(get_db),
) -> TokenResponse:
    del request
    user = create_user(db, payload)
    token = create_access_token(user.id, timedelta(minutes=settings.access_token_expire_minutes))
    return TokenResponse(access_token=token, user=UserPublic.model_validate(user))


@router.post("/login", response_model=TokenResponse)
@limiter.limit(settings.rate_limit_auth)
async def login(
    request: Request,
    payload: LoginRequest,
    db: Session = Depends(get_db),
) -> TokenResponse:
    del request
    user = authenticate_user(db, payload.email, payload.password)
    token = create_access_token(user.id, timedelta(minutes=settings.access_token_expire_minutes))
    return TokenResponse(access_token=token, user=UserPublic.model_validate(user))


@router.get("/me", response_model=UserPublic)
async def me(current_user=Depends(get_current_user)) -> UserPublic:
    return UserPublic.model_validate(current_user)
