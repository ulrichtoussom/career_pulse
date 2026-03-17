import { adjustBrightness } from "../CareerModule";

export default function CVTemplateModerne({ data, theme = {} }) {
  // 1. Valeurs par défaut du thème
  const {
    primaryColor = "#2c3e50",
    fontFamily = "font-sans"
  } = theme;

  // 2. LOGIQUE DYNAMIQUE : Génère une couleur d'accentuation basée sur la couleur primaire
  const accentColor = adjustBrightness(primaryColor, 60);
  
  if (!data) return <div className="p-10 text-center">Chargement du profil...</div>;

  // Extraction des données avec sécurité
  const basics = data.basics || {};
  const work = data.work || [];
  const education = data.education || [];
  const projects = data.projects || [];
  const skills = data.skills || [];
  const languages = data.languages || [];

  return (
    <div className={`bg-white shadow-2xl mx-auto my-4 min-h-[1120px] w-[794px] flex text-[#333] ${fontFamily} border border-gray-100`} id="cv-preview">
      
      {/* --- BARRE LATÉRALE GAUCHE --- */}
      <div className="w-1/3 p-8 flex flex-col text-white" style={{ backgroundColor: primaryColor }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold uppercase tracking-wider">
              {basics.name || "Candidat"}
          </h1>
          <p className="font-medium mt-1" style={{ color: accentColor }}>
              {basics.label || "Développeur"}
          </p>
        </div>

        <div className="space-y-6 flex-1">
          {/* Compétences */}
          <section>
            <h3 className="text-sm font-bold border-b pb-1 mb-3 uppercase tracking-widest text-blue-100" style={{ borderColor: accentColor }}>Compétences</h3>
            <ul className="text-xs space-y-2 opacity-90">
              {skills.map((skill, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
                  {typeof skill === 'object' ? skill.name : skill}
                </li>
              ))}
            </ul>
          </section>

          {/* Langues */}
          <section>
            <h3 className="text-sm font-bold border-b pb-1 mb-3 uppercase tracking-widest text-blue-100" style={{ borderColor: accentColor }}>Langues</h3>
            <div className="space-y-3">
                {languages.map((lang, i) => {
                    const languageName = typeof lang === 'object' ? (lang.language || lang.name) : lang;
                    const languageLevel = typeof lang === 'object' ? (lang.fluency || lang.level) : null;
                    return (
                        <div key={i} className="text-[11px]">
                            <p className="font-bold flex justify-between">
                              <span>{languageName}</span>
                              <span className="font-normal opacity-80">{languageLevel}</span>
                            </p>
                            <div className="flex gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map((dot) => (
                                    <div key={dot} className={`w-1.5 h-1.5 rounded-full ${dot <= 4 ? '' : 'opacity-30'}`} style={{ backgroundColor: dot <= 4 ? accentColor : 'white' }}></div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
          </section>
        </div>

        {/* Contact */}
        <section className="mt-10 pt-6 border-t border-white/20">
            <h3 className="text-xs font-bold mb-3 uppercase" style={{ color: accentColor }}>Contact</h3>
            <div className="text-[10px] space-y-2 opacity-80">
              <p>📧 {basics.email || "Non renseigné"}</p>
              {basics.phone && <p>📞 {basics.phone}</p>}
              <p>📍 {basics.location?.city || "France"}</p> 
            </div>
        </section>
      </div>

      {/* --- CONTENU PRINCIPAL DROITE --- */}
      <div className="flex-1 p-10 bg-white">
        
        {/* Résumé */}
        <section className="mb-10">
          <h3 className="text-lg font-bold border-b-2 pb-1 mb-4" style={{ color: primaryColor, borderColor: '#f3f4f6' }}>Profil Professionnel</h3>
          <p className="text-sm leading-relaxed text-gray-600 italic">
              {basics.summary || "Résumé en attente de génération..."}
          </p>
        </section>

        {/* Expériences */}
        <section className="mb-10">
          <h3 className="text-lg font-bold border-b-2 pb-1 mb-6" style={{ color: primaryColor, borderColor: '#f3f4f6' }}>Expériences Professionnelles</h3>
          <div className="space-y-8">
            {work.map((exp, i) => (
              <div key={i} className="relative pl-6 border-l-2" style={{ borderColor: `${accentColor}20` }}>
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-2 rounded-full" style={{ borderColor: primaryColor }}></div>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-sm uppercase" style={{ color: primaryColor }}>{exp.position}</h4>
                  <span className="text-[10px] font-bold px-2 py-1 rounded" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                      {exp.startDate} — {exp.endDate || "Présent"}
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-400 mb-3">{exp.name || exp.company}</p>
                <ul className="space-y-2">
                  {(exp.highlights || []).map((task, j) => (
                    <li key={j} className="text-xs text-gray-600 flex gap-2">
                      <span style={{ color: accentColor }}>•</span>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Formation (AJOUTÉ) */}
        {education.length > 0 && (
          <section className="mb-10">
            <h3 className="text-lg font-bold border-b-2 pb-1 mb-6" style={{ color: primaryColor, borderColor: '#f3f4f6' }}>Formation</h3>
            <div className="space-y-4">
              {education.map((edu, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm" style={{ color: primaryColor }}>{edu.studyType} - {edu.area}</h4>
                    <p className="text-xs text-gray-500">{edu.institution}</p>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">
                    {edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projets Personnels (AJOUTÉ) */}
        {projects.length > 0 && (
          <section>
            <h3 className="text-lg font-bold border-b-2 pb-1 mb-6" style={{ color: primaryColor, borderColor: '#f3f4f6' }}>Projets Personnels</h3>
            <div className="space-y-6">
              {projects.map((proj, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-sm" style={{ color: primaryColor }}>{proj.name}</h4>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{proj.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {proj.highlights?.map((h, j) => (
                      <span key={j} className="text-[9px] px-2 py-0.5 rounded-md border" style={{ borderColor: `${accentColor}40`, color: primaryColor, backgroundColor: `${accentColor}05` }}>
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}