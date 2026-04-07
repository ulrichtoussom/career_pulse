// Templates prédéfinis pour JSON Resume
export const resumeTemplates = {
  modern: {
    name: "Moderne",
    description: "Design épuré et professionnel",
    icon: "✨",
    data: {
      basics: {
        name: "Votre Nom",
        label: "Titre Professionnel",
        image: "",
        email: "email@exemple.com",
        phone: "+33 6 XX XX XX XX",
        url: "https://votre-portfolio.com",
        summary: "Résumé professionnel court et impactant",
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
        { name: "Entreprise", position: "Poste", url: "", startDate: "2023-01", endDate: "2024-01", summary: "Description", highlights: [] }
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
    }
  },
  elegant: {
    name: "Élégant",
    description: "Design classique et intemporel",
    icon: "🎩",
    data: {
      basics: {
        name: "Votre Nom",
        label: "Titre Professionnel",
        image: "",
        email: "email@exemple.com",
        phone: "+33 6 XX XX XX XX",
        url: "https://votre-portfolio.com",
        summary: "Résumé professionnel avec style classique",
        location: {
          address: "Adresse",
          postalCode: "Code Postal",
          city: "Ville",
          countryCode: "FR",
          region: "Région"
        },
        profiles: [
          { network: 'LinkedIn', username: '', url: '' }
        ]
      },
      work: [],
      volunteer: [],
      education: [],
      awards: [],
      certificates: [],
      publications: [],
      skills: [],
      languages: [],
      interests: [],
      references: [],
      projects: []
    }
  },
  creative: {
    name: "Créatif",
    description: "Design original et coloré",
    icon: "🎨",
    data: {
      basics: {
        name: "Votre Nom",
        label: "Titre Professionnel",
        image: "",
        email: "email@exemple.com",
        phone: "+33 6 XX XX XX XX",
        url: "https://votre-portfolio.com",
        summary: "Résumé professionnel avec flair créatif",
        location: {
          address: "Adresse",
          postalCode: "Code Postal",
          city: "Ville",
          countryCode: "FR",
          region: "Région"
        },
        profiles: [
          { network: 'Portfolio', username: '', url: '' },
          { network: 'GitHub', username: '', url: '' },
          { network: 'LinkedIn', username: '', url: '' }
        ]
      },
      work: [],
      volunteer: [],
      education: [],
      awards: [],
      certificates: [],
      publications: [],
      skills: [],
      languages: [],
      interests: [],
      references: [],
      projects: []
    }
  },
  minimalist: {
    name: "Minimaliste",
    description: "Design épuré au maximum",
    icon: "◽",
    data: {
      basics: {
        name: "Votre Nom",
        label: "Titre",
        image: "",
        email: "email@exemple.com",
        phone: "+33 6 XX XX XX XX",
        url: "",
        summary: "Résumé court",
        location: {
          address: "",
          postalCode: "",
          city: "Ville",
          countryCode: "FR",
          region: ""
        },
        profiles: []
      },
      work: [],
      volunteer: [],
      education: [],
      awards: [],
      certificates: [],
      publications: [],
      skills: [],
      languages: [],
      interests: [],
      references: [],
      projects: []
    }
  }
};

export const defaultLayout = {
  fontSize: 11,
  lineHeight: 1.5,
  marginV: 45,
  marginH: 50,
  sectionSpacing: 25,
  primaryColor: '#2563eb',
  fontFamily: 'Inter'
};

// Layout spécifique pour chaque template
export const templateLayouts = {
  modern: {
    fontSize: 11,
    lineHeight: 1.5,
    marginV: 45,
    marginH: 50,
    sectionSpacing: 25,
    primaryColor: '#2563eb', // Bleu moderne
    fontFamily: 'Inter'
  },
  elegant: {
    fontSize: 12,
    lineHeight: 1.6,
    marginV: 50,
    marginH: 55,
    sectionSpacing: 30,
    primaryColor: '#1f2937', // Gris foncé élégant
    fontFamily: 'Georgia'
  },
  creative: {
    fontSize: 11,
    lineHeight: 1.5,
    marginV: 40,
    marginH: 45,
    sectionSpacing: 28,
    primaryColor: '#ec4899', // Rose créatif
    fontFamily: 'Inter'
  },
  minimalist: {
    fontSize: 10,
    lineHeight: 1.4,
    marginV: 35,
    marginH: 40,
    sectionSpacing: 20,
    primaryColor: '#000000', // Noir pur
    fontFamily: 'Courier New'
  }
};
