from pydantic import BaseModel

from app.schemas.dashboard import TrendPoint


class RoleDistributionItem(BaseModel):
    label: str
    value: int


class RecentSignupItem(BaseModel):
    full_name: str
    email: str
    created_at: str


class AdminOverview(BaseModel):
    total_users: int
    total_analyses: int
    active_users_30d: int
    api_requests_7d: int
    average_ats_score: float
    daily_usage: list[TrendPoint]
    role_distribution: list[RoleDistributionItem]
    recent_signups: list[RecentSignupItem]
