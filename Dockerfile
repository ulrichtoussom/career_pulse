# ════════════════════════════════════════════════════════════════════
# ÉTAPE 1 — Base commune (image légère Alpine)
# ════════════════════════════════════════════════════════════════════
FROM node:20-alpine AS base

# ════════════════════════════════════════════════════════════════════
# ÉTAPE 2 — Installation des dépendances
# ════════════════════════════════════════════════════════════════════
FROM base AS deps

# libc6-compat  : compatibilité glibc pour certains packages natifs
# python3/make/g++ : requis pour compiler html2pdf.js et pdfjs-dist
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

COPY package.json package-lock.json ./

# npm ci : installation reproductible (respecte package-lock.json)
RUN npm ci

# ════════════════════════════════════════════════════════════════════
# ÉTAPE 3 — Build Next.js
# ════════════════════════════════════════════════════════════════════
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables publiques injectées au BUILD TIME (préfixe NEXT_PUBLIC_)
# Elles sont embarquées dans le bundle JS côté client
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SITE_URL

# Variables serveur uniquement (non exposées au client)
ARG SUPABASE_SERVICE_ROLE_KEY
ARG GROQ_API_KEY

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY
ENV GROQ_API_KEY=$GROQ_API_KEY
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ════════════════════════════════════════════════════════════════════
# ÉTAPE 4 — Runner de production (image finale minimale)
# Grâce à output:'standalone' dans next.config.mjs,
# .next/standalone contient un serveur Node.js complet sans node_modules
# ════════════════════════════════════════════════════════════════════
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Sécurité : utilisateur non-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Fichiers statiques publics
COPY --from=builder /app/public ./public

# Serveur autonome généré par Next.js standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Assets statiques (CSS, JS, images du build)
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# server.js est généré par Next.js dans le dossier standalone
CMD ["node", "server.js"]
