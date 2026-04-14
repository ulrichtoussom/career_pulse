// PREMIUM RESUME TEMPLATES

const baseData = {
  basics: {
    name: "Votre Nom",
    label: "Titre Professionnel",
    image: "",
    email: "email@exemple.com",
    phone: "+33 6 XX XX XX XX",
    url: "https://votre-portfolio.com",
    summary: "Résumé professionnel impact et memorable",
    location: {
      address: "Adresse",
      postalCode: "Code Postal",
      city: "Ville",
      countryCode: "FR",
      region: "Région"
    },
    profiles: [
      { network: 'LinkedIn', username: '', url: '' },
      { network: 'GitHub', username: '', url: '' }
    ]
  },
  work: [
    { name: "Entreprise", position: "Poste", url: "", startDate: "2023-01", endDate: "2024-01", summary: "Description", highlights: ["Réussite 1", "Réussite 2"] }
  ],
  volunteer: [],
  education: [
    { institution: "École", url: "", studyType: "Diplôme", area: "Domaine", startDate: "2020-09", endDate: "2023-06", score: "", courses: [] }
  ],
  awards: [],
  certificates: [],
  publications: [],
  skills: [
    { name: "JavaScript", level: "Avancé", keywords: [] },
    { name: "React", level: "Avancé", keywords: [] }
  ],
  languages: [
    { language: "Français", fluency: "Natif" }
  ],
  interests: [],
  references: [],
  projects: []
};

export const resumeTemplates = {
  classicPro: {
    name: "Classic Pro",
    description: "Élégant, noir et blanc intemporel",
    icon: "🎩",
    layout: "classicPro",
    data: baseData
  },
  modernBlue: {
    name: "Modern Blue",
    description: "En-tête bleu vibrant, design contemporain",
    icon: "💎",
    layout: "modernBlue",
    data: baseData
  },
  minimalistClean: {
    name: "Minimalist",
    description: "Ultra épuré, focus sur le contenu",
    icon: "◽",
    layout: "minimalistClean",
    data: baseData
  },
  techDeveloper: {
    name: "Tech Sidebar",
    description: "Sidebar sombre, idéal pour développeurs",
    icon: "💻",
    layout: "techDeveloper",
    data: baseData
  },
  creativeEdge: {
    name: "Creative Sidebar",
    description: "Sidebar violet, design créatif moderne",
    icon: "🎨",
    layout: "creativeEdge",
    data: baseData
  },
  executive: {
    name: "Executive",
    description: "Premium bleu marine pour dirigeants",
    icon: "👔",
    layout: "executive",
    data: baseData
  },
  startupVibes: {
    name: "Startup Bold",
    description: "En-tête orange audacieux, dynamique",
    icon: "🚀",
    layout: "startupVibes",
    data: baseData
  },
  academic: {
    name: "Academic",
    description: "Format académique classique structuré",
    icon: "🎓",
    layout: "academic",
    data: baseData
  },
  navyTimeline: {
    name: "Navy Timeline",
    description: "En-tête marine, layout timeline élégant",
    icon: "📋",
    layout: "navyTimeline",
    data: baseData
  },
  purpleGradient: {
    name: "Purple Gradient",
    description: "Dégradé violet, sidebar compacte moderne",
    icon: "🟣",
    layout: "purpleGradient",
    data: baseData
  },
  darkInitials: {
    name: "Dark Initials",
    description: "Sidebar sombre avec initiales, sobre",
    icon: "🌑",
    layout: "darkInitials",
    data: baseData
  },
  lightMinimal: {
    name: "Light Minimal",
    description: "Sidebar claire minimaliste, épuré",
    icon: "◻️",
    layout: "lightMinimal",
    data: baseData
  }
};

// LAYOUTS — layout:'sidebar' = colonnes gauche/droite
//           layout:'single-column' = colonne unique
export const templateLayouts = {
  classicPro: {
    fontSize: 11,
    lineHeight: 1.6,
    marginV: 50,
    marginH: 55,
    sectionSpacing: 28,
    primaryColor: '#1a1a1a',
    accentColor: '#d4af37',
    fontFamily: 'Georgia',
    headerStyle: 'line-bottom',
    layout: 'single-column'
  },

  modernBlue: {
    fontSize: 10.5,
    lineHeight: 1.5,
    marginV: 0,
    marginH: 0,
    sectionSpacing: 24,
    primaryColor: '#1d4ed8',
    accentColor: '#60a5fa',
    fontFamily: 'Inter',
    headerStyle: 'colored-bg',
    layout: 'single-column'
  },

  minimalistClean: {
    fontSize: 10,
    lineHeight: 1.45,
    marginV: 40,
    marginH: 45,
    sectionSpacing: 18,
    primaryColor: '#111111',
    accentColor: '#999999',
    fontFamily: 'Helvetica',
    headerStyle: 'minimal',
    layout: 'single-column'
  },

  techDeveloper: {
    fontSize: 10,
    lineHeight: 1.5,
    marginV: 0,
    marginH: 0,
    sectionSpacing: 22,
    primaryColor: '#0f172a',
    accentColor: '#38bdf8',
    fontFamily: 'Courier New',
    headerStyle: 'sidebar',
    layout: 'sidebar'
  },

  creativeEdge: {
    fontSize: 10.5,
    lineHeight: 1.5,
    marginV: 0,
    marginH: 0,
    sectionSpacing: 22,
    primaryColor: '#6d28d9',
    accentColor: '#a78bfa',
    fontFamily: 'Inter',
    headerStyle: 'sidebar',
    layout: 'sidebar'
  },

  executive: {
    fontSize: 11.5,
    lineHeight: 1.7,
    marginV: 55,
    marginH: 60,
    sectionSpacing: 32,
    primaryColor: '#0c3547',
    accentColor: '#b8860b',
    fontFamily: 'Georgia',
    headerStyle: 'luxury-line',
    layout: 'single-column'
  },

  startupVibes: {
    fontSize: 11,
    lineHeight: 1.5,
    marginV: 0,
    marginH: 0,
    sectionSpacing: 24,
    primaryColor: '#ea580c',
    accentColor: '#fbbf24',
    fontFamily: 'Inter',
    headerStyle: 'gradient-bg',
    layout: 'single-column'
  },

  academic: {
    fontSize: 11,
    lineHeight: 1.65,
    marginV: 48,
    marginH: 52,
    sectionSpacing: 28,
    primaryColor: '#1e3a5f',
    accentColor: '#4a90d9',
    fontFamily: 'Times New Roman',
    headerStyle: 'classic-line',
    layout: 'single-column'
  },

  navyTimeline: {
    fontSize: 10,
    lineHeight: 1.5,
    marginV: 0,
    marginH: 0,
    sectionSpacing: 18,
    primaryColor: '#1e2d4a',
    accentColor: '#3b6cb7',
    fontFamily: 'Georgia',
    headerStyle: 'navy-timeline',
    layout: 'timeline'
  },

  purpleGradient: {
    fontSize: 10,
    lineHeight: 1.5,
    marginV: 0,
    marginH: 0,
    sectionSpacing: 18,
    primaryColor: '#6d28d9',
    accentColor: '#c4b5fd',
    fontFamily: 'Inter',
    headerStyle: 'sidebar',
    layout: 'sidebar',
    sidebarStyle: 'gradient-left'
  },

  darkInitials: {
    fontSize: 10,
    lineHeight: 1.5,
    marginV: 0,
    marginH: 0,
    sectionSpacing: 18,
    primaryColor: '#1e293b',
    accentColor: '#94a3b8',
    fontFamily: 'Inter',
    headerStyle: 'sidebar',
    layout: 'sidebar',
    sidebarStyle: 'dark-initials'
  },

  lightMinimal: {
    fontSize: 10,
    lineHeight: 1.5,
    marginV: 0,
    marginH: 0,
    sectionSpacing: 18,
    primaryColor: '#374151',
    accentColor: '#6366f1',
    fontFamily: 'Inter',
    headerStyle: 'sidebar',
    layout: 'sidebar',
    sidebarStyle: 'light-initials',
    sidebarBg: '#f1f5f9'
  }
};

export const defaultLayout = templateLayouts.classicPro;
