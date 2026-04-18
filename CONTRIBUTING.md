# Contributing to CareerPulse

First off — thanks for taking the time to contribute. Every PR, bug report, or idea helps.

CareerPulse is an open source AI-powered career platform built with Next.js and Supabase. We're actively looking for contributors at all levels.

---

## Table of Contents

- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Good First Issues](#good-first-issues)
- [Code Style](#code-style)
- [Branch Strategy](#branch-strategy)
- [Commit Convention](#commit-convention)
- [Architecture Overview](#architecture-overview)

---

## Getting Started

**Prerequisites:** Node.js 20+, a Supabase account, a Groq API key (free tier works).

```bash
# 1. Fork the repo, then clone your fork
git clone https://github.com/YOUR_USERNAME/career_pulse.git
cd career_pulse
git checkout session_messages   # active development branch

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# SUPABASE_SERVICE_ROLE_KEY, GROQ_API_KEY, NEXT_PUBLIC_SITE_URL

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Full setup guide in [README.md](./README.md).

---

## How to Contribute

### Reporting a Bug

Open an issue and include:
- What you did
- What you expected
- What actually happened
- Browser / OS / Node version
- Console errors if any

### Suggesting a Feature

Open an issue with the label `enhancement`. Describe the problem it solves, not just what you want built.

### Submitting a Pull Request

1. Fork → branch off `session_messages`
2. Name your branch: `feat/your-feature` or `fix/bug-description`
3. Make your changes (read [Code Style](#code-style) first)
4. Test locally
5. Open a PR against `session_messages` — not `main`
6. Describe what you changed and why

We review PRs within a few days. We'll leave comments if changes are needed.

---

## Good First Issues

New to the codebase? These are well-scoped tasks that don't require deep context:

### Beginner

- **[ ] Add loading skeleton to CareerHistory**
  The history list shows nothing while fetching. Add a skeleton loader component.
  Files: `frontend/components/career/CareerHistory.js`

- **[ ] Improve error messages on login form**
  Supabase error codes are raw strings. Map them to user-friendly French messages.
  Files: `app/login/page.js`

- **[ ] Add character counter to CareerForm textarea**
  The profile summary textarea has no feedback on length.
  Files: `frontend/components/career/CareerForm.js`

- **[ ] Add a "Copy to clipboard" button on generated CV sections**
  Let users copy individual sections (summary, work experience) as plain text.
  Files: `frontend/components/career/CareerPreview.js`

### Intermediate

- **[ ] Persist sidebar width to localStorage**
  The resizable sidebar resets to 280px on page reload. Save and restore the width.
  Files: `app/page.js`

- **[ ] Add dark mode toggle**
  Tailwind v4 supports `dark:` variants. Wire up a toggle that persists to localStorage.
  Files: `app/page.js`, `frontend/components/Sidebar.js`

- **[ ] Internationalise the app (i18n)**
  The UI is French-only. Add an English toggle using Next.js i18n or a simple context.
  Files: global — good opportunity to introduce a `locales/` directory

- **[ ] Add a "Share CV" feature**
  Generate a public read-only link for a CV stored in Supabase.
  Files: `app/api/career/`, `frontend/components/career/CareerPreview.js`, Supabase RLS

- **[ ] Rate limiting on AI API routes**
  Add request-level rate limiting (e.g. 10 requests / minute per user) to all `/api/` AI routes.
  Files: `app/api/career/route.js`, `app/api/careerCoach/`

### Advanced

- **[ ] Stripe integration for premium subscriptions**
  The `subscriptions` table is ready. Wire up Stripe Checkout for monthly/yearly plans.
  Database schema: `subscriptions` (see Supabase dashboard)
  Files: new `app/api/payments/` directory, `frontend/components/` upgrade flow

- **[ ] Add a new AI provider to the gateway**
  The gateway is designed for extension. Add Mistral, Cohere, or any OpenAI-compatible endpoint.
  Files: `backend/services/aiGateway.js` — add an adapter following the existing pattern

- **[ ] CV scoring against job description**
  Analyse how well the user's CV matches a given job offer and return a percentage score with actionable gaps.
  Files: `app/api/career/`, `backend/prompts/`

- **[ ] Streaming AI responses**
  The AI responses are returned all at once. Stream them progressively using Next.js streaming + ReadableStream.
  Files: `app/api/career/route.js`, `app/api/careerCoach/chat/route.js`

---

## Code Style

- **Language:** JavaScript (ES2022+) — no TypeScript
- **Styling:** Tailwind CSS v4 only — no inline styles except for dynamic values (resize widths, etc.)
- **Async:** `async/await` throughout — no `.then()` chains
- **Imports:** Use the `@/` alias (`@/backend/...`, `@/frontend/...`) — no relative `../../` paths
- **Comments:** Only where the logic isn't obvious — don't explain what the code does, explain why
- **Error handling:** At system boundaries (API routes, external calls) — not inside pure UI components
- **No abstractions for one-time use** — three similar lines of code is better than a premature helper

---

## Branch Strategy

| Branch | Purpose |
|---|---|
| `session_messages` | Active development — open PRs here |
| `main` | Stable — merged periodically from `session_messages` |

**Never open a PR against `main` directly.**

---

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add share CV button
fix: stop refresh token loop on CORS error
docs: update contributing guide
chore: bump dependencies
```

Keep the subject line under 72 characters. Add a body if the change needs context.

---

## Architecture Overview

```
app/api/          → Next.js route handlers (server-side only)
backend/
  services/
    aiGateway.js  → Multi-provider LLM gateway with automatic fallback
    aiSercive.js  → Public interface consumed by API routes
  prompts/        → All AI system prompts isolated here
  lib/            → Supabase server-side client
frontend/
  components/     → React components (client-side)
  lib/            → Supabase browser client
  data/           → CV template definitions
middleware.js     → Supabase session refresh on every request
```

**Key principle:** API routes call `aiSercive.js` → which calls `aiGateway.js` → which picks a provider. Adding a feature never requires touching the gateway unless you're adding a provider.

---

## Questions?

Open an issue with the label `question` or start a GitHub Discussion.

We're building this in public. Every contribution — code, design, feedback — moves it forward.
