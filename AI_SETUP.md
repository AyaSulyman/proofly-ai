# Proofly AI setup

Proofly uses the OpenAI Responses API with structured text and image input.
The API key is server-only and is never included in this project archive.

## 1. Rotate any exposed key

If an API key was pasted into chat, email, source code, or a public issue,
revoke it in the API dashboard and create a fresh project key.

## 2. Configure Django

Copy `backend/.env.example` to `backend/.env`, then set:

```env
OPENAI_API_KEY=your_fresh_server_key
OPENAI_MODEL=gpt-5.6-luna
OPENAI_RESPONSES_URL=https://api.openai.com/v1/responses
```

Do not add this key to `frontend/.env.local`, Git, screenshots, or deployment
logs. In deployment, add the same values through the backend host's secret
environment-variable settings.

## 3. Apply the new evidence metadata migration

```powershell
cd backend
.\venv\Scripts\Activate.ps1
py manage.py migrate
```

## 4. Verify one real provider request

```powershell
py manage.py check_ai
```

Success looks like:

```text
AI provider is working: openai:gpt-5.6-luna
```

This command makes one real API request. A missing key, invalid key, exhausted
credit, unavailable model, rate limit, malformed provider response, or network
failure produces a specific error instead of a fake local result.

## 5. Run the project

Backend:

```powershell
py manage.py runserver
```

Frontend in a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`, create an investigation, add text and/or image
evidence, continue to AI Review, and confirm the analysis. Successful database
records use the provider label `openai:gpt-5.6-luna`.

## Cost and quota

The integration does not silently fall back to heuristic analysis. It also
cannot make a metered external API unlimited or inherently free. Usage is
charged to, or deducted from quota belonging to, the API project that owns the
key. Proofly caches completed evidence extraction to avoid charging again when
the AI Review page is merely reopened.
