
# 1. Image de base : on utilise Node.js version 20 (version légère Alpine)
FROM node:20-alpine AS builder

# 2. Définition du dossier de travail dans le conteneur
WORKDIR /app

# 3. Installation des dépendances
# On copie d'abord les fichiers de configuration pour optimiser le cache Docker
COPY package*.json ./
RUN npm install

# 4. Copie de tout le code source
COPY . .

# 5. Préparation de Prisma
# On génère le moteur de recherche (Client) Prisma pour l'OS du conteneur
RUN npx prisma generate --schema=./backend/prisma/schema.prisma

# 6. Build de l'application Next.js
RUN npm run build

# --- Étape de Production (pour réduire la taille de l'image) ---
FROM node:20-alpine AS runner
WORKDIR /app

# On définit l'environnement sur production
ENV NODE_ENV production

# On ne copie que le strict nécessaire depuis l'étape de build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/data ./data

# 7. Exposition du port utilisé par Next.js
EXPOSE 3000

# Remplace la dernière ligne CMD par celle-ci :
CMD npx prisma migrate deploy --schema=./backend/prisma/schema.prisma && npm start