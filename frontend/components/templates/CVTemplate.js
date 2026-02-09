// frontend/components/CVTemplate.js
export default function CVTemplate({ data }) {
    if (!data) return null;
  
    return (
      <div className="bg-white shadow-2xl mx-auto my-4 min-h-[1120px] w-[794px] flex text-[#333] font-sans border border-gray-100" id="cv-preview">
        {/* Barre Latérale Gauche (Style Moderne) */}
        <div className="w-1/3 bg-[#2c3e50] text-white p-8 flex flex-col">
          <div className="mb-8">
            <h1 className="text-2xl font-bold uppercase tracking-wider">{data.header.name}</h1>
            <p className="text-blue-400 font-medium mt-1">{data.header.title}</p>
          </div>
  
          <div className="space-y-6">
            <section>
              <h3 className="text-sm font-bold border-b border-blue-400 pb-1 mb-3 uppercase">Compétences</h3>
              <ul className="text-xs space-y-2 opacity-90">
                {data.cv.skills.map((skill, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
  
            <section>
              <h3 className="text-sm font-bold border-b border-blue-400 pb-1 mb-3 uppercase">Contact</h3>
              <div className="text-[10px] space-y-2 opacity-90">
                <p className="flex items-center gap-2">📧 {data.header.email}</p>
                <p className="flex items-center gap-2">📞 {data.header.phone}</p>
                <p className="flex items-center gap-2">📍 Paris, France</p> 
              </div>
          </section>
          
          </div>
        </div>
  
        {/* Contenu Principal Droite */}
        <div className="flex-1 p-10 bg-white">
          <section className="mb-8">
            <h3 className="text-lg font-bold text-[#2c3e50] border-b-2 border-gray-100 pb-1 mb-4">Profil Professionnel</h3>
            <p className="text-sm leading-relaxed text-gray-600">{data.cv.summary}</p>
          </section>
  
          <section>
            <h3 className="text-lg font-bold text-[#2c3e50] border-b-2 border-gray-100 pb-1 mb-6">Expériences</h3>
            <div className="space-y-6">
              {data.cv.experience.map((exp, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-blue-100">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-2 border-blue-400 rounded-full"></div>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm uppercase">{exp.role}</h4>
                    <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded">{exp.period}</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-500 mb-2">{exp.company}</p>
                  <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                    {exp.tasks.map((task, j) => (
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