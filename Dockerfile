# --- ÉTAPE 1 : Base ---
    FROM node:20-alpine AS base

    # --- ÉTAPE 2 : Dépendances ---
    FROM base AS deps
    # Ajout de dépendances pour les paquets natifs potentiels (utile pour le PDF/Canvas)
    RUN apk add --no-cache libc6-compat python3 make g++
    WORKDIR /app
    COPY package.json package-lock.json ./
    # Installation propre
    RUN npm ci
    
    # --- ÉTAPE 3 : Builder ---
    FROM base AS builder
    WORKDIR /app
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    
    # Variables de build (Indispensables pour Next.js au moment du build)
    ARG NEXT_PUBLIC_SUPABASE_URL
    ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
    ARG SUPABASE_SERVICE_ROLE_KEY
    ARG GROQ_API_KEY
    
    ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
    ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
    ENV SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY
    ENV GROQ_API_KEY=$GROQ_API_KEY
    ENV NEXT_TELEMETRY_DISABLED 1
    
    # Build de l'application
    RUN npm run build
    
    # --- ÉTAPE 4 : Runner ---
    FROM base AS runner
    WORKDIR /app
    
    ENV NODE_ENV production
    ENV NEXT_TELEMETRY_DISABLED 1
    
    # Sécurité : création d'un utilisateur non-root
    RUN addgroup --system --gid 1001 nodejs
    RUN adduser --system --uid 1001 nextjs
    
    # Copie des fichiers essentiels
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package.json ./package.json
    
    USER nextjs
    
    EXPOSE 3000
    ENV PORT 3000
    ENV HOSTNAME "0.0.0.0"
    
    # Démarrage
    CMD ["npm", "start"]