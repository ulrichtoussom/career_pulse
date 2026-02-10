export default function CVTemplateEpure({ data }) {
    // Sécurité si data est absent
    if (!data) return <div className="p-16 text-center italic text-gray-400">Génération du profil épuré...</div>;

    return (
      <div className="bg-white p-16 w-[794px] min-h-[1120px] text-gray-800 font-serif" id="cv-preview">
        <header className="text-center border-b-2 border-black pb-8 mb-10">
          <h1 className="text-4xl font-light tracking-[0.2em] uppercase">
            {data?.header?.name || "Candidat"}
          </h1>
          <p className="text-lg italic mt-2 text-gray-500">
            {data?.header?.title || "Profil Professionnel"}
          </p>
        </header>
  
        <div className="grid grid-cols-1 gap-10">
          <section>
            <h2 className="text-xs font-bold tracking-widest uppercase mb-4 text-gray-400">Résumé</h2>
            <p className="text-sm leading-relaxed">
              {data?.cv?.summary || "Résumé en cours de rédaction..."}
            </p>
          </section>
  
          <section>
            <h2 className="text-xs font-bold tracking-widest uppercase mb-6 text-gray-400">Parcours</h2>
            <div className="space-y-8">
              {/* Sécurisation du parcours */}
              {(data?.cv?.experience || []).map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-lg font-bold">{exp?.role || "Poste occupé"}</h3>
                    <span className="text-sm italic">{exp?.period || "Période"}</span>
                  </div>
                  <p className="text-md mb-3 font-semibold">{exp?.company || "Entreprise"}</p>
                  <ul className="space-y-1">
                    {/* Sécurisation des tâches */}
                    {(exp?.tasks || []).map((task, j) => (
                      <li key={j} className="text-sm text-gray-600">• {task}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="pt-8 border-t border-gray-100">
            <h2 className="text-xs font-bold tracking-widest uppercase mb-4 text-gray-400">Contact & Infos</h2>
            <div className="grid grid-cols-2 gap-4 text-sm italic text-gray-600">
                <p>📧 {data?.header?.email || "Non renseigné"}</p>
                <p>📞 {data?.header?.phone || "Non renseigné"}</p>
                <p>📍 {data?.header?.location || "Paris, France"}</p> 
                {/* On ajoute les compétences ici aussi pour l'équilibre du template épuré */}
                <p>🛠️ {(data?.cv?.skills || []).slice(0, 5).join(", ")}</p>
            </div>
          </section>
        </div>
      </div>
    );
}