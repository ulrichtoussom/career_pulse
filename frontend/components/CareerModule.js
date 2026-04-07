// components/CareerModule.js
import { useState } from 'react';
import { supabase } from '@/frontend/lib/supabaseClient'

// Imports des sous-composants
import CareerForm from './career/CareerForm';
import CareerPreview from './career/CareerPreview';
import CareerHistory from './career/CareerHistory';
import AppearanceSettings from './career/AppearanceSettings';

// Import des templates premium du builder
import { resumeTemplates, templateLayouts } from '@/frontend/data/resumeTemplates';

export const adjustBrightness = (hex, amt) => {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(s => s + s).join('');
    let [r, g, b] = hex.match(/.{2}/g).map(x => parseInt(x, 16));
    
    r = Math.max(0, Math.min(255, r + amt));
    g = Math.max(0, Math.min(255, g + amt));
    b = Math.max(0, Math.min(255, b + amt));
    
    const fill = (n) => n.toString(16).padStart(2, '0');
    return `#${fill(r)}${fill(g)}${fill(b)}`;
};

export default function CareerModule() {
    
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [activeTab, setActiveTab] = useState('cv'); 
    const [selectedTemplate, setSelectedTemplate] = useState('classicPro');
    const [fileName, setFileName] = useState("");
    const [isEditingLetter, setIsEditingLetter] = useState(false);
    const [showDesignPanel, setShowDesignPanel] = useState(true);
    const [sectionTitles, setSectionTitles] = useState({});

    // État du layout avec valeurs par défaut robustes
    const defaultLayout = {
        fontSize: 11,
        lineHeight: 1.6,
        marginV: 50,
        marginH: 55,
        sectionSpacing: 32,
        primaryColor: '#000000',
        fontFamily: 'Inter',
        headerStyle: 'line-bottom',
        layout: 'single-column'
    };

    const [layout, setLayout] = useState(templateLayouts[selectedTemplate] || defaultLayout);

    // --- LOGIQUE DE TÉLÉCHARGEMENT ---
    const downloadLetterPDF = () => {
        const content = document.getElementById('letter-preview').innerHTML;
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed'; iframe.style.bottom = '0'; iframe.style.width = '0'; iframe.style.height = '0'; iframe.style.border = '0';
        document.body.appendChild(iframe);
        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(`<html><head><title>Lettre</title><script src="https://cdn.tailwindcss.com"></script><style>body { background: white; padding: 20mm; font-family: serif; } .letter-container { max-width: 170mm; margin: 0 auto; line-height: 1.6; } @page { size: A4; margin: 0; }</style></head><body><div class="letter-container">${content}</div><script>window.onload = () => { setTimeout(() => { window.print(); window.frameElement.remove(); }, 500); };</script></body></html>`);
        doc.close();
    };

    const downloadPDF = async () => {
        try {
            const element = document.getElementById('resume-preview');
            if (!element) {
                alert('❌ Aperçu du CV non trouvé');
                return;
            }

            const filename = fileName || `CV_${result?.basics?.name || 'Resume'}.pdf`;
            
            // Import dynamique pour éviter les problèmes SSR
            const { exportToPDF } = await import('@/frontend/utils/pdfExport');
            await exportToPDF('resume-preview', filename);
        } catch (err) {
            console.error('Erreur export PDF:', err);
            alert('❌ Erreur lors de l\'export PDF');
        }
    };

    // --- LOGIQUE DE GÉNÉRATION ---
    const generate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData(e.target); 
            const { data: { session } } = await supabase.auth.getSession();

            const res = await fetch('/api/career', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${session.access_token}` },
                body: formData 
            });

            if (!res.ok) {
                const errorText = await res.text(); 
                console.error("L'API a renvoyé une erreur :", errorText);
                return
            }

            const data = await res.json();
            if (data.structured_data) {
                const raw = data.structured_data;
                const safeData = {
                    ...raw,
                    basics: raw.basics || {},
                    work: raw.work || [],
                    education: raw.education || [],
                    projects: raw.projects || [],
                    analysis: raw.analysis || { strengths: [], gaps: [] }
                };
                setResult(safeData);
            }
        } catch (error) {
            console.error("Erreur de génération:", error);
        } finally {
            setLoading(false);
        }
    };

    const switchTemplate = (templateKey) => {
        setSelectedTemplate(templateKey);
        setLayout(templateLayouts[templateKey] || defaultLayout);
    };

    return (
        <div className="flex flex-col h-full bg-[#f8f9fa]">
            <div className="flex flex-1 overflow-hidden">
                
                {/* COLONNE GAUCHE (Formulaire + Historique) */}
                <div className="w-full md:w-[350px] bg-white border-r flex flex-col overflow-hidden shadow-sm z-10">
                    <CareerHistory onSelect={(data) => {
                        setResult(data);
                        setActiveTab('cv');
                    }} />

                    <div className="flex-1 overflow-y-auto">
                        <CareerForm 
                            generate={generate}
                            loading={loading}
                            fileName={fileName}
                            setFileName={setFileName}
                        />
                    </div>
                </div>

                {/* ZONE DE TRAVAIL CENTRALE (Aperçu) */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
                    <CareerPreview 
                        result={result}
                        setResult={setResult}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        isEditingLetter={isEditingLetter}
                        setIsEditingLetter={setIsEditingLetter}
                        downloadPDF={downloadPDF}
                        downloadLetterPDF={downloadLetterPDF}
                        layout={layout}
                        selectedTemplate={selectedTemplate}
                        sectionTitles={sectionTitles}
                        setSectionTitles={setSectionTitles}
                    />
                </div>

                {/* BARRE LATÉRALE DROITE (Réglages de style) */}
                {result && activeTab === 'cv' && (

                    <div className="relative flex">
                        {/* BOUTON D'ONGLET POUR OUVRIR/FERMER */}
                        <button 
                            onClick={() => setShowDesignPanel(!showDesignPanel)}
                            className= {`absolute -left-10 top-1/2 -translate-y-1/2 border border-r-0 p-2 rounded-l-xl shadow-md hover:text-blue-600 transition-all z-20 ${showDesignPanel ? 'bg-blue-500' : 'bg-emerald-500'} `}
                            title={showDesignPanel ? "Fermer le menu" : "Ouvrir le menu"}
                        >
                            {showDesignPanel ? '→' : '←'} 
                        </button>

                        {/* CONTENU DU PANNEAU AVEC TRANSITION */}
                        <div className={`bg-white border-l h-full transition-all duration-300 ease-in-out overflow-hidden ${
                            showDesignPanel ? 'w-72 p-4 opacity-100' : 'w-0 p-0 opacity-0 border-none'
                        }`}>
                            <div className="w-64">
                                <AppearanceSettings 
                                    layout={layout}
                                    setLayout={setLayout}
                                    currentTemplate={selectedTemplate}
                                    setTemplate={switchTemplate}
                                    templates={resumeTemplates}
                                    templateLayouts={templateLayouts}
                                />
                                
                                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <button 
                                        onClick={downloadPDF}
                                        className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        ⬇ Télécharger PDF
                                    </button>
                                </div>
                            </div>
                        </div>  
                    </div>
                )}
            </div>
        </div>
    );
}