// frontend/components/templates/CVTemplateCreatif.js

export default function CVTemplateCreatif({ data }) {
    if (!data) return null;
  
    return (
      <div className="bg-white w-[794px] min-h-[1120px] flex flex-col shadow-2xl overflow-hidden font-sans" id="cv-preview">
        {/* HEADER AVEC DESIGN GÉOMÉTRIQUE */}
        <header className="relative bg-gradient-to-r from-[#6366f1] to-[#a855f7] p-12 text-white overflow-hidden">
          {/* Forme décorative en arrière-plan */}
          <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h1 className="text-5xl font-black tracking-tighter mb-2 uppercase italic">
              {data.header.name}
            </h1>
            <div className="inline-block bg-white text-[#6366f1] px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest shadow-lg">
              {data.header.title}
            </div>
          </div>
        </header>
  
        <div className="flex flex-1">
          {/* COLONNE GAUCHE - COMPÉTENCES & INFOS */}
          <aside className="w-1/3 bg-gray-50 p-10 border-r border-gray-100">
            <section className="mb-10">
              <h3 className="text-[#a855f7] text-xs font-black uppercase tracking-[0.2em] mb-6">Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {data.cv.skills.map((skill, i) => (
                  <span key={i} className="bg-white border border-purple-100 text-purple-700 px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
  
            <section>
                <h3 className="text-sm font-bold border-b border-blue-400 pb-1 mb-3 uppercase">Contact</h3>
                <div className="text-[10px] space-y-2 opacity-90">
                    <p className="flex items-center gap-2">📧 {data.header.email}</p>
                    <p className="flex items-center gap-2">📞 {data.header.phone}</p>
                    <p className="flex items-center gap-2">📍 Paris, France</p> 
                </div>
            </section>
            
          </aside>
  
          {/* COLONNE DROITE - EXPÉRIENCES & PROFIL */}
          <main className="flex-1 p-12">
            <section className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <span className="h-[2px] w-8 bg-purple-500"></span>
                <h3 className="text-lg font-black uppercase italic text-gray-800">À propos de moi</h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-600 font-medium">
                {data.cv.summary}
              </p>
            </section>
  
            <section>
              <div className="flex items-center gap-4 mb-8">
                <span className="h-[2px] w-8 bg-purple-500"></span>
                <h3 className="text-lg font-black uppercase italic text-gray-800">Parcours</h3>
              </div>
              
              <div className="space-y-10">
                {data.cv.experience.map((exp, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-end mb-2">
                      <h4 className="text-md font-black text-gray-900 group-hover:text-purple-600 transition-colors">
                        {exp.role}
                      </h4>
                      <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-purple-500 mb-4">{exp.company}</p>
                    <ul className="space-y-2">
                      {exp.tasks.map((task, j) => (
                        <li key={j} className="text-[11px] text-gray-500 flex gap-2">
                          <span className="text-purple-400">▹</span>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    );
  }