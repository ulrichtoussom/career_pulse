import { useState } from 'react';
import { supabase } from '@/backend/lib/supabase';
import CVTemplateModerne from './templates/CVTemplateModerne';
import CVTemplateEpure from './templates/CVTemplateEpure';
import CVTemplateCreatif from './templates/CVTemplateCreatif';


export default function CareerModule() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [activeTab, setActiveTab] = useState('cv'); 
    const [selectedTemplate, setSelectedTemplate] = useState('moderne');
    const [fileName, setFileName] = useState("")
    const [isEditingLetter, setIsEditingLetter] = useState(false);

    const templates = {
        moderne: CVTemplateModerne,
        epure: CVTemplateEpure,
        creatif: CVTemplateCreatif
    };

    const SelectedCV = templates[selectedTemplate];

    // Télécharger Lettre de motivation 
    const downloadLetterPDF = () => {
        const content = document.getElementById('letter-preview').innerHTML;
        
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);
    
        const doc = iframe.contentWindow.document;
    
        doc.open();
        doc.write(`
            <html>
                <head>
                    <title>Lettre_Motivation</title>
                    <link href="${window.location.origin}/_next/static/css/app/layout.css" rel="stylesheet">
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style>
                        body { background: white !important; padding: 20mm; font-family: serif; }
                        .letter-container { max-width: 170mm; margin: 0 auto; line-height: 1.6; }
                        @page { size: A4; margin: 0; }
                    </style>
                </head>
                <body>
                    <div class="letter-container">
                        ${content}
                    </div>
                    <script>
                        window.onload = () => {
                            setTimeout(() => {
                                window.print();
                                window.frameElement.remove();
                            }, 500);
                        };
                    </script>
                </body>
            </html>
        `);
        doc.close();
    };


    // FONCTION DE TÉLÉCHARGEMENT PDF cv 
    const downloadPDF = () => {
        const content = document.getElementById('cv-preview').innerHTML;
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);
    
        const doc = iframe.contentWindow.document;
    
        doc.open();
        doc.write(`
            <html>
                <head>
                    <title>CV_Ulrich_Toussom</title>
                    <link href="${window.location.origin}/_next/static/css/app/layout.css" rel="stylesheet">
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style>
                        body { background: white !important; margin: 0; padding: 0; }
                        #cv-preview { width: 210mm; min-height: 297mm; margin: 0 auto; }
                        @page { size: A4; margin: 0; }
                        @media print {
                            body { -webkit-print-color-adjust: exact; }
                        }
                    </style>
                </head>
                <body>
                    <div id="cv-preview">
                        ${content}
                    </div>
                    <script>
                        window.onload = () => {
                            setTimeout(() => {
                                window.print();
                                window.frameElement.remove();
                            }, 500);
                        };
                    </script>
                </body>
            </html>
        `);
        doc.close();
    };

    const generate = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const formData = new FormData(e.target); 
            const { data: { session } } = await supabase.auth.getSession();

            const res = await fetch('/api/career', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: formData 
            });

            const data = await res.json();

            if (data.structured_data) {
                const raw = data.structured_data
                // On s'assure que les objets critiques existent avant de faire le setResult
                const safeData = {
                    ...raw,
                    basics: raw.basics || {},
                    work: raw.work || [],
                    analysis: raw.analysis || { strengths: [], gaps: [] }
                }
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
                {/* FORMULAIRE (Gauche) */}
                <div className="w-full md:w-[350px] bg-white border-r p-6 overflow-y-auto custom-scrollbar">
                    <h2 className="text-lg font-bold mb-6 italic">Career Studio</h2>
                    
                    <div className="mb-8">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-3 block">1. Style du CV</label>
                        <div className="grid grid-cols-3 gap-2">
                            {Object.keys(templates).map((t) => (
                                <button
                                    key={t}
                                    type="button" 
                                    onClick={() => setSelectedTemplate(t)}
                                    className={`py-2 px-1 text-[10px] font-bold uppercase rounded-lg border-2 transition-all ${
                                        selectedTemplate === t 
                                        ? 'border-blue-600 bg-blue-50 text-blue-600' 
                                        : 'border-gray-100 text-gray-400 hover:border-gray-200'
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={generate} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Optionnel : Ancien CV (PDF)</label>
                            <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-blue-400 transition-colors bg-gray-50">
                                <input 
                                    type="file" 
                                    name="cv_file" 
                                    accept=".pdf"
                                    onChange={(e) => setFileName(e.target.files[0]?.name)} 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="text-center">
                                    {fileName ? (
                                        <div className="flex flex-col items-center animate-bounce-short">
                                            <span className="text-blue-600 font-bold text-xs">📄 {fileName}</span>
                                            <p className="text-[10px] text-gray-400 mt-1">Fichier prêt !</p>
                                        </div>
                                    ) : (
                                        <p className="text-[10px] text-gray-500 mt-1">Cliquez pour importer un PDF</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">2. Mon Profil</label>
                            <textarea name="profile_summary" placeholder="Ou décrivez brièvement votre parcours ici..." className="w-full h-32 p-3 text-sm border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">3. L Annonce</label>
                            <textarea name="job_description" placeholder="Collez l'offre ici..." className="w-full h-32 p-3 text-sm border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-none" />
                        </div>

                        <button disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50">
                            {loading ? "IA en cours..." : "Générer le dossier"}
                        </button>
                    </form>
                </div>

                {/* ZONE DE TRAVAIL (Droite) */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="bg-white border-b px-8 py-2 flex justify-between items-center">
                        <div className="flex gap-4">
                            {['cv', 'letter', 'analysis'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                                        activeTab === tab ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
                                    }`}
                                >
                                    {tab === 'cv' ? '📄 Mon CV' : tab === 'letter' ? '✉️ Lettre' : '🔍 Analyse'}
                                </button>
                            ))}
                        </div>

                        {/* BOUTON TÉLÉCHARGER INTELLIGENT */}
                        {result && (activeTab === 'cv' || activeTab === 'letter') && (
                            <button 
                                onClick={activeTab === 'cv' ? downloadPDF : downloadLetterPDF}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                {activeTab === 'cv' ? 'Télécharger CV (PDF)' : 'Télécharger Lettre (PDF)'}
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-200 shadow-inner">
                        {result ? (
                            <div className="scale-90 origin-top transition-all duration-500">
                                {activeTab === 'cv' && (
                                    <div id="cv-preview" className="bg-white shadow-2xl">
                                        <SelectedCV data={result} />
                                    </div>
                                )}
                                
                                {activeTab === 'letter' && (
                                    <div className="relative group">
                                        {/* Bouton pour activer l'édition */}
                                        <button 
                                            onClick={() => setIsEditingLetter(!isEditingLetter)}
                                            className="absolute -top-10 right-4 bg-blue-100 text-blue-600 px-3 py-1 rounded-md text-xs font-bold hover:bg-blue-200 transition-all"
                                        >
                                            {isEditingLetter ? "✅ Terminer l'édition" : "✏️ Modifier la lettre"}
                                        </button>
                                
                                        <div id="letter-preview" className="bg-white shadow-2xl p-16 w-[794px] min-h-[1120px] text-sm leading-loose">
                                            {/* Nouvelle version (Compatible JSON Resume) */}
                                                <div className="mb-10 text-right">
                                                    <p className="font-bold text-lg">{result.basics?.name || "Candidat"}</p>
                                                    <p className="text-gray-500 text-xs">
                                                        {result.basics?.email} {result.basics?.phone && `• ${result.basics.phone}`}
                                                    </p>
                                                    <p className="text-gray-400 italic text-xs mt-1">Le {new Date().toLocaleDateString('fr-FR')}</p>
                                                </div>
                                            {isEditingLetter ? (
                                                <textarea
                                                    value={result.cover_letter || result.letter}
                                                    onChange={(e) => {
                                                        // On met à jour le contenu dans l'objet result
                                                        setResult({ ...result, cover_letter: e.target.value });
                                                    }}
                                                    className="w-full min-h-[700px] p-4 font-serif text-gray-700 text-base border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 bg-blue-50/30 resize-none"
                                                    spellCheck="false"
                                                />
                                            ) : (
                                                <div className="whitespace-pre-wrap font-serif text-gray-700 text-base outline-none">
                                                    {result.letter}
                                                </div>
                                            )}
                                        </div>
                                </div>
                                )}

                                {activeTab === 'analysis' && (
                                    <div className="bg-white shadow-2xl p-10 w-[794px] rounded-xl">
                                        <h2 className="text-xl font-bold text-purple-600 mb-6 border-b pb-2">Analyse Stratégique</h2>
                                        <div className="grid grid-cols-2 gap-8 text-left">
                                            <div className="bg-green-50 p-6 rounded-2xl">
                                                <h4 className="font-bold text-green-700 mb-4 flex items-center gap-2 text-base">✅ Points Forts</h4>
                                                <ul className="space-y-3 text-sm text-green-800 italic">{result.analysis.strengths.map((s,i) => <li key={i}>• {s}</li>)}</ul>
                                            </div>
                                            <div className="bg-red-50 p-6 rounded-2xl">
                                                <h4 className="font-bold text-red-700 mb-4 flex items-center gap-2 text-base">⚠️ Points à surveiller</h4>
                                                <ul className="space-y-3 text-sm text-red-800 italic">{result.analysis.gaps.map((g,i) => <li key={i}>• {g}</li>)}</ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400">
                                <div className="w-16 h-16 border-4 border-dashed border-gray-300 rounded-full mb-4 animate-spin-slow"></div>
                                <p className="italic font-light">Importez un CV ou décrivez votre profil pour commencer...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>–––
        </div>
    );
}