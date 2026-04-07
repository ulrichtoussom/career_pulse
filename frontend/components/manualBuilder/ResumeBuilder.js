'use client'
import { useState } from 'react';
import ResumeForm from './ResumeForm';
import AppearanceSettings from '../career/AppearanceSettings';
import ResumePreview from './ResumePreview';
import TemplateSelector from './TemplateSelector';
import { defaultLayout, templateLayouts, resumeTemplates } from '@/frontend/data/resumeTemplates';

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

export default function ResumeBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeTab, setActiveTab] = useState('content');
  const [resumeData, setResumeData] = useState(null);
  const [layout, setLayout] = useState(defaultLayout);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [sectionTitles, setSectionTitles] = useState(DEFAULT_SECTION_TITLES);
  const [isExporting, setIsExporting] = useState(false);

  // Fonction d'export PDF
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const { exportToPDF } = await import('@/frontend/utils/pdfExport');
      const filename = `${resumeData.basics.name || 'resume'}.pdf`;
      exportToPDF('resume-preview', filename);
    } catch (error) {
      console.error('Export error:', error);
      alert('Erreur lors de l\'export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  // Si pas de template sélectionné, afficher le sélecteur
  if (!selectedTemplate) {
    return <TemplateSelector onSelect={(key, data) => {
      setSelectedTemplate(key);
      setResumeData(data);
      setLayout(templateLayouts[key] || defaultLayout);
    }} />;
  }

  // Switcher vers un autre template
  const switchTemplate = (key, data) => {
    setSelectedTemplate(key);
    setResumeData(data);
    setLayout(templateLayouts[key] || defaultLayout);
    setShowTemplateModal(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] bg-[#F8F9FA] overflow-hidden">
      
      {/* PANNEAU DE CONTRÔLE - Desktop & Tablet */}
      <div className="hidden md:flex flex-col w-full lg:w-[450px] bg-white border-r border-gray-200 shadow-xl z-10">
        {/* HEADER TABS */}
        <div className="flex p-2 bg-gray-50 m-4 rounded-2xl border border-gray-100 gap-1">
          <button 
            onClick={() => setActiveTab('content')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'content' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
          >
            Contenu
          </button>
          <button 
            onClick={() => setActiveTab('design')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'design' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
          >
            Apparence
          </button>
          <button 
            onClick={() => setShowTemplateModal(true)}
            className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all text-gray-400 hover:text-blue-600 hover:bg-blue-50"
            title="Changer de template"
          >
            🎨 Template
          </button>
        </div>

        {/* CONTENU */}
        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          {activeTab === 'content' ? (
            <ResumeForm data={resumeData} setData={setResumeData} sectionTitles={sectionTitles} setSectionTitles={setSectionTitles} />
          ) : (
            <AppearanceSettings layout={layout} setLayout={setLayout} />
          )}
        </div>
      </div>

      {/* ZONE DE RENDU - Responsive */}
      <div className="flex-1 bg-gray-100 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-black text-sm uppercase">Prévisualisation</span>
          <button
            onClick={() => setSelectedTemplate(null)}
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            Retour
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-white border-b border-gray-200 p-4 space-y-4">
            <div className="flex gap-2 mb-4">
              <button 
                onClick={() => { setActiveTab('content'); setShowMobileMenu(false); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${activeTab === 'content' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Contenu
              </button>
              <button 
                onClick={() => { setActiveTab('design'); setShowMobileMenu(false); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${activeTab === 'design' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Apparence
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {activeTab === 'content' ? (
                <ResumeForm data={resumeData} setData={setResumeData} />
              ) : (
                <AppearanceSettings layout={layout} setLayout={setLayout} />
              )}
            </div>
          </div>
        )}

        {/* Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-12 scroll-smooth">
          <div className="max-w-[210mm] w-full mx-auto">
            {/* Export Button - Responsive */}
            <div className="flex justify-between items-center mb-4 md:mb-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 hidden md:block">
                Prévisualisation Directe
              </h3>
              <button 
                onClick={handleExportPDF}
                disabled={isExporting}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 md:px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-xl"
              >
                {isExporting ? '⏳ Export...' : '⬇ Télécharger PDF'}
              </button>
            </div>

            {/* CV Preview - Responsive */}
            <div 
              id="resume-preview"
              className="bg-white shadow-2xl mx-auto origin-top transition-all duration-300 rounded-lg"
              style={{
                width: '100%',
                maxWidth: '210mm',
                minHeight: 'auto',
                padding: `${layout.marginV}px ${layout.marginH}px`,
                fontSize: `${layout.fontSize}px`,
                lineHeight: layout.lineHeight,
                fontFamily: layout.fontFamily,
                color: '#1f2937'
              }}
            >
              {resumeData && <ResumePreview data={resumeData} layout={layout} sectionTitles={sectionTitles} />}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE SÉLECTION DE TEMPLATE */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase tracking-wider">Changer de Template</h2>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(resumeTemplates).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => switchTemplate(key, template.data)}
                  className={`p-6 rounded-2xl border-2 transition-all text-left hover:shadow-lg ${
                    selectedTemplate === key
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-4xl mb-2">{template.icon}</div>
                  <h3 className="font-black text-lg uppercase">{template.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  {selectedTemplate === key && (
                    <div className="mt-3 text-blue-600 font-bold text-sm">✓ Sélectionné</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}