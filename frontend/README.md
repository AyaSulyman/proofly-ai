# Proofly AI — Frontend

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Structure

```
app/
  page.tsx                     Landing page
  login/ register/             Auth pages
  forgot-password/ reset-password/ verify-email/
  not-found.tsx                 404
  access-denied/                 403 equivalent
  search/                       Search results
  business/[id]/                Public trust profile (business/seller)
  business/claim/               Claim-a-business entry point
  (app)/                        Authenticated app shell (sidebar + topbar)
    investigations/             List, new (subject+details), evidence,
                                 AI review, [id] (trust report / read-only)
    reports/                    My reports, new report, [id] detail
    disputes/                   List, [id] thread
    notifications/
    settings/                   Profile + Security tabs

components/
  ui/                           Design-system primitives (Button, Badge,
                                 Card, Input, Avatar, RiskRing, StepIndicator…)
  layout/                       SiteHeader/Footer, AuthShell, AppShell

lib/
  types.ts                      TypeScript types mirroring the ERD
  mock-data.ts                  Placeholder data standing in for the
                                 Django REST API until it's connected
  utils.ts                      cn(), avatar color/initials helpers, dates
```

## Business / seller profile images

`components/ui/avatar.tsx` is the single component responsible for
rendering a business, seller, or user photo everywhere in the app (search
results, trust profiles, investigation cards, review authors, account
settings). It takes `src` (the uploaded photo URL, i.e. what the Django
`Business`/`User` serializer will return as `imageUrl`) and `name`:

- If `src` is set and loads successfully → renders the real photo.
- If `src` is missing, or the image fails to load → falls back to a
  deterministic colored initials avatar (same business always gets the
  same color), so the UI never shows a broken image icon.

`lib/mock-data.ts` currently seeds some businesses with a placeholder
generated avatar (via api.dicebear.com) to preview the "has a photo" state,
and others with `imageUrl: null` to preview the fallback. Once the backend
is connected, swap the `businesses`/`investigations`/`currentUser` mock
arrays for real `fetch()` calls to the Django API — the component and page
code don't need to change.

## Connecting the real backend

Every page that currently imports from `lib/mock-data.ts` is written so
that data source is the only thing that needs to change (e.g. `const
businesses = await fetch(...).then(r => r.json())` inside the relevant
Server Component). Env vars for the API base URL should go in `.env.local`
as `NEXT_PUBLIC_API_URL` once the Django backend exists.
