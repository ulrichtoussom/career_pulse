import { useState, useCallback } from 'react';
import CareerResumePreview from './CareerResumePreview';
import CareerEditForm from './CareerEditForm';

// ─────────────────────────────────────────────
// Indicateur visuel de saut de page (hors export PDF)
// Positionné à 297mm du haut = fin de la page A4
// ─────────────────────────────────────────────
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
            {/* Ligne de séparation */}
            <div style={{
                height: '2px',
                background: 'linear-gradient(to right, transparent, #94a3b8 20%, #94a3b8 80%, transparent)',
            }} />
            {/* Badge "Page 2" */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '4px',
            }}>
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

// ─────────────────────────────────────────────
// Composant lettre au format français standard
// Défini HORS du composant parent pour éviter le remontage
// ─────────────────────────────────────────────
function LetterDisplay({ result }) {
    const today = new Date().toLocaleDateString('fr-FR', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const basics   = result?.basics || {};
    const location = basics.location || {};
    const city     = location.city || '';
    const label    = basics.label || '';
    const company  = basics.target_company || '';

    // Nettoyer "Madame, Monsieur," du corps si l'IA l'a inclus (on l'affiche nous-mêmes)
    const rawBody = (result?.letter || '').replace(/^Madame,?\s*Monsieur,?\s*[\n,]*/i, '').trim();

    const objet = label && company
        ? `Candidature au poste de ${label} chez ${company}`
        : label
            ? `Candidature au poste de ${label}`
            : 'Candidature';

    return (
        <div style={{ fontFamily: "'Calibri', 'Arial', sans-serif", lineHeight: '1.6', color: '#222', maxWidth: '680px', margin: '0 auto', fontSize: '11pt', padding: '0 4px' }}>

            {/* EN-TÊTE EXPÉDITEUR (haut gauche) */}
            <div style={{ marginBottom: '28px' }}>
                <p style={{ fontWeight: '700', margin: '0 0 2px 0', fontSize: '13pt' }}>
                    {basics.name || 'Votre Nom'}
                </p>
                {location.address && <p style={{ margin: '0', fontSize: '10pt' }}>{location.address}</p>}
                {(location.postalCode || city) && (
                    <p style={{ margin: '0', fontSize: '10pt' }}>
                        {[location.postalCode, city].filter(Boolean).join(' ')}
                    </p>
                )}
                {basics.phone && <p style={{ margin: '0', fontSize: '10pt' }}>{basics.phone}</p>}
                {basics.email && <p style={{ margin: '0', fontSize: '10pt' }}>{basics.email}</p>}
            </div>

            {/* DATE (droite) */}
            <div style={{ textAlign: 'right', marginBottom: '24px', fontSize: '10.5pt' }}>
                <p style={{ margin: 0 }}>
                    {city ? `${city}, le ${today}` : `Le ${today}`}
                </p>
            </div>

            {/* DESTINATAIRE (haut droite) */}
            <div style={{ marginBottom: '28px', fontSize: '10.5pt' }}>
                <p style={{ fontWeight: '600', margin: '0' }}>{"À l'attention du Service Recrutement"}</p>
                {company && <p style={{ margin: '0' }}>{company}</p>}
            </div>

            {/* OBJET */}
            <div style={{ marginBottom: '24px', fontSize: '10.5pt' }}>
                <p style={{ margin: '0' }}>
                    <strong>Objet&nbsp;: {objet}</strong>
                </p>
            </div>

            {/* FORMULE D'APPEL */}
            <div style={{ marginBottom: '16px', fontSize: '10.5pt' }}>
                <p style={{ margin: '0' }}>{"Madame, Monsieur,"}</p>
            </div>

            {/* CORPS DE LA LETTRE */}
            <div style={{ marginBottom: '24px', fontSize: '10.5pt' }}>
                {rawBody
                    .split(/\n{2,}/)
                    .filter(p => p.trim())
                    .map((paragraph, i) => (
                        <p key={i} style={{ margin: '0 0 14px 0', textAlign: 'justify' }}>
                            {paragraph.replace(/\n/g, ' ').trim()}
                        </p>
                    ))}
            </div>

            {/* FORMULE DE POLITESSE */}
            <div style={{ marginBottom: '40px', fontSize: '10.5pt' }}>
                <p style={{ margin: '0 0 10px 0' }}>
                    {"Dans l'attente d'un retour favorable de votre part, je reste à votre disposition pour tout entretien à votre convenance."}
                </p>
                <p style={{ margin: '0' }}>
                    {"Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."}
                </p>
            </div>

            {/* SIGNATURE */}
            <div>
                <p style={{ margin: '0', fontWeight: '700', fontSize: '11pt' }}>
                    {basics.name || 'Votre Nom'}
                </p>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// Composant principal
// ─────────────────────────────────────────────
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
    sectionTitles,
    setSectionTitles
}) {
    const [isSaving, setIsSaving] = useState(false);
    const [isEditingCV, setIsEditingCV] = useState(false);

    const handleSave = useCallback(async () => {
        if (!result?.id) {
            alert("Impossible de sauvegarder : ID du dossier manquant.");
            return;
        }
        setIsSaving(true);
        try {
            const response = await fetch('/api/career/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: result.id, structured_data: result })
            });
            if (response.ok) {
                alert("✅ Modifications enregistrées avec succès !");
            } else {
                throw new Error("Erreur serveur");
            }
        } catch (err) {
            alert("Erreur lors de la sauvegarde");
            console.error('Erreur de sauvegarde:', err);
        } finally {
            setIsSaving(false);
        }
    }, [result]);

    if (!result) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-100 w-full h-full min-h-[200px] md:min-h-[400px] p-6 md:p-8 text-center">
                <div className="w-16 h-16 border-4 border-dashed border-gray-300 rounded-full mb-4 animate-spin-slow"></div>
                <p className="italic font-light">{"Analysez votre profil et une offre d'emploi pour commencer..."}</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden w-full h-full">
            {/* BARRE D'ONGLETS */}
            <div className="bg-white border-b px-3 md:px-6 py-2 flex justify-between items-center flex-wrap gap-2 flex-shrink-0">
                <div className="flex gap-1 md:gap-2">
                    {['cv', 'letter', 'analysis'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-2 text-xs md:text-sm font-medium rounded-lg transition-all ${
                                activeTab === tab ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
                            }`}
                        >
                            {tab === 'cv' ? '📄 CV' : tab === 'letter' ? '✉️ Lettre' : '🔍 Analyse'}
                        </button>
                    ))}
                </div>

                <div className="flex gap-1 md:gap-2 flex-wrap">
                    {/* BOUTON MODIFIER CV */}
                    {activeTab === 'cv' && (
                        <button
                            onClick={() => setIsEditingCV(!isEditingCV)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all whitespace-nowrap ${
                                isEditingCV
                                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                            }`}
                        >
                            {isEditingCV ? '✓ Édition' : '✎ Modifier'}
                        </button>
                    )}

                    {/* BOUTON MODIFIER LETTRE */}
                    {activeTab === 'letter' && (
                        <button
                            onClick={() => setIsEditingLetter(!isEditingLetter)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all whitespace-nowrap ${
                                isEditingLetter
                                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                            }`}
                        >
                            {isEditingLetter ? '✓ Édition' : '✎ Modifier'}
                        </button>
                    )}

                    {/* BOUTON ENREGISTRER */}
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                    >
                        {isSaving ? '⏳' : '💾 Enreg.'}
                    </button>

                    {/* BOUTON TÉLÉCHARGER — caché quand on édite la lettre */}
                    {activeTab === 'cv' && (
                        <button
                            onClick={downloadPDF}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all whitespace-nowrap bg-green-600 hover:bg-green-700 text-white"
                        >
                            ⬇ PDF
                        </button>
                    )}
                    {activeTab === 'letter' && !isEditingLetter && (
                        <button
                            onClick={downloadLetterPDF}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all whitespace-nowrap bg-green-600 hover:bg-green-700 text-white"
                        >
                            📧 PDF
                        </button>
                    )}
                </div>
            </div>

            {/* CONTENU DE L'ONGLET */}
            <div className="flex-1 overflow-hidden flex">
                {/* ── ONGLET CV ── always mounted, toggled via display */}
                <div style={{ display: activeTab === 'cv' ? 'contents' : 'none' }}>
                    {/* ZONE ÉDITION (gauche) */}
                    <div
                        style={{ display: isEditingCV ? 'flex' : 'none' }}
                        className="w-full md:w-1/2 overflow-y-auto border-r border-gray-200 bg-gray-50 p-4 md:p-6 flex-col"
                    >
                        <h3 className="font-bold text-base mb-4">✏️ Modifier le CV</h3>
                        <CareerEditForm
                            data={result}
                            setData={setResult}
                            sectionTitles={sectionTitles}
                            setSectionTitles={setSectionTitles}
                        />
                    </div>

                    {/* ZONE APERÇU */}
                    <div className={`${isEditingCV ? 'hidden md:flex md:w-1/2' : 'w-full flex'} justify-start md:justify-center py-4 md:py-6 overflow-auto bg-gray-100`}>
                        {/* Wrapper positionné pour l'indicateur de page 2 */}
                        <div style={{ position: 'relative', width: 'fit-content', minWidth: 'min-content' }}>
                            {/* id="resume-preview" sur le papier blanc — seul ce div est exporté en PDF */}
                            <div id="resume-preview" style={{ background: 'white', boxShadow: '0 4px 40px rgba(0,0,0,0.12)' }}>
                                <CareerResumePreview
                                    data={result}
                                    layout={layout}
                                    sectionTitles={sectionTitles}
                                />
                            </div>
                            {/* Indicateur saut de page — à l'extérieur du div exporté */}
                            <PageBreakIndicator />
                        </div>
                    </div>
                </div>

                {/* ── ONGLET LETTRE ── */}
                {activeTab === 'letter' && (
                    <div className="flex-1 overflow-auto bg-gray-50">
                        {isEditingLetter ? (
                            /* MODE ÉDITION — textarea pour le corps uniquement */
                            <div className="max-w-3xl mx-auto p-4 md:p-8">
                                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
                                    {"✏️ Vous modifiez le "}
                                    <strong>corps</strong>
                                    {" de la lettre. L'en-tête (nom, adresse, date, objet) et la formule de politesse sont générés automatiquement depuis votre profil."}
                                </div>
                                <textarea
                                    value={result.letter || ''}
                                    onChange={(e) => setResult({ ...result, letter: e.target.value })}
                                    className="w-full h-96 md:h-[500px] p-4 border border-gray-300 rounded-lg font-serif text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    placeholder="Corps de votre lettre de motivation..."
                                />
                            </div>
                        ) : (
                            /* MODE AFFICHAGE — lettre complète au format français */
                            <div id="letter-preview" className="max-w-3xl mx-auto p-6 md:p-12 bg-white my-4 md:my-8 shadow-sm border border-gray-100 rounded">
                                <LetterDisplay result={result} />
                            </div>
                        )}
                    </div>
                )}

                {/* ── ONGLET ANALYSE ── */}
                {activeTab === 'analysis' && (
                    <div className="flex-1 overflow-auto bg-white">
                        <div className="max-w-3xl mx-auto p-4 md:p-8">
                            <h2 className="text-xl font-bold mb-6">📊 Analyse de votre candidature</h2>

                            {result.analysis ? (
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                                        <h3 className="text-base font-bold text-green-700 mb-4">✅ Points forts</h3>
                                        <ul className="space-y-2">
                                            {(result.analysis.strengths || []).map((s, i) => (
                                                <li key={i} className="flex gap-2 text-sm">
                                                    <span className="text-green-600 mt-0.5">•</span>
                                                    <span>{s}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
                                        <h3 className="text-base font-bold text-orange-700 mb-4">⚠️ Points à améliorer</h3>
                                        <ul className="space-y-2">
                                            {(result.analysis.gaps || []).map((g, i) => (
                                                <li key={i} className="flex gap-2 text-sm">
                                                    <span className="text-orange-600 mt-0.5">•</span>
                                                    <span>{g}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-400 italic">Aucune analyse disponible.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
