# API Reference

Base URL: `http://localhost:8000/api/v1`

Interactive docs are available at `http://localhost:8000/docs`.

## Auth

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`

## Uploads

- `POST /uploads/resume`
  - Multipart form with `file`
- `POST /uploads/job-description`
  - Multipart form with:
    - `title`
    - `company_name` optional
    - `text` optional
    - `file` optional

## Analyses

- `POST /analyses`
  - JSON body:
    ```json
    {
      "resume_id": "uuid",
      "job_description_id": "uuid",
      "target_role": "Senior AI Product Engineer",
      "company_name": "Northstar Talent"
    }
    ```
- `GET /analyses`
- `GET /analyses/{analysis_id}`
- `GET /analyses/{analysis_id}/export`

## Dashboard

- `GET /dashboard/overview`

## Admin

- `GET /admin/overview`

## Health

- `GET /health`

## Response Highlights

Analysis responses include:

- ATS score
- score breakdown
- matched and missing keywords
- executive summary
- weak bullets and rewrites
- section scoring
- interview questions
- certifications
- job recommendations
