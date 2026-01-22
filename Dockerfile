FROM node:20-alpine AS builder
WORKDIR /app

# --- SOLUTION ICI ---
# On définit l'URL SANS guillemets superflus pour que Prisma ne s'y perde pas
ENV DATABASE_URL=file:/app/data/app.db
# --------------------

COPY package*.json ./
RUN npm install
COPY . .

# On génère le client avec cette variable bien définie
RUN npx prisma generate --schema=./backend/prisma/schema.prisma
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# On redéfinit pour l'exécution également
ENV DATABASE_URL=file:/app/data/app.db

COPY --from=builder /app ./

RUN mkdir -p /app/data

EXPOSE 3000

# Commande de lancement
CMD npx prisma migrate deploy --schema=./backend/prisma/schema.prisma && npm start