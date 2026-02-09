# --- ÉTAPE 1 : Base ---
    FROM node:20-alpine AS base

    # --- ÉTAPE 2 : Dépendances ---
    FROM base AS deps
    RUN apk add --no-cache libc6-compat
    WORKDIR /app
    COPY package.json package-lock.json ./
    RUN npm ci
    
    # --- ÉTAPE 3 : Builder (La forge) ---
    FROM base AS builder
    WORKDIR /app
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    
    # On déclare les variables nécessaires au build pour éviter les erreurs "missing API key"
    ARG NEXT_PUBLIC_SUPABASE_URL
    ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
    ARG SUPABASE_SERVICE_ROLE_KEY
    ARG GROQ_API_KEY
    
    # On les rend disponibles pour le processus "npm run build"
    ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
    ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
    ENV SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY
    ENV GROQ_API_KEY=$GROQ_API_KEY
    ENV NEXT_TELEMETRY_DISABLED 1
    
    RUN npm run build
    
    # --- ÉTAPE 4 : Runner (L'image finale légère) ---
    FROM base AS runner
    WORKDIR /app
    
    ENV NODE_ENV production
    ENV NEXT_TELEMETRY_DISABLED 1
    
    RUN addgroup --system --gid 1001 nodejs
    RUN adduser --system --uid 1001 nextjs
    
    # On ne copie que le strict nécessaire pour l'exécution
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package.json ./package.json
    
    USER nextjs
    
    EXPOSE 3000
    ENV PORT 3000
    ENV HOSTNAME "0.0.0.0"
    
    CMD ["npm", "start"]