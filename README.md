# Proofly AI — Digital Trust & Online Risk Investigation Platform

## Repo layout

```
proofly-ai/
  frontend/     Next.js + TypeScript + Tailwind CSS  (implemented)
  backend/      Django + DRF + FastAPI AI service     (next up)
```

See `frontend/README.md` for setup instructions and architecture notes.

## Stack

- Frontend: Next.js (App Router), TypeScript, Tailwind CSS
- Backend: Django + Django REST Framework, JWT auth
- AI Service: FastAPI (Python), called internally by the Django backend
- Database: PostgreSQL
- Background jobs: Celery + Redis
- File storage: Cloudinary / S3-compatible

## Status

- [x] BRD, ERD, UI wireframes (planning phase)
- [x] Frontend — public/auth pages, search & trust profile, investigation
      flow, community/disputes/account (30-page trimmed scope)
- [ ] Backend — Django project, models, DRF endpoints
- [ ] AI service — FastAPI extraction/risk-language/similarity/summary
- [ ] Wire frontend to real API (replace `lib/mock-data.ts`)
