from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, Float, ForeignKey, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"))
    resume_id: Mapped[str] = mapped_column(String(36), ForeignKey("resumes.id", ondelete="CASCADE"))
    job_description_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("job_descriptions.id", ondelete="CASCADE"),
    )
    target_role: Mapped[str] = mapped_column(String(160), nullable=False)
    company_name: Mapped[str | None] = mapped_column(String(160), nullable=True)
    executive_summary: Mapped[str] = mapped_column(Text, nullable=False)
    resume_strength: Mapped[str] = mapped_column(String(50), nullable=False)
    ats_score: Mapped[float] = mapped_column(Float, nullable=False)
    semantic_score: Mapped[float] = mapped_column(Float, nullable=False)
    missing_keywords: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    matched_keywords: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    improvement_suggestions: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    weak_bullets: Mapped[list[dict]] = mapped_column(JSON, default=list, nullable=False)
    bullet_rewrites: Mapped[list[dict]] = mapped_column(JSON, default=list, nullable=False)
    section_scores: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    interview_questions: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    recommended_certifications: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    job_recommendations: Mapped[list[dict]] = mapped_column(JSON, default=list, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="analyses")
    resume = relationship("Resume", back_populates="analyses")
    job_description = relationship("JobDescription", back_populates="analyses")
    score = relationship(
        "AnalysisScore",
        back_populates="analysis",
        uselist=False,
        cascade="all, delete-orphan",
    )
