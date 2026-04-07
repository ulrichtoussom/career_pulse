
export default function ResumePreview({ data, layout }) {

    // Helper pour formater le texte gras (**texte** -> <strong>texte</strong>)
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

    return (
      <div className="h-full">
        {/* HEADER */}
        <header className="mb-6 border-b-2 pb-4" style={{ borderColor: layout.primaryColor }}>
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-1" style={{ color: layout.primaryColor }}>
              {data.basics.name}
          </h1>
          {data.basics.label && <p className="text-sm font-bold text-gray-500 mb-3">{data.basics.label}</p>}
          
          <div className="flex flex-wrap gap-3 text-[9px] font-bold uppercase text-gray-500">
            {data.basics.email && <span>{data.basics.email}</span>}
            {data.basics.phone && <span>•</span>}
            {data.basics.phone && <span>{data.basics.phone}</span>}
            {data.basics.url && <span>•</span>}
            {data.basics.url && <span>{data.basics.url.replace(/^https?:\/\//, '')}</span>}
            {data.basics.location?.city && <span>•</span>}
            {data.basics.location?.city && <span>{data.basics.location.city}{data.basics.location.countryCode ? `, ${data.basics.location.countryCode}` : ''}</span>}
          </div>

          {/* Social Profiles */}
          {data.basics.profiles?.filter(p => p.network && p.url).length > 0 && (
            <div className="flex flex-wrap gap-3 mt-2 text-[9px]">
              {data.basics.profiles.filter(p => p.network && p.url).map((p, i) => (
                <span key={i} style={{ color: layout.primaryColor }} className="font-bold">
                  {p.network}: {p.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* SUMMARY */}
        {data.basics.summary && (
          <section style={{ marginBottom: `${layout.sectionSpacing}px` }}>
            <div className="leading-relaxed text-justify text-[10px]">{formatText(data.basics.summary)}</div>
          </section>
        )}

        {/* EXPERIENCE */}
        {data.work?.length > 0 && (
          <section style={{ marginBottom: `${layout.sectionSpacing}px` }}>
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-3 py-1 border-b" style={{ color: layout.primaryColor }}>Expériences</h2>
            <div className="space-y-4">
              {data.work.map((job, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-black uppercase text-[11px]">{job.position}</h3>
                    <span className="text-[9px] font-black text-gray-400">{job.startDate} — {job.endDate || 'Présent'}</span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">{job.name || job.company}</p>
                  {job.summary && <div className="text-[9px] leading-relaxed mb-2">{formatText(job.summary)}</div>}
                  {job.highlights?.filter(h => h?.trim()).length > 0 && (
                    <div className="text-[9px] ml-0">{renderBullets(job.highlights)}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* VOLUNTEER */}
        {data.volunteer?.length > 0 && (
          <section style={{ marginBottom: `${layout.sectionSpacing}px` }}>
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-3 py-1 border-b" style={{ color: layout.primaryColor }}>Bénévolat</h2>
            <div className="space-y-4">
              {data.volunteer.map((vol, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-black uppercase text-[11px]">{vol.position}</h3>
                    <span className="text-[9px] font-black text-gray-400">{vol.startDate} — {vol.endDate || 'Présent'}</span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">{vol.organization}</p>
                  {vol.summary && <div className="text-[9px] leading-relaxed">{formatText(vol.summary)}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {data.education?.length > 0 && (
          <section style={{ marginBottom: `${layout.sectionSpacing}px` }}>
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-3 py-1 border-b" style={{ color: layout.primaryColor }}>Formation</h2>
            <div className="space-y-4">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-black uppercase text-[11px]">{edu.studyType}{edu.area ? ` — ${edu.area}` : ''}</h3>
                    <span className="text-[9px] font-black text-gray-400">{edu.startDate?.substring(0, 4)} — {edu.endDate?.substring(0, 4) || 'Présent'}</span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">{edu.institution}</p>
                  {edu.score && <p className="text-[9px] text-gray-600 mb-1">Mention: <span className="font-bold">{edu.score}</span></p>}
                  {edu.courses?.filter(c => c?.trim()).length > 0 && (
                    <div className="text-[9px] text-gray-600 italic">Cours: {edu.courses.filter(c => c?.trim()).join(', ')}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* AWARDS */}
        {data.awards?.length > 0 && (
          <section style={{ marginBottom: `${layout.sectionSpacing}px` }}>
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-3 py-1 border-b" style={{ color: layout.primaryColor }}>Récompenses</h2>
            <div className="space-y-3">
              {data.awards.map((award, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-black uppercase text-[10px]">{award.title}</h3>
                    <span className="text-[9px] text-gray-400">{award.date?.substring(0, 4)}</span>
                  </div>
                  <p className="text-[9px] text-gray-500">{award.awarder}</p>
                  {award.summary && <p className="text-[9px] text-gray-600">{award.summary}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATES */}
        {data.certificates?.length > 0 && (
          <section style={{ marginBottom: `${layout.sectionSpacing}px` }}>
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-3 py-1 border-b" style={{ color: layout.primaryColor }}>Certifications</h2>
            <div className="space-y-3">
              {data.certificates.map((cert, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-black uppercase text-[10px]">{cert.name}</h3>
                    <span className="text-[9px] text-gray-400">{cert.date?.substring(0, 4)}</span>
                  </div>
                  <p className="text-[9px] text-gray-500">{cert.issuer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PUBLICATIONS */}
        {data.publications?.length > 0 && (
          <section style={{ marginBottom: `${layout.sectionSpacing}px` }}>
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-3 py-1 border-b" style={{ color: layout.primaryColor }}>Publications</h2>
            <div className="space-y-3">
              {data.publications.map((pub, i) => (
                <div key={i}>
                  <h3 className="font-black uppercase text-[10px]">{pub.name}</h3>
                  <p className="text-[9px] text-gray-500">{pub.publisher} • {pub.releaseDate?.substring(0, 4)}</p>
                  {pub.summary && <p className="text-[9px] text-gray-600 italic">{pub.summary}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS */}
        {data.skills?.length > 0 && (
          <section style={{ marginBottom: `${layout.sectionSpacing}px` }}>
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-3 py-1 border-b" style={{ color: layout.primaryColor }}>Compétences</h2>
            <div className="space-y-3">
              {data.skills.map((skill, i) => (
                <div key={i}>
                  <div className="flex gap-2 items-baseline">
                    <h3 className="font-black uppercase text-[10px]">{skill.name}</h3>
                    <span className="text-[9px] font-bold" style={{ color: layout.primaryColor }}>{skill.level}</span>
                  </div>
                  {skill.keywords?.filter(k => k?.trim()).length > 0 && (
                    <div className="text-[8px] text-gray-600">{skill.keywords.filter(k => k?.trim()).join(', ')}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* LANGUAGES */}
        {data.languages?.length > 0 && (
          <section style={{ marginBottom: `${layout.sectionSpacing}px` }}>
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-3 py-1 border-b" style={{ color: layout.primaryColor }}>Langues</h2>
            <div className="grid grid-cols-2 gap-2 text-[9px]">
              {data.languages.map((lang, i) => (
                <div key={i} className="flex justify-between">
                  <span className="font-bold">{lang.language}</span>
                  <span className="text-gray-500">{lang.fluency}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* INTERESTS */}
        {data.interests?.length > 0 && (
          <section style={{ marginBottom: `${layout.sectionSpacing}px` }}>
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-3 py-1 border-b" style={{ color: layout.primaryColor }}>Centres d'Intérêt</h2>
            <div className="space-y-2">
              {data.interests.map((interest, i) => (
                <div key={i}>
                  <h3 className="font-black uppercase text-[10px]">{interest.name}</h3>
                  {interest.keywords?.filter(k => k?.trim()).length > 0 && (
                    <div className="text-[9px] text-gray-600">{interest.keywords.filter(k => k?.trim()).join(', ')}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {data.projects?.length > 0 && (
          <section style={{ marginBottom: `${layout.sectionSpacing}px` }}>
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-3 py-1 border-b" style={{ color: layout.primaryColor }}>Projets</h2>
            <div className="space-y-4">
              {data.projects.map((proj, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-black uppercase text-[11px]">{proj.name}</h3>
                    <span className="text-[9px] font-black text-gray-400">{proj.startDate?.substring(0, 4)} — {proj.endDate?.substring(0, 4) || 'Présent'}</span>
                  </div>
                  {proj.description && <div className="text-[9px] leading-relaxed mb-2">{formatText(proj.description)}</div>}
                  {proj.highlights?.filter(h => h?.trim()).length > 0 && (
                    <div className="text-[9px] ml-0">{renderBullets(proj.highlights)}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* REFERENCES */}
        {data.references?.length > 0 && (
          <section>
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-3 py-1 border-b" style={{ color: layout.primaryColor }}>Références</h2>
            <div className="space-y-3">
              {data.references.map((ref, i) => (
                <div key={i}>
                  <h3 className="font-black uppercase text-[10px]">{ref.name}</h3>
                  <p className="text-[9px] text-gray-600 italic">{ref.reference}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }