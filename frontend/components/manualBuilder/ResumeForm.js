'use client'
import { useState } from 'react';

// Stockage des titres de sections personnalisés
const DEFAULT_SECTION_TITLES = {
  basics: 'Identité & Contact',
  profiles: 'Profils & Réseaux',
  work: 'Expérience Professionnelle',
  volunteer: 'Bénévolat',
  education: 'Formation',
  awards: 'Distinctions',
  certificates: 'Certifications',
  publications: 'Publications',
  skills: 'Compétences',
  languages: 'Langues',
  interests: 'Centres d\'Intérêt',
  references: 'Références',
  projects: 'Projets'
};

export default function ResumeForm({ data, setData, sectionTitles, setSectionTitles }) {
  const [expandedSections, setExpandedSections] = useState({
    basics: true,
    profiles: true,
    work: false,
    volunteer: false,
    education: false,
    awards: false,
    certificates: false,
    publications: false,
    skills: false,
    languages: false,
    interests: false,
    references: false,
    projects: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const handleChange = (section, field, value) => {
    setData({
      ...data,
      [section]: { ...data[section], [field]: value }
    });
  };

  const handleLocationChange = (field, value) => {
    setData({
      ...data,
      basics: { ...data.basics, location: { ...data.basics.location, [field]: value } }
    });
  };

  const addItem = (section, newItem) => {
    if (section === 'profiles') {
      setData({
        ...data,
        basics: { ...data.basics, profiles: [...(data.basics.profiles || []), newItem] }
      });
    } else {
      setData({ ...data, [section]: [...(data[section] || []), newItem] });
    }
  };
  
  const removeItem = (section, index) => {
    if (section === 'profiles') {
      const newList = data.basics.profiles.filter((_, i) => i !== index);
      setData({ ...data, basics: { ...data.basics, profiles: newList } });
    } else {
      const newList = data[section].filter((_, i) => i !== index);
      setData({ ...data, [section]: newList });
    }
  };
  
  const updateItem = (section, index, field, value) => {
    if (section === 'profiles') {
      const newList = [...data.basics.profiles];
      newList[index] = { ...newList[index], [field]: value };
      setData({ ...data, basics: { ...data.basics, profiles: newList } });
    } else {
      const newList = [...data[section]];
      newList[index] = { ...newList[index], [field]: value };
      setData({ ...data, [section]: newList });
    }
  };

   const updateArrayField = (section, index, field, value) => {
    const newList = [...data[section]];
    newList[index] = { ...newList[index], [field]: value.split('\n').filter(v => v.trim()) };
    setData({ ...data, [section]: newList });
  };

  const handleTitleChange = (section, newTitle) => {
    setSectionTitles(prev => ({
      ...prev,
      [section]: newTitle || DEFAULT_SECTION_TITLES[section]
    }));
  };
  
  return (
    <div className="space-y-3 pb-20">
      
      {/* ===== BASICS ===== */}
      <FormSection 
        title={sectionTitles.basics} 
        section="basics" 
        expanded={expandedSections.basics} 
        onToggle={toggleSection}
        onTitleChange={handleTitleChange}
      >
        {expandedSections.basics && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Nom complet" value={data.basics.name} onChange={(v) => handleChange('basics', 'name', v)} />
              <Input label="Intitulé du poste" value={data.basics.label} onChange={(v) => handleChange('basics', 'label', v)} />
              <Input label="Email" value={data.basics.email} onChange={(v) => handleChange('basics', 'email', v)} />
              <Input label="Téléphone" value={data.basics.phone} onChange={(v) => handleChange('basics', 'phone', v)} />
              <Input label="URL/Portfolio" value={data.basics.url} onChange={(v) => handleChange('basics', 'url', v)} />
              <Input label="Photo URL" value={data.basics.image} onChange={(v) => handleChange('basics', 'image', v)} />
            </div>
            <div className="mt-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Résumé professionnel</label>
              <textarea 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
                value={data.basics.summary}
                onChange={(e) => handleChange('basics', 'summary', e.target.value)}
              />
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <h4 className="text-xs font-black uppercase tracking-widest text-blue-900 mb-3">Localisation</h4>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Adresse" value={data.basics.location.address} onChange={(v) => handleLocationChange('address', v)} />
                <Input label="Ville" value={data.basics.location.city} onChange={(v) => handleLocationChange('city', v)} />
                <Input label="Code postal" value={data.basics.location.postalCode} onChange={(v) => handleLocationChange('postalCode', v)} />
                <Input label="Région" value={data.basics.location.region} onChange={(v) => handleLocationChange('region', v)} />
                <Input label="Code pays (FR, US...)" value={data.basics.location.countryCode} onChange={(v) => handleLocationChange('countryCode', v)} />
              </div>
            </div>
          </>
        )}
      </FormSection>

      {/* ===== PROFILES ===== */}
      <FormSection 
        title={sectionTitles.profiles} 
        section="profiles" 
        expanded={expandedSections.profiles} 
        onToggle={toggleSection}
        onTitleChange={handleTitleChange}
      >
        {expandedSections.profiles && (
          <>
            <div className="grid grid-cols-1 gap-4">
              {data.basics.profiles.map((profile, index) => (
                <div key={index} className="flex gap-4 items-end bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400">Réseau</label>
                    <input type="text" placeholder="LinkedIn" value={profile.network}
                      onChange={(e) => updateItem('profiles', index, 'network', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none focus:border-blue-500" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400">Nom d'utilisateur</label>
                    <input type="text" placeholder="@username" value={profile.username}
                      onChange={(e) => updateItem('profiles', index, 'username', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none focus:border-blue-500" />
                  </div>
                  <div className="flex-[2] space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400">URL</label>
                    <input type="url" placeholder="https://..." value={profile.url}
                      onChange={(e) => updateItem('profiles', index, 'url', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none focus:border-blue-500" />
                  </div>
                  <button onClick={() => removeItem('profiles', index)} className="p-3 text-gray-300 hover:text-red-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => addItem('profiles', { network: '', username: '', url: '' })} className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:opacity-70">
              <span className="text-lg">+</span> Ajouter un lien social
            </button>
          </>
        )}
      </FormSection>

      {/* ===== WORK ===== */}
      <FormSection title={sectionTitles.work} section="work" expanded={expandedSections.work} onToggle={toggleSection} onTitleChange={handleTitleChange}>
        {expandedSections.work && (
          <>
            <div className="space-y-6">
              {data.work.map((job, index) => (
                <div key={index} className="p-6 border border-gray-100 rounded-[24px] bg-white shadow-sm relative">
                  <button onClick={() => removeItem('work', index)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Input label="Entreprise" value={job.name || job.company || ''} onChange={(v) => updateItem('work', index, 'name', v)} />
                    <Input label="Poste" value={job.position} onChange={(v) => updateItem('work', index, 'position', v)} />
                    <Input label="Site web (optionnel)" value={job.url} onChange={(v) => updateItem('work', index, 'url', v)} />
                    <Input label="Date de début" type="month" value={job.startDate} onChange={(v) => updateItem('work', index, 'startDate', v)} />
                    <Input label="Date de fin" type="month" value={job.endDate || ''} onChange={(v) => updateItem('work', index, 'endDate', v)} />
                  </div>
                  <textarea placeholder="Description de vos missions..." className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-blue-300 h-20 resize-none"
                    value={job.summary} onChange={(e) => updateItem('work', index, 'summary', e.target.value)} />
                  <div className="mt-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Points clés</label>
                    <div className="space-y-2">
                      {(job.highlights || []).map((bullet, bIdx) => (
                        <div key={bIdx} className="flex gap-2 items-center">
                          <span className="text-blue-400 flex-shrink-0 text-xs">▸</span>
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => {
                              const newH = [...(job.highlights || [])];
                              newH[bIdx] = e.target.value;
                              updateItem('work', index, 'highlights', newH);
                            }}
                            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-blue-300"
                            placeholder="Accomplissement..."
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newH = (job.highlights || []).filter((_, i) => i !== bIdx);
                              updateItem('work', index, 'highlights', newH);
                            }}
                            className="text-gray-300 hover:text-red-500 text-xs font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => updateItem('work', index, 'highlights', [...(job.highlights || []), ''])}
                        className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:opacity-70 mt-1"
                      >
                        + Ajouter un point
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => addItem('work', { name: '', position: '', url: '', startDate: '', endDate: '', summary: '', highlights: [] })} 
              className="w-full py-4 border-2 border-dashed border-gray-200 rounded-[24px] text-gray-400 font-bold text-xs uppercase tracking-widest hover:border-blue-400 hover:text-blue-600">
              + Ajouter une expérience
            </button>
          </>
        )}
      </FormSection>

      {/* ===== VOLUNTEER ===== */}
      <FormSection title={sectionTitles.volunteer} section="volunteer" expanded={expandedSections.volunteer} onToggle={toggleSection} onTitleChange={handleTitleChange}>
        {expandedSections.volunteer && (
          <>
            <div className="space-y-6">
              {data.volunteer.map((vol, index) => (
                <div key={index} className="p-6 border border-gray-100 rounded-[24px] bg-white shadow-sm relative">
                  <button onClick={() => removeItem('volunteer', index)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Input label="Organisation" value={vol.organization} onChange={(v) => updateItem('volunteer', index, 'organization', v)} />
                    <Input label="Poste" value={vol.position} onChange={(v) => updateItem('volunteer', index, 'position', v)} />
                    <Input label="URL" value={vol.url} onChange={(v) => updateItem('volunteer', index, 'url', v)} />
                    <Input label="Date de début" type="month" value={vol.startDate} onChange={(v) => updateItem('volunteer', index, 'startDate', v)} />
                    <Input label="Date de fin" type="month" value={vol.endDate || ''} onChange={(v) => updateItem('volunteer', index, 'endDate', v)} />
                  </div>
                  <textarea placeholder="Description..." className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-blue-300 h-20 resize-none"
                    value={vol.summary} onChange={(e) => updateItem('volunteer', index, 'summary', e.target.value)} />
                </div>
              ))}
            </div>
            <button onClick={() => addItem('volunteer', { organization: '', position: '', url: '', startDate: '', endDate: '', summary: '', highlights: [] })} 
              className="w-full py-4 border-2 border-dashed border-gray-200 rounded-[24px] text-gray-400 font-bold text-xs uppercase tracking-widest hover:border-blue-400 hover:text-blue-600">
              + Ajouter une activité bénévole
            </button>
          </>
        )}
      </FormSection>

      {/* ===== EDUCATION ===== */}
      <FormSection title={sectionTitles.education} section="education" expanded={expandedSections.education} onToggle={toggleSection} onTitleChange={handleTitleChange}>
        {expandedSections.education && (
          <>
            <div className="space-y-6">
              {data.education.map((edu, index) => (
                <div key={index} className="p-6 border border-gray-100 rounded-[24px] bg-white shadow-sm relative">
                  <button onClick={() => removeItem('education', index)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Input label="Institution" value={edu.institution} onChange={(v) => updateItem('education', index, 'institution', v)} />
                    <Input label="URL" value={edu.url} onChange={(v) => updateItem('education', index, 'url', v)} />
                    <Input label="Diplôme (Bachelor, Master...)" value={edu.studyType} onChange={(v) => updateItem('education', index, 'studyType', v)} />
                    <Input label="Domaine d'étude" value={edu.area} onChange={(v) => updateItem('education', index, 'area', v)} />
                    <Input label="Date de début" type="month" value={edu.startDate} onChange={(v) => updateItem('education', index, 'startDate', v)} />
                    <Input label="Date de fin" type="month" value={edu.endDate} onChange={(v) => updateItem('education', index, 'endDate', v)} />
                    <Input label="Mention/Score" value={edu.score || ''} onChange={(v) => updateItem('education', index, 'score', v)} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Cours ou spécialisations (un par ligne)</label>
                    <textarea placeholder="IA Avancée&#10;Architecture Microservices" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-blue-300 h-16 resize-none"
                      value={edu.courses?.join('\n') || ''} onChange={(e) => updateArrayField('education', index, 'courses', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => addItem('education', { institution: '', url: '', studyType: '', area: '', startDate: '', endDate: '', score: '', courses: [] })} 
              className="w-full py-4 border-2 border-dashed border-gray-200 rounded-[24px] text-gray-400 font-bold text-xs uppercase tracking-widest hover:border-blue-400 hover:text-blue-600">
              + Ajouter une formation
            </button>
          </>
        )}
      </FormSection>

      {/* ===== AWARDS ===== */}
      <FormSection title={sectionTitles.awards} section="awards" expanded={expandedSections.awards} onToggle={toggleSection} onTitleChange={handleTitleChange}>
        {expandedSections.awards && (
          <>
            <div className="space-y-4">
              {data.awards.map((award, index) => (
                <div key={index} className="p-4 border border-gray-100 rounded-2xl bg-white shadow-sm relative">
                  <button onClick={() => removeItem('awards', index)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Titre" value={award.title} onChange={(v) => updateItem('awards', index, 'title', v)} />
                    <Input label="Décerné par" value={award.awarder} onChange={(v) => updateItem('awards', index, 'awarder', v)} />
                    <Input label="Date" type="month" value={award.date} onChange={(v) => updateItem('awards', index, 'date', v)} />
                  </div>
                  <textarea placeholder="Description..." className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-blue-300 h-12 resize-none mt-3"
                    value={award.summary} onChange={(e) => updateItem('awards', index, 'summary', e.target.value)} />
                </div>
              ))}
            </div>
            <button onClick={() => addItem('awards', { title: '', date: '', awarder: '', summary: '' })} 
              className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold text-xs uppercase tracking-widest hover:border-blue-400 hover:text-blue-600">
              + Ajouter une récompense
            </button>
          </>
        )}
      </FormSection>

      {/* ===== CERTIFICATES ===== */}
      <FormSection title={sectionTitles.certificates} section="certificates" expanded={expandedSections.certificates} onToggle={toggleSection} onTitleChange={handleTitleChange}>
        {expandedSections.certificates && (
          <>
            <div className="space-y-4">
              {data.certificates.map((cert, index) => (
                <div key={index} className="p-4 border border-gray-100 rounded-2xl bg-white shadow-sm relative">
                  <button onClick={() => removeItem('certificates', index)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Nom de la certification" value={cert.name} onChange={(v) => updateItem('certificates', index, 'name', v)} />
                    <Input label="Émetteur" value={cert.issuer} onChange={(v) => updateItem('certificates', index, 'issuer', v)} />
                    <Input label="Date" type="month" value={cert.date} onChange={(v) => updateItem('certificates', index, 'date', v)} />
                    <Input label="URL" value={cert.url} onChange={(v) => updateItem('certificates', index, 'url', v)} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => addItem('certificates', { name: '', date: '', issuer: '', url: '' })} 
              className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold text-xs uppercase tracking-widest hover:border-blue-400 hover:text-blue-600">
              + Ajouter une certification
            </button>
          </>
        )}
      </FormSection>

      {/* ===== PUBLICATIONS ===== */}
      <FormSection title={sectionTitles.publications} section="publications" expanded={expandedSections.publications} onToggle={toggleSection} onTitleChange={handleTitleChange}>
        {expandedSections.publications && (
          <>
            <div className="space-y-4">
              {data.publications.map((pub, index) => (
                <div key={index} className="p-4 border border-gray-100 rounded-2xl bg-white shadow-sm relative">
                  <button onClick={() => removeItem('publications', index)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Titre" value={pub.name} onChange={(v) => updateItem('publications', index, 'name', v)} />
                    <Input label="Éditeur" value={pub.publisher} onChange={(v) => updateItem('publications', index, 'publisher', v)} />
                    <Input label="Date de publication" type="month" value={pub.releaseDate} onChange={(v) => updateItem('publications', index, 'releaseDate', v)} />
                    <Input label="URL" value={pub.url} onChange={(v) => updateItem('publications', index, 'url', v)} />
                  </div>
                  <textarea placeholder="Résumé..." className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-blue-300 h-12 resize-none mt-3"
                    value={pub.summary} onChange={(e) => updateItem('publications', index, 'summary', e.target.value)} />
                </div>
              ))}
            </div>
            <button onClick={() => addItem('publications', { name: '', publisher: '', releaseDate: '', url: '', summary: '' })} 
              className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold text-xs uppercase tracking-widest hover:border-blue-400 hover:text-blue-600">
              + Ajouter une publication
            </button>
          </>
        )}
      </FormSection>

      {/* ===== SKILLS ===== */}
      <FormSection title={sectionTitles.skills} section="skills" expanded={expandedSections.skills} onToggle={toggleSection} onTitleChange={handleTitleChange}>
        {expandedSections.skills && (
          <>
            <div className="space-y-4">
              {data.skills.map((skill, index) => (
                <div key={index} className="p-4 border border-gray-100 rounded-2xl bg-white shadow-sm relative">
                  <button onClick={() => removeItem('skills', index)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <Input label="Compétence" value={skill.name} onChange={(v) => updateItem('skills', index, 'name', v)} />
                    <select value={skill.level || 'Advanced'} onChange={(e) => updateItem('skills', index, 'level', e.target.value)}
                      className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500">
                      <option value="Beginner">Débutant</option>
                      <option value="Intermediate">Intermédiaire</option>
                      <option value="Advanced">Avancé</option>
                      <option value="Master">Expert</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Mots-clés (un par ligne)</label>
                    <textarea placeholder="HTML&#10;CSS&#10;JavaScript" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-blue-300 h-12 resize-none"
                      value={skill.keywords?.join('\n') || ''} onChange={(e) => updateArrayField('skills', index, 'keywords', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => addItem('skills', { name: '', level: 'Advanced', keywords: [] })} 
              className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold text-xs uppercase tracking-widest hover:border-blue-400 hover:text-blue-600">
              + Ajouter une compétence
            </button>
          </>
        )}
      </FormSection>

      {/* ===== LANGUAGES ===== */}
      <FormSection title={sectionTitles.languages} section="languages" expanded={expandedSections.languages} onToggle={toggleSection} onTitleChange={handleTitleChange}>
        {expandedSections.languages && (
          <>
            <div className="space-y-4">
              {data.languages.map((lang, index) => (
                <div key={index} className="flex gap-3 items-end p-3 border border-gray-100 rounded-2xl bg-white shadow-sm">
                  <div className="flex-1">
                    <Input label="Langue" value={lang.language} onChange={(v) => updateItem('languages', index, 'language', v)} />
                  </div>
                  <select value={lang.fluency || 'Professional working'} onChange={(e) => updateItem('languages', index, 'fluency', e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500">
                    <option value="Elementary">Élémentaire</option>
                    <option value="Limited working">Limité</option>
                    <option value="Professional working">Professionnel</option>
                    <option value="Full professional">Très professionnel</option>
                    <option value="Native speaker">Natif</option>
                  </select>
                  <button onClick={() => removeItem('languages', index)} className="p-2 text-gray-300 hover:text-red-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => addItem('languages', { language: '', fluency: 'Professional working' })} 
              className="mt-4 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">
              + Ajouter une langue
            </button>
          </>
        )}
      </FormSection>

      {/* ===== INTERESTS ===== */}
      <FormSection title={sectionTitles.interests} section="interests" expanded={expandedSections.interests} onToggle={toggleSection} onTitleChange={handleTitleChange}>
        {expandedSections.interests && (
          <>
            <div className="space-y-4">
              {data.interests.map((interest, index) => (
                <div key={index} className="p-3 border border-gray-100 rounded-2xl bg-white shadow-sm relative">
                  <button onClick={() => removeItem('interests', index)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <div className="mb-3">
                    <Input label="Intérêt" value={interest.name} onChange={(v) => updateItem('interests', index, 'name', v)} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Mots-clés (un par ligne)</label>
                    <textarea placeholder="Technologie&#10;Innovation" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-blue-300 h-12 resize-none"
                      value={interest.keywords?.join('\n') || ''} onChange={(e) => updateArrayField('interests', index, 'keywords', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => addItem('interests', { name: '', keywords: [] })} 
              className="mt-4 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">
              + Ajouter un centre d'intérêt
            </button>
          </>
        )}
      </FormSection>

      {/* ===== REFERENCES ===== */}
      <FormSection title={sectionTitles.references} section="references" expanded={expandedSections.references} onToggle={toggleSection} onTitleChange={handleTitleChange}>
        {expandedSections.references && (
          <>
            <div className="space-y-4">
              {data.references.map((ref, index) => (
                <div key={index} className="p-4 border border-gray-100 rounded-2xl bg-white shadow-sm relative">
                  <button onClick={() => removeItem('references', index)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <Input label="Nom" value={ref.name} onChange={(v) => updateItem('references', index, 'name', v)} />
                  <textarea placeholder="Référence..." className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-blue-300 h-12 resize-none mt-3"
                    value={ref.reference} onChange={(e) => updateItem('references', index, 'reference', e.target.value)} />
                </div>
              ))}
            </div>
            <button onClick={() => addItem('references', { name: '', reference: '' })} 
              className="mt-4 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">
              + Ajouter une référence
            </button>
          </>
        )}
      </FormSection>

      {/* ===== PROJECTS ===== */}
      <FormSection title={sectionTitles.projects} section="projects" expanded={expandedSections.projects} onToggle={toggleSection} onTitleChange={handleTitleChange}>
        {expandedSections.projects && (
          <>
            <div className="space-y-6">
              {data.projects.map((proj, index) => (
                <div key={index} className="p-6 border border-gray-100 rounded-[24px] bg-white shadow-sm relative">
                  <button onClick={() => removeItem('projects', index)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Input label="Nom du projet" value={proj.name} onChange={(v) => updateItem('projects', index, 'name', v)} />
                    <Input label="URL" value={proj.url} onChange={(v) => updateItem('projects', index, 'url', v)} />
                    <Input label="Date de début" type="month" value={proj.startDate} onChange={(v) => updateItem('projects', index, 'startDate', v)} />
                    <Input label="Date de fin" type="month" value={proj.endDate || ''} onChange={(v) => updateItem('projects', index, 'endDate', v)} />
                  </div>
                  <textarea placeholder="Description du projet..." className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-blue-300 h-16 resize-none"
                    value={proj.description} onChange={(e) => updateItem('projects', index, 'description', e.target.value)} />
                  <div className="mt-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Points clés (un par ligne)</label>
                    <textarea placeholder="Fonctionnalité 1&#10;Fonctionnalité 2" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-blue-300 h-16 resize-none"
                      value={proj.highlights?.join('\n') || ''} onChange={(e) => updateArrayField('projects', index, 'highlights', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => addItem('projects', { name: '', startDate: '', endDate: '', description: '', highlights: [], url: '' })} 
              className="w-full py-4 border-2 border-dashed border-gray-200 rounded-[24px] text-gray-400 font-bold text-xs uppercase tracking-widest hover:border-blue-400 hover:text-blue-600">
              + Ajouter un projet
            </button>
          </>
        )}
      </FormSection>

    </div>
  );
}

// --- UTILITY COMPONENTS ---

// Composant pour éditer du texte avec gras
function RichInput({ label, value, onChange }) {
  const [isBold, setIsBold] = useState(false);

  const handleText = (text) => {
    if (isBold && text) {
      onChange(`${value}**${text}**`);
    } else {
      onChange(value + text);
    }
    setIsBold(false);
  };

  const insertBold = () => {
    const textarea = document.getElementById('rich-' + Math.random());
    if (textarea && textarea.selectionStart !== undefined) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      if (selectedText) {
        const newValue = value.substring(0, start) + `**${selectedText}**` + value.substring(end);
        onChange(newValue);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          {label}
        </label>
        <button
          onClick={insertBold}
          className="text-xs font-black text-gray-400 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
          title="Sélectionner du texte et cliquer pour mettre en gras"
        >
          <strong>B</strong>
        </button>
      </div>
      <textarea
        id={`rich-${Math.random()}`}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Utilisez **texte** pour mettre en gras"
        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
      />
      <p className="text-[9px] text-gray-400 italic">
        💡 Conseil: Entourez du texte avec ** pour le mettre en gras. Ex: Vous êtes **expert** en JavaScript
      </p>
    </div>
  );
}

function FormSection({ title, section, children, expanded, onToggle, onTitleChange }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);

  return (
    <section className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex items-center px-6 py-4 hover:bg-gray-50 transition-colors group">
        <button
          onClick={() => onToggle(section)}
          className="flex items-center justify-between flex-1 text-left gap-2 min-w-0"
        >
          <div className="flex items-center gap-2 min-w-0">
            {isEditingTitle ? (
              <input
                autoFocus
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={() => {
                  onTitleChange(section, tempTitle);
                  setIsEditingTitle(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onTitleChange(section, tempTitle);
                    setIsEditingTitle(false);
                  }
                }}
                className="text-sm font-black uppercase tracking-[0.3em] text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-transparent px-1"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-gray-900 truncate">
                {title}
              </h3>
            )}
          </div>
          <span className={`text-sm flex-shrink-0 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>▼</span>
        </button>
        {!isEditingTitle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditingTitle(true);
              setTempTitle(title);
            }}
            className="p-1 text-gray-300 hover:text-gray-600 rounded opacity-0 group-hover:opacity-100 ml-2 flex-shrink-0"
            title="Éditer le titre"
          >
            ✏️
          </button>
        )}
      </div>
      {expanded && (
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 animate-in slide-in-from-top-2 duration-300">
          {children}
        </div>
      )}
    </section>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
        {label}
      </label>
      <input 
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-inner"
      />
    </div>
  );
}
