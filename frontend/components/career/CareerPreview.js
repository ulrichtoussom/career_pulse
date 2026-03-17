// components/career/CareerPreview.js
import { useState } from 'react';

export default function CareerPreview({ 
    result, 
    setResult,
    activeTab, 
    setActiveTab, 
    SelectedCV, 
    isEditingLetter, 
    setIsEditingLetter,
    downloadPDF,
    downloadLetterPDF 
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

    // Mise à jour des champs basics (ville, entreprise, label)
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
                <p className="italic font-light">Importez un CV ou décrivez votre profil pour commencer...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
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
                    {/* BOUTON ENREGISTRER (Global) */}
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
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            PDF
                        </button>
                    )}
                </div>
            </div>

            {/* ZONE DE RENDU */}
            <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-200 shadow-inner">
                <div className="scale-90 origin-top transition-all duration-500">
                    
                    {activeTab === 'cv' && (
                        <div id="cv-preview" className="bg-white shadow-2xl">
                            <SelectedCV data={result} />
                        </div>
                    )}
                    
                    {activeTab === 'letter' && (
                        <div className="relative group">
                            <button 
                                onClick={() => setIsEditingLetter(!isEditingLetter)}
                                className="absolute -top-10 right-4 bg-blue-100 text-blue-600 px-3 py-1 rounded-md text-xs font-bold hover:bg-blue-200 transition-all z-20 shadow-sm"
                            >
                                {isEditingLetter ? "👁️ Voir le rendu final" : "✏️ Modifier tout l'en-tête et texte"}
                            </button>
                    
                            <div id="letter-preview" className="bg-white shadow-2xl w-[794px] min-h-[1120px]">
                                {isEditingLetter ? (
                                    /* MODE ÉDITION DÉTAILLÉ */
                                    <div className="p-16 space-y-8 text-left">
                                        <div className="grid grid-cols-2 gap-10">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-blue-400 uppercase">Ma Ville</label>
                                                <input 
                                                    className="w-full border-b-2 border-blue-50 focus:border-blue-400 outline-none p-1 text-sm"
                                                    value={result.basics?.location?.city || ""}
                                                    onChange={(e) => updateBasics('location', { ...result.basics.location, city: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-3 text-right">
                                                <label className="text-[10px] font-black text-blue-400 uppercase text-right block">Société Visée</label>
                                                <input 
                                                    className="w-full border-b-2 border-blue-50 focus:border-blue-400 outline-none p-1 text-sm text-right font-bold"
                                                    value={result.basics?.target_company || ""}
                                                    onChange={(e) => updateBasics('target_company', e.target.value)}
                                                    placeholder="Nom de l'entreprise"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-blue-400 uppercase">Poste (Objet)</label>
                                            <input 
                                                className="w-full border-b-2 border-blue-50 focus:border-blue-400 outline-none p-1 text-sm font-bold"
                                                value={result.basics?.label || ""}
                                                onChange={(e) => updateBasics('label', e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-blue-400 uppercase">Corps de la lettre</label>
                                            <textarea
                                                value={result.cover_letter || result.letter || ""}
                                                onChange={(e) => setResult({ ...result, cover_letter: e.target.value })}
                                                className="w-full min-h-[600px] p-6 font-mono text-sm text-gray-700 border-2 border-blue-100 rounded-xl focus:outline-none focus:border-blue-400 bg-blue-50/20 resize-none shadow-inner"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <LetterContent data={result} />
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'analysis' && (
                        <div className="bg-white shadow-2xl p-10 w-[794px] rounded-xl">
                            {/* ... garde ton code d'analyse actuel ... */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ... garde ton composant LetterContent actuel en dessous ...

// SOUS-COMPOSANT POUR LE RENDU VISUEL "COURRIER"
function LetterContent({ data }) {
    const text = data.cover_letter || data.letter;
    if (!text) return <div className="p-20 text-center text-gray-400">Aucune lettre générée.</div>;

    // Récupération du nom de l'entreprise
    const companyName = data.basics?.target_company || "votre entreprise";
    // On nettoie le texte pour éviter que l'IA ne répète "Madame, Monsieur" si on l'a déjà en dur
    const cleanBody = text.includes("Madame, Monsieur") 
        ? text.split("Madame, Monsieur").pop().replace(/^,/, "").trim() 
        : text;

    return (
        <div className="p-16 text-gray-800 font-serif leading-relaxed text-[15px]">
            <div className="max-w-[600px] mx-auto">
                
                {/* Header : Expéditeur et Destinataire */}
                <div className="flex justify-between mb-16">
                    <div className="text-left font-sans text-[11px] leading-tight text-gray-600">
                        <p className="font-bold text-gray-900 text-sm mb-1">{data.basics?.name}</p>
                        <p>{data.basics?.location?.city}</p>
                        <p>{data.basics?.phone}</p>
                        <p>{data.basics?.email}</p>
                    </div>
                    <div className="text-right mt-12 font-sans text-[11px] leading-tight text-gray-600">
                        <p className="font-bold text-gray-900">À l'attention du Responsable Recrutement</p>
                        <p className="italic">{companyName}</p>
                        <p className="mt-4">Fait à {data.basics?.location?.city || "Paris"}, le {new Date().toLocaleDateString('fr-FR')}</p>
                    </div>
                </div>

                {/* Objet */}
                <div className="mb-10">
                    <p className="font-bold text-gray-900 border-b border-gray-200 pb-1">
                        Objet : Candidature au poste de {data.basics?.label} chez {companyName}
                    </p>
                </div>

                {/* Corps du texte */}
                <div className="text-justify space-y-6">
                    <p>Madame, Monsieur,</p>
                    <div className="whitespace-pre-wrap">
                        {cleanBody}
                    </div>
                    
                    <div className="mt-12 pt-8">
                        <p>Je reste à votre entière disposition pour un futur entretien au sein de <strong>{companyName}</strong>.</p>
                        <p className="mt-2">Cordialement,</p>
                        <p className="font-bold mt-6 text-lg">{data.basics?.name}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}