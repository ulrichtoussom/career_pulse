'use client'
import { useState } from 'react';

export default function ImportCV({ onImport }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Parser de CV simple - transforme le texte en JSON Resume
  const parseCV = (text) => {
    const lines = text.split('\n').filter(l => l.trim());
    
    // Extraction basique des informations
    const resumeData = {
      basics: {
        name: extractName(text),
        label: extractTitle(lines),
        email: extractEmail(text),
        phone: extractPhone(text),
        url: extractUrl(text),
        summary: extractSummary(lines),
        location: {
          address: '',
          postalCode: '',
          city: extractCity(lines),
          countryCode: 'FR',
          region: ''
        },
        profiles: extractProfiles(lines)
      },
      work: extractWork(lines),
      education: extractEducation(lines),
      skills: extractSkills(lines),
      languages: extractLanguages(lines),
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
    const lines = text.split('\n');
    // Premier ligne souvent le nom
    return lines[0]?.trim() || 'Votre Nom';
  };

  const extractTitle = (lines) => {
    // Chercher des mots clés de titre
    const titleKeywords = ['développeur', 'ingénieur', 'manager', 'designer', 'consultant', 'chef', 'specialist', 'expert'];
    for (let line of lines) {
      const lower = line.toLowerCase();
      if (titleKeywords.some(kw => lower.includes(kw))) {
        return line.trim();
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
    const phoneRegex = /(\+?33|0)[1-9](?:[0-9]{8}|[0-9]{7}(?:\s[0-9]{2})?)/;
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
    const cities = ['paris', 'lyon', 'marseille', 'toulouse', 'nice', 'nantes', 'strasbourg'];
    for (let line of lines) {
      const lower = line.toLowerCase();
      if (cities.some(city => lower.includes(city))) {
        return line.trim();
      }
    }
    return '';
  };

  const extractSummary = (lines) => {
    // Prendre les premières lignes non vides comme résumé
    let summary = [];
    for (let line of lines.slice(0, 5)) {
      if (line.trim() && !line.includes('@') && !line.match(/^\d/)) {
        summary.push(line.trim());
      }
    }
    return summary.join(' ');
  };

  const extractProfiles = (lines) => {
    const profiles = [];
    const text = lines.join(' ').toLowerCase();
    
    if (text.includes('linkedin')) {
      profiles.push({ network: 'LinkedIn', username: '', url: '' });
    }
    if (text.includes('github')) {
      profiles.push({ network: 'GitHub', username: '', url: '' });
    }
    if (text.includes('twitter')) {
      profiles.push({ network: 'Twitter', username: '', url: '' });
    }
    
    return profiles.length > 0 ? profiles : [{ network: 'LinkedIn', username: '', url: '' }];
  };

  const extractWork = (lines) => {
    const work = [];
    const text = lines.join('\n');
    
    // Chercher des sections "Expérience" ou "Experience"
    const expRegex = /exp[eé]rien[ce]{2}|professionn[^ ]*/i;
    const expMatch = text.match(expRegex);
    
    if (expMatch) {
      // Créer une entrée par défaut
      work.push({
        name: 'Entreprise',
        position: 'Poste',
        url: '',
        startDate: '',
        endDate: '',
        summary: 'Description de votre expérience',
        highlights: ['Réalisation 1', 'Réalisation 2']
      });
    }
    
    return work;
  };

  const extractEducation = (lines) => {
    const education = [];
    const text = lines.join('\n').toLowerCase();
    
    // Chercher des sections "Formation" ou "Education"
    if (text.includes('formation') || text.includes('education') || text.includes('diplôme')) {
      education.push({
        institution: 'École/Université',
        url: '',
        studyType: 'Diplôme',
        area: 'Domaine d\'étude',
        startDate: '',
        endDate: '',
        score: '',
        courses: []
      });
    }
    
    return education;
  };

  const extractSkills = (lines) => {
    const skills = [];
    const text = lines.join('\n').toLowerCase();
    
    // Chercher des sections "Compétences" ou "Skills"
    if (text.includes('compétence') || text.includes('skill') || text.includes('technologies')) {
      skills.push(
        { name: 'JavaScript', level: 'Advanced', keywords: [] },
        { name: 'React', level: 'Advanced', keywords: [] }
      );
    }
    
    return skills;
  };

  const extractLanguages = (lines) => {
    const languages = [];
    const text = lines.join('\n');
    
    // Chercher des sections "Langues"
    if (text.toLowerCase().includes('langue')) {
      languages.push({ language: 'Français', fluency: 'Native speaker' });
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
      
      // Configurer le worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      
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
          Téléchargez votre CV en format TXT ou PDF et nous le convertirons en JSON Resume
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
            {isLoading ? '⏳ Chargement...' : '📤 Importer un CV'}
          </span>
        </label>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
            ⚠️ {error}
          </div>
        )}

        <p className="text-[10px] text-gray-500 mt-4 leading-relaxed">
          💡 Conseils: Importez votre CV en TXT ou PDF pour de meilleurs résultats.<br/>
          Les champs détectés: Nom, Email, Téléphone, Expérience, Formation, Compétences
        </p>
      </div>
    </div>
  );
}
