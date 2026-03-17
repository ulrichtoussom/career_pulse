// components/CareerModule.js
import { useState } from 'react';
import { supabase } from '@/frontend/lib/supabaseClient'
import CVTemplateModerne from './templates/CVTemplateModerne';
import CVTemplateEpure from './templates/CVTemplateEpure';
import CVTemplateCreatif from './templates/CVTemplateCreatif';

// Imports des sous-composants
import CareerForm from './career/CareerForm';
import CareerPreview from './career/CareerPreview';
import CareerHistory from './career/CareerHistory';
import AppearanceSettings from './career/AppearanceSettings'; // Importation du nouveau composant

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
    const [selectedTemplate, setSelectedTemplate] = useState('moderne');
    const [fileName, setFileName] = useState("");
    const [isEditingLetter, setIsEditingLetter] = useState(false);
    const [showDesignPanel, setShowDesignPanel] = useState(true);

    // État du Thème
    const [theme, setTheme] = useState({
        primaryColor: '#2563eb',
        secondaryColor: '#6366f1',
        fontFamily: 'font-sans',
        spacing: 'normal',
        borderRadius: '8px'
    });

    const templates = {
        moderne: CVTemplateModerne,
        epure: CVTemplateEpure,
        creatif: CVTemplateCreatif
    };

    // Mapping pour transformer "moderne" en "Moderne" pour le sélecteur
    const templateDisplayNames = {
        moderne: 'Moderne',
        epure: 'Épure',
        creatif: 'Créatif'
    };

    const SelectedCV = templates[selectedTemplate];

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

    const downloadPDF = () => {
        const content = document.getElementById('cv-preview').innerHTML;
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed'; iframe.style.bottom = '0'; iframe.style.width = '0'; iframe.style.height = '0'; iframe.style.border = '0';
        document.body.appendChild(iframe);
        const doc = iframe.contentWindow.document;
        doc.open();
        // Injection du thème dans le print
        doc.write(`<html><head><title>CV</title><script src="https://cdn.tailwindcss.com"></script><style>body { background: white; margin: 0; padding: 0; } #cv-preview { width: 210mm; min-height: 297mm; margin: 0 auto; } @page { size: A4; margin: 0; } @media print { body { -webkit-print-color-adjust: exact; } }</style></head><body><div id="cv-preview" class="${theme.fontFamily}">${content}</div><script>window.onload = () => { setTimeout(() => { window.print(); window.frameElement.remove(); }, 500); };</script></body></html>`);
        doc.close();
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
                    education: raw.education || [], // <-- Vérifie que cette ligne existe bien
                    projects: raw.projects,
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
                            templates={templates}
                            selectedTemplate={selectedTemplate}
                            setSelectedTemplate={setSelectedTemplate}
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
                        SelectedCV={SelectedCV}
                        isEditingLetter={isEditingLetter}
                        setIsEditingLetter={setIsEditingLetter}
                        downloadPDF={downloadPDF}
                        downloadLetterPDF={downloadLetterPDF}
                        theme={theme}
                        setTheme={setTheme}
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
                            <div className="w-64"> {/* Container fixe pour éviter que le contenu ne saute pendant le slide */}
                                <AppearanceSettings 
                                    theme={theme} 
                                    setTheme={setTheme}
                                    currentTemplate={templateDisplayNames[selectedTemplate]}
                                    setTemplate={(name) => setSelectedTemplate(name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))}
                                />
                                
                                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <button 
                                        onClick={downloadPDF}
                                        className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        Exporter en PDF
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