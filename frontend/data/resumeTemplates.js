// 8 PREMIUM RESUME TEMPLATES - Inspirés des meilleurs designs JSON Resume

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
    { name: "JavaScript", level: "Advanced", keywords: [] },
    { name: "React", level: "Advanced", keywords: [] }
  ],
  languages: [
    { language: "Français", fluency: "Native speaker" }
  ],
  interests: [],
  references: [],
  projects: []
};

export const resumeTemplates = {
  classicPro: {
    name: "Classic Pro",
    description: "Élégant et intemporel pour cadres",
    icon: "🎩",
    layout: "classicPro",
    data: baseData
  },

  modernBlue: {
    name: "Modern Blue",
    description: "Design contemporain avec bleu vibrant",
    icon: "💎",
    layout: "modernBlue",
    data: baseData
  },

  minimalistClean: {
    name: "Minimalist Clean",
    description: "Ultra épuré et focalisé sur le contenu",
    icon: "◽",
    layout: "minimalistClean",
    data: baseData
  },

  techDeveloper: {
    name: "Tech Developer",
    description: "Parfait pour ingénieurs et développeurs",
    icon: "💻",
    layout: "techDeveloper",
    data: baseData
  },

  creativeEdge: {
    name: "Creative Edge",
    description: "Design créatif avec effets modernes",
    icon: "🎨",
    layout: "creativeEdge",
    data: baseData
  },

  executive: {
    name: "Executive",
    description: "Premium et professionnel pour dirigeants",
    icon: "👔",
    layout: "executive",
    data: baseData
  },

  startupVibes: {
    name: "Startup Vibes",
    description: "Dynamique et moderne pour entrepreneurs",
    icon: "🚀",
    layout: "startupVibes",
    data: baseData
  },

  academic: {
    name: "Academic",
    description: "Pour chercheurs et académiques",
    icon: "🎓",
    layout: "academic",
    data: baseData
  }
};

// LAYOUTS PREMIUM AVEC STYLES UNIQUES
export const templateLayouts = {
  classicPro: {
    // Noir/Blanc élégant - pour cadres
    fontSize: 11,
    lineHeight: 1.6,
    marginV: 50,
    marginH: 55,
    sectionSpacing: 32,
    primaryColor: '#1a1a1a',
    accentColor: '#d4af37',
    fontFamily: 'Georgia',
    headerStyle: 'line-bottom',
    layout: 'single-column'
  },

  modernBlue: {
    // Bleu vibrant contemporain
    fontSize: 10.5,
    lineHeight: 1.5,
    marginV: 40,
    marginH: 45,
    sectionSpacing: 28,
    primaryColor: '#0066cc',
    accentColor: '#00b4d8',
    fontFamily: 'Inter',
    headerStyle: 'colored-bg',
    layout: 'single-column'
  },

  minimalistClean: {
    // Ultra épuré
    fontSize: 10,
    lineHeight: 1.4,
    marginV: 35,
    marginH: 40,
    sectionSpacing: 20,
    primaryColor: '#000000',
    accentColor: '#666666',
    fontFamily: 'Helvetica',
    headerStyle: 'minimal',
    layout: 'single-column'
  },

  techDeveloper: {
    // Noir/Bleu pour développeurs
    fontSize: 11,
    lineHeight: 1.5,
    marginV: 45,
    marginH: 50,
    sectionSpacing: 25,
    primaryColor: '#1a1a2e',
    accentColor: '#0f3460',
    fontFamily: 'Courier New',
    headerStyle: 'gradient-line',
    layout: 'two-column'
  },

  creativeEdge: {
    // Rose/Gradient moderne
    fontSize: 11,
    lineHeight: 1.5,
    marginV: 40,
    marginH: 45,
    sectionSpacing: 28,
    primaryColor: '#e91e63',
    accentColor: '#ff6090',
    fontFamily: 'Inter',
    headerStyle: 'gradient-bg',
    layout: 'single-column'
  },

  executive: {
    // Bleu marine luxe
    fontSize: 11.5,
    lineHeight: 1.7,
    marginV: 55,
    marginH: 60,
    sectionSpacing: 35,
    primaryColor: '#003d5c',
    accentColor: '#1a6b8f',
    fontFamily: 'Georgia',
    headerStyle: 'luxury-line',
    layout: 'single-column'
  },

  startupVibes: {
    // Orange/Dynamique
    fontSize: 11,
    lineHeight: 1.5,
    marginV: 42,
    marginH: 48,
    sectionSpacing: 26,
    primaryColor: '#ff6b35',
    accentColor: '#ffa500',
    fontFamily: 'Inter',
    headerStyle: 'sidebar-accent',
    layout: 'single-column'
  },

  academic: {
    // Bleu académique classique
    fontSize: 11,
    lineHeight: 1.6,
    marginV: 48,
    marginH: 52,
    sectionSpacing: 30,
    primaryColor: '#2c3e50',
    accentColor: '#34495e',
    fontFamily: 'Times New Roman',
    headerStyle: 'classic-line',
    layout: 'single-column'
  }
};

export const defaultLayout = templateLayouts.classicPro;
