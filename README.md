# Proofly AI

Proofly is a full-stack trust and online-risk investigation platform. The frontend is Next.js and TypeScript; the API is Django REST Framework with PostgreSQL, JWT authentication, camelCase JSON, auditable AI analysis, deterministic scoring, and protected public-website inspection.

## Project layout

```text
proofly-ai/
  backend/   Django API, scoring, AI orchestration, website scanner
  frontend/  Next.js application
```

## Run the complete project

Prerequisites: Python 3.12+, Node.js 20+, npm, and PostgreSQL.

### 1. Database

Create a PostgreSQL database and user matching `backend/.env.example`, or change those values to your own credentials.

### 2. Django API

Windows PowerShell:

```powershell
cd backend
py -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

macOS/Linux:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

### 3. Next.js frontend

In a second terminal:

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

On Windows PowerShell use `Copy-Item .env.local.example .env.local` instead of `cp`.

Open `http://localhost:3000`. API documentation is at `http://127.0.0.1:8000/api/docs/` and administration is at `http://127.0.0.1:8000/admin/`.

## AI configuration

Proofly uses the OpenAI Responses API for real text and image evidence analysis. Copy `backend/.env.example` to `backend/.env`, create a fresh server-side API key, and set:

```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5.6-luna
```

Never commit or expose the key in the frontend. Run a real provider health check before starting UI testing:

```bash
python manage.py check_ai
```

There is no silent model fallback. Missing credentials, exhausted credit, invalid model access, rate limits, and provider outages are returned as clear API/UI errors, so a local heuristic can never be mistaken for a real model result.

The model identifies candidate evidence signals and writes a neutral explanation. It never chooses the numerical risk score. The Django risk engine owns fixed weights, thresholds, score history, and the 0–100 result.

## Updating an investigation

Open a completed investigation and choose **Update evidence**. Adding or removing evidence/identifiers marks the report as needing re-analysis. Continue to **AI Review**, run the analysis again, and Proofly stores a new immutable score version. Because automatic signals are rebuilt from the current evidence, the new percentage can increase, decrease, or stay unchanged.

For website or business checks, include a full public URL. The scanner supports publicly reachable websites worldwide, follows validated redirects, blocks private/local/reserved addresses, limits downloads, and records HTTPS/TLS and security-header findings. A website result is a risk indicator, not a guarantee that an organization is safe or fraudulent.

## Verification

```bash
cd backend
python manage.py check
python manage.py test

cd ../frontend
npm run build
```

Keep `API_URL=http://127.0.0.1:8000` in `frontend/.env.local` so server-side Next.js requests reach Django correctly.
