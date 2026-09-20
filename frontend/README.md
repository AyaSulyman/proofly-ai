# Proofly AI — Frontend

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4. Fully connected
to the real Django API — no mock data.

## Setup

```bash
cd frontend
cp .env.local.example .env.local   # sets API_URL=http://localhost:8000
npm install
npm run dev
```

Open http://localhost:3000. Requires the Django backend running at
`API_URL` (see `../backend/README.md`).

Log in with a seeded demo account, e.g. `sara.ahmed@email.com` /
`password123`.

## Structure

```
app/
  page.tsx                     Landing page
  login/ register/             Real JWT auth (Route Handlers set httpOnly cookies)
  forgot-password/ reset-password/ verify-email/
  not-found.tsx                 404
  access-denied/                 403 equivalent
  search/                       Real search results
  business/[id]/                Public trust profile + live review posting
  business/claim/               Real business creation (auth-gated)
  (app)/                        Authenticated app shell (sidebar + topbar)
    investigations/             List, new, [id]/evidence, [id]/review,
                                 [id] (trust report / read-only) — all real
    reports/                    Real list/detail/submit
    disputes/                   Real thread, reply/resolve
    notifications/               Real list, mark-read
    settings/                   Real profile/security/2FA
  api/auth/                     Route Handlers: login/register/logout
                                 (proxy to Django, set httpOnly cookies)
  api/investigations-list/      Thin proxy for client-side dropdowns

components/
  ui/                           Design-system primitives
  layout/                       SiteHeader/Footer, AuthShell, AppShell,
                                 SignOutButton

lib/
  types.ts                      TypeScript types mirroring the ERD
  session.ts                    Server-only: reads the JWT from the
                                 httpOnly cookie, apiFetch()/publicFetch()
                                 wrappers used by every Server Component
  mock-data.ts                  No longer used anywhere — kept only as a
                                 reference for the original data shapes
  utils.ts                      cn(), avatar color/initials helpers, dates

proxy.ts                        Route protection (Next 16's renamed
                                 middleware.ts) — guards /investigations,
                                 /reports, /disputes, /notifications,
                                 /settings; redirects signed-in users
                                 away from /login, /register
```

Each authenticated section also has a colocated `actions.ts` ("use
server" functions) that Client Components call directly — e.g.
`app/(app)/investigations/actions.ts` has `createInvestigation`,
`addFileEvidence`, `runAiReview`, `analyzeInvestigation`. These are the
only place JWTs are used to talk to Django; the token never reaches
client-side JS.

## Business / seller profile images

`components/ui/avatar.tsx` renders a business/seller/user photo
everywhere in the app. It reads `imageUrl` from the real API response
and `isIndividual` to decide shape (circle for a person, rounded-square
for a company). If `imageUrl` is null or the image fails to load, it
falls back to a deterministic colored-initials avatar — verified live
against seeded businesses that do and don't have a photo.

## Auth architecture

JWT access/refresh tokens live in httpOnly cookies set by
`app/api/auth/{login,register,logout}`. Server Components and Server
Actions read them via `lib/session.ts` (`next/headers` `cookies()`) and
attach `Authorization: Bearer <token>` when calling Django — the token
is never exposed to browser JS, unlike a typical localStorage approach.
`proxy.ts` redirects unauthenticated requests to protected routes.

## Verified working end-to-end

Login → search → business profile + live review → create investigation
→ add evidence (file/URL/text) → AI review (real extraction) → analyze
(real risk engine, detected real risk language and scored correctly) →
trust report → submit community report → dispute reply → notifications
→ settings update — all tested via live Playwright runs against a real
PostgreSQL database, not just code review.
