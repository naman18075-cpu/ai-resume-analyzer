import asyncio

from sqlalchemy import select

from app.core.config import settings
from app.db.init_db import init_db
from app.db.session import SessionLocal
from app.models.analysis import Analysis
from app.models.job_description import JobDescription
from app.models.resume import Resume
from app.models.user import User
from app.schemas.analysis import AnalysisCreateRequest
from app.schemas.user import UserCreate
from app.services.analysis_service import analysis_service
from app.services.auth_service import create_user
from app.services.nlp_service import extract_sections, extract_skills


SAMPLE_RESUME = """
SUMMARY
Senior full-stack engineer with 6+ years of experience building SaaS platforms with React, TypeScript, Python, FastAPI, PostgreSQL, Docker, and AWS.
EXPERIENCE
- Led development of a recruitment analytics dashboard used by 14 enterprise customers, improving recruiter decision speed by 31%.
- Built FastAPI and PostgreSQL services for resume parsing, scoring, and export workflows, cutting manual screening time by 60%.
- Designed reusable React and Tailwind UI systems with Framer Motion interactions for client-facing B2B products.
SKILLS
Python, FastAPI, React, TypeScript, PostgreSQL, Docker, AWS, OpenAI API, NLP, spaCy, sentence-transformers
PROJECTS
- Created an AI interview copilot that generated tailored interview questions and scorecards for technical hiring teams.
EDUCATION
B.Tech in Computer Science
"""

SAMPLE_JOB_DESCRIPTION = """
We are hiring a Senior AI Product Engineer to build intelligent workflow software for recruiting teams.
You should have strong experience with Python, FastAPI, React, PostgreSQL, Docker, AWS, OpenAI API, NLP, prompt engineering, analytics, and SaaS product delivery.
Experience building dashboards, authentication systems, semantic search, and polished client-facing interfaces is highly preferred.
"""


async def main() -> None:
    init_db()
    db = SessionLocal()

    try:
        user = db.scalar(select(User).where(User.email == "demo@resumeai.dev"))
        if not user:
            user = create_user(
                db,
                UserCreate(
                    full_name="Demo Candidate",
                    email="demo@resumeai.dev",
                    password="Password123",
                ),
            )

        admin = db.scalar(select(User).where(User.email == "admin@resumeai.dev"))
        if not admin:
            create_user(
                db,
                UserCreate(
                    full_name="Admin User",
                    email="admin@resumeai.dev",
                    password="Password123",
                ),
            )

        existing_analysis = db.scalar(select(Analysis).where(Analysis.target_role == "Senior AI Product Engineer"))
        if existing_analysis:
            return

        resume_file = settings.resume_dir / "demo-resume.txt"
        resume_file.write_text(SAMPLE_RESUME.strip(), encoding="utf-8")

        resume = Resume(
            user_id=user.id,
            file_name="demo-resume.docx",
            file_path=str(resume_file),
            mime_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            extracted_text=SAMPLE_RESUME.strip(),
            parsed_sections=extract_sections(SAMPLE_RESUME),
            skills=extract_skills(SAMPLE_RESUME),
            word_count=len(SAMPLE_RESUME.split()),
        )
        db.add(resume)

        job_description = JobDescription(
            user_id=user.id,
            title="Senior AI Product Engineer",
            company_name="Northstar Talent",
            source_type="manual",
            content=SAMPLE_JOB_DESCRIPTION.strip(),
            skills=extract_skills(SAMPLE_JOB_DESCRIPTION),
        )
        db.add(job_description)
        db.commit()
        db.refresh(resume)
        db.refresh(job_description)

        await analysis_service.create_analysis(
            db,
            user,
            AnalysisCreateRequest(
                resume_id=resume.id,
                job_description_id=job_description.id,
                target_role="Senior AI Product Engineer",
                company_name="Northstar Talent",
            ),
        )
    finally:
        db.close()


if __name__ == "__main__":
    asyncio.run(main())
