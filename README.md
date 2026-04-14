# CareerPulse

CareerPulse is a full-stack AI-powered career platform built with Next.js and Supabase. It helps professionals create tailored CVs, prepare for job interviews, and get personalized career coaching — all in one place.

---

## Features

### AI CV Generator
Generate a complete, job-specific CV from a job description and your professional profile. The AI analyzes the offer and produces a structured CV ready for export.

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
| AI | AI Gateway (Groq, Claude, OpenAI, Gemini) |
| PDF parsing | unpdf, pdfjs-dist |
| PDF export | html2pdf.js |
| Styling | Tailwind CSS v4 |
| Containerization | Docker + Docker Compose |
| Deployment | Render.com |

---

## AI Gateway

The application uses a custom AI Gateway (`backend/services/aiGateway.js`) that abstracts all LLM calls behind a single interface. When a provider hits its rate limit (429) or becomes unavailable, the gateway automatically falls back to the next configured provider.

**Default priority order:**

| Priority | Provider | Model | Env var |
|---|---|---|---|
| 1 | Groq | llama-3.3-70b-versatile | `GROQ_API_KEY` |
| 2 | Claude (Anthropic) | claude-haiku-4-5 | `ANTHROPIC_API_KEY` |
| 3 | OpenAI | gpt-4o-mini | `OPENAI_API_KEY` |
| 4 | Gemini (Google) | gemini-1.5-flash | `GEMINI_API_KEY` |

A provider is silently skipped if its API key is not set. Only `GROQ_API_KEY` is required to run the app. The fallback order is customizable via `AI_PROVIDER_ORDER`.

**Fallback logic:** errors that trigger a switch to the next provider: `429` (rate limit), `503` (unavailable), `529` (overloaded), `500/502` (server errors). Any other error (e.g. `401` invalid key, malformed prompt) propagates immediately without trying the next provider.

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
│   ├── login/                   # Auth page (login / signup / forgot password)
│   └── page.js                  # Main app entry point
│
├── backend/
│   ├── lib/
│   │   └── supabaseServer.js    # Supabase server-side client
│   ├── prompts/                 # AI system prompts
│   ├── services/
│   │   ├── aiGateway.js         # Multi-provider AI gateway with fallback
│   │   └── aiSercive.js         # Public interface (routes through gateway)
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
- A [Groq](https://console.groq.com) API key (minimum required)

### 1. Clone the repository

```bash
git clone https://github.com/ulrichtoussom/career_pulse.git
cd career_pulse
git checkout session_messages
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

# App URL (used for OAuth redirects — must match your deployment URL)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# AI Gateway — primary provider (required)
GROQ_API_KEY=your_groq_api_key

# AI Gateway — fallback providers (optional, activate by adding the key)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GEMINI_API_KEY=

# AI Gateway — customize fallback order (optional)
# AI_PROVIDER_ORDER=groq,claude,openai,gemini
```

### 4. Configure Supabase

#### Authentication → URL Configuration → Redirect URLs

```
http://localhost:3000/auth/callback
http://localhost:3000/auth/callback?next=/auth/reset-password
```

#### OAuth providers (optional)

**GitHub**
1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
2. Authorization callback URL: `https://<your-ref>.supabase.co/auth/v1/callback`
3. Supabase Dashboard → Authentication → Providers → GitHub → paste Client ID & Secret

**Google**
1. Google Cloud Console → APIs & Services → Credentials → Create OAuth 2.0 Client ID
2. Authorized redirect URI: `https://<your-ref>.supabase.co/auth/v1/callback`
3. Supabase Dashboard → Authentication → Providers → Google → paste Client ID & Secret

### 5. Run in development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Running with Docker

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

The `docker-compose.yaml` reads all variables from your `.env` file automatically.

The Dockerfile uses a 3-stage build (deps → builder → runner). The final image runs `node server.js` from `.next/standalone` — no `node_modules` copy needed in the production image.

---

## Deploying on Render

1. Create a new **Web Service** on [render.com](https://render.com) and connect your GitHub repository
2. Select **Docker** as the environment
3. In **Environment → Environment Variables**, add all variables from your `.env`
4. In **Environment → Docker Build Args**, add the `NEXT_PUBLIC_*` variables (required at build time by Next.js)
5. Set `NEXT_PUBLIC_SITE_URL` to your Render URL (e.g. `https://yourapp.onrender.com`)
6. In Supabase Dashboard → Authentication → URL Configuration, add your Render URL to Redirect URLs:
   ```
   https://yourapp.onrender.com/auth/callback
   https://yourapp.onrender.com/auth/callback?next=/auth/reset-password
   ```

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-side only) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public base URL — used for OAuth redirects |
| `GROQ_API_KEY` | Yes | Groq API key (primary AI provider) |
| `ANTHROPIC_API_KEY` | No | Claude API key (fallback provider) |
| `OPENAI_API_KEY` | No | OpenAI API key (fallback provider) |
| `GEMINI_API_KEY` | No | Google Gemini API key (fallback provider) |
| `AI_PROVIDER_ORDER` | No | Comma-separated provider order (default: `groq,claude,openai,gemini`) |

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

**AI Gateway with automatic fallback**  
All LLM calls go through `backend/services/aiGateway.js`. It tries providers in order and switches to the next one on rate-limit or availability errors. Adding a new provider requires only a new adapter in the gateway — no route changes needed.

**`@supabase/ssr` for session management**  
Uses `createBrowserClient` / `createServerClient` for proper cookie-based sessions in the App Router. Sessions are refreshed on every request via `middleware.js`.

**PKCE auth flow**  
Supabase v2 uses PKCE by default. All OAuth and password reset flows go through `/auth/callback` which exchanges the `?code=` parameter server-side. The public origin is derived from `NEXT_PUBLIC_SITE_URL` (not `request.url`) to prevent Render's internal proxy address (`127.0.0.1:10000`) from leaking into redirect URLs.

**Standalone Docker output**  
`next.config.mjs` sets `output: 'standalone'`, generating a self-contained `server.js` in `.next/standalone`. The production Docker image does not need to copy `node_modules`.

**`@/` path alias**  
All imports use the `@/` alias mapped to the project root (`jsconfig.json`). Example: `import { getAIResponse } from '@/backend/services/aiSercive'`.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes
4. Push and open a Pull Request against `session_messages`

Code style: JavaScript (no TypeScript), Tailwind CSS for styling, async/await throughout, Next.js App Router conventions.

---

## License

MIT
