
# Project Principale 

## Notre projet finale Se trouve sur La branche session_messages


# 🚀 Career Studio - AI-Powered Resume & Cover Letter Generator

**Career Studio** est une plateforme SaaS moderne qui transforme un profil brut ou un ancien CV PDF en un dossier de candidature professionnel (CV + Lettre de motivation) optimisé par l'Intelligence Artificielle.

---

## 🌟 Points Forts

- **Analyse de documents** : Extraction automatique de texte depuis des fichiers PDF via `unpdf`.
- **Intelligence Artificielle** : Génération de contenu ultra-personnalisé (Résumé, Expériences, Compétences) basée sur les modèles Gemini/Llama via Groq.
- **Design Professionnel** : Trois templates dynamiques (Moderne, Épuré, Créatif) conçus avec Tailwind CSS.
- **Export PDF** : Système d'impression intégré pour générer des fichiers PDF au format A4.
- **Authentification** : Gestion des utilisateurs sécurisée via Supabase (Email & GitHub OAuth).
- **Analyse de Matching** : Évaluation des points forts et des lacunes par rapport à une offre d'emploi spécifique.

---

## 🛠️ Stack Technique

| Secteur | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React, Tailwind CSS |
| **Backend** | API Routes Next.js, Supabase SSR |
| **IA** | Groq SDK (Llama 3 / Gemini) |
| **Infrastructure** | Docker, Docker Compose |
| **Déploiement** | Render.com |

---

## 🚀 Installation et Utilisation Locale

### 1. Pré-requis
- Docker et Docker Compose installés sur votre machine.
- Un compte [Supabase](https://supabase.com) et une clé API [Groq](https://console.groq.com).

### 2. Clonage du projet
```bash
git clone [https://github.com/votre-username/career-studio.git](https://github.com/votre-username/career-studio.git)
cd career-studio

```

# 🚀 Career Studio – Guide d'installation et de déploiement

## 📦 1. Création du fichier `.env`

Créez un fichier `.env` à la racine du projet et ajoutez les variables suivantes :

```bash
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anonyme
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_secret
GROQ_API_KEY=votre_groq_api_key

```

### Lamcement  du code 

docker-compose up --build

Une fois lancé, l'application sera accessible à l'adresse suivante :
http://localhost:3000

### 3. Architecture du projet 

```bash

├── app/                  # Routes et API (Backend Next.js)
├── components/           # Composants UI React
│   └── templates/        # Styles de CV (Moderne, Épuré, Créatif)
├── backend/
│   ├── lib/              # Configuration Supabase & Clients
│   └── services/         # Logique d'appel à l'IA
├── public/               # Images et assets statiques
├── Dockerfile            # Configuration de production (Alpine)
└── docker-compose.yml    # Orchestration 

```

### 🌍 4.Deploiement sur render 

Suivez les étapes suivantes pour déployer l'application :

Étape 1 : Créer un service

Créez un nouveau Web Service

Connectez votre dépôt GitHub

Étape 2 : Choisir l'environnement

Sélectionnez Docker comme environnement

Étape 3 : Configurer les variables d'environnement

Copiez les variables du fichier .env

Ajoutez-les dans l'onglet Environment

Étape 4 : Configuration du Build

En raison du pré-rendu de Next.js, assurez-vous que les variables NEXT_PUBLIC_* sont :

soit configurées dans les Docker Build Args

soit accessibles via le fallback sécurisé dans:

backend/lib/supabase.js

##
Vous pouvez le modifier pour :

changer le ton

modifier la structure du JSON

améliorer la qualité des réponses


## Support de L'Extraction PDF 

Les dépendances système nécessaires sont déjà incluses dans le Dockerfile :

g++

make

Cela permet d'utiliser des bibliothèques natives d'extraction PDF.

## informations Comp;ementaires 

Ce projet inclut :

une architecture modulaire

une conteneurisation complète avec Docker

une intégration Supabase

une intégration IA via GROQ

une structure prête pour la production

Ce projet est parfaitement adapté pour :

un portfolio développeur

une démonstration technique

un projet professionnel

## 🤝 Contribution

es contributions sont les bienvenues.

Fork le projet

Créez une branche (feature/ma-feature)

Commit vos modifications

Push la branche

Créez une Pull Request

## 📬 Support

Pour toute question ou amélioration, vous pouvez ouvrir une issue sur le repository.

Career Studio est maintenant prêt pour le développement, la conteneurisation et le déploiement 🚀

