import io
from pathlib import Path
from uuid import uuid4

import fitz
from docx import Document
from fastapi import HTTPException, UploadFile, status

from app.core.config import settings
from app.utils.text import normalize_text


ALLOWED_RESUME_EXTENSIONS = {".pdf", ".docx"}
ALLOWED_JOB_DESCRIPTION_EXTENSIONS = {".txt", ".md", ".pdf", ".docx"}


def _read_upload_bytes(upload: UploadFile, max_size_mb: int) -> bytes:
    content = upload.file.read()
    max_bytes = max_size_mb * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds {max_size_mb}MB limit",
        )
    return content


def _validate_extension(filename: str, allowed_extensions: set[str]) -> str:
    extension = Path(filename).suffix.lower()
    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type: {extension or 'unknown'}",
        )
    return extension


def _write_bytes(directory: Path, original_name: str, content: bytes) -> Path:
    extension = Path(original_name).suffix.lower()
    file_name = f"{uuid4()}{extension}"
    target = directory / file_name
    target.write_bytes(content)
    return target


def _extract_pdf_text(content: bytes) -> str:
    with fitz.open(stream=content, filetype="pdf") as document:
        return "\n".join(page.get_text() for page in document)


def _extract_docx_text(content: bytes) -> str:
    document = Document(io.BytesIO(content))
    return "\n".join(paragraph.text for paragraph in document.paragraphs if paragraph.text.strip())


def _extract_txt_text(content: bytes) -> str:
    return content.decode("utf-8", errors="ignore")


def parse_resume_upload(upload: UploadFile) -> tuple[str, str, str]:
    _validate_extension(upload.filename or "", ALLOWED_RESUME_EXTENSIONS)
    content = _read_upload_bytes(upload, settings.max_resume_size_mb)
    extension = Path(upload.filename or "").suffix.lower()

    if extension == ".pdf":
        text = _extract_pdf_text(content)
        mime_type = "application/pdf"
    else:
        text = _extract_docx_text(content)
        mime_type = (
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )

    cleaned = normalize_text(text)
    if len(cleaned) < 40:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Resume content is too short")

    path = _write_bytes(settings.resume_dir, upload.filename or "resume.pdf", content)
    return str(path), cleaned, mime_type


def parse_job_description_input(
    text: str | None,
    upload: UploadFile | None,
) -> tuple[str, str]:
    if text and normalize_text(text):
        cleaned = normalize_text(text)
        return cleaned, "manual"

    if not upload:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provide either pasted job description text or a supported file",
        )

    _validate_extension(upload.filename or "", ALLOWED_JOB_DESCRIPTION_EXTENSIONS)
    content = _read_upload_bytes(upload, settings.max_jd_size_mb)
    extension = Path(upload.filename or "").suffix.lower()

    if extension == ".pdf":
        extracted = _extract_pdf_text(content)
    elif extension == ".docx":
        extracted = _extract_docx_text(content)
    else:
        extracted = _extract_txt_text(content)

    cleaned = normalize_text(extracted)
    if len(cleaned) < 40:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description content is too short",
        )

    _write_bytes(settings.job_description_dir, upload.filename or "job-description.txt", content)
    return cleaned, "file"
