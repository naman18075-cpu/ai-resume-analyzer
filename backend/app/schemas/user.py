from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserBase(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=72)

class UserPublic(UserBase):
    id: str
    role: str
    avatar_url: str | None = None
    analyses_count: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
