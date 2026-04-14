# CareerPulse

CareerPulse is a full-stack AI-powered career platform built with Next.js and Supabase. It helps professionals create tailored CVs, prepare for job interviews, and get personalized career coaching — all in one place.

---

## Features

### AI CV Generator
Generate a complete, job-specific CV from a job description and your professional profile. The AI (powered by Groq) analyzes the offer and produces a structured CV ready for export.

### Manual CV Builder
Build your CV step by step using a guided form. Choose from multiple premium templates, customize the appearance (fonts, colors, layout), and export to PDF.

### IA Career Coach
An intelligent coaching session that:
- Extracts your profile from an existing CV (PDF parsing)
- Generates a personalized quiz based on your target job
- Runs an interactive interview preparation session
- Provides feedback and suggested follow-up questions

### Authentication
- Email / Password with email confirmation
- GitHub OAuth
- Google OAuth
- Password reset via email link

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | JavaScript (ES2022+) |
| Auth & Database | Supabase |
| AI | Groq SDK (LLaMA 3) |
| PDF parsing | unpdf, pdfjs-dist |
| PDF export | html2pdf.js |
| Styling | Tailwind CSS v4 |
| Containerization | Docker + Docker Compose |

---

## Project Structure

```
careerpulse/
├── app/
│   ├── api/
│   │   ├── career/              # AI CV generation & update
│   │   ├── careerCoach/
│   │   │   ├── chat/            # Coach chat session
│   │   │   ├── extractCv/       # PDF CV extraction
│   │   │   ├── quiz/            # Quiz generation & answers
│   │   │   └── session/         # Session management
│   │   ├── chat/                # General chat
│   │   └── manualBuilder/
│   │       └── parseCV/         # CV parsing for manual builder
│   ├── auth/
│   │   ├── callback/            # OAuth & PKCE code exchange (Supabase)
│   │   └── reset-password/      # Password reset page
│   ├── login/                   # Auth page (login / signup / forgot)
│   └── page.js                  # Main app entry point
│
├── backend/
│   ├── lib/
│   │   └── supabaseServer.js    # Supabase server-side client
│   ├── prompts/                 # AI system prompts
│   ├── services/
│   │   └── aiSercive.js         # Groq API wrapper
│   └── utils/
│       └── jsonCleaner.js       # AI response sanitizer
│
├── frontend/
│   ├── components/
│   │   ├── career/              # AI CV generator UI
│   │   ├── iaCareerCoach/       # Career coach UI
│   │   ├── manualBuilder/       # Manual CV builder UI
│   │   └── ...                  # Sidebar, Chat, Landing
│   ├── data/
│   │   └── resumeTemplates.js   # CV template definitions
│   ├── lib/
│   │   └── supabaseClient.js    # Supabase browser client
│   └── utils/
│       ├── pdfExport.js         # PDF generation
│       └── letterFormatter.js   # Cover letter formatting
│
├── Dockerfile
├── docker-compose.yaml
├── middleware.js                # Supabase session refresh
└── next.config.mjs
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project
- A [Groq](https://console.groq.com) API key

### 1. Clone the repository

```bash
git clone https://github.com/your-username/careerpulse.git
cd careerpulse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file at the root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Groq AI
GROQ_API_KEY=your_groq_api_key

# App URL (used for OAuth redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Configure Supabase

#### Authentication redirect URLs

In your Supabase Dashboard → **Authentication** → **URL Configuration** → **Redirect URLs**, add:

```
http://localhost:3000/auth/callback
http://localhost:3000/auth/callback?next=/auth/reset-password
```

#### OAuth providers (optional)

**GitHub**
1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
2. Authorization callback URL: `https://<your-ref>.supabase.co/auth/v1/callback`
3. Paste Client ID & Secret in Supabase Dashboard → Authentication → Providers → GitHub

**Google**
1. Google Cloud Console → APIs & Services → Credentials → Create OAuth 2.0 Client ID
2. Authorized redirect URI: `https://<your-ref>.supabase.co/auth/v1/callback`
3. Paste Client ID & Secret in Supabase Dashboard → Authentication → Providers → Google

### 5. Run in development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Running with Docker

The application is fully containerized using a multi-stage Docker build with Next.js standalone output.

```bash
# Build and start
docker compose up --build

# In background
docker compose up --build -d

# Logs
docker compose logs -f

# Stop
docker compose down
```

> The `docker-compose.yaml` reads all variables from your `.env` file automatically.

The Dockerfile uses a 3-stage build (deps → builder → runner). The final image runs `node server.js` from `.next/standalone` — no `node_modules` copy needed, resulting in a significantly smaller image.

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-side only) |
| `GROQ_API_KEY` | Yes | Groq API key for AI features |
| `NEXT_PUBLIC_SITE_URL` | Yes | Base URL of the app (for OAuth redirects) |

---

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/career` | POST | Generate AI CV from job offer |
| `/api/career/update` | POST | Update an existing AI-generated CV |
| `/api/careerCoach/session` | POST | Create / get a coaching session |
| `/api/careerCoach/extractCv` | POST | Extract profile from uploaded PDF |
| `/api/careerCoach/quiz/generate` | POST | Generate a personalized interview quiz |
| `/api/careerCoach/quiz/[id]` | GET | Get quiz questions by session ID |
| `/api/careerCoach/quiz/answer` | POST | Submit a quiz answer |
| `/api/careerCoach/chat` | POST | Send a message to the career coach |
| `/api/manualBuilder/parseCV` | POST | Parse a PDF CV for the manual builder |
| `/auth/callback` | GET | Supabase OAuth & PKCE code exchange |

---

## Key Architecture Decisions

**`@supabase/ssr` for session management**  
Uses `createBrowserClient` / `createServerClient` from `@supabase/ssr` for proper cookie-based sessions in the Next.js App Router. Sessions are refreshed on every request via `middleware.js`.

**PKCE auth flow**  
Supabase v2 uses PKCE by default. All OAuth and password reset flows route through `/auth/callback` which exchanges the `?code=` parameter server-side before redirecting to the target page.

**Standalone Docker output**  
`next.config.mjs` sets `output: 'standalone'`. This generates a self-contained `server.js` in `.next/standalone`, removing the need to copy `node_modules` into the production image.

**`@/` path alias**  
All imports use the `@/` alias mapped to the project root, configured in `jsconfig.json`. Example: `import { getAIResponse } from '@/backend/services/aiSercive'`.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes following the existing style
4. Push and open a Pull Request

Code style: JavaScript (no TypeScript), Tailwind CSS for styling, async/await throughout, Next.js App Router conventions.

---

## License

MIT
