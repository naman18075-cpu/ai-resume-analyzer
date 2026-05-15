from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ResumeUploadResponse(BaseModel):
    id: str
    file_name: str
    mime_type: str
    extracted_text: str
    parsed_sections: dict[str, str]
    skills: list[str]
    word_count: int
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)


class JobDescriptionResponse(BaseModel):
    id: str
    title: str
    company_name: str | None = None
    source_type: str
    content: str
    skills: list[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AnalysisCreateRequest(BaseModel):
    resume_id: str
    job_description_id: str
    target_role: str | None = Field(default=None, max_length=160)
    company_name: str | None = Field(default=None, max_length=160)


class ScoreBreakdown(BaseModel):
    overall_score: float
    keyword_score: float
    semantic_score: float
    formatting_score: float
    section_score: float
    impact_score: float


class AnalysisListItem(BaseModel):
    id: str
    target_role: str
    company_name: str | None = None
    ats_score: float
    created_at: datetime
    resume_name: str
    job_description_title: str
    matched_keywords: list[str]
    missing_keywords: list[str]


class AnalysisDetail(BaseModel):
    id: str
    target_role: str
    company_name: str | None = None
    executive_summary: str
    resume_strength: str
    ats_score: float
    score_breakdown: ScoreBreakdown
    semantic_score: float
    matched_keywords: list[str]
    missing_keywords: list[str]
    improvement_suggestions: list[str]
    weak_bullets: list[dict]
    bullet_rewrites: list[dict]
    section_scores: dict[str, float]
    interview_questions: list[str]
    recommended_certifications: list[str]
    job_recommendations: list[dict]
    created_at: datetime
    resume: ResumeUploadResponse
    job_description: JobDescriptionResponse
