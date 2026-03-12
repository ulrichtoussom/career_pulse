// frontend/components/templates/CVTemplateEpure.js

export default function CVTemplateEpure({ data }) {
  // Sécurité si data est absent
  if (!data) return <div className="p-10 text-center text-gray-400">Chargement...</div>;

  const basics = data.basics || {};
  const work = data.work || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const languages = data.languages || [];

  return (
    <div className="bg-white w-[794px] min-h-[1120px] p-16 shadow-2xl font-serif text-[#2c3e50]" id="cv-preview">
      {/* HEADER MINIMALISTE CENTRAL */}
      <header className="text-center border-b-2 border-gray-900 pb-8 mb-12">
        <h1 className="text-4xl tracking-[0.15em] uppercase font-light mb-2">
          {basics.name || "Candidat"}
        </h1>
        <p className="text-sm tracking-[0.3em] uppercase text-gray-500 font-medium">
          {basics.label || "Profil Professionnel"}
        </p>
        <div className="mt-4 flex justify-center gap-6 text-[10px] uppercase tracking-widest text-gray-400">
          <span>{basics.email}</span>
          <span>•</span>
          <span>{basics.phone}</span>
          <span>•</span>
          <span>{basics.location?.city || "France"}</span>
        </div>
      </header>

      {/* RÉSUMÉ */}
      <section className="mb-12">
        <p className="text-sm leading-relaxed text-center max-w-2xl mx-auto italic text-gray-600">
          "{basics.summary || "Aucun résumé disponible."}"
        </p>
      </section>

      <div className="grid grid-cols-12 gap-12">
        {/* COLONNE GAUCHE (PLUS LARGE) - EXPÉRIENCES */}
        <div className="col-span-8 space-y-10">
          <section>
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase border-b mb-6 pb-1">Expériences</h3>
            <div className="space-y-8">
              {work.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-sm uppercase">{exp.position}</h4>
                    <span className="text-[9px] text-gray-400 font-bold uppercase">
                      {exp.startDate} — {exp.endDate || "Présent"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">{exp.name || exp.company}</p>
                  <ul className="space-y-1.5">
                    {(exp.highlights || exp.tasks || []).map((task, j) => (
                      <li key={j} className="text-[11px] text-gray-600 leading-tight flex gap-3">
                        <span className="text-gray-300">•</span>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {education.length > 0 && (
            <section>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase border-b mb-6 pb-1">Formation</h3>
              <div className="space-y-4">
                {education.map((edu, i) => (
                  <div key={i} className="flex justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase">{edu.studyType || edu.degree}</p>
                      <p className="text-[10px] text-gray-500">{edu.institution || edu.school}</p>
                    </div>
                    <span className="text-[9px] text-gray-400 font-bold">{edu.startDate || edu.year}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* COLONNE DROITE (PLUS FINE) - SKILLS & LANGUES */}
        <div className="col-span-4 space-y-10">
          <section>
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase border-b mb-4 pb-1">Expertise</h3>
            <ul className="space-y-2">
              {skills.map((skill, i) => (
                <li key={i} className="text-[10px] uppercase tracking-wide text-gray-600 flex justify-between">
                  <span>{typeof skill === 'object' ? skill.name : skill}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase border-b mb-4 pb-1">Langues</h3>
            <div className="space-y-3">
              {languages.map((lang, i) => (
                <div key={i} className="text-[10px] uppercase">
                  <p className="font-bold">{lang.language || lang.name || lang}</p>
                  <p className="text-gray-400 text-[9px]">{lang.fluency || "Maîtrisé"}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}