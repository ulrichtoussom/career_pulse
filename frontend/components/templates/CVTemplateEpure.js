export default function CVTemplateEpure({ data, theme = {} }) {
  const {
    primaryColor = "#1f2937",
    fontFamily = "font-serif"
  } = theme;

  if (!data) return <div className="p-10 text-center text-gray-400">Chargement...</div>;

  const basics = data.basics || {};
  const work = data.work || [];
  const education = data.education || [];
  const projects = data.projects || [];
  const skills = data.skills || [];

  return (
    <div className={`bg-white w-[794px] min-h-[1120px] p-16 shadow-2xl ${fontFamily}`} style={{ color: primaryColor }} id="cv-preview">
      
      {/* HEADER MINIMALISTE */}
      <header className="text-center border-b-2 pb-8 mb-12" style={{ borderColor: primaryColor }}>
        <h1 className="text-4xl tracking-[0.15em] uppercase font-light mb-2">
          {basics.name || "Candidat"}
        </h1>
        <p className="text-sm tracking-[0.3em] uppercase opacity-60 font-medium">
          {basics.label || "Profil Professionnel"}
        </p>
        <div className="mt-4 flex justify-center gap-6 text-[10px] uppercase tracking-widest opacity-50">
          <span>{basics.email}</span>
          <span>•</span>
          <span>{basics.phone}</span>
          {basics.location?.city && (
            <>
              <span>•</span>
              <span>{basics.location.city}</span>
            </>
          )}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-12">
        {/* COLONNE PRINCIPALE (Gauche - 8/12) */}
        <div className="col-span-8 space-y-12">
          
          {/* EXPÉRIENCES */}
          <section>
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase border-b mb-6 pb-1" style={{ borderColor: `${primaryColor}30` }}>Expériences</h3>
            <div className="space-y-8">
              {work.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-sm uppercase">{exp.position}</h4>
                    <span className="text-[9px] opacity-50 font-bold uppercase">{exp.startDate} — {exp.endDate || "Présent"}</span>
                  </div>
                  <p className="text-xs opacity-70 mb-3 font-medium uppercase tracking-wider">{exp.name || exp.company}</p>
                  <ul className="space-y-1.5">
                    {(exp.highlights || []).map((task, j) => (
                      <li key={j} className="text-[11px] opacity-80 leading-tight flex gap-3">
                        <span className="opacity-30">•</span>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* FORMATION (AJOUTÉ) */}
          {education.length > 0 && (
            <section>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase border-b mb-6 pb-1" style={{ borderColor: `${primaryColor}30` }}>Formation</h3>
              <div className="space-y-6">
                {education.map((edu, i) => (
                  <div key={i} className="flex justify-between items-baseline">
                    <div>
                      <h4 className="font-bold text-[11px] uppercase tracking-wide">{edu.studyType} — {edu.area}</h4>
                      <p className="text-[10px] opacity-60 uppercase mt-0.5">{edu.institution}</p>
                    </div>
                    <span className="text-[9px] opacity-50 font-bold">{edu.endDate}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* COLONNE LATÉRALE (Droite - 4/12) */}
        <div className="col-span-4 space-y-12">
          
          {/* EXPERTISE */}
          <section>
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase border-b mb-4 pb-1" style={{ borderColor: `${primaryColor}30` }}>Expertise</h3>
            <ul className="space-y-2">
              {skills.map((skill, i) => (
                <li key={i} className="text-[10px] uppercase tracking-wide opacity-70">
                  {typeof skill === 'object' ? skill.name : skill}
                </li>
              ))}
            </ul>
          </section>

          {/* PROJETS PERSONNELS (AJOUTÉ) */}
          {projects.length > 0 && (
            <section>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase border-b mb-4 pb-1" style={{ borderColor: `${primaryColor}30` }}>Projets</h3>
              <div className="space-y-5">
                {projects.map((proj, i) => (
                  <div key={i}>
                    <h4 className="text-[10px] font-bold uppercase mb-1 tracking-wider">{proj.name}</h4>
                    <p className="text-[10px] opacity-60 leading-relaxed italic">
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}