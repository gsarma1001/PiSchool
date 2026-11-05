# The Pi School

A responsive Next.js foundation for the Pi School website. The initial
homepage introduces the tutoring direction and clearly labels future
learning features as planned. It does not publish uncaptured testimonials,
unverified tutor details, or event information.

## Requirements

- Node.js 20.9 or newer
- npm 10 or newer

## Install and run locally

From the repository root, run:

```powershell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser. Stop the
development server with `Ctrl+C`.

No environment variables or external services are required for this
homepage. `.env.example` is provided as a placeholder for future
configuration; it contains no secrets.

## Checks

```powershell
npm run lint
npm run typecheck
npm run build
```

To serve the production build locally after building:

```powershell
npm run start
```

## Stack

| Package | Version |
|---|---|
| Next.js | 16.4.3 |
| React | 19.3.0 |
| React DOM | 19.3.0 |
| `@tailwindcss/turbopack` | 4.3.3 |
| Tailwind CSS | 4.3.3 |
| TypeScript | 5.9.3 |
| ESLint | 10.13.0 |
| `eslint-config-next` | 16.4.3 |
| `@types/node` | 20.19.43 |
| `@types/react` | 19.3.0 |
| `@types/react-dom` | 19.3.0 |

Exact resolved dependency versions are recorded in `package-lock.json`.

## Project documents

- `AGENTS.md` — permanent project rules.
- `docs/PROJECT_PLAN.md` — source plan and phase status.
- `docs/PROJECT_BRIEF.md` — initial goals and constraints.
- `docs/IMPLEMENTATION_PLAN.md` — staged implementation and exit criteria.
- `docs/CONTENT_MIGRATION.md` — content capture and reconciliation tracker.
- `docs/CURRICULUM_SCOPE.md` — future curriculum boundaries and open
  questions.

## Current scope

This is a local foundation, not a production deployment. The homepage has
no contact form, booking, student accounts, database, or AI. Content
preservation is still outstanding. Do not change the live website or
domain as part of local development.
