'use client'
import { useState } from 'react';
import ResumeForm from './ResumeForm';
import AppearanceSettings from '../career/AppearanceSettings';
import CareerResumePreview from '../career/CareerResumePreview';
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
    interests: "Centres d'Intérêt",
    references: 'Références',
    projects: 'Projets'
};

// ── Indicateur de saut de page — hors du div exporté en PDF ─────────────────
function PageBreakIndicator() {
    return (
        <div style={{
            position: 'absolute',
            top: '297mm',
            left: '-16px',
            right: '-16px',
            pointerEvents: 'none',
            zIndex: 10,
        }}>
            <div style={{
                height: '2px',
                background: 'linear-gradient(to right, transparent, #94a3b8 20%, #94a3b8 80%, transparent)',
            }} />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
                <span style={{
                    background: '#64748b',
                    color: 'white',
                    fontSize: '8px',
                    fontWeight: 700,
                    letterSpacing: '1.5px',
                    padding: '2px 10px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                }}>
                    Page 2
                </span>
            </div>
        </div>
    );
}

export default function ResumeBuilder() {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [activeTab, setActiveTab] = useState('content');
    const [resumeData, setResumeData] = useState(null);
    const [layout, setLayout] = useState(defaultLayout);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [sectionTitles, setSectionTitles] = useState(DEFAULT_SECTION_TITLES);
    const [isExporting, setIsExporting] = useState(false);
    // Mobile: toggle entre formulaire et aperçu
    const [mobileView, setMobileView] = useState('form');

    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            const { exportToPDF } = await import('@/frontend/utils/pdfExport');
            const filename = `${resumeData?.basics?.name || 'CV'}.pdf`;
            await exportToPDF('resume-preview', filename);
        } catch (error) {
            console.error('Export error:', error);
            alert("Erreur lors de l'export PDF");
        } finally {
            setIsExporting(false);
        }
    };

    // Sélection initiale du template
    if (!selectedTemplate) {
        return (
            <TemplateSelector onSelect={(key, data) => {
                setSelectedTemplate(key);
                setResumeData(data);
                setLayout(templateLayouts[key] || defaultLayout);
                setMobileView('preview');
            }} />
        );
    }

    const switchTemplate = (key) => {
        setSelectedTemplate(key);
        setLayout(templateLayouts[key] || defaultLayout);
        setShowTemplateModal(false);
    };

    return (
        <div className="flex flex-col h-full bg-[#F8F9FA] overflow-hidden">

            {/* ── NAVIGATION MOBILE ─────────────────────────────────────── */}
            <div className="md:hidden flex border-b bg-white shadow-sm flex-shrink-0">
                <button
                    onClick={() => setMobileView('form')}
                    className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                        mobileView === 'form'
                            ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                            : 'text-gray-500 hover:bg-gray-50'
                    }`}
                >
                    📝 Édition
                </button>
                <button
                    onClick={() => setMobileView('preview')}
                    className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                        mobileView === 'preview'
                            ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                            : 'text-gray-500 hover:bg-gray-50'
                    }`}
                >
                    👁 Aperçu
                </button>
            </div>

            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

                {/* ── PANNEAU GAUCHE (formulaire + apparence) ───────────── */}
                <div className={`
                    ${mobileView === 'form' ? 'flex' : 'hidden'} md:flex
                    flex-col w-full md:w-[440px] lg:w-[500px] bg-white border-r border-gray-200 shadow-xl z-10 shrink-0
                `}>
                    {/* Tabs */}
                    <div className="flex p-2 bg-gray-50 m-4 rounded-2xl border border-gray-100 gap-1">
                        <button
                            onClick={() => setActiveTab('content')}
                            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all ${activeTab === 'content' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
                        >
                            Contenu
                        </button>
                        <button
                            onClick={() => setActiveTab('design')}
                            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all ${activeTab === 'design' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
                        >
                            Apparence
                        </button>
                        <button
                            onClick={() => setShowTemplateModal(true)}
                            className="flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                        >
                            🎨 Template
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
                        {activeTab === 'content' ? (
                            <ResumeForm
                                data={resumeData}
                                setData={setResumeData}
                                sectionTitles={sectionTitles}
                                setSectionTitles={setSectionTitles}
                            />
                        ) : (
                            <AppearanceSettings
                                layout={layout}
                                setLayout={setLayout}
                                currentTemplate={selectedTemplate}
                                setTemplate={switchTemplate}
                                templates={resumeTemplates}
                                templateLayouts={templateLayouts}
                            />
                        )}
                    </div>
                </div>

                {/* ── ZONE APERÇU ───────────────────────────────────────── */}
                <div className={`
                    ${mobileView === 'preview' ? 'flex' : 'hidden'} md:flex
                    flex-1 overflow-y-auto bg-gray-100 flex-col
                `}>
                    {/* Barre d'actions */}
                    <div className="flex items-center justify-between px-4 md:px-8 py-3 bg-white border-b border-gray-200 flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSelectedTemplate(null)}
                                className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                            >
                                ← Changer template
                            </button>
                            <span className="text-gray-300">|</span>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                {resumeTemplates[selectedTemplate]?.icon} {resumeTemplates[selectedTemplate]?.name}
                            </span>
                        </div>
                        <button
                            onClick={handleExportPDF}
                            disabled={isExporting}
                            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-sm"
                        >
                            {isExporting ? '⏳ Export...' : '⬇ Télécharger PDF'}
                        </button>
                    </div>

                    {/* Zone de prévisualisation */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-10 flex justify-center">
                        <div style={{ position: 'relative', width: 'fit-content' }}>
                            {/*
                             * id="resume-preview" est sur le PAPIER BLANC uniquement.
                             * Cela garantit que l'export PDF ne capture que le CV,
                             * sans le fond gris ou les indicateurs de page.
                             */}
                            <div
                                id="resume-preview"
                                style={{ background: 'white', boxShadow: '0 4px 40px rgba(0,0,0,0.12)', borderRadius: '4px' }}
                            >
                                {resumeData && (
                                    <CareerResumePreview
                                        data={resumeData}
                                        layout={layout}
                                        sectionTitles={sectionTitles}
                                    />
                                )}
                            </div>

                            {/* Indicateur de saut de page — non exporté en PDF */}
                            <PageBreakIndicator />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MODAL CHANGEMENT DE TEMPLATE ─────────────────────────── */}
            {showTemplateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto">
                        <div className="sticky top-0 bg-white p-5 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-black uppercase tracking-wider">Changer de Template</h2>
                            <button
                                onClick={() => setShowTemplateModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 font-bold"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(resumeTemplates).map(([key, template]) => (
                                <button
                                    key={key}
                                    onClick={() => switchTemplate(key)}
                                    className={`p-5 rounded-2xl border-2 transition-all text-left hover:shadow-lg ${
                                        selectedTemplate === key
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="text-3xl mb-2">{template.icon}</div>
                                    <h3 className="font-black text-base uppercase">{template.name}</h3>
                                    <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                                    {selectedTemplate === key && (
                                        <div className="mt-2 text-blue-600 font-bold text-xs">✓ Actif</div>
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
