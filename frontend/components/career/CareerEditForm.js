'use client'
import { useState, useCallback } from 'react';

const DEFAULT_SECTION_TITLES = {
  basics: 'Identité & Contact',
  work: 'Expérience Professionnelle',
  education: 'Formation',
  skills: 'Compétences',
  languages: 'Langues',
  projects: 'Projets'
};

// FormSection MUST be defined outside CareerEditForm.
// Defining it inside causes React to see a new component type on every render,
// which unmounts/remounts all child inputs and breaks focus.
function FormSection({ title, section, expandedSections, toggleSection, children }) {
  return (
    <section className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
      <button
        type="button"
        onClick={() => toggleSection(section)}
        className="w-full px-4 md:px-6 py-3 md:py-4 flex items-center justify-between hover:bg-gray-50 transition-colors bg-white"
      >
        <h3 className="font-bold text-sm text-gray-800 text-left">{title}</h3>
        <span className={`text-lg transition-transform flex-shrink-0 ml-2 ${expandedSections[section] ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {expandedSections[section] && (
        <div className="px-4 md:px-6 py-3 md:py-4 bg-white border-t border-gray-200 space-y-3">
          {children}
        </div>
      )}
    </section>
  );
}

export default function CareerEditForm({ data, setData, sectionTitles, setSectionTitles }) {
  const [expandedSections, setExpandedSections] = useState({
    basics: true,
    work: false,
    education: false,
    skills: false,
    languages: false,
    projects: false
  });

  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  // Use functional updates (prev =>) so these callbacks never depend on `data`,
  // avoiding re-creation on every keystroke.
  const handleChange = useCallback((section, field, value) => {
    setData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  }, [setData]);

  const handleLocationChange = useCallback((field, value) => {
    setData(prev => ({
      ...prev,
      basics: { ...prev.basics, location: { ...prev.basics?.location, [field]: value } }
    }));
  }, [setData]);

  const addItem = useCallback((section, newItem) => {
    setData(prev => ({ ...prev, [section]: [...(prev[section] || []), newItem] }));
  }, [setData]);

  const removeItem = useCallback((section, index) => {
    setData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  }, [setData]);

  const updateItem = useCallback((section, index, field, value) => {
    setData(prev => {
      const newList = [...prev[section]];
      newList[index] = { ...newList[index], [field]: value };
      return { ...prev, [section]: newList };
    });
  }, [setData]);

  if (!data) return <div className="p-4 text-gray-500">Aucune donnée</div>;

  return (
    <div className="space-y-3 pb-20">
      {/* ===== BASICS ===== */}
      <FormSection
        title={sectionTitles?.basics || DEFAULT_SECTION_TITLES.basics}
        section="basics"
        expandedSections={expandedSections}
        toggleSection={toggleSection}
      >
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Nom complet</label>
          <input type="text" value={data.basics?.name || ''} onChange={(e) => handleChange('basics', 'name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Titre professionnel</label>
          <input type="text" value={data.basics?.label || ''} onChange={(e) => handleChange('basics', 'label', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Résumé professionnel</label>
          <textarea value={data.basics?.summary || ''} onChange={(e) => handleChange('basics', 'summary', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm h-20 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Email</label>
          <input type="email" value={data.basics?.email || ''} onChange={(e) => handleChange('basics', 'email', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Téléphone</label>
          <input type="tel" value={data.basics?.phone || ''} onChange={(e) => handleChange('basics', 'phone', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Portfolio/Site web</label>
          <input type="url" value={data.basics?.url || ''} onChange={(e) => handleChange('basics', 'url', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="pt-2 border-t mt-3">
          <h4 className="text-xs font-bold text-gray-600 mb-3">Localisation</h4>
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Adresse</label>
              <input type="text" value={data.basics?.location?.address || ''} onChange={(e) => handleLocationChange('address', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Ville</label>
              <input type="text" value={data.basics?.location?.city || ''} onChange={(e) => handleLocationChange('city', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Code postal</label>
              <input type="text" value={data.basics?.location?.postalCode || ''} onChange={(e) => handleLocationChange('postalCode', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>
      </FormSection>

      {/* ===== WORK ===== */}
      <FormSection
        title={sectionTitles?.work || DEFAULT_SECTION_TITLES.work}
        section="work"
        expandedSections={expandedSections}
        toggleSection={toggleSection}
      >
        <div className="space-y-4">
          {(data.work || []).map((item, idx) => (
            <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Entreprise</label>
                <input type="text" value={item.name || ''} onChange={(e) => updateItem('work', idx, 'name', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="mt-2">
                <label className="block text-xs font-bold text-gray-600 mb-1">Poste</label>
                <input type="text" value={item.position || ''} onChange={(e) => updateItem('work', idx, 'position', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Début</label>
                  <input type="date" value={item.startDate || ''} onChange={(e) => updateItem('work', idx, 'startDate', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Fin</label>
                  <input type="date" value={item.endDate || ''} onChange={(e) => updateItem('work', idx, 'endDate', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="mt-2">
                <label className="block text-xs font-bold text-gray-600 mb-1">Description</label>
                <textarea value={item.summary || ''} onChange={(e) => updateItem('work', idx, 'summary', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded text-xs h-12 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="mt-2">
                <label className="block text-xs font-bold text-gray-600 mb-1">Points clés</label>
                <div className="space-y-1">
                  {(item.highlights || []).map((bullet, bIdx) => (
                    <div key={bIdx} className="flex gap-1 items-center">
                      <span className="text-blue-400 flex-shrink-0 text-xs">▸</span>
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => {
                          const newH = [...(item.highlights || [])];
                          newH[bIdx] = e.target.value;
                          updateItem('work', idx, 'highlights', newH);
                        }}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Accomplissement..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newH = (item.highlights || []).filter((_, i) => i !== bIdx);
                          updateItem('work', idx, 'highlights', newH);
                        }}
                        className="text-red-400 hover:text-red-600 px-1 text-xs font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => updateItem('work', idx, 'highlights', [...(item.highlights || []), ''])}
                    className="mt-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    + Ajouter un point
                  </button>
                </div>
              </div>
              <button type="button" onClick={() => removeItem('work', idx)} className="mt-2 w-full px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-bold hover:bg-red-200">Supprimer</button>
            </div>
          ))}
          <button type="button" onClick={() => addItem('work', { name: '', position: '', startDate: '', endDate: '', summary: '', highlights: [] })} className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded text-xs font-bold text-gray-600 hover:bg-gray-50">+ Ajouter</button>
        </div>
      </FormSection>

      {/* ===== EDUCATION ===== */}
      <FormSection
        title={sectionTitles?.education || DEFAULT_SECTION_TITLES.education}
        section="education"
        expandedSections={expandedSections}
        toggleSection={toggleSection}
      >
        <div className="space-y-4">
          {(data.education || []).map((item, idx) => (
            <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Établissement</label>
                <input type="text" value={item.institution || ''} onChange={(e) => updateItem('education', idx, 'institution', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="mt-2">
                <label className="block text-xs font-bold text-gray-600 mb-1">Domaine</label>
                <input type="text" value={item.area || ''} onChange={(e) => updateItem('education', idx, 'area', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="mt-2">
                <label className="block text-xs font-bold text-gray-600 mb-1">Diplôme</label>
                <input type="text" value={item.studyType || ''} onChange={(e) => updateItem('education', idx, 'studyType', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Début</label>
                  <input type="month" value={item.startDate || ''} onChange={(e) => updateItem('education', idx, 'startDate', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Fin</label>
                  <input type="month" value={item.endDate || ''} onChange={(e) => updateItem('education', idx, 'endDate', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <button type="button" onClick={() => removeItem('education', idx)} className="mt-2 w-full px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-bold hover:bg-red-200">Supprimer</button>
            </div>
          ))}
          <button type="button" onClick={() => addItem('education', { institution: '', area: '', studyType: '', startDate: '', endDate: '' })} className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded text-xs font-bold text-gray-600 hover:bg-gray-50">+ Ajouter</button>
        </div>
      </FormSection>

      {/* ===== SKILLS ===== */}
      <FormSection
        title={sectionTitles?.skills || DEFAULT_SECTION_TITLES.skills}
        section="skills"
        expandedSections={expandedSections}
        toggleSection={toggleSection}
      >
        <div className="space-y-3">
          {(data.skills || []).map((item, idx) => (
            <div key={idx} className="flex gap-2 items-end">
              <input type="text" value={item.name || ''} onChange={(e) => updateItem('skills', idx, 'name', e.target.value)} className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Compétence" />
              <button type="button" onClick={() => removeItem('skills', idx)} className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-bold hover:bg-red-200">✕</button>
            </div>
          ))}
          <button type="button" onClick={() => addItem('skills', { name: '' })} className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded text-xs font-bold text-gray-600 hover:bg-gray-50">+ Ajouter</button>
        </div>
      </FormSection>

      {/* ===== LANGUAGES ===== */}
      <FormSection
        title={sectionTitles?.languages || DEFAULT_SECTION_TITLES.languages}
        section="languages"
        expandedSections={expandedSections}
        toggleSection={toggleSection}
      >
        <div className="space-y-3">
          {(data.languages || []).map((item, idx) => (
            <div key={idx} className="flex gap-2 items-end">
              <input type="text" value={item.language || ''} onChange={(e) => updateItem('languages', idx, 'language', e.target.value)} className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Langue" />
              <button type="button" onClick={() => removeItem('languages', idx)} className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-bold hover:bg-red-200">✕</button>
            </div>
          ))}
          <button type="button" onClick={() => addItem('languages', { language: '' })} className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded text-xs font-bold text-gray-600 hover:bg-gray-50">+ Ajouter</button>
        </div>
      </FormSection>

      {/* ===== PROJECTS ===== */}
      <FormSection
        title={sectionTitles?.projects || DEFAULT_SECTION_TITLES.projects}
        section="projects"
        expandedSections={expandedSections}
        toggleSection={toggleSection}
      >
        <div className="space-y-4">
          {(data.projects || []).map((item, idx) => (
            <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Projet</label>
                <input type="text" value={item.name || ''} onChange={(e) => updateItem('projects', idx, 'name', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button type="button" onClick={() => removeItem('projects', idx)} className="mt-2 w-full px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-bold hover:bg-red-200">Supprimer</button>
            </div>
          ))}
          <button type="button" onClick={() => addItem('projects', { name: '' })} className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded text-xs font-bold text-gray-600 hover:bg-gray-50">+ Ajouter</button>
        </div>
      </FormSection>
    </div>
  );
}
