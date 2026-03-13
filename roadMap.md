# 🚀 Career Studio (ChatWeb) - Feuille de Route

## 📑 Présentation
Career Studio est une application SaaS de gestion de carrière intelligente. Elle utilise l'IA pour analyser des profils, générer des CV optimisés et des lettres de motivation personnalisées en fonction d'offres d'emploi spécifiques.

---

## ✅ Étapes Réalisées

### 1. Architecture & Fondations
- [x] **Framework :** Initialisation de Next.js 14+ (App Router).
- [x] **Backend & Auth :** Intégration complète de Supabase (Auth, Database, Storage).
- [x] **DevOps :** Création d'un `Dockerfile` multi-étapes optimisé pour la production.
- [x] **Base de Données :** Script `init.sql` pour la structure des tables (`user_profiles`, `resumes`, `cover_letters`).

### 2. Intelligence Artificielle
- [x] **Moteur IA :** Connexion à l'API Groq (Modèle Llama 3) pour la génération de texte.
- [x] **Analyse PDF :** Extraction de texte depuis des fichiers PDF téléchargés.
- [x] **Logique métier :** Prompt engineering pour l'analyse comparative (Matching score).

### 3. Interface Utilisateur (Dashboard)
- [x] **Layout :** Dashboard interactif avec formulaire à gauche et prévisualisation à droite.
- [x] **Templates CV :** Mise en place de 3 thèmes (Moderne, Épuré, Créatif).
- [x] **Navigation :** Système d'onglets pour switcher entre CV, Lettre et Analyse.
- [x] **Export :** Fonctionnalité d'impression/export PDF via iframe.

### 4. Déploiement & Connectivité
- [x] **Hébergement :** Déploiement fonctionnel sur Render via Docker.
- [x] **OAuth :** Authentification GitHub configurée pour le local et la production.
- [x] **Dynamic Routing :** Gestion intelligente des redirections via `window.location.origin`.

---

## 🛠️ En Cours / À Venir

### 🔄 Fonctionnalités d'Édition
- [ ] **Éditeur de Lettre :** Mode édition directe du texte généré par l'IA.
- [ ] **Persistance :** Sauvegarde des modifications en base de données (UPDATE).
- [ ] **Édition de CV :** Formulaire de modification champ par champ pour le CV.

### 🚀 Optimisations
- [ ] **Multi-langues :** Support pour la génération de documents en anglais.
- [ ] **Historique :** Liste des CV et lettres précédemment générés.

---
*Dernière mise à jour : Mars 2026