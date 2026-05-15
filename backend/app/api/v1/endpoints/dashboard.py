from collections import Counter
from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.analysis import Analysis
from app.models.resume import Resume
from app.models.user import User
from app.schemas.dashboard import DashboardOverview, TrendPoint
from app.services.analysis_service import analysis_service


router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/overview", response_model=DashboardOverview)
async def dashboard_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DashboardOverview:
    analyses = db.scalars(
        select(Analysis)
        .options(joinedload(Analysis.resume), joinedload(Analysis.job_description))
        .where(Analysis.user_id == current_user.id)
        .order_by(Analysis.created_at.desc())
    ).all()
    resumes_count = (
        db.scalar(select(func.count()).select_from(Resume).where(Resume.user_id == current_user.id)) or 0
    )

    if not analyses:
        return DashboardOverview(
            total_analyses=0,
            average_ats_score=0,
            top_score=0,
            recent_uploads=resumes_count,
            skill_gap_count=0,
            current_streak=0,
            score_trend=[],
            recent_analyses=[],
            favorite_skills=[],
        )

    average_score = round(sum(item.ats_score for item in analyses) / len(analyses), 2)
    top_score = round(max(item.ats_score for item in analyses), 2)
    skill_gap_count = len({skill for item in analyses for skill in item.missing_keywords})

    streak_days = 0
    seen_dates = {item.created_at.date() for item in analyses if item.created_at}
    current_date = datetime.now(UTC).date()
    while current_date in seen_dates:
        streak_days += 1
        current_date -= timedelta(days=1)

    trend = [
        TrendPoint(label=item.created_at.strftime("%b %d"), score=item.ats_score)
        for item in list(reversed(analyses[:6]))
    ]
    recent_analyses = [analysis_service.serialize_analysis_item(item) for item in analyses[:5]]
    favorite_skills = [
        name
        for name, _ in Counter(skill for item in analyses for skill in item.matched_keywords).most_common(6)
    ]

    return DashboardOverview(
        total_analyses=len(analyses),
        average_ats_score=average_score,
        top_score=top_score,
        recent_uploads=resumes_count,
        skill_gap_count=skill_gap_count,
        current_streak=streak_days,
        score_trend=trend,
        recent_analyses=recent_analyses,
        favorite_skills=favorite_skills,
    )
