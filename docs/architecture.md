# Architecture Overview

AI Resume Analyzer is split into a Vite-powered React frontend and a FastAPI backend backed by PostgreSQL.

## High-Level Flow

1. Users authenticate with JWT-based access tokens.
2. Resumes are uploaded as PDF or DOCX files and parsed with PyMuPDF or `python-docx`.
3. Job descriptions are ingested through pasted text or uploaded files.
4. The analysis service extracts skills, compares resume and JD signals, computes semantic similarity, and generates ATS scoring.
5. OpenAI augments the heuristics with richer summaries, bullet rewrites, interview questions, and role recommendations.
6. Results are stored in PostgreSQL and visualized in the dashboard, history views, admin analytics, and template studio.

## Core Backend Modules

- `app/api/v1/endpoints`: Route handlers for auth, uploads, analyses, dashboard, and admin.
- `app/services/file_parser.py`: PDF, DOCX, and text parsing with validation and storage.
- `app/services/nlp_service.py`: Skill extraction, semantic similarity, section scoring, bullet analysis, and role recommendations.
- `app/services/analysis_service.py`: Main orchestration layer that turns uploads into persisted analysis records.
- `app/services/openai_service.py`: Optional OpenAI augmentation with safe fallbacks when no API key is provided.
- `app/services/pdf_service.py`: Exportable analysis reports.

## Database Entities

- `users`: Accounts, roles, and analysis counters.
- `resumes`: Uploaded files, extracted text, parsed sections, and extracted skills.
- `job_descriptions`: Target roles, company context, and parsed job requirements.
- `analyses`: Stored ATS evaluations, summaries, gaps, rewrites, and recommendations.
- `scores`: Numerical breakdowns for keyword, semantic, formatting, section, and impact metrics.
- `api_usage_logs`: Lightweight request tracking for the admin console.

## Frontend Experience

- Marketing landing page for public acquisition.
- Protected application shell with sidebar navigation, dark mode, and responsive layouts.
- Analysis workspace for upload, JD entry, report generation, and PDF export.
- History and admin analytics with Recharts.
- Resume Studio for template previews, bullet rewrites, certifications, and interview questions.
