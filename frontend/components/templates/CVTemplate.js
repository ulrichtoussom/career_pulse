
export default function CVTemplate({ data }) {
  // Sécurité si data est absent au chargement
  if (!data) return <div className="p-10 text-center">Chargement du profil...</div>;

  return (
    <div className="bg-white shadow-2xl mx-auto my-4 min-h-[1120px] w-[794px] flex text-[#333] font-sans border border-gray-100" id="cv-preview">
      {/* Barre Latérale Gauche (Style Moderne) */}
      <div className="w-1/3 bg-[#2c3e50] text-white p-8 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold uppercase tracking-wider">
              {data?.header?.name || "Candidat"}
          </h1>
          <p className="text-blue-400 font-medium mt-1">
              {data?.header?.title || "Développeur"}
          </p>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="text-sm font-bold border-b border-blue-400 pb-1 mb-3 uppercase">Compétences</h3>
            <ul className="text-xs space-y-2 opacity-90">
              {/* Sécurisation du map skills */}
              {(data?.cv?.skills || []).map((skill, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                  {skill}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
                <h3 className="text-[#a855f7] text-xs font-black uppercase tracking-[0.2em] mb-4">Langues</h3>
                <div className="space-y-2">
                {(data?.cv?.languages || []).map((lang, i) => (
                    <div key={i} className="flex justify-between items-center text-[11px] font-medium ">
                      <span>{lang}</span>
                      <div className="flex gap-1">
                          {/* Petits points décoratifs pour le niveau */}
                          {[1, 2, 3, 4, 5].map((dot) => (
                          <div key={dot} className={`w-1.5 h-1.5 rounded-full ${dot <= 4 ? 'bg-blue-400' : 'bg-blue-400'}`}></div>
                          ))}
                      </div>
                    </div>
                ))}
                </div>
          </section>

          <section className="mb-10">
              <h3 className="text-[#a855f7] text-xs font-black uppercase tracking-[0.2em] mb-4">Loisirs</h3>
              <div className="flex flex-wrap gap-2">
                  {(data?.cv?.interests || []).map((interest, i) => (
                  <span key={i} className="text-[10px] text-gray-500 italic">
                      {interest}{i < data.cv.interests.length - 1 ? " • " : ""}
                  </span>
                  ))}
              </div>
            </section>

          <section>
            <h3 className="text-sm font-bold border-b border-blue-400 pb-1 mb-3 uppercase">Contact</h3>
            <div className="text-[10px] space-y-2 opacity-90">
              <p className="flex items-center gap-2">📧 {data?.header?.email || "Non renseigné"}</p>
              <p className="flex items-center gap-2">📞 {data?.header?.phone || "Non renseigné"}</p>
              <p className="flex items-center gap-2">📍 {data?.header?.location || "France"}</p> 
            </div>
        </section>
        
        </div>
      </div>

      {/* Contenu Principal Droite */}
      <div className="flex-1 p-10 bg-white">
        <section className="mb-8">
          <h3 className="text-lg font-bold text-[#2c3e50] border-b-2 border-gray-100 pb-1 mb-4">Profil Professionnel</h3>
          <p className="text-sm leading-relaxed text-gray-600">
              {data?.cv?.summary || "Résumé en attente de génération..."}
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-[#2c3e50] border-b-2 border-gray-100 pb-1 mb-6">Expériences</h3>
          <div className="space-y-6">
            {/* Sécurisation du map experience */}
            {(data?.cv?.experience || []).map((exp, i) => (
              <div key={i} className="relative pl-4 border-l-2 border-blue-100">
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-2 border-blue-400 rounded-full"></div>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-sm uppercase">{exp?.role || "Poste"}</h4>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded">
                      {exp?.period || "Période"}
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-500 mb-2">{exp?.company || "Entreprise"}</p>
                <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                  {/* Sécurisation du map tasks */}
                  {(exp?.tasks || []).map((task, j) => (
                    <li key={j}>{task}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}