from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.analysis import Analysis
from app.models.job_description import JobDescription
from app.models.resume import Resume
from app.models.score import AnalysisScore
from app.models.user import User
from app.schemas.analysis import AnalysisCreateRequest
from app.services.nlp_service import (
    analyze_bullets,
    build_executive_summary,
    build_fallback_bullet_rewrites,
    build_interview_questions,
    classify_resume_strength,
    compare_skills,
    extract_sections,
    extract_skills,
    formatting_score,
    recommend_certifications,
    recommend_roles,
    score_resume_sections,
    semantic_similarity,
)
from app.services.openai_service import OpenAIService
from app.utils.text import unique_list


class AnalysisService:
    def __init__(self) -> None:
        self.openai_service = OpenAIService()

    @staticmethod
    def _normalize_string_list(values: list | None) -> list[str]:
        if not isinstance(values, list):
            return []
        return [str(item).strip() for item in values if str(item).strip()]

    @staticmethod
    def _normalize_bullet_rewrites(values: list | None) -> list[dict]:
        if not isinstance(values, list):
            return []
        normalized: list[dict] = []
        for item in values:
            if isinstance(item, dict) and item.get("original") and item.get("rewrite"):
                normalized.append(
                    {
                        "original": str(item["original"]).strip(),
                        "rewrite": str(item["rewrite"]).strip(),
                    }
                )
        return normalized

    @staticmethod
    def _normalize_job_recommendations(values: list | None) -> list[dict]:
        if not isinstance(values, list):
            return []
        normalized: list[dict] = []
        for item in values:
            if isinstance(item, dict) and item.get("role"):
                normalized.append(
                    {
                        "role": str(item.get("role")).strip(),
                        "match_score": float(item.get("match_score", 0)),
                        "why": str(item.get("why", "Aligned to your resume signals.")).strip(),
                    }
                )
        return normalized

    async def create_analysis(
        self,
        db: Session,
        current_user: User,
        payload: AnalysisCreateRequest,
    ) -> dict:
        resume = db.scalar(
            select(Resume).where(Resume.id == payload.resume_id, Resume.user_id == current_user.id)
        )
        if not resume:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

        job_description = db.scalar(
            select(JobDescription).where(
                JobDescription.id == payload.job_description_id,
                JobDescription.user_id == current_user.id,
            )
        )
        if not job_description:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job description not found",
            )

        resume_sections = resume.parsed_sections or extract_sections(resume.extracted_text)
        resume_skills = resume.skills or extract_skills(resume.extracted_text)
        jd_skills = job_description.skills or extract_skills(job_description.content)

        resume.parsed_sections = resume_sections
        resume.skills = resume_skills
        job_description.skills = jd_skills

        skill_metrics = compare_skills(resume_skills, jd_skills)
        keyword_score = round(float(skill_metrics["coverage"]) * 100, 2)
        semantic_score_value = round(semantic_similarity(resume.extracted_text, job_description.content) * 100, 2)
        section_scores = score_resume_sections(resume_sections)
        section_score_value = round(section_scores.pop("overall"), 2)
        bullet_metrics = analyze_bullets(resume.extracted_text, jd_skills)
        formatting_score_value = formatting_score(resume.extracted_text, resume_sections)
        impact_score_value = round(float(bullet_metrics["average_score"]), 2)

        overall_score = round(
            (keyword_score * 0.34)
            + (semantic_score_value * 0.24)
            + (section_score_value * 0.16)
            + (formatting_score_value * 0.11)
            + (impact_score_value * 0.15),
            2,
        )
        resume_strength = classify_resume_strength(overall_score)

        default_suggestions = unique_list(
            [
                f"Add stronger evidence for {skill} in your experience bullets."
                for skill in list(skill_metrics["missing"])[:3]
            ]
            + [
                "Quantify business impact with percentages, revenue, time saved, or user growth.",
                "Tailor the summary section to mirror the target role and top keywords.",
                "Strengthen project bullets with tool names, ownership scope, and outcomes.",
            ]
        )[:6]

        ai_payload = await self.openai_service.generate_enhancements(
            {
                "target_role": payload.target_role or job_description.title,
                "company_name": payload.company_name or job_description.company_name,
                "resume_skills": resume_skills,
                "job_description_skills": jd_skills,
                "matched_keywords": skill_metrics["matched"],
                "missing_keywords": skill_metrics["missing"],
                "weak_bullets": bullet_metrics["weak_bullets"],
                "current_score": overall_score,
            }
        ) or {}

        executive_summary = (
            ai_payload.get("summary") if isinstance(ai_payload.get("summary"), str) else None
        ) or build_executive_summary(
            overall_score,
            list(skill_metrics["matched"]),
            list(skill_metrics["missing"]),
            semantic_score_value,
        )
        improvement_suggestions = unique_list(
            self._normalize_string_list(ai_payload.get("suggestions")) + default_suggestions
        )[:6]
        bullet_rewrites = self._normalize_bullet_rewrites(ai_payload.get("bullet_rewrites")) or build_fallback_bullet_rewrites(
            bullet_metrics["weak_bullets"],
            jd_skills,
        )
        interview_questions = unique_list(
            self._normalize_string_list(ai_payload.get("interview_questions"))
            + build_interview_questions(list(skill_metrics["matched"]), list(skill_metrics["missing"]))
        )[:5]
        recommended_certifications = unique_list(
            self._normalize_string_list(ai_payload.get("recommended_certifications"))
            + recommend_certifications(list(skill_metrics["missing"]))
        )[:4]
        job_recommendations = self._normalize_job_recommendations(ai_payload.get("job_recommendations")) or recommend_roles(resume_skills)

        analysis = Analysis(
            user_id=current_user.id,
            resume_id=resume.id,
            job_description_id=job_description.id,
            target_role=payload.target_role or job_description.title,
            company_name=payload.company_name or job_description.company_name,
            executive_summary=executive_summary,
            resume_strength=resume_strength,
            ats_score=overall_score,
            semantic_score=semantic_score_value,
            missing_keywords=list(skill_metrics["missing"]),
            matched_keywords=list(skill_metrics["matched"]),
            improvement_suggestions=improvement_suggestions,
            weak_bullets=bullet_metrics["weak_bullets"],
            bullet_rewrites=bullet_rewrites,
            section_scores=section_scores,
            interview_questions=interview_questions,
            recommended_certifications=recommended_certifications,
            job_recommendations=job_recommendations,
        )
        analysis.score = AnalysisScore(
            overall_score=overall_score,
            keyword_score=keyword_score,
            semantic_score=semantic_score_value,
            formatting_score=formatting_score_value,
            section_score=section_score_value,
            impact_score=impact_score_value,
        )

        current_user.analyses_count += 1
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
        return self.serialize_analysis(analysis)

    def get_analysis(self, db: Session, current_user: User, analysis_id: str) -> dict:
        analysis = db.scalar(
            select(Analysis)
            .options(
                joinedload(Analysis.score),
                joinedload(Analysis.resume),
                joinedload(Analysis.job_description),
            )
            .where(Analysis.id == analysis_id, Analysis.user_id == current_user.id)
        )
        if not analysis:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis not found")
        return self.serialize_analysis(analysis)

    def list_analyses(self, db: Session, current_user: User) -> list[dict]:
        analyses = db.scalars(
            select(Analysis)
            .options(joinedload(Analysis.resume), joinedload(Analysis.job_description))
            .where(Analysis.user_id == current_user.id)
            .order_by(Analysis.created_at.desc())
        ).all()
        return [self.serialize_analysis_item(analysis) for analysis in analyses]

    @staticmethod
    def serialize_analysis_item(analysis: Analysis) -> dict:
        return {
            "id": analysis.id,
            "target_role": analysis.target_role,
            "company_name": analysis.company_name,
            "ats_score": analysis.ats_score,
            "created_at": analysis.created_at,
            "resume_name": analysis.resume.file_name,
            "job_description_title": analysis.job_description.title,
            "matched_keywords": analysis.matched_keywords,
            "missing_keywords": analysis.missing_keywords,
        }

    def serialize_analysis(self, analysis: Analysis) -> dict:
        if not analysis.score or not analysis.resume or not analysis.job_description:
            loaded_analysis = analysis
        else:
            loaded_analysis = analysis

        return {
            "id": loaded_analysis.id,
            "target_role": loaded_analysis.target_role,
            "company_name": loaded_analysis.company_name,
            "executive_summary": loaded_analysis.executive_summary,
            "resume_strength": loaded_analysis.resume_strength,
            "ats_score": loaded_analysis.ats_score,
            "score_breakdown": {
                "overall_score": loaded_analysis.score.overall_score,
                "keyword_score": loaded_analysis.score.keyword_score,
                "semantic_score": loaded_analysis.score.semantic_score,
                "formatting_score": loaded_analysis.score.formatting_score,
                "section_score": loaded_analysis.score.section_score,
                "impact_score": loaded_analysis.score.impact_score,
            },
            "semantic_score": loaded_analysis.semantic_score,
            "matched_keywords": loaded_analysis.matched_keywords,
            "missing_keywords": loaded_analysis.missing_keywords,
            "improvement_suggestions": loaded_analysis.improvement_suggestions,
            "weak_bullets": loaded_analysis.weak_bullets,
            "bullet_rewrites": loaded_analysis.bullet_rewrites,
            "section_scores": loaded_analysis.section_scores,
            "interview_questions": loaded_analysis.interview_questions,
            "recommended_certifications": loaded_analysis.recommended_certifications,
            "job_recommendations": loaded_analysis.job_recommendations,
            "created_at": loaded_analysis.created_at,
            "resume": {
                "id": loaded_analysis.resume.id,
                "file_name": loaded_analysis.resume.file_name,
                "mime_type": loaded_analysis.resume.mime_type,
                "extracted_text": loaded_analysis.resume.extracted_text,
                "parsed_sections": loaded_analysis.resume.parsed_sections,
                "skills": loaded_analysis.resume.skills,
                "word_count": loaded_analysis.resume.word_count,
                "uploaded_at": loaded_analysis.resume.uploaded_at,
            },
            "job_description": {
                "id": loaded_analysis.job_description.id,
                "title": loaded_analysis.job_description.title,
                "company_name": loaded_analysis.job_description.company_name,
                "source_type": loaded_analysis.job_description.source_type,
                "content": loaded_analysis.job_description.content,
                "skills": loaded_analysis.job_description.skills,
                "created_at": loaded_analysis.job_description.created_at,
            },
        }


analysis_service = AnalysisService()
