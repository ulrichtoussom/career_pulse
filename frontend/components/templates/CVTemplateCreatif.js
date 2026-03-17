export default function CVTemplateCreatif({ data, theme = {} }) {
  const {
    primaryColor = "#6366f1", // Indigo
    secondaryColor = "#a855f7", // Purple
    fontFamily = "font-sans"
  } = theme;

  if (!data) return <div className="p-10 text-center text-gray-500">Chargement...</div>;

  const basics = data.basics || {};
  const work = data.work || [];
  const education = data.education || [];
  const projects = data.projects || [];
  const skills = data.skills || [];
  const languages = data.languages || [];

  return (
    <div className={`bg-white w-[794px] min-h-[1120px] flex flex-col shadow-2xl overflow-hidden ${fontFamily}`} id="cv-preview">
      
      {/* HEADER AVEC GRADIENT DYNAMIQUE */}
      <header className="relative p-12 text-white overflow-hidden" 
              style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-black tracking-tighter mb-2 uppercase italic">
            {basics.name || "Nom"}
          </h1>
          <div className="inline-block bg-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest shadow-lg"
               style={{ color: primaryColor }}>
            {basics.label || "Poste visé"}
          </div>
          <div className="mt-4 flex gap-4 text-[10px] font-bold uppercase tracking-widest opacity-90">
             <span>{basics.email}</span>
             <span>{basics.phone}</span>
             <span>{basics.location?.city}</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* COLONNE GAUCHE (ASIDE) */}
        <aside className="w-1/3 bg-gray-50 p-10 border-r border-gray-100 flex flex-col gap-10">
          
          {/* EXPERTISE */}
          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6" style={{ color: secondaryColor }}>Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span key={i} className="bg-white border px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-sm transition-transform hover:scale-105"
                      style={{ borderColor: `${primaryColor}20`, color: primaryColor }}>
                  {typeof skill === 'object' ? skill.name : skill}
                </span>
              ))}
            </div>
          </section>

          {/* FORMATION (AJOUTÉ) */}
          {education.length > 0 && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6" style={{ color: secondaryColor }}>Formation</h3>
              <div className="space-y-6">
                {education.map((edu, i) => (
                  <div key={i} className="relative pl-4 border-l-2" style={{ borderColor: `${primaryColor}30` }}>
                    <p className="text-[11px] font-black text-gray-800 uppercase leading-tight">{edu.studyType}</p>
                    <p className="text-[10px] font-bold opacity-70 mb-1" style={{ color: primaryColor }}>{edu.area}</p>
                    <p className="text-[9px] font-medium text-gray-400 uppercase tracking-tighter">{edu.institution} • {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* LANGUES */}
          <section>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4" style={{ color: secondaryColor }}>Langues</h3>
              <div className="space-y-2">
                  {languages.map((lang, i) => {
                      const languageName = lang.language || lang.name || lang;
                      return (
                        <div key={i} className="flex justify-between items-center text-[11px] font-medium text-gray-700">
                            <span>{languageName}</span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((dot) => (
                                    <div key={dot} className="w-1.5 h-1.5 rounded-full" 
                                         style={{ backgroundColor: dot <= 4 ? primaryColor : '#e5e7eb' }}></div>
                                ))}
                            </div>
                        </div>
                      );
                  })}
              </div>
          </section>
        </aside>

        {/* COLONNE DROITE (MAIN) */}
        <main className="flex-1 p-12 overflow-hidden">
          
          {/* EXPÉRIENCES */}
          <section className="mb-12">
            <div className="flex items-center gap-4 mb-8">
              <span className="h-[2px] w-8" style={{ backgroundColor: secondaryColor }}></span>
              <h3 className="text-lg font-black uppercase italic text-gray-800">Expériences</h3>
            </div>
            <div className="space-y-10">
              {work.map((exp, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <h4 className="text-md font-black text-gray-900 group-hover:text-indigo-600 transition-colors uppercase leading-none">
                      {exp.position}
                    </h4>
                    <span className="text-[9px] font-black text-gray-400 bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
                      {exp.startDate} — {exp.endDate || "Présent"}
                    </span>
                  </div>
                  <p className="text-xs font-bold mb-4 uppercase tracking-wider" style={{ color: primaryColor }}>{exp.name || exp.company}</p>
                  <ul className="space-y-2">
                    {(exp.highlights || []).map((task, j) => (
                      <li key={j} className="text-[11px] text-gray-500 flex gap-2 leading-relaxed">
                        <span style={{ color: primaryColor }}>▹</span>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* PROJETS (AJOUTÉ) */}
          {projects.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-8">
                <span className="h-[2px] w-8" style={{ backgroundColor: secondaryColor }}></span>
                <h3 className="text-lg font-black uppercase italic text-gray-800">Projets Clés</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {projects.map((proj, i) => (
                  <div key={i} className="p-4 rounded-xl border-2 border-dashed bg-gray-50/50 transition-all hover:bg-white hover:shadow-md"
                       style={{ borderColor: `${primaryColor}15` }}>
                    <h4 className="text-xs font-black uppercase mb-1" style={{ color: primaryColor }}>{proj.name}</h4>
                    <p className="text-[11px] text-gray-600 leading-relaxed mb-3">{proj.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {proj.highlights?.map((h, j) => (
                        <span key={j} className="text-[9px] font-bold px-2 py-0.5 rounded bg-white border border-gray-100 text-gray-400">
                          #{h}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}