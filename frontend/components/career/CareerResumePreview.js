
export default function ResumePreview({ data, layout, sectionTitles }) {

    // Helper pour formater le texte gras
    const renderFormattedText = (text) => {
      if (!text) return null;
      const parts = text.split(/(\*\*.*?\*\*)/);
      return parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={idx}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
    };

    const formatText = (text) => {
        if (!text) return null;
        return (
          <div className="whitespace-pre-wrap break-words text-justify">
            {text.split('\n').map((line, i) => {
              if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) {
                return (
                  <div key={i} className="flex gap-2 ml-2">
                    <span>•</span>
                    <span>{renderFormattedText(line.replace(/^[•\-*]\s*/, ''))}</span>
                  </div>
                );
              }
              return <p key={i} className={line.trim() === '' ? 'h-2' : ''}>{renderFormattedText(line)}</p>;
            })}
          </div>
        );
    };

    const renderBullets = (items) => items?.filter(i => i?.trim()).map((item, j) => (
        <div key={j} className="flex gap-2 ml-2 text-[10px]">
            <span>•</span>
            <span>{renderFormattedText(item)}</span>
        </div>
    ));

    // Render header basé sur le style
    const renderHeader = () => {
      const baseStyles = {
        fontFamily: layout.fontFamily,
        color: layout.primaryColor,
        fontSize: `${layout.fontSize}px`,
        lineHeight: layout.lineHeight
      };

      switch(layout.headerStyle) {
        case 'colored-bg':
          // Fond coloré avec texte blanc
          return (
            <header 
              className="p-6 mb-6 rounded-lg"
              style={{ 
                backgroundColor: layout.primaryColor,
                color: 'white'
              }}
            >
              <h1 className="text-3xl font-black uppercase tracking-tighter mb-1">
                {data.basics.name}
              </h1>
              {data.basics.label && <p className="text-sm font-bold opacity-90 mb-3">{data.basics.label}</p>}
              
              <div className="flex flex-wrap gap-3 text-[9px] font-bold uppercase opacity-80">
                {data.basics.email && <span>{data.basics.email}</span>}
                {data.basics.phone && <span>•</span>}
                {data.basics.phone && <span>{data.basics.phone}</span>}
                {data.basics.url && <span>•</span>}
                {data.basics.url && <span>{data.basics.url.replace(/^https?:\/\//, '')}</span>}
              </div>
            </header>
          );

        case 'gradient-bg':
          // Gradient background
          return (
            <header 
              className="p-6 mb-6 rounded-lg text-white"
              style={{ 
                background: `linear-gradient(135deg, ${layout.primaryColor} 0%, ${layout.accentColor} 100%)`
              }}
            >
              <h1 className="text-3xl font-black uppercase tracking-tighter mb-1">
                {data.basics.name}
              </h1>
              {data.basics.label && <p className="text-sm font-bold opacity-90 mb-3">{data.basics.label}</p>}
              
              <div className="flex flex-wrap gap-3 text-[9px] font-bold uppercase opacity-85">
                {data.basics.email && <span>{data.basics.email}</span>}
                {data.basics.phone && <span>•</span>}
                {data.basics.phone && <span>{data.basics.phone}</span>}
                {data.basics.url && <span>•</span>}
                {data.basics.url && <span>{data.basics.url.replace(/^https?:\/\//, '')}</span>}
              </div>
            </header>
          );

        case 'sidebar-accent':
          // Ligne accent sur le côté
          return (
            <header 
              className="mb-6 pl-4 border-l-4"
              style={{ 
                borderColor: layout.primaryColor,
                paddingLeft: '16px'
              }}
            >
              <h1 className="text-3xl font-black uppercase tracking-tighter mb-1" style={{ color: layout.primaryColor }}>
                {data.basics.name}
              </h1>
              {data.basics.label && <p className="text-sm font-bold text-gray-500 mb-3">{data.basics.label}</p>}
              
              <div className="flex flex-wrap gap-3 text-[9px] font-bold uppercase text-gray-600">
                {data.basics.email && <span>{data.basics.email}</span>}
                {data.basics.phone && <span>•</span>}
                {data.basics.phone && <span>{data.basics.phone}</span>}
                {data.basics.url && <span>•</span>}
                {data.basics.url && <span>{data.basics.url.replace(/^https?:\/\//, '')}</span>}
              </div>
            </header>
          );

        case 'line-bottom':
        case 'classic-line':
        case 'gradient-line':
        case 'luxury-line':
        case 'minimal':
        default:
          // Standard avec bordure en bas
          return (
            <header 
              className="mb-6 pb-4"
              style={{ 
                borderBottom: `2px solid ${layout.primaryColor}`
              }}
            >
              <h1 className="text-3xl font-black uppercase tracking-tighter mb-1" style={{ color: layout.primaryColor }}>
                {data.basics.name}
              </h1>
              {data.basics.label && <p className="text-sm font-bold text-gray-500 mb-3">{data.basics.label}</p>}
              
              <div className="flex flex-wrap gap-3 text-[9px] font-bold uppercase text-gray-600">
                {data.basics.email && <span>{data.basics.email}</span>}
                {data.basics.phone && <span>•</span>}
                {data.basics.phone && <span>{data.basics.phone}</span>}
                {data.basics.url && <span>•</span>}
                {data.basics.url && <span>{data.basics.url.replace(/^https?:\/\//, '')}</span>}
                {data.basics.location?.city && <span>•</span>}
                {data.basics.location?.city && <span>{data.basics.location.city}</span>}
              </div>
            </header>
          );
      }
    };

    // Section Title Component
    const SectionTitle = ({ name }) => (
      <h2 
        className="text-sm font-black uppercase tracking-[0.2em] mb-3 pb-2"
        style={{ 
          color: layout.primaryColor,
          borderBottom: `1px solid ${layout.accentColor}`
        }}
      >
        {sectionTitles?.[name] || name}
      </h2>
    );

    return (
      <div className="h-full">
        {/* HEADER AVEC STYLE APPLIQUÉ */}
        {renderHeader()}

        {/* Social Profiles */}
        {data.basics.profiles?.filter(p => p.network && p.url).length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4 text-[9px]">
            {data.basics.profiles.filter(p => p.network && p.url).map((p, i) => (
              <span key={i} style={{ color: layout.primaryColor }} className="font-bold">
                {p.network}: {p.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </span>
            ))}
          </div>
        )}

        {/* SUMMARY */}
        {data.basics.summary && (
          <section style={{ marginBottom: `${layout.sectionSpacing}px` }}>
            <div className="leading-relaxed text-justify text-[10px]">{formatText(data.basics.summary)}</div>
          </section>
        )}

        {/* EXPERIENCE */}
        {data.work?.length > 0 && (
          <section style={{ marginBottom: `${layout.sectionSpacing}px` }}>
            <SectionTitle name="work" />
            <div className="space-y-3">
              {data.work.map((job, i) => (
                <div key={i} className="text-[10px]">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-black uppercase">{job.position}</div>
                      <div className="text-gray-600">{job.name}</div>
                    </div>
                    <div className="text-gray-500 text-[9px] text-right">
                      {job.startDate} → {job.endDate}
                    </div>
                  </div>
                  {job.summary && <div className="mt-1 text-justify">{formatText(job.summary)}</div>}
                  {job.highlights?.length > 0 && <div className="mt-2">{renderBullets(job.highlights)}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {data.education?.length > 0 && (
          <section style={{ marginBottom: `${layout.sectionSpacing}px` }}>
            <SectionTitle name="education" />
            <div className="space-y-3">
              {data.education.map((edu, i) => (
                <div key={i} className="text-[10px]">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-black uppercase">{edu.studyType} in {edu.area}</div>
                      <div className="text-gray-600">{edu.institution}</div>
                    </div>
                    <div className="text-gray-500 text-[9px] text-right">
                      {edu.startDate} → {edu.endDate}
                    </div>
                  </div>
                  {edu.score && <div className="mt-1 text-gray-600">Score: {edu.score}</div>}
                  {edu.courses?.length > 0 && <div className="mt-2">{renderBullets(edu.courses)}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS */}
        {data.skills?.length > 0 && (
          <section style={{ marginBottom: `${layout.sectionSpacing}px` }}>
            <SectionTitle name="skills" />
            <div className="text-[10px] space-y-1">
              {data.skills.map((skill, i) => (
                <div key={i} className="flex justify-between">
                  <div className="font-bold">{skill.name}</div>
                  <div className="text-gray-600">{skill.level}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* LANGUAGES */}
        {data.languages?.length > 0 && (
          <section style={{ marginBottom: `${layout.sectionSpacing}px` }}>
            <SectionTitle name="languages" />
            <div className="text-[10px] space-y-1">
              {data.languages.map((lang, i) => (
                <div key={i} className="flex justify-between">
                  <div className="font-bold">{lang.language}</div>
                  <div className="text-gray-600">{lang.fluency}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* AWARDS */}
        {data.awards?.length > 0 && (
          <section style={{ marginBottom: `${layout.sectionSpacing}px` }}>
            <SectionTitle name="awards" />
            <div className="space-y-2 text-[10px]">
              {data.awards.map((award, i) => (
                <div key={i}>
                  <div className="font-black">{award.title}</div>
                  <div className="text-gray-600">{award.awarder} • {award.date}</div>
                  {award.summary && <div className="mt-1">{award.summary}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATES */}
        {data.certificates?.length > 0 && (
          <section style={{ marginBottom: `${layout.sectionSpacing}px` }}>
            <SectionTitle name="certificates" />
            <div className="space-y-2 text-[10px]">
              {data.certificates.map((cert, i) => (
                <div key={i}>
                  <div className="font-black">{cert.name}</div>
                  <div className="text-gray-600">{cert.issuer} • {cert.date}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {data.projects?.length > 0 && (
          <section style={{ marginBottom: `${layout.sectionSpacing}px` }}>
            <SectionTitle name="projects" />
            <div className="space-y-3 text-[10px]">
              {data.projects.map((proj, i) => (
                <div key={i}>
                  <div className="font-black">{proj.name}</div>
                  {proj.url && <div className="text-gray-600 text-[9px]">{proj.url}</div>}
                  {proj.description && <div className="mt-1">{proj.description}</div>}
                  {proj.highlights?.length > 0 && <div className="mt-2">{renderBullets(proj.highlights)}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* REFERENCES */}
        {data.references?.length > 0 && (
          <section>
            <SectionTitle name="references" />
            <div className="space-y-2 text-[10px]">
              {data.references.map((ref, i) => (
                <div key={i}>
                  <div className="font-bold">{ref.name}</div>
                  <div className="text-gray-600">{ref.reference}</div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    );
}
