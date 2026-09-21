# Proofly AI — Digital Trust & Online Risk Investigation Platform

## Repo layout

```
proofly-ai/
  frontend/     Next.js + TypeScript + Tailwind CSS
  backend/      Django + DRF + PostgreSQL (+ FastAPI AI service, next up)
```

**Frontend and backend are fully connected** — the frontend runs on real
data from PostgreSQL via the Django API, not mock data. See the two
README's below for setup.

## Quick start (both together)

```bash
# 1. Backend
cd backend
python3 -m venv venv && ./venv/bin/pip install -r requirements.txt
cp .env.example .env   # adjust DB creds if needed
./venv/bin/python manage.py migrate
<<<<<<< HEAD
=======
./venv/bin/python manage.py seed_demo_data
>>>>>>> dc3a9d3b223fe66be845befdf3fc26c2e119d2b2
./venv/bin/python manage.py runserver   # http://localhost:8000

# 2. Frontend (new terminal)
cd frontend
cp .env.local.example .env.local
npm install
npm run dev   # http://localhost:3000
```

<<<<<<< HEAD
Create an account at `http://localhost:3000/register` and sign in.
=======
Log in at `http://localhost:3000/login` with `sara.ahmed@email.com` /
`password123` (see `backend/README.md` for other demo accounts).
>>>>>>> dc3a9d3b223fe66be845befdf3fc26c2e119d2b2

API docs (Swagger): `http://localhost:8000/api/docs/`

## Stack

- Frontend: Next.js (App Router), TypeScript, Tailwind CSS, Server
  Actions + httpOnly-cookie JWT auth (token never reaches client JS)
- Backend: Django + Django REST Framework, JWT auth, camelCase responses
<<<<<<< HEAD
- AI Service: intentionally excluded from this repair round
=======
- AI Service: FastAPI (Python) — scaffolded, real AI integration pending
>>>>>>> dc3a9d3b223fe66be845befdf3fc26c2e119d2b2
- Database: PostgreSQL
- API docs: drf-spectacular (Swagger UI + ReDoc)
- Background jobs: Celery + Redis (planned)
- File storage: local `media/` in dev; Cloudinary/S3 in production

## Status

- [x] BRD, ERD, UI wireframes (planning phase)
- [x] Frontend — all pages (public/auth, search & trust profile,
      investigation flow, community/disputes/account)
- [x] Backend — Django project, models, DRF endpoints, JWT auth, Swagger
<<<<<<< HEAD
- [x] Frontend wired to the real backend for authentication, search,
      profiles, reviews, investigations, reports, disputes,
      notifications, settings, and PDF downloads
- [ ] AI features remain unfinished and were intentionally left untouched
=======
- [x] **Frontend wired to the real backend** — verified end-to-end via
      live Playwright runs against Postgres: register/login, search,
      full investigation flow (create → evidence → AI review → risk
      analysis → trust report), reviews, reports, disputes,
      notifications, settings — all real, no mock data
- [ ] AI service — FastAPI extraction/risk-language/similarity/summary
      with real model calls (currently a local regex fallback used by
      Django when the AI service isn't running)
>>>>>>> dc3a9d3b223fe66be845befdf3fc26c2e119d2b2

## Git workflow

`main` + `develop` + one feature/fix branch per unit of work, merged
with `--no-ff`. Run `git log --oneline --all --graph` to see the full
history.
