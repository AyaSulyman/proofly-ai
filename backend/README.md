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

## The AI pipeline

`apps/investigations/ai_client.py` calls the OpenAI Responses API using the
model configured in `OPENAI_MODEL`. It uses strict structured outputs for
evidence extraction, risk-signal classification, and neutral summaries,
including real image/screenshot input. Run `python manage.py check_ai` to
verify the key, model access, quota, network, and structured response before
testing investigations.

Proofly intentionally has no silent AI fallback. If the provider is not
available, Django returns a clear safe error and does not create a fake
analysis version. Temporary rate limits are retried briefly. The API key is
read only from the backend environment and is never included in the frontend.

`apps/investigations/risk_engine.py` owns the actual scoring — fixed point
weights per signal (advance payment +20, urgency +15, connections +25,
etc.), matching the BRD's "AI explains signals, never sets the score"
design. Evidence changes mark completed investigations for re-analysis, and
each successful run saves a provider-labelled immutable score snapshot.

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

## Verification

Run `python manage.py check`, `python manage.py test`, and
`python manage.py check_ai`. The first two are deterministic project checks;
the last command performs one real provider request and may consume a small
amount of API quota.
