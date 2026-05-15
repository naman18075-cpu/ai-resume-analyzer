from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.db.session import get_db
from app.models.analysis import Analysis
from app.models.usage import ApiUsageLog
from app.models.user import User
from app.schemas.admin import AdminOverview, RecentSignupItem, RoleDistributionItem
from app.schemas.dashboard import TrendPoint


router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/overview", response_model=AdminOverview)
async def admin_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
) -> AdminOverview:
    del current_user
    total_users = db.scalar(select(func.count()).select_from(User)) or 0
    total_analyses = db.scalar(select(func.count()).select_from(Analysis)) or 0
    average_ats_score = round(
        float(db.scalar(select(func.coalesce(func.avg(Analysis.ats_score), 0))) or 0),
        2,
    )

    since_30_days = datetime.now(UTC) - timedelta(days=30)
    active_users_30d = db.scalar(
        select(func.count(func.distinct(ApiUsageLog.user_id))).where(ApiUsageLog.created_at >= since_30_days)
    ) or 0

    since_7_days = datetime.now(UTC) - timedelta(days=7)
    api_requests_7d = db.scalar(
        select(func.count()).select_from(ApiUsageLog).where(ApiUsageLog.created_at >= since_7_days)
    ) or 0

    usage_rows = db.execute(
        select(
            func.date(ApiUsageLog.created_at).label("day"),
            func.count(ApiUsageLog.id).label("total"),
        )
        .where(ApiUsageLog.created_at >= since_7_days)
        .group_by(func.date(ApiUsageLog.created_at))
        .order_by(func.date(ApiUsageLog.created_at))
    ).all()
    daily_usage = [
        TrendPoint(label=row.day.strftime("%b %d"), score=float(row.total))
        for row in usage_rows
    ]

    role_rows = db.execute(
        select(User.role, func.count(User.id))
        .group_by(User.role)
        .order_by(func.count(User.id).desc())
    ).all()
    role_distribution = [
        RoleDistributionItem(label=row[0].title(), value=row[1]) for row in role_rows
    ]

    recent_signups_rows = db.execute(
        select(User.full_name, User.email, User.created_at)
        .order_by(User.created_at.desc())
        .limit(5)
    ).all()
    recent_signups = [
        RecentSignupItem(
            full_name=row.full_name,
            email=row.email,
            created_at=row.created_at.strftime("%Y-%m-%d %H:%M"),
        )
        for row in recent_signups_rows
    ]

    return AdminOverview(
        total_users=total_users,
        total_analyses=total_analyses,
        active_users_30d=active_users_30d,
        api_requests_7d=api_requests_7d,
        average_ats_score=average_ats_score,
        daily_usage=daily_usage,
        role_distribution=role_distribution,
        recent_signups=recent_signups,
    )
