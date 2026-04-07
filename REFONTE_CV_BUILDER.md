# Refonte Application CV Builder

## 🎯 Nouvelles Fonctionnalités

### 1. **Sélecteur de Templates avec Designs Uniques**
- **4 templates prédéfinis** au format JSON Resume avec layouts propres :
  - ✨ **Moderne** : Bleu moderne, Inter, 11pt, espacement normal
  - 🎩 **Élégant** : Gris foncé classique, Georgia, 12pt, espacement large
  - 🎨 **Créatif** : Rose créatif, Inter, 11pt, espacement compact
  - ◽ **Minimaliste** : Noir pur, Courier New, 10pt, espacement minimal

#### Chaque template charge ses propres paramètres de design !
- Couleur primaire spécifique
- Typographie prédéfinie
- Espacement pré-calibré
- Impossible de confondre les résultats

#### ✨ Switcher entre Templates
- Bouton **"🎨 Template"** toujours visible dans le panneau
- Modal élégante avec aperçu de tous les templates
- Conserve vos données tout en changeant de style
- Voir les différences en temps réel

### 2. **Édition des Titres de Sections**
- ✏️ **Modifier chaque titre** : "Formation" → "Éducation", "Expériences Professionnelles" → "Expérience"
- Cliquez sur le crayon **✏️** pour éditer (apparaît au survol)
- Les modifications s'appliquent instantanément au PDF
- Réinitialisez avec les titres par défaut quand vous le souhaitez

### 3. **Texte en Gras dans le Formulaire**
- **Mettez du texte en gras** : Entourez avec `**texte**`
  - Exemple: "Vous êtes **expert** en JavaScript" → "Vous êtes **expert** en JavaScript"
- Bouton **B** pour formater le texte sélectionné rapidement
- Le gras s'affiche correctement dans l'aperçu PDF
- Fonctionne dans tous les champs de texte

### 4. **Appearance Settings Amélioré**
Contrôle complet du design avec :

#### 🎨 Couleurs
- 9 couleurs prédéfinies (spécifiques au template sélectionné)
- Sélecteur couleur personnalisé
- Aperçu en temps réel

#### ✍️ Typographie
- 4 polices d'écriture disponibles
- Taille de police ajustable (8pt - 14pt)
- Interligne configurable (1 - 2)
- Aperçu live de la typographie

#### 📐 Espacement
- Marges verticales (20px - 80px)
- Marges horizontales (30px - 80px)
- Espacement entre sections (12px - 40px)
- Tous les sliders avec feedback temps réel

#### 🔄 Réinitialisation
- Bouton pour revenir aux paramètres par défaut du template actuel

### 5. **Responsive Design Amélioré**
- **Desktop (≥768px)** : Layout classique avec panneau latéral + button Template
- **Tablet/Mobile (<768px)** : 
  - Menu hamburger collapsible
  - Tabs pour Contenu/Apparence
  - Preview optimisée
  - Navigation intuitive
  - Modal Template accessible même en mobile

## 📁 Structure des Fichiers

```
frontend/
├── data/
│   └── resumeTemplates.js          # Données templates + layouts UNIQUES par template
├── components/
│   ├── manualBuilder/
│   │   ├── ResumeBuilder.js        # 🔄 MODIFIÉ - Responsive + Template Switcher
│   │   ├── TemplateSelector.js     # Sélection initiale des templates
│   │   ├── ResumeForm.js           # 🔄 MODIFIÉ - Titres éditables + texte gras
│   │   └── ResumePreview.js        # 🔄 MODIFIÉ - Support du gras + titres personnalisés
│   └── career/
│       └── AppearanceSettings.js   # Contrôles d'apparence avancés
```

## 🎮 Utilisation

### Étape 1 : Sélectionner un Template Initial
```
- Ouvrir ResumeBuilder
- Choisir parmi 4 templates
- Chaque template charge son propre style
```

### Étape 2 : Éditer le Contenu & Titres
```
- Tab "Contenu"
- 13 sections collapsibles
- Modification temps réel
- ✏️ Cliquez sur le crayon pour éditer les titres de section
- Utilisez **texte** pour mettre en gras
```

### Étape 3 : Changer de Template
```
- Cliquez sur "🎨 Template" (toujours visible)
- Voir tous les designs disponibles
- Cliquez pour switcher instantanément
- Vos données sont conservées !
```

### Étape 4 : Personnaliser le Design
```
- Tab "Apparence"
- Ajuster couleurs, polices, espacement
- Aperçu live à chaque changement
- Réinitialiser si besoin
```

## 🎯 Cas d'Usage Exemple

1. **Utilisateur choisit "Moderne"** → Bleu, Inter, espacement normal
2. **Édite son CV** → Ajoute du gras avec `**chef de projet**`
3. **Renomme "Formation"** → En "Éducation" via ✏️
4. **Clique "Template"** → Voit "Élégant" dans la modal
5. **Switche vers "Élégant"** → Tout change en Georgia/Gris, données intactes
6. **Affiche PDF** → Gras, titres custom, style nouveau ✨

## 📋 Détails Techniques

### Template Layouts Uniques
Chaque template inclut son propre objet layout dans `templateLayouts`:

```javascript
templateLayouts = {
  modern: { fontSize: 11, primaryColor: '#2563eb', fontFamily: 'Inter', ... },
  elegant: { fontSize: 12, primaryColor: '#1f2937', fontFamily: 'Georgia', ... },
  creative: { fontSize: 11, primaryColor: '#ec4899', fontFamily: 'Inter', ... },
  minimalist: { fontSize: 10, primaryColor: '#000000', fontFamily: 'Courier New', ... }
}
```

Quand un utilisateur sélectionne un template :
```javascript
setLayout(templateLayouts[templateKey])
```

### Édition des Titres de Section
État `sectionTitles` gère les titres personnalisés:
```javascript
const [sectionTitles, setSectionTitles] = useState(DEFAULT_SECTION_TITLES)

handleTitleChange(section, newTitle) {
  setSectionTitles(prev => ({ ...prev, [section]: newTitle }))
}
```

Les titres s'affichent dans le formulaire ET le PDF via `sectionTitles[key]`

### Support du Gras
Format simple : `**texte en gras**`

Fonction `renderFormattedText()` dans ResumePreview:
```javascript
const renderFormattedText = (text) => {
  const parts = text.split(/(\*\*.*?\*\*)/);
  return parts.map(part => 
    part.startsWith('**') && part.endsWith('**')
      ? <strong>{part.slice(2, -2)}</strong>
      : part
  );
};
```

### Modal de Template Switcher
Dans ResumeBuilder, un état `showTemplateModal` contrôle l'affichage:
```javascript
{showTemplateModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-3xl max-w-2xl w-full">
      {/* Grille de 4 templates avec onSelect callback */}
    </div>
  </div>
)}
```

## 🔄 Workflow Complet

```
Utilisateur arrive
    ↓
Choisit template (TemplateSelector)
    ↓
ResumeBuilder charge layout du template
    ↓
Voir bouton "🎨 Template" en permanence
    ↓
Peut éditer :
  - Contenu (données + gras)
  - Titres de sections (✏️)
  - Apparence (layout sliders)
    ↓
Clicke "🎨 Template" pour switcher
    ↓
Même modal, choisit nouveau template
    ↓
Layout change, données conservées ✨
```

## 📱 Responsive Breakpoints

| Écran | Layout |
|-------|--------|
| < 768px | Mobile : Menu hamburger + fullscreen |
| 768px - 1024px | Tablet : Panneau réduit |
| ≥ 1024px | Desktop : Panneau latéral + preview |

## 🎨 Couleurs Disponibles par Template

### Moderne
- Primaire : Bleu `#2563eb`

### Élégant  
- Primaire : Gris foncé `#1f2937`

### Créatif
- Primaire : Rose `#ec4899`

### Minimaliste
- Primaire : Noir `#000000`

## ✍️ Polices Disponibles

- **Inter** (Moderne, Créatif)
- **Georgia** (Élégant)
- **Courier New** (Minimaliste)

## 📦 Dépendances

Aucune dépendance externe ajoutée !
- Utilise React Hooks pour l'état
- Tailwind CSS pour le styling
- Next.js pour le SSR

## 🚀 Points Forts

✅ **Templates avec identité** - Chacun unique en couleur, police, espacement
✅ **Titres personnalisables** - Renommez les sections comme vous le souhaitez
✅ **Texte en gras** - Mettez l'accent sur vos compétences clés
✅ **Switchable** - Changez de template sans perdre vos données
✅ **Responsive** - Fonctionne sur tous les appareils
✅ **Performance** - Changements instantanés
✅ **Standards** - Format JSON Resume officiel
