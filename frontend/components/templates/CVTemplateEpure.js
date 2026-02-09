export default function CVTemplateEpure({ data }) {
    return (
      <div className="bg-white p-16 w-[794px] min-h-[1120px] text-gray-800 font-serif" id="cv-preview">
        <header className="text-center border-b-2 border-black pb-8 mb-10">
          <h1 className="text-4xl font-light tracking-[0.2em] uppercase">{data.header.name}</h1>
          <p className="text-lg italic mt-2 text-gray-500">{data.header.title}</p>
        </header>
  
        <div className="grid grid-cols-1 gap-10">
          <section>
            <h2 className="text-xs font-bold tracking-widest uppercase mb-4 text-gray-400">Résumé</h2>
            <p className="text-sm leading-relaxed">{data.cv.summary}</p>
          </section>
  
          <section>
            <h2 className="text-xs font-bold tracking-widest uppercase mb-6 text-gray-400">Parcours</h2>
            <div className="space-y-8">
              {data.cv.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-lg font-bold">{exp.role}</h3>
                    <span className="text-sm italic">{exp.period}</span>
                  </div>
                  <p className="text-md mb-3">{exp.company}</p>
                  <ul className="space-y-1">
                    {exp.tasks.map((task, j) => (
                      <li key={j} className="text-sm text-gray-600">• {task}</li>
                    ))}
                  </ul>
                </div>
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
        </div>
      </div>
    );
  }