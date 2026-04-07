'use client'
import { useState } from 'react';

export default function ImportCV({ onImport }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Parser intelligent pour extraire les données structurées du CV
  const parseCV = (text) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    
    const resumeData = {
      basics: {
        name: extractName(lines),
        label: extractLabel(lines),
        email: extractEmail(text),
        phone: extractPhone(text),
        url: extractUrl(text),
        summary: extractSummary(text, lines),
        location: {
          address: '',
          postalCode: '',
          city: extractCity(lines),
          countryCode: 'FR',
          region: ''
        },
        profiles: extractProfiles(text)
      },
      work: extractWork(text, lines),
      education: extractEducation(text, lines),
      skills: extractSkills(text, lines),
      languages: extractLanguages(text, lines),
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

  const extractName = (lines) => {
    // Le nom est généralement la première ligne
    return lines[0] || 'Votre Nom';
  };

  const extractLabel = (lines) => {
    // Le titre est généralement la deuxième ligne ou contient un titre professionnel
    if (lines[1]) return lines[1];
    
    const titleKeywords = ['développeur', 'ingénieur', 'manager', 'designer', 'consultant', 
                          'chef', 'specialist', 'expert', 'analyst', 'architect', 'lead',
                          'senior', 'junior', 'architect', 'devops', 'data scientist'];
    
    for (let line of lines.slice(0, 10)) {
      const lower = line.toLowerCase();
      if (titleKeywords.some(kw => lower.includes(kw))) {
        return line;
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
    // Support plusieurs formats de téléphone
    const phoneRegex = /(\+?33|0)[1-9](?:[0-9]{8}|[0-9]{7}(?:\s[0-9]{2})?)|(\+?[0-9]{1,3}\s?[0-9]{6,14})/;
    const match = text.match(phoneRegex);
    return match ? match[0] : '';
  };

  const extractUrl = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/;
    const match = text.match(urlRegex);
    return match ? match[1] : '';
  };

  const extractCity = (lines) => {
    // Chercher une ligne avec une ville commune française
    const cities = ['paris', 'lyon', 'marseille', 'toulouse', 'nice', 'nantes', 'strasbourg',
                   'bordeaux', 'lille', 'rennes', 'reims', 'monaco', 'dijon'];
    for (let line of lines) {
      const lower = line.toLowerCase();
      if (cities.some(city => lower.includes(city))) {
        // Retourner juste la ville, pas toute la ligne
        return cities.find(city => lower.includes(city)) || line;
      }
    }
    return '';
  };

  const extractSummary = (text, lines) => {
    // Chercher une section résumé professionnel
    const summaryPatterns = [
      /résumé\s*professionnel[\s\n]+([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i,
      /summary[\s\n]+([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i,
      /profil[\s\n]+([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i,
    ];

    for (let pattern of summaryPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim().split('\n')[0];
      }
    }

    // Sinon retourner les 2-3 premières lignes utiles
    let summary = [];
    for (let line of lines.slice(0, 5)) {
      if (line.trim() && !line.includes('@') && !line.match(/^\d/) && line.length > 10) {
        summary.push(line.trim());
        if (summary.length >= 2) break;
      }
    }
    return summary.join(' ');
  };

  const extractProfiles = (text) => {
    const profiles = [];
    const lower = text.toLowerCase();

    if (lower.includes('linkedin')) {
      const linkedinUrl = text.match(/https?:\/\/(www\.)?linkedin\.com\/in\/[^\s]+/i);
      profiles.push({ 
        network: 'LinkedIn', 
        username: linkedinUrl ? linkedinUrl[0].split('/in/')[1].split('/')[0] : '', 
        url: linkedinUrl ? linkedinUrl[0] : '' 
      });
    }
    if (lower.includes('github')) {
      const githubUrl = text.match(/https?:\/\/(www\.)?github\.com\/[^\s]+/i);
      profiles.push({ 
        network: 'GitHub', 
        username: githubUrl ? githubUrl[0].split('/')[3] : '', 
        url: githubUrl ? githubUrl[0] : '' 
      });
    }
    if (lower.includes('twitter') || lower.includes('x.com')) {
      profiles.push({ network: 'Twitter', username: '', url: '' });
    }

    return profiles.length > 0 ? profiles : [];
  };

  const extractWork = (text, lines) => {
    const work = [];
    
    // Chercher des sections d'expérience
    const expRegex = /(exp[eé]rien[ce]{2}|professionn[^ ]*|work experience|poste|emploi)[\s\n]*([\s\S]*?)(?=\n\n[A-Z]|FORMATION|EDUCATION|COMPÉTENCES|SKILLS|$)/i;
    const expMatch = text.match(expRegex);
    
    if (expMatch && expMatch[2]) {
      const experienceText = expMatch[2];
      
      // Extraire chaque entrée de travail (généralement séparées par des tirets ou des nouvelles lignes)
      const jobRegex = /(?:^|\n)(.*?(?:développeur|ingénieur|manager|consultant|chef|lead|senior|junior|analyst|architect).*?)\s*[-––]\s*(.+?)(?=\n(?:.*?(?:développeur|ingénieur|manager|consultant|chef|lead|senior|junior|analyst|architect)|$))/gim;
      
      let jobMatch;
      while ((jobMatch = jobRegex.exec(experienceText)) !== null) {
        const titleAndCompany = jobMatch[1];
        const dateAndDetails = jobMatch[2];
        
        // Parser: "Position - Company (2020 - 2022)"
        const positionMatch = titleAndCompany.match(/^(.*?)\s*(?:@|-|à|–|–)?\s*(.*)$/);
        const position = positionMatch ? positionMatch[1].trim() : titleAndCompany;
        const company = positionMatch && positionMatch[2] ? positionMatch[2].trim() : 'Entreprise';
        
        // Extraire les dates
        const dateMatch = dateAndDetails.match(/(\d{4})\s*[-–––]\s*(?:(présent|today|now|actuel|current)|(\d{4}))/i);
        const startDate = dateMatch ? `${dateMatch[1]}-01-01` : '';
        const endDate = dateMatch && dateMatch[3] ? `${dateMatch[3]}-01-01` : dateMatch && dateMatch[2] ? '' : '';
        
        // Extraire les highlights (puces)
        const highlightLines = dateAndDetails.split('\n').filter(l => l.trim().startsWith('-') || l.trim().startsWith('•'));
        const highlights = highlightLines.map(l => l.trim().replace(/^[-–•]\s*/, ''));
        
        if (position) {
          work.push({
            name: company,
            position: position,
            url: '',
            startDate: startDate,
            endDate: endDate,
            summary: '',
            highlights: highlights.length > 0 ? highlights : ['Description à ajouter']
          });
        }
      }
    }

    return work;
  };

  const extractEducation = (text, lines) => {
    const education = [];
    
    // Chercher la section formation/éducation
    const eduRegex = /(formation|education|études|diplôme)[\s\n]*([\s\S]*?)(?=\n\n[A-Z]|COMPÉTENCES|SKILLS|EXPÉRIENCE|$)/i;
    const eduMatch = text.match(eduRegex);
    
    if (eduMatch && eduMatch[2]) {
      const educationText = eduMatch[2];
      
      // Extraire chaque entrée d'éducation
      const schoolRegex = /(?:^|\n)((?:master|licence|bac|doctorat|diplôme|degree|bachelor|phd)[^\n]*)\s*[-–––]?\s*([^\n]*(?:université|école|institute|académie|college)[^\n]*)\s*(?:\(([0-9]{4})\))?/gim;
      
      let schoolMatch;
      while ((schoolMatch = schoolRegex.exec(educationText)) !== null) {
        const studyType = schoolMatch[1].trim();
        const institution = schoolMatch[2].trim();
        const year = schoolMatch[3] || '';
        
        // Extraire le domaine d'étude
        const areaMatch = studyType.match(/(?:en|in|d'?|de)\s+([^-()]+)/i);
        const area = areaMatch ? areaMatch[1].trim() : '';
        
        if (institution || studyType) {
          education.push({
            institution: institution || 'École/Université',
            url: '',
            studyType: studyType.split(/[-–]/)[0].trim(),
            area: area,
            startDate: year ? `${year}-01-01` : '',
            endDate: '',
            score: '',
            courses: []
          });
        }
      }
    }

    return education;
  };

  const extractSkills = (text, lines) => {
    const skills = [];
    
    // Chercher la section compétences/skills
    const skillsRegex = /(compétence|skill|technolog|langage|framework|outils?|tools)[\s\n]*([\s\S]*?)(?=\n\n[A-Z]|LANGUES?|LANGUAGES?|EXPÉRIENCE|$)/i;
    const skillsMatch = text.match(skillsRegex);
    
    if (skillsMatch && skillsMatch[2]) {
      const skillsText = skillsMatch[2];
      
      // Parser les compétences avec des catégories
      const categories = [
        { name: 'Langages', pattern: /(langage|language)[^:]*:\s*([^:\n]+)/gi },
        { name: 'Frameworks', pattern: /(framework)[^:]*:\s*([^:\n]+)/gi },
        { name: 'Bases de données', pattern: /(base|database|bdd)[^:]*:\s*([^:\n]+)/gi },
        { name: 'Outils', pattern: /(outil|tool)[^:]*:\s*([^:\n]+)/gi },
      ];

      for (let cat of categories) {
        let catMatch;
        while ((catMatch = cat.pattern.exec(skillsText)) !== null) {
          const items = catMatch[2].split(/[,;]/);
          items.forEach(item => {
            const skill = item.trim();
            if (skill && skill.length > 2) {
              skills.push({
                name: skill,
                level: 'Intermédiaire',
                keywords: []
              });
            }
          });
        }
      }

      // Si pas de catégories trouvées, parser comme une liste
      if (skills.length === 0) {
        const skillLines = skillsText.split('\n').filter(l => l.trim());
        skillLines.forEach(line => {
          // Parser les items séparés par des virgules
          const items = line.split(/[,;–—]/);
          items.forEach(item => {
            const skill = item.trim().replace(/^[-•]\s*/, '');
            if (skill && skill.length > 2 && !skill.includes(':')) {
              skills.push({
                name: skill,
                level: 'Intermédiaire',
                keywords: []
              });
            }
          });
        });
      }
    }

    return skills;
  };

  const extractLanguages = (text, lines) => {
    const languages = [];
    
    // Chercher la section langues
    const langRegex = /(langue|language)[s]?[\s\n]*([\s\S]*?)(?=\n\n[A-Z]|CERTIFICATION|$)/i;
    const langMatch = text.match(langRegex);
    
    if (langMatch && langMatch[2]) {
      const languagesText = langMatch[2];
      
      // Parser les langues: "Français - Natif" ou "Français (Natif)"
      const langPattern = /([a-zàâäéèêëïîôöûüç]+)\s*[-–––:]?\s*([^(\n]*(?:\([^)]*\))?|[^\n]*)/gi;
      
      let langItem;
      while ((langItem = langPattern.exec(languagesText)) !== null) {
        const language = langItem[1].trim();
        const fluency = langItem[2].trim().replace(/[()]/g, '');
        
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
        // Extraire le texte du PDF
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
      // Charger pdfjs dynamiquement (côté client uniquement)
      const pdfjsLib = await import('pdfjs-dist');
      
      // Configurer le worker - utiliser le fichier local dans public/
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      // Extraire le texte de chaque page
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
          Téléchargez votre CV en format TXT ou PDF et nous l'analyserons pour préremplir votre template
        </p>

        <label className="inline-block">
          <input
            type="file"
            accept=".txt,.pdf,.docx"
            onChange={handleFileUpload}
            disabled={isLoading}
            className="hidden"
          />
          <span className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer transition-colors">
            {isLoading ? '⏳ Analyse en cours...' : '📤 Importer un CV'}
          </span>
        </label>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
            ⚠️ {error}
          </div>
        )}

        <p className="text-[10px] text-gray-500 mt-4 leading-relaxed">
          💡 Analyse intelligente: Notre système extrait automatiquement<br/>
          Nom, Email, Expérience, Formation, Compétences, Langues et plus encore!<br/>
          Vous pourrez modifier tous les champs après l'import.
        </p>
      </div>
    </div>
  );
}
