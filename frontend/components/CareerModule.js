// Fichier Principal Netoyer 

// components/CareerModule.js
import { useState } from 'react';
import { supabase } from '@/frontend/lib/supabaseClient'
import CVTemplateModerne from './templates/CVTemplateModerne';
import CVTemplateEpure from './templates/CVTemplateEpure';
import CVTemplateCreatif from './templates/CVTemplateCreatif';

// Imports des sous-composants
import CareerForm from './career/CareerForm';
import CareerPreview from './career/CareerPreview';
import CareerHistory from './career/CareerHistory'; // On ajoute l'import


export default function CareerModule() {
    
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [activeTab, setActiveTab] = useState('cv'); 
    const [selectedTemplate, setSelectedTemplate] = useState('moderne');
    const [fileName, setFileName] = useState("");
    const [isEditingLetter, setIsEditingLetter] = useState(false);

    const templates = {
        moderne: CVTemplateModerne,
        epure: CVTemplateEpure,
        creatif: CVTemplateCreatif
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
        doc.write(`<html><head><title>CV</title><script src="https://cdn.tailwindcss.com"></script><style>body { background: white; margin: 0; padding: 0; } #cv-preview { width: 210mm; min-height: 297mm; margin: 0 auto; } @page { size: A4; margin: 0; } @media print { body { -webkit-print-color-adjust: exact; } }</style></head><body><div id="cv-preview">${content}</div><script>window.onload = () => { setTimeout(() => { window.print(); window.frameElement.remove(); }, 500); };</script></body></html>`);
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
                <div className="w-full md:w-[350px] bg-white border-r flex flex-col overflow-hidden">
                    
                    {/* On place l'historique en haut */}
                    <CareerHistory onSelect={(data) => {
                        setResult(data);
                        setActiveTab('cv'); // On bascule sur le CV par défaut à l'ouverture
                    }} />

                    {/* Le formulaire prend le reste de la place avec scroll */}
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

                {/* ZONE DE TRAVAIL (Droite) */}
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
                />
            </div>
        </div>
    );
}