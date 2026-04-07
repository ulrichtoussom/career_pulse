import { useState } from 'react';
import CareerResumePreview from './CareerResumePreview';

export default function CareerPreview({ 
    result, 
    setResult,
    activeTab, 
    setActiveTab, 
    isEditingLetter, 
    setIsEditingLetter,
    downloadPDF,
    downloadLetterPDF,
    layout,
    selectedTemplate,
    sectionTitles,
    setSectionTitles
}) {

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!result.id) {
            alert("Impossible de sauvegarder : ID du dossier manquant.");
            return;
        }
        setIsSaving(true);
        try {
            const response = await fetch('/api/career/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: result.id,
                    structured_data: result
                })
            });

            if (response.ok) {
                alert("✅ Modifications enregistrées avec succès !");
            } else {
                throw new Error("Erreur serveur");
            }
        } catch (err) {
            alert("Erreur lors de la sauvegarde");
            console.error('Erreur de sauvegarde ', err);
        } finally {
            setIsSaving(false);
        }
    };

    // Mise à jour des champs basics
    const updateBasics = (field, value) => {
        setResult({
            ...result,
            basics: { 
                ...result.basics, 
                [field]: value 
            }
        });
    };

    if (!result) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-200">
                <div className="w-16 h-16 border-4 border-dashed border-gray-300 rounded-full mb-4 animate-spin-slow"></div>
                <p className="italic font-light">Analysez votre profil et une offre d'emploi pour commencer...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden w-full">
            {/* BARRE D'ONGLETS */}
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

                <div className="flex gap-3">
                    {/* BOUTON ENREGISTRER */}
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all disabled:opacity-50"
                    >
                        {isSaving ? "Chargement..." : "💾 Enregistrer"}
                    </button>

                    {/* BOUTON TÉLÉCHARGER */}
                    {(activeTab === 'cv' || activeTab === 'letter') && (
                        <button 
                            onClick={activeTab === 'cv' ? downloadPDF : downloadLetterPDF}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all"
                        >
                            {activeTab === 'cv' ? '⬇ PDF' : '📧 Télécharger'}
                        </button>
                    )}
                </div>
            </div>

            {/* CONTENU DE L'ONGLET */}
            <div className="flex-1 overflow-auto flex flex-col items-center justify-start">
                {activeTab === 'cv' && (
                    <div id="resume-preview" className="w-full flex justify-center py-6">
                        <CareerResumePreview 
                            data={result}
                            layout={layout}
                            sectionTitles={sectionTitles}
                        />
                    </div>
                )}

                {activeTab === 'letter' && (
                    <div id="letter-preview" className="w-full max-w-2xl mx-auto p-8 bg-white">
                        {isEditingLetter ? (
                            <textarea
                                value={result.letter || ''}
                                onChange={(e) => setResult({ ...result, letter: e.target.value })}
                                className="w-full h-96 p-4 border border-gray-300 rounded-lg font-serif text-sm"
                                placeholder="Votre lettre de motivation..."
                            />
                        ) : (
                            <div className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-justify">
                                {result.letter || 'Aucune lettre générée'}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'analysis' && (
                    <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-lg">
                        <h2 className="text-2xl font-bold mb-6">📊 Analyse</h2>
                        
                        {result.analysis && (
                            <>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-lg font-bold text-green-600 mb-4">✅ Points forts</h3>
                                        <ul className="space-y-2">
                                            {(result.analysis.strengths || []).map((s, i) => (
                                                <li key={i} className="flex gap-2">
                                                    <span className="text-green-600">•</span>
                                                    <span>{s}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-lg font-bold text-orange-600 mb-4">⚠️ Lacunes</h3>
                                        <ul className="space-y-2">
                                            {(result.analysis.gaps || []).map((g, i) => (
                                                <li key={i} className="flex gap-2">
                                                    <span className="text-orange-600">•</span>
                                                    <span>{g}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
