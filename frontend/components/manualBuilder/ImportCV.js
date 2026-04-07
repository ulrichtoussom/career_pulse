'use client'
import { useState } from 'react';

export default function ImportCV({ onImport }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const parseCV = (text) => {
    // Normaliser le texte
    text = text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');
    
    const resumeData = {
      basics: {
        name: extractName(text),
        label: extractLabel(text),
        email: extractEmail(text),
        phone: extractPhone(text),
        url: extractUrl(text),
        summary: extractSummary(text),
        location: {
          address: '',
          postalCode: '',
          city: extractCity(text),
          countryCode: 'FR',
          region: ''
        },
        profiles: extractProfiles(text)
      },
      work: extractWork(text),
      education: extractEducation(text),
      skills: extractSkills(text),
      languages: extractLanguages(text),
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

  const extractName = (text) => {
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length === 0) return 'Votre Nom';
    
    // Chercher un email ou téléphone pour savoir où commencent les données
    let nameLines = [];
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i].trim();
      if (!line.includes('@') && !line.match(/^\+?[\d\s\-()]{8,}/) && !line.match(/https?:/) && line.length < 80) {
        nameLines.push(line);
      } else {
        break;
      }
    }
    
    if (nameLines.length > 0) {
      // Retourner la première ligne signif icative
      const name = nameLines[0].split(/\s{2,}/)[0]; // Prendre avant les doubles espaces
      return name.replace(/[A-Z\s]{30,}/g, '').trim() || name;
    }
    
    return lines[0]?.trim() || 'Votre Nom';
  };

  const extractLabel = (text) => {
    // Chercher un titre professionnel
    const titlePatterns = [
      /développeur[^\n]*/i,
      /ingénieur[^\n]*/i,
      /manager[^\n]*/i,
      /designer[^\n]*/i,
      /consultant[^\n]*/i,
      /chef[^\n]*/i,
      /specialist[^\n]*/i,
      /expert[^\n]*/i,
      /analyst[^\n]*/i,
      /architect[^\n]*/i,
      /lead[^\n]*/i,
    ];
    
    for (let pattern of titlePatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0].substring(0, 100).trim();
      }
    }
    
    return 'Titre Professionnel';
  };

  const extractEmail = (text) => {
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
    const match = text.match(emailRegex);
    return match ? match[1] : '';
  };

  const extractPhone = (text) => {
    const phoneRegex = /(\+?33|0)[1-9](?:[0-9]{8}|[0-9]{7}(?:\s[0-9]{2})?)|(\+?[0-9]{1,3}[\s\-.]?[0-9]{6,14})/;
    const match = text.match(phoneRegex);
    return match ? match[0].trim() : '';
  };

  const extractUrl = (text) => {
    const urlRegex = /(https?:\/\/[^\s\n]+)/;
    const match = text.match(urlRegex);
    return match ? match[1] : '';
  };

  const extractCity = (text) => {
    const cities = ['paris', 'lyon', 'marseille', 'toulouse', 'nice', 'nantes', 'strasbourg',
                   'bordeaux', 'lille', 'rennes', 'reims', 'monaco', 'dijon', 'montpellier',
                   'toulouse', 'cannes', 'biarritz', 'grenoble', 'rouen'];
    const lowerText = text.toLowerCase();
    for (let city of cities) {
      if (lowerText.includes(city)) {
        return city.charAt(0).toUpperCase() + city.slice(1);
      }
    }
    return '';
  };

  const extractSummary = (text) => {
    const summaryPatterns = [
      /(?:résumé|profil|objectif|summary|profile)[\s\n:]*([^\n]+)/i,
    ];

    for (let pattern of summaryPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].substring(0, 200).trim();
      }
    }

    const lines = text.split('\n').filter(l => l.trim() && !l.includes('@') && !l.match(/^\+?[\d]/)).slice(0, 3);
    return lines.join(' ').substring(0, 200);
  };

  const extractProfiles = (text) => {
    const profiles = [];
    const lowerText = text.toLowerCase();

    if (lowerText.includes('linkedin')) {
      const linkedinUrl = text.match(/https?:\/\/(?:www\.)?linkedin\.com\/in\/[^\s]+/i);
      profiles.push({ 
        network: 'LinkedIn', 
        username: linkedinUrl ? linkedinUrl[0].split('/in/')[1].split(/[\/?]/)[0] : '', 
        url: linkedinUrl ? linkedinUrl[0] : '' 
      });
    }
    
    if (lowerText.includes('github')) {
      const githubUrl = text.match(/https?:\/\/(?:www\.)?github\.com\/[^\s]+/i);
      profiles.push({ 
        network: 'GitHub', 
        username: githubUrl ? githubUrl[0].split('/')[3] : '', 
        url: githubUrl ? githubUrl[0] : '' 
      });
    }

    return profiles;
  };

  const extractWork = (text) => {
    const work = [];
    
    // Chercher la section expérience
    const expRegex = /(?:expérience|experience|professionn[^ ]*|work[\s\n]*experience)[\s\n]*([\s\S]*?)(?=\n\n(?:formation|education|compétence|skill|langue|language|certification|$))/i;
    const expMatch = text.match(expRegex);
    
    if (!expMatch) return work;
    
    const experienceText = expMatch[1];
    
    // Chercher les positions avec dates
    const jobLines = experienceText.split('\n').filter(l => l.trim());
    
    for (let i = 0; i < jobLines.length; i++) {
      const line = jobLines[i].trim();
      
      // Pattern: "Position - Company (2020 - 2022)"
      const jobPattern = /^(.+?)\s*[-–—]\s*([A-Za-z\s&.(),]+?)\s*(?:\(([0-9]{4})\s*[-–]\s*([0-9]{4}|présent|today|current|now|actuel)\))?/i;
      const jobMatch = line.match(jobPattern);
      
      if (jobMatch) {
        const position = jobMatch[1].trim();
        const company = jobMatch[2].trim();
        const startYear = jobMatch[3];
        const endYear = jobMatch[4];
        
        // Extraire les highlights des lignes suivantes
        const highlights = [];
        for (let j = i + 1; j < jobLines.length && highlights.length < 5; j++) {
          const nextLine = jobLines[j].trim();
          if (nextLine.match(/^[-–•]/)) {
            highlights.push(nextLine.replace(/^[-–•]\s*/, '').trim());
          } else if (nextLine.match(/\d{4}/) || nextLine.match(/^[A-Z]/)) {
            break; // Nouvelle section
          }
        }
        
        if (position) {
          work.push({
            name: company,
            position: position,
            url: '',
            startDate: startYear ? `${startYear}-01-01` : '',
            endDate: (endYear && !endYear.toLowerCase().match(/présent|current|now|today/)) ? `${endYear}-01-01` : '',
            summary: '',
            highlights: highlights.length > 0 ? highlights : []
          });
        }
      }
    }

    return work;
  };

  const extractEducation = (text) => {
    const education = [];
    
    // Chercher la section formation
    const eduRegex = /(?:formation|education|études|diplôme)[\s\n]*([\s\S]*?)(?=\n\n(?:compétence|skill|expérience|langue|language|certification|$))/i;
    const eduMatch = text.match(eduRegex);
    
    if (!eduMatch) return education;
    
    const educationText = eduMatch[1];
    const eduLines = educationText.split('\n').filter(l => l.trim());
    
    for (let line of eduLines) {
      // Pattern: "Master Informatique - Université Paris (2020)"
      const eduPattern = /^((?:master|licence|bac|doctorat|diplôme|degree|bachelor|phd|ingénieur)[^\n]*?)\s*[-–—]\s*([A-Za-zàâäéèêëïîôöûüç\s&().,]+?)\s*(?:\(([0-9]{4})\))?/i;
      const eduMatch2 = line.match(eduPattern);
      
      if (eduMatch2) {
        const studyType = eduMatch2[1].trim();
        const institution = eduMatch2[2].trim();
        const year = eduMatch2[3];
        
        // Extraire le domaine d'étude du studyType
        const areaMatch = studyType.match(/(?:en|in|d'?|de|informatique|gestion|commerce|sciences|lettres|droit|ingénierie)\s+([^-()]+)/i);
        const area = areaMatch ? areaMatch[1].trim() : '';
        
        education.push({
          institution: institution || 'École/Université',
          url: '',
          studyType: studyType.replace(/\s*\d{4}\s*/g, '').trim(),
          area: area,
          startDate: year ? `${year}-01-01` : '',
          endDate: '',
          score: '',
          courses: []
        });
      }
    }

    return education;
  };

  const extractSkills = (text) => {
    const skills = [];
    
    // Chercher la section compétences
    const skillsRegex = /(?:compétence|skill|technolog|langage|framework|outils?|tools)[\s\n:]*([\s\S]*?)(?=\n\n(?:langue|language|expérience|education|formation|certification|$))/i;
    const skillsMatch = text.match(skillsRegex);
    
    if (!skillsMatch) return skills;
    
    const skillsText = skillsMatch[1];
    const skillLines = skillsText.split('\n');
    
    for (let line of skillLines) {
      // Parser les items séparés par virgules, tirets ou puces
      const items = line.split(/[,;]/);
      
      for (let item of items) {
        let skill = item.trim().replace(/^[-–•\s]*/, '');
        
        // Si c'est un pattern "Catégorie: item1, item2", récupérer juste la partie après les deux-points
        if (skill.includes(':')) {
          skill = skill.split(':')[1].trim();
        }
        
        // Limiter la taille du skill
        if (skill && skill.length > 2 && skill.length < 50 && !skill.includes('\n')) {
          skills.push({
            name: skill,
            level: 'Intermédiaire',
            keywords: []
          });
        }
      }
    }

    // Dédupliquer
    const uniqueSkills = new Map();
    skills.forEach(s => {
      if (!uniqueSkills.has(s.name.toLowerCase())) {
        uniqueSkills.set(s.name.toLowerCase(), s);
      }
    });

    return Array.from(uniqueSkills.values()).slice(0, 25);
  };

  const extractLanguages = (text) => {
    const languages = [];
    
    // Chercher la section langues
    const langRegex = /(?:langue|language)s?[\s\n:]*([\s\S]*?)(?=\n\n(?:certification|award|$|compétence|skill))/i;
    const langMatch = text.match(langRegex);
    
    if (!langMatch) return languages;
    
    const languagesText = langMatch[1];
    const langLines = languagesText.split('\n');
    
    for (let line of langLines) {
      // Pattern: "Français - Natif" ou "Français (Natif)"
      const langPattern = /^([a-zàâäéèêëïîôöûüç]+)\s*[-–:\s]*([^\n]*(?:courant|fluent|native|advanced|intermediate|beginner|débutant|intermédiaire|natif))?/i;
      const match = line.match(langPattern);
      
      if (match) {
        const language = match[1].trim();
        let fluency = match[2]?.trim() || 'Courant';
        
        // Normaliser les niveaux
        if (fluency.toLowerCase().includes('natif')) fluency = 'Natif';
        else if (fluency.toLowerCase().includes('courant') || fluency.toLowerCase().includes('fluent')) fluency = 'Courant';
        else if (fluency.toLowerCase().includes('intermédiaire') || fluency.toLowerCase().includes('intermediate')) fluency = 'Intermédiaire';
        else if (fluency.toLowerCase().includes('débutant') || fluency.toLowerCase().includes('beginner')) fluency = 'Débutant';
        else if (fluency.toLowerCase().includes('advanced')) fluency = 'Avancé';
        
        if (language && language.length > 2) {
          languages.push({
            language: language.charAt(0).toUpperCase() + language.slice(1),
            fluency: fluency || 'Courant'
          });
        }
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
          Téléchargez votre CV en format TXT ou PDF. Nos algorithmes intelligents l'analyseront et prérempliront automatiquement votre CV.
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
          💡 Notre système extrait automatiquement: Nom, Email, Téléphone, Poste, Expérience,<br/>
          Formation, Compétences et Langues. Vous pouvez éditer tous les champs après l'import!
        </p>
      </div>
    </div>
  );
}
