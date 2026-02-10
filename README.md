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


## 🚀 ICreation du fichier .env a la racine du projet 

NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anonyme
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_secret
GROQ_API_KEY=

## 🚀 Lancement Avec Docker 

docker-compose up --build

L'application sera accessible sur http://localhost:3000.

## Architecture du projet 

├── app/                  # Routes et API (Backend)
├── components/           # Composants UI React
│   └── templates/        # Les 3 styles de CV (Moderne, Epure, Creatif)
├── backend/
│   ├── lib/              # Configuration Supabase & Clients
│   └── services/         # Logique d'appel à l'IA
├── public/               # Images et assets statiques
├── Dockerfile            # Configuration pour la production (Alpine-based)
└── docker-compose.yml    # Orchestration des services


## 🌍 Déploiement sur Render.com

Service : Créez un nouveau Web Service lié à votre repo GitHub.

Environnement : Choisissez Docker.

Variables : Copiez vos variables du fichier .env dans l'onglet Environment.

Fix de Build : En raison du pré-rendu de Next.js, assurez-vous d'avoir configuré les NEXT_PUBLIC variables soit dans les Docker Build Args, soit via le fallback sécurisé implémenté dans backend/lib/supabase.js.


##  📝 Guide pour les contributeurs
Si vous souhaitez améliorer ce projet, voici les points clés :

Ajout de templates : Créez un nouveau fichier dans components/templates/ et référencez-le dans CareerModule.js.

Logique IA : Le prompt système se trouve dans app/api/career/route.js. Vous pouvez l'ajuster pour modifier le ton ou la structure du JSON retourné.

Extraction PDF : Les dépendances système (g++, make) sont déjà incluses dans le Dockerfile pour supporter les bibliothèques d'extraction natives.

--
### 💡 Note pour toi :
J'ai inclus une section **Architecture** et un **Tableau technique** pour que ton projet ait l'air très sérieux. C'est parfait si tu veux le présenter dans un portfolio ou à un recruteur. 

C'était un plaisir de t'accompagner sur ce **Career Studio**. Ton application est maintenant complète, conteneurisée et déployée ! 

**Souhaites-tu que je t'aide à rédiger le fichier `LICENSE` ou à créer une page de documentation pour les API ?**