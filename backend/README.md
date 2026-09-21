# Proofly AI — Backend

Django + Django REST Framework + PostgreSQL. JWT auth. Responses are
camelCase so they match `frontend/lib/types.ts` field-for-field.

## Setup

```bash
cd backend
python3 -m venv venv
./venv/bin/pip install -r requirements.txt

cp .env.example .env   # edit DB credentials if needed

# Postgres (adjust to your setup)
sudo -u postgres psql -c "CREATE USER proofly WITH PASSWORD 'proofly' SUPERUSER;"
sudo -u postgres psql -c "CREATE DATABASE proofly_db OWNER proofly;"

./venv/bin/python manage.py migrate
./venv/bin/python manage.py seed_demo_data
./venv/bin/python manage.py createsuperuser
./venv/bin/python manage.py runserver
```

API at `http://localhost:8000/api/`, Django admin at `/admin/`.

Demo logins after seeding (password `password123` for all):
- `sara.ahmed@email.com` — consumer, has investigations/reports/disputes
- `owner@techworld-store.com` — business owner
- `moderator@proofly.ai` — moderator

## App structure

Each Django app maps to one ERD domain and one section of the frontend:

| App | Models (ERD entities) | Frontend pages it serves |
|---|---|---|
| `accounts` | Role, Permission, RolePermission, User | Login/Register, Settings |
| `businesses` | Business, BusinessVerification | Search, /business/[id], Claim |
| `investigations` | Investigation, Identifier, Evidence, RiskSignal, EvidenceConnection, AIAnalysisLog | The full investigation flow |
| `community` | CommunityReport, Review | Reports, Reviews |
| `disputes` | Dispute, DisputeMessage | Disputes |
| `notifications` | Notification | Notifications |
| `moderation` | AuditLog | Moderator queues (trimmed scope) |

`TrustReport` from the ERD is folded directly onto `Investigation`
(risk_score/risk_level/summary fields) — see the model docstring for why.

## The AI pipeline (works today, without the AI service running)

`apps/investigations/ai_client.py` calls the FastAPI AI microservice at
`AI_SERVICE_URL` for evidence extraction, risk-language detection, and
summarization. If that service is unreachable, it transparently falls back
to a local regex heuristic — so `POST /api/investigations/{id}/analyze/`
works correctly today, before the AI service exists. Once the AI service
is built, no Django code changes are needed; the real calls just start
succeeding instead of falling back.

`apps/investigations/risk_engine.py` owns the actual scoring — fixed point
weights per signal (advance payment +20, urgency +15, connections +25,
etc.), matching the BRD's "AI explains signals, never sets the score"
design. Verified end-to-end: creating an investigation with evidence
containing risk language and running `/analyze/` correctly detects
signals, computes a score, sets risk_level from thresholds, and generates
a summary.

## Key endpoints

```
POST   /api/auth/register/
POST   /api/auth/login/                       -> {access, refresh, user}
GET    /api/businesses/?q=...                  public search
GET    /api/businesses/{id}/                   public trust profile
POST   /api/investigations/                    Step 1: subject + details
POST   /api/investigations/{id}/evidence/      Step 2: add evidence
POST   /api/investigations/{id}/ai-review/     Step 3: extract (per-evidence)
POST   /api/investigations/{id}/analyze/       Step 4: risk score + summary
GET    /api/investigations/{id}/graph/         Evidence relationship graph
POST   /api/community/reports/                 Submit community report
POST   /api/disputes/{id}/messages/            Reply in a dispute thread
GET    /api/moderation/reports/                Moderator queue (IsModerator)
```

## Tested

Every endpoint above was verified via live `curl` calls against a running
Postgres database in this environment: register → login → create
investigation → add evidence → analyze (risk engine + local AI fallback)
→ post review (business rating recomputes live) → post dispute reply
(status transitions correctly) → moderator queue → audit log. See git log
for the bug found and fixed during that pass.
