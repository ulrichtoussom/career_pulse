// components/templates/CVTemplateModerne.js

export default function CVTemplateModerne({ data }) {
  // Sécurité si data est absent au chargement
  if (!data) return <div className="p-10 text-center">Chargement du profil...</div>;

  // Extraction propre des données (Standard JSON Resume)
  const basics = data.basics || {};
  const work = data.work || [];
  const skills = data.skills || [];
  const languages = data.languages || [];
  const interests = data.interests || [];

  return (
    <div className="bg-white shadow-2xl mx-auto my-4 min-h-[1120px] w-[794px] flex text-[#333] font-sans border border-gray-100" id="cv-preview">
      
      {/* Barre Latérale Gauche (Style Moderne) */}
      <div className="w-1/3 bg-[#2c3e50] text-white p-8 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold uppercase tracking-wider">
              {basics.name || "Candidat"}
          </h1>
          <p className="text-blue-400 font-medium mt-1">
              {basics.label || "Développeur"}
          </p>
        </div>

        <div className="space-y-6 flex-1">
          {/* COMPÉTENCES */}
          <section>
            <h3 className="text-sm font-bold border-b border-blue-400 pb-1 mb-3 uppercase tracking-widest text-blue-100">Compétences</h3>
            <ul className="text-xs space-y-2 opacity-90">
              {skills.map((skill, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                  {typeof skill === 'object' ? skill.name : skill}
                </li>
              ))}
            </ul>
          </section>

          {/* LANGUES */}
          <section>
                <h3 className="text-sm font-bold border-b border-blue-400 pb-1 mb-3 uppercase tracking-widest text-blue-100">Langues</h3>
                <div className="space-y-3">
                    {languages.map((lang, i) => {
                        const languageName = typeof lang === 'object' ? (lang.language || lang.name) : lang;
                        const languageLevel = typeof lang === 'object' ? (lang.fluency || lang.level) : null;

                        return (
                            <div key={i} className="text-[11px]">
                                <p className="font-bold flex justify-between">
                                  <span>{languageName}</span>
                                  <span className="text-blue-300 font-normal">{languageLevel}</span>
                                </p>
                                <div className="flex gap-1 mt-1">
                                    {[1, 2, 3, 4, 5].map((dot) => (
                                        <div key={dot} className={`w-1.5 h-1.5 rounded-full ${dot <= 4 ? 'bg-blue-400' : 'bg-gray-600'}`}></div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

          {/* LOISIRS */}
          <section>
              <h3 className="text-sm font-bold border-b border-blue-400 pb-1 mb-3 uppercase tracking-widest text-blue-100">Loisirs</h3>
              <div className="flex flex-wrap gap-2">
                  {interests.map((interest, i) => (
                    <span key={i} className="text-[10px] text-gray-300 italic">
                        {typeof interest === 'object' ? interest.name : interest}
                        {i < interests.length - 1 ? " • " : ""}
                    </span>
                  ))}
              </div>
            </section>
        </div>

        {/* CONTACT (Bas de colonne) */}
        <section className="mt-10 pt-6 border-t border-gray-600">
            <h3 className="text-xs font-bold mb-3 uppercase text-blue-400">Contact</h3>
            <div className="text-[10px] space-y-2 opacity-80">
              <p className="flex items-center gap-2">📧 {basics.email || "Non renseigné"}</p>
              {basics.phone && <p className="flex items-center gap-2">📞 {basics.phone}</p>}
              <p className="flex items-center gap-2">📍 {basics.location?.city || "France"}</p> 
            </div>
        </section>
      </div>

      {/* Contenu Principal Droite */}
      <div className="flex-1 p-10 bg-white">
        {/* PROFIL */}
        <section className="mb-10">
          <h3 className="text-lg font-bold text-[#2c3e50] border-b-2 border-gray-100 pb-1 mb-4">Profil Professionnel</h3>
          <p className="text-sm leading-relaxed text-gray-600 italic">
              {basics.summary || "Résumé en attente de génération..."}
          </p>
        </section>

        {/* EXPÉRIENCES */}
        <section>
          <h3 className="text-lg font-bold text-[#2c3e50] border-b-2 border-gray-100 pb-1 mb-6">Expériences Professionnelles</h3>
          <div className="space-y-8">
            {work.map((exp, i) => (
              <div key={i} className="relative pl-6 border-l-2 border-blue-50">
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-2 border-[#2c3e50] rounded-full"></div>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-sm uppercase text-[#2c3e50]">{exp.position}</h4>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {exp.startDate} — {exp.endDate || "Présent"}
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-500 mb-3">{exp.name || exp.company}</p>
                <ul className="space-y-2">
                  {(exp.highlights || []).map((task, j) => (
                    <li key={j} className="text-xs text-gray-600 flex gap-2">
                      <span className="text-blue-400">•</span>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FORMATION (Ajouté pour être complet) */}
        {data.education && data.education.length > 0 && (
          <section className="mt-10">
            <h3 className="text-lg font-bold text-[#2c3e50] border-b-2 border-gray-100 pb-1 mb-6">Formation</h3>
            <div className="space-y-4">
              {data.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold uppercase">{edu.studyType || edu.area}</h4>
                    <p className="text-[11px] text-gray-500">{edu.institution}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 italic">{edu.startDate}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}