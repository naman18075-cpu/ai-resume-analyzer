# FreelancerHub Backend MVP

Backend API for a simplified freelance job bidding platform built with Node.js, Express, PostgreSQL, Sequelize, and JWT authentication.

## Features

- JWT auth with `CLIENT` and `FREELANCER` roles
- Verified client job posting toggle
- Job posting and filtered marketplace listing
- Bid system with:
  - max 5 active bids per freelancer
  - duplicate bid prevention on the same job
  - client-only accept/reject flow
- Automatic job status transitions when a bid is accepted
- Review system for completed jobs
- Admin stats endpoint using allowlisted admin emails
- Pagination and request validation
- Seed data for demo/testing

## Project Structure

```text
src/
  config/
  controllers/
  middlewares/
  models/
  routes/
  seeders/
  utils/
  validators/
```

## Environment Setup

1. Copy `.env.example` to `.env`
2. Update PostgreSQL credentials
3. Set a strong `JWT_SECRET`

## Install and Run

```bash
npm install
npm run dev
```

Production start:

```bash
npm start
```

Seed sample data:

```bash
npm run seed
```

## Important Environment Flags

- `REQUIRE_VERIFIED_CLIENTS=true`
  - when enabled, only verified clients can create jobs
- `FORCE_DB_SYNC=false`
  - set to `true` only for local resets because it recreates tables
- `ADMIN_EMAILS=admin@example.com`
  - comma-separated emails allowed to access `/api/admin/stats`

## Main API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Jobs

- `POST /api/jobs`
- `GET /api/jobs`
- `GET /api/jobs/client/:clientId`
- `GET /api/jobs/:id`
- `GET /api/jobs/my-jobs`
- `PATCH /api/jobs/:id/complete`

### Bids

- `POST /api/bids`
- `GET /api/bids/my-bids`
- `GET /api/bids/job/:jobId`
- `PATCH /api/bids/:id/accept`
- `PATCH /api/bids/:id/reject`

### Reviews

- `POST /api/reviews`

### Admin

- `GET /api/admin/stats`

## Example Request Payloads

Register:

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "Password123",
  "role": "CLIENT",
  "city": "Mumbai",
  "isVerified": true
}
```

Create job:

```json
{
  "title": "Need a React developer",
  "description": "Build a dashboard MVP with authentication and analytics screens.",
  "budgetMin": 20000,
  "budgetMax": 40000,
  "deadline": "2026-05-30",
  "skillsRequired": ["React", "Node.js", "PostgreSQL"],
  "locationPreference": "remote"
}
```

Create bid:

```json
{
  "jobId": "JOB_UUID",
  "price": 32000,
  "proposalText": "I can build this MVP with clean backend integration and deployment support.",
  "estimatedTime": "10 days",
  "matchScore": 0.82
}
```

Create review:

```json
{
  "jobId": "JOB_UUID",
  "revieweeId": "USER_UUID",
  "rating": 5,
  "comment": "Very professional and delivered excellent work."
}
```

## Seed Data Summary

After running `npm run seed`, you get:

- 3 client accounts
- 3 freelancer accounts
- 3 jobs across `OPEN`, `IN_PROGRESS`, and `COMPLETED`
- sample pending, accepted, and rejected bids
- 1 review

All seed users use:

```text
Password123
```

## Business Rules Implemented

- Only `CLIENT` users can create jobs
- Only `FREELANCER` users can create bids
- Only clients who own a job can accept/reject bids for it
- Accepting a bid:
  - sets the job to `IN_PROGRESS`
  - marks all other bids for that job as `REJECTED`
- Freelancers cannot create more than 5 active bids
- Freelancers cannot bid twice on the same job
- Reviews are allowed only after the job is `COMPLETED`
- Freelancer rating updates automatically when they receive reviews

## Notes

- The backend uses `sequelize.sync()` for MVP simplicity
- For production, prefer Sequelize migrations instead of sync-based schema management
- The existing frontend files in the workspace were left untouched, per request
