'use client'
import { useState } from 'react';

export default function ImportCV({ onImport }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const parseCV = (text) => {
    // Normaliser et nettoyer le texte
    text = text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').replace(/  +/g, ' ');
    
    // Sections clés à extraire
    const sections = extractSections(text);
    
    const resumeData = {
      basics: {
        name: extractName(text),
        label: extractLabel(text, sections),
        email: extractEmail(text),
        phone: extractPhone(text),
        url: extractUrl(text),
        summary: extractSummary(text, sections),
        location: {
          address: extractAddress(text),
          postalCode: extractPostalCode(text),
          city: extractCity(text),
          countryCode: 'FR',
          region: ''
        },
        profiles: extractProfiles(text)
      },
      work: extractWork(text, sections),
      education: extractEducation(text, sections),
      skills: extractSkills(text, sections),
      languages: extractLanguages(text, sections),
      volunteer: [],
      awards: [],
      certificates: [],
      publications: [],
      interests: [],
      references: [],
      projects: []
    };

    return resumeData;
  };

  const extractSections = (text) => {
    // Chercher les sections principales
    const sections = {};
    
    const sectionPatterns = {
      contact: /CONTACT([\s\S]*?)(?=\n[A-Z]{2,}|\n\n[A-Z]|EDUCATION|COMPETENCES|EXPERIENCES|$)/i,
      education: /EDUCATION([\s\S]*?)(?=\n[A-Z]{2,}|\n\n[A-Z]|COMPETENCES|EXPERIENCES|PROJETS|$)/i,
      experience: /EXPERIENCES?([\s\S]*?)(?=\n[A-Z]{2,}|\n\n[A-Z]|EDUCATION|COMPETENCES|PROJETS|$)/i,
      competences: /COMPETENCES?([\s\S]*?)(?=\n[A-Z]{2,}|\n\n[A-Z]|EXPERIENCES|PROJETS|LANGUE|$)/i,
      projets: /PROJETS?([\s\S]*?)(?=\n[A-Z]{2,}|\n\n[A-Z]|LANGUE|CERTIF|$)/i,
      langues: /LANGUE[S]?([\s\S]*?)(?=\n[A-Z]{2,}|\n\n[A-Z]|CERTIF|QUALITES|$)/i,
      profile: /PROFIL([\s\S]*?)(?=\n[A-Z]{2,}|\n\n[A-Z]|EXPERIENCES|COMPETENCES|$)/i,
    };
    
    for (let [key, pattern] of Object.entries(sectionPatterns)) {
      const match = text.match(pattern);
      if (match) {
        sections[key] = match[1].trim();
      }
    }
    
    return sections;
  };

  const extractName = (text) => {
    // Le nom est généralement en majuscules au début
    // Pattern: "NAME | Title" ou "NAME Développeur"
    const namePattern = /^([A-Z\s]{2,50}?)\s*(?:\||Développeur|Full-Stack|Software|Ingénieur|Senior|Junior)/i;
    const match = text.match(namePattern);
    
    if (match) {
      return match[1].trim();
    }
    
    // Essayer une autre approche
    const lines = text.split('\n');
    for (let line of lines.slice(0, 10)) {
      const clean = line.trim();
      if (clean && !clean.includes('@') && clean.length > 3 && clean.length < 50) {
        return clean;
      }
    }
    
    return 'Votre Nom';
  };

  const extractLabel = (text, sections) => {
    // Chercher le titre/poste principal
    const patterns = [
      /Développeur\s+([^\n]+)/i,
      /Software\s+([^\n]+)/i,
      /Ingénieur\s+([^\n]+)/i,
      /\|\s*([^\n]+?)(?:\||$)/,
    ];
    
    for (let pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1].trim().substring(0, 100);
      }
    }
    
    return 'Développeur Full-Stack';
  };

  const extractEmail = (text) => {
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
    const match = text.match(emailRegex);
    return match ? match[1] : '';
  };

  const extractPhone = (text) => {
    const phoneRegex = /(?:Phone\s*:|Tel\s*:)?\s*(\+?33|0)[1-9](?:[0-9]{8}|[0-9]{7}(?:\s[0-9]{2})?)|(\+?[0-9]{1,3}[\s\-.]?[0-9]{6,14})/i;
    const match = text.match(phoneRegex);
    return match ? match[0].replace(/(?:Phone|Tel)?\s*:?\s*/i, '').trim() : '';
  };

  const extractUrl = (text) => {
    // Chercher les URLs en priorité GitHub, Portfolio, etc.
    const urlPatterns = [
      /https?:\/\/(?:www\.)?github\.com\/\S+/i,
      /https?:\/\/(?:www\.)?linkedin\.com\/\S+/i,
      /https?:\/\/\S+(?:onrender|vercel|netlify|herokuapp)\S*/i,
      /https?:\/\/\S+/,
    ];
    
    for (let pattern of urlPatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0];
      }
    }
    
    return '';
  };

  const extractAddress = (text) => {
    // Pattern: "Adresse: ..."
    const addressPattern = /Adresse\s*:\s*([^\n]+)/i;
    const match = text.match(addressPattern);
    return match ? match[1].trim() : '';
  };

  const extractPostalCode = (text) => {
    // Pattern: code postal français
    const codePattern = /\b([0-9]{5})\b/;
    const match = text.match(codePattern);
    return match ? match[1] : '';
  };

  const extractCity = (text) => {
    // Chercher dans l'adresse ou les sections Contact/Profil
    const addressPattern = /Adresse\s*:\s*[^,]*,\s*(\d+\s+)?([A-Za-zÀ-ÿ\s]+)/i;
    const addressMatch = text.match(addressPattern);
    if (addressMatch) {
      return addressMatch[2].trim();
    }
    
    // Chercher une ville française
    const cities = ['paris', 'lyon', 'marseille', 'toulouse', 'nice', 'nantes', 'strasbourg',
                   'bordeaux', 'lille', 'rennes', 'reims', 'dijon', 'montpellier', 'cameroun', 'france'];
    const lowerText = text.toLowerCase();
    for (let city of cities) {
      if (lowerText.includes(city)) {
        return city.charAt(0).toUpperCase() + city.slice(1);
      }
    }
    
    return '';
  };

  const extractSummary = (text, sections) => {
    // Le profil est généralement une section dédiée
    if (sections.profile) {
      return sections.profile.substring(0, 200).trim();
    }
    
    // Ou chercher après le titre
    const profilePattern = /Profil\s+([^\n]+(?:\n[^\n]+){0,2})/i;
    const match = text.match(profilePattern);
    if (match) {
      return match[1].substring(0, 200).trim();
    }
    
    return '';
  };

  const extractProfiles = (text) => {
    const profiles = [];
    
    // GitHub
    const githubMatch = text.match(/https?:\/\/(?:www\.)?github\.com\/([^\s/]+)/i);
    if (githubMatch) {
      profiles.push({
        network: 'GitHub',
        username: githubMatch[1],
        url: githubMatch[0]
      });
    }
    
    // LinkedIn
    const linkedinMatch = text.match(/https?:\/\/(?:www\.)?linkedin\.com\/in\/([^\s/]+)/i);
    if (linkedinMatch) {
      profiles.push({
        network: 'LinkedIn',
        username: linkedinMatch[1],
        url: linkedinMatch[0]
      });
    }
    
    // HuggingFace et autres
    const huggingfaceMatch = text.match(/https?:\/\/huggingface\.co\/([^\s/]+)/i);
    if (huggingfaceMatch) {
      profiles.push({
        network: 'HuggingFace',
        username: huggingfaceMatch[1],
        url: huggingfaceMatch[0]
      });
    }
    
    return profiles;
  };

  const extractWork = (text, sections) => {
    const work = [];
    
    if (!sections.experience) return work;
    
    // Chercher les entrées de travail
    // Pattern: "Poste - Entreprise 📅 YYYY - YYYY"
    const jobPattern = /([A-Za-z\s]+?)\s*[-–—]\s*([A-Za-zÀ-ÿ\s&.(),]+?)\s*📅?\s*(\d{4})\s*[-–]\s*(\d{4}|[Pp]résent|[Cc]urrent)/g;
    
    let match;
    while ((match = jobPattern.exec(sections.experience)) !== null) {
      const position = match[1].trim();
      const company = match[2].trim();
      const startYear = match[3];
      const endYear = match[4];
      
      work.push({
        name: company,
        position: position,
        url: '',
        startDate: startYear ? `${startYear}-01-01` : '',
        endDate: (endYear && !endYear.toLowerCase().includes('présent') && !endYear.toLowerCase().includes('current')) ? `${endYear}-01-01` : '',
        summary: '',
        highlights: []
      });
    }
    
    // Si pas trouvé avec ce pattern, essayer une approche plus simple
    if (work.length === 0 && sections.experience) {
      const lines = sections.experience.split('\n').filter(l => l.trim());
      for (let line of lines) {
        if (line.includes('Développeur') || line.includes('Software') || line.includes('📅')) {
          work.push({
            name: 'À ajouter',
            position: line.substring(0, 100),
            url: '',
            startDate: '',
            endDate: '',
            summary: '',
            highlights: []
          });
        }
      }
    }
    
    return work;
  };

  const extractEducation = (text, sections) => {
    const education = [];
    
    if (!sections.education) return education;
    
    // Pattern: "Master 1 Architecture Logicielle (2025-2026)"
    const eduPattern = /([A-Za-z\s]+?)(?:\s+(\d))?(?:\s*[-–—]\s*)?([A-Za-zÀ-ÿ\s(),]+?)\s*\(?(\d{4})-?(\d{4})?\)?/g;
    
    let match;
    while ((match = eduPattern.exec(sections.education)) !== null) {
      const studyType = match[1].trim();
      const institution = match[3].trim();
      const startYear = match[4];
      const endYear = match[5];
      
      if (studyType && institution) {
        education.push({
          institution: institution,
          url: '',
          studyType: studyType,
          area: '',
          startDate: startYear ? `${startYear}-01-01` : '',
          endDate: endYear ? `${endYear}-01-01` : '',
          score: '',
          courses: []
        });
      }
    }
    
    return education;
  };

  const extractSkills = (text, sections) => {
    const skills = [];
    const skillsText = sections.competences || '';
    
    if (!skillsText) return skills;
    
    // Parser les skills en catégories
    // Pattern: "Catégorie : item1, item2, item3"
    const categoryPattern = /([A-Za-z\s]+?)\s*:\s*([^:\n]+?)(?=\n[A-Za-z]|\n\n|$)/g;
    
    let match;
    while ((match = categoryPattern.exec(skillsText)) !== null) {
      const items = match[2].split(/[,;]/);
      items.forEach(item => {
        const skill = item.trim();
        if (skill && skill.length > 2 && skill.length < 50) {
          skills.push({
            name: skill,
            level: 'Intermédiaire',
            keywords: []
          });
        }
      });
    }
    
    // Dédupliquer
    const uniqueSkills = new Map();
    skills.forEach(s => {
      if (!uniqueSkills.has(s.name.toLowerCase())) {
        uniqueSkills.set(s.name.toLowerCase(), s);
      }
    });
    
    return Array.from(uniqueSkills.values()).slice(0, 30);
  };

  const extractLanguages = (text, sections) => {
    const languages = [];
    
    if (!sections.langues) return languages;
    
    const langText = sections.langues;
    
    // Pattern: "Français Anglais" ou "Français - Natif"
    const langPattern = /([A-Za-zÀ-ÿ]+)(?:\s*[-–]\s*([^\n,]+))?/g;
    
    let match;
    while ((match = langPattern.exec(langText)) !== null) {
      const language = match[1].trim();
      let fluency = match[2]?.trim() || 'Courant';
      
      // Normaliser
      if (fluency.toLowerCase().includes('natif')) fluency = 'Natif';
      else if (fluency.toLowerCase().includes('courant')) fluency = 'Courant';
      else if (fluency.toLowerCase().includes('intermédiaire')) fluency = 'Intermédiaire';
      else if (!fluency || fluency === language) fluency = 'Courant';
      
      if (language && language.length > 2 && language.length < 30) {
        languages.push({
          language: language.charAt(0).toUpperCase() + language.slice(1).toLowerCase(),
          fluency: fluency
        });
      }
    }
    
    return languages;
  };

  const handleFileUpload = async (e) => {
    setError('');
    setIsLoading(true);

    try {
      const file = e.target.files?.[0];
      if (!file) return;

      let text = '';

      if (file.type === 'text/plain') {
        text = await file.text();
      } else if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setError('Les fichiers DOCX ne sont pas encore supportés. Convertissez en TXT ou PDF.');
        setIsLoading(false);
        return;
      } else {
        text = await file.text();
      }

      const parsedData = parseCV(text);
      onImport(parsedData);
    } catch (err) {
      setError('Erreur lors de la lecture du fichier: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const extractTextFromPDF = async (file) => {
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }
      
      return fullText;
    } catch (err) {
      throw new Error(`Erreur lors de la lecture du PDF: ${err.message}`);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-dashed border-blue-200">
      <div className="text-center">
        <div className="text-4xl mb-3">📄</div>
        <h3 className="text-lg font-black uppercase tracking-wider text-gray-900 mb-2">
          Importer un CV
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Téléchargez votre CV en format TXT ou PDF. Nos algorithmes analyseront intelligemment votre CV et prérempliront automatiquement tous les champs.
        </p>

        <label className="inline-block">
          <input
            type="file"
            accept=".txt,.pdf,.docx"
            onChange={handleFileUpload}
            disabled={isLoading}
            className="hidden"
          />
          <span className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer transition-colors disabled:bg-gray-400">
            {isLoading ? '⏳ Analyse en cours...' : '📤 Importer un CV'}
          </span>
        </label>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
            ⚠️ {error}
          </div>
        )}

        <p className="text-[10px] text-gray-500 mt-4 leading-relaxed">
          💡 Notre système extrait: Nom, Email, Téléphone, Poste, Entreprise,<br/>
          Dates, Formation, Compétences, Langues et Profils (GitHub, LinkedIn, etc.)<br/>
          ✏️ Vous pouvez éditer et corriger tous les champs après l'import!
        </p>
      </div>
    </div>
  );
}
