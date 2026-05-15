from fastapi import APIRouter, Depends, File, Form, Request, UploadFile
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.limiter import limiter
from app.db.session import get_db
from app.models.job_description import JobDescription
from app.models.resume import Resume
from app.models.user import User
from app.schemas.analysis import JobDescriptionResponse, ResumeUploadResponse
from app.services.file_parser import parse_job_description_input, parse_resume_upload
from app.services.nlp_service import extract_sections, extract_skills


router = APIRouter(prefix="/uploads", tags=["Uploads"])


@router.post("/resume", response_model=ResumeUploadResponse)
@limiter.limit("10/minute")
async def upload_resume(
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ResumeUploadResponse:
    del request
    file_path, extracted_text, mime_type = parse_resume_upload(file)
    parsed_sections = extract_sections(extracted_text)
    skills = extract_skills(extracted_text)

    resume = Resume(
        user_id=current_user.id,
        file_name=file.filename or "resume.pdf",
        file_path=file_path,
        mime_type=mime_type,
        extracted_text=extracted_text,
        parsed_sections=parsed_sections,
        skills=skills,
        word_count=len(extracted_text.split()),
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return ResumeUploadResponse.model_validate(resume)


@router.post("/job-description", response_model=JobDescriptionResponse)
@limiter.limit("12/minute")
async def upload_job_description(
    request: Request,
    title: str = Form(...),
    company_name: str | None = Form(default=None),
    text: str | None = Form(default=None),
    file: UploadFile | None = File(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> JobDescriptionResponse:
    del request
    content, source_type = parse_job_description_input(text, file)
    job_description = JobDescription(
        user_id=current_user.id,
        title=title,
        company_name=company_name,
        source_type=source_type,
        content=content,
        skills=extract_skills(content),
    )
    db.add(job_description)
    db.commit()
    db.refresh(job_description)
    return JobDescriptionResponse.model_validate(job_description)
