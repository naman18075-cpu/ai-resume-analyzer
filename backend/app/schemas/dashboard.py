from pydantic import BaseModel

from app.schemas.analysis import AnalysisListItem


class TrendPoint(BaseModel):
    label: str
    score: float


class DashboardOverview(BaseModel):
    total_analyses: int
    average_ats_score: float
    top_score: float
    recent_uploads: int
    skill_gap_count: int
    current_streak: int
    score_trend: list[TrendPoint]
    recent_analyses: list[AnalysisListItem]
    favorite_skills: list[str]
