# 🚀 Import CV & Export PDF - Guide Complet

## 📋 Nouvelles Fonctionnalités

Trois fonctionnalités majeures ajoutées à votre CV Builder :

### 1️⃣ **Import de CV**
Importez votre CV existant et transformez-le automatiquement en JSON Resume

### 2️⃣ **Modification Complète**
Utilisez votre formulaire dédié pour modifier tous les détails

### 3️⃣ **Export PDF Fonctionnel**
Téléchargez votre CV en PDF avec le template et l'apparence choisis

---

## 📤 **IMPORT DE CV**

### Comment Importer ?

1. **Sur la page d'accueil**, cliquez sur **"📤 Importer un CV Existant"**
2. **Choisissez votre fichier** (TXT de préférence)
3. **Le système parse automatiquement** votre CV
4. **Les données sont chargées** dans le formulaire

### Format Supporté

#### ✅ **Format Recommandé : TXT**
```
Votre Nom
Expert en JavaScript et React

Email: vous@email.com
Téléphone: +33 6 XX XX XX XX
Portfolio: https://portfolio.com

EXPÉRIENCE PROFESSIONNELLE
Poste de Chef de Projet
Entreprise ABC
2023-01 à 2024-01
Description de vos réalisations

FORMATION & DIPLÔMES
Diplôme en Informatique
École XYZ
2020-09 à 2023-06

COMPÉTENCES
JavaScript, React, Node.js, Python

LANGUES
Français - Native speaker
```

#### ℹ️ **Format Alternatif : PDF/DOCX**
- Convertissez d'abord en TXT
- Les systèmes de reconnaissance PDF nécessitent des dépendances externes

### Ce qui est Parsé

✅ **Informations Basiques**
- Nom (première ligne)
- Email (regex automatique)
- Téléphone (regex française)
- URL (detection automatique)
- Profils LinkedIn/GitHub

✅ **Sections**
- Expérience Professionnelle
- Formation & Diplômes
- Compétences
- Langues

ℹ️ **Note**: Le parsing est basique. Vérifiez et complétez les détails après import.

---

## 📝 **MODIFIER APRÈS IMPORT**

Après import, vous avez accès à:

### **Tab Contenu**
- 13 sections complètes à remplir
- Titres personnalisables (✏️)
- Texte en gras (**texte**)
- Tous les champs JSON Resume

### **Tab Apparence**
- 8 templates au choix
- Couleurs, polices, espacement
- Styles de headers variés
- Aperçu live en temps réel

---

## 📥 **EXPORT PDF FONCTIONNEL**

### Comment Exporter ?

1. **Sur le preview**, localisez le bouton **"⬇ Télécharger PDF"** (vert)
2. **Cliquez pour télécharger**
3. **Le PDF s'ouvre** dans votre dossier de téléchargement
4. Nommé : `[VotreNom].pdf`

### Options d'Export

**Bouton Export PDF:**
- Localisation: Haut du preview (desktop et mobile)
- Couleur: Vert (#16a34a)
- État: Disabled pendant le chargement (⏳)
- Nom du fichier: Automatiquement `[Votre Nom].pdf`

### Configuration du PDF

```javascript
Options actuelles:
- Format: A4 (Portrait)
- Marges: 10mm
- Qualité image: 98%
- Résolution: 2x (haute qualité)
- Fond: Blanc
```

### Qualité du PDF

✅ **Haute Qualité Garantie**
- Preservation des couleurs
- Polices embeddées
- Images haute résolution
- Mise en page exacte A4
- Responsive: adapté à l'impression

---

## 🔄 **Workflow Complet**

```
┌─ Accueil
│
├─ Importer un CV existant
│  └─ Sélectionner fichier TXT
│     └─ Parser automatique
│        └─ Données chargées
│           └─ Sélectionner un template
│              └─ Entrer en édition
│                 │
│                 ├─ Tab Contenu
│                 │  ├─ Éditer les champs
│                 │  ├─ Personnaliser titres (✏️)
│                 │  └─ Ajouter du gras (**)
│                 │
│                 ├─ Tab Apparence
│                 │  ├─ Changer template
│                 │  ├─ Couleurs/polices
│                 │  └─ Espacement
│                 │
│                 └─ Exporter en PDF
│                    └─ ⬇ Télécharger PDF
│
└─ Ou Créer de zéro
   └─ Choisir template
      └─ Remplir formulaire
         └─ Exporter PDF
```

---

## 💾 **Téléchargement du PDF**

### Où est le fichier ?

**Desktop:**
```
Windows: C:\Users\[Utilisateur]\Downloads\
Mac: /Users/[Utilisateur]/Downloads/
Linux: ~/Downloads/
```

**Nom du fichier:**
```
[VotreNom].pdf

Exemple:
Jean Dupont.pdf
Marie Martin.pdf
```

### Vérification du PDF

✅ **Le PDF doit contenir:**
- Tous vos détails (nom, email, téléphone)
- Toutes vos sections (expérience, formation, compétences)
- Votre template choisi (colors, fonts, spacing)
- Votre mise en page personnalisée
- Du texte en gras si ajouté

---

## 🎨 **Templates & Export**

Chaque template exporte magnifiquement:

| Template | Export | Parfait Pour |
|----------|--------|-------------|
| Classic Pro | Noir/Or classique | Financiers, juristes |
| Modern Blue | Bleu vibrant | Tech, startups |
| Minimalist | Épuré noir/gris | Académique |
| Tech Developer | Noir/Bleu + 2 col | Développeurs |
| Creative Edge | Rose gradient | Designers |
| Executive | Bleu marine luxe | Dirigeants |
| Startup Vibes | Orange accent | Entrepreneurs |
| Academic | Bleu académique | Chercheurs |

**Tous les PDFs:**
- A4 Portrait
- Marges optimales
- Impression professionnelle
- Copie exacte du preview

---

## ⚙️ **Configuration Technique**

### Installation (déjà fait)
```bash
npm install html2pdf.js
```

### Fichiers Ajoutés

```
frontend/
├── components/
│   └── manualBuilder/
│       ├── ImportCV.js          # Composant import
│       └── TemplateSelector.js  # Intégration import
├── utils/
│   └── pdfExport.js            # Fonctions export PDF
└── data/
    └── resumeTemplates.js       # (déjà existant)
```

### Fonction Export

```javascript
import { exportToPDF } from '@/frontend/utils/pdfExport';

exportToPDF('resume-preview', 'monCV.pdf');
```

---

## 🐛 **Troubleshooting**

### L'export PDF ne fonctionne pas ?
```
✓ Vérifiez que html2pdf.js est installé (npm list html2pdf)
✓ Assurez-vous d'avoir du contenu dans le formulaire
✓ Vérifiez la console (F12) pour les erreurs
✓ Réessayez après un rechargement (Ctrl+F5)
```

### Le parsing du CV n'a pas trouvé tout ?
```
✓ Les infos manquantes: editez manuellement
✓ Utilisez le format TXT pour meilleur résultat
✓ Une ligne par élément (email, téléphone, etc)
✓ Laissez des espaces entre les sections
```

### Le PDF s'affiche mal ?
```
✓ Vérifiez votre navigateur (Chrome recommandé)
✓ Les marges et espacement: modifiables en "Apparence"
✓ Les polices: choisissez les fonts standards
✓ Les images: max 2MB pour performance
```

---

## 🚀 **Prochaines Améliorations**

Futures fonctionnalités possibles:
- [ ] Support PDF/DOCX direct avec extraction avancée
- [ ] Import depuis LinkedIn
- [ ] Historique des modifications (Undo/Redo)
- [ ] Sauvegarde en localStorage
- [ ] Partage du CV via lien
- [ ] Modèles de cover letter
- [ ] Import de templates personnalisés

---

## 📞 **Support**

**Si quelque chose ne fonctionne pas:**

1. Vérifiez la console (F12 → Console)
2. Rechargez la page (Ctrl+F5)
3. Essayez un autre navigateur
4. Testez avec un fichier TXT simple

---

**Votre CV Builder est maintenant complet avec import & export ! 🎉**
