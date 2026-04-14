'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/frontend/lib/supabaseClient';

const CV_MODES = [
    { id: 'profile', label: 'Profil sauvegardé' },
    { id: 'upload',  label: 'Importer un PDF' },
    { id: 'paste',   label: 'Coller le texte' },
];

export default function SessionSetup({ onSessionCreated }) {
    const [profiles, setProfiles] = useState([]);
    const [cvMode, setCvMode] = useState('upload');

    // Mode profile
    const [selectedProfile, setSelectedProfile] = useState('');

    // Mode upload
    const [cvFile, setCvFile] = useState(null);
    const [extracting, setExtracting] = useState(false);
    const [extractedText, setExtractedText] = useState('');
    const [extractError, setExtractError] = useState('');
    const fileInputRef = useRef(null);

    // Mode paste
    const [pastedCv, setPastedCv] = useState('');

    // Job offer
    const [jobOffer, setJobOffer] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        supabase
            .from('career_profiles')
            .select('id, structured_data, created_at')
            .order('created_at', { ascending: false })
            .limit(10)
            .then(({ data, error }) => {
                if (error) console.error('career_profiles fetch error:', error.message);
                const list = data || [];
                setProfiles(list);
                if (list.length > 0) setCvMode('profile');
            });
    }, []);

    const getProfileLabel = (p) => {
        const b = p.structured_data?.basics || {};
        return b.name || b.label || `Profil ${p.id.slice(0, 6)}`;
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCvFile(file);
        setExtractedText('');
        setExtractError('');
        setExtracting(true);

        try {
            const fd = new FormData();
            fd.append('cv_file', file);
            const res = await fetch('/api/careerCoach/extractCv', { method: 'POST', body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Erreur d'extraction");
            setExtractedText(data.cv_text);
        } catch (err) {
            setExtractError(err.message);
            setCvFile(null);
        } finally {
            setExtracting(false);
        }
    };

    const getCvText = () => {
        if (cvMode === 'upload') return extractedText;
        if (cvMode === 'paste') return pastedCv.trim();
        return ''; // profile mode: handled server-side via career_profile_id
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!jobOffer.trim()) {
            setError("Veuillez coller une offre d'emploi.");
            return;
        }
        if (cvMode === 'upload' && !extractedText) {
            setError('Veuillez importer votre CV (PDF).');
            return;
        }
        if (cvMode === 'paste' && !pastedCv.trim()) {
            setError('Veuillez coller le texte de votre CV.');
            return;
        }
        if (cvMode === 'profile' && !selectedProfile) {
            setError('Veuillez sélectionner un profil.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/careerCoach/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    career_profile_id: cvMode === 'profile' ? selectedProfile : undefined,
                    cv_text: cvMode !== 'profile' ? getCvText() : undefined,
                    job_offer_text: jobOffer.trim(),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erreur création session');
            onSessionCreated(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-full px-4 py-10">
            <div className="w-full max-w-xl">

                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-violet-600 rounded-2xl mb-4">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                        </svg>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">IA Career Coach</h1>
                    <p className="text-sm text-slate-500 mt-1">Votre expert recrutement personnel, disponible 24h/24</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">

                    {/* ── Section CV ── */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                            Votre CV
                        </label>

                        {/* Mode tabs */}
                        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-3">
                            {CV_MODES.filter(m => m.id !== 'profile' || profiles.length > 0).map((m) => (
                                <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => { setCvMode(m.id); setError(''); }}
                                    className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg transition-all ${
                                        cvMode === m.id
                                            ? 'bg-white text-violet-700 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>

                        {/* Mode: profil sauvegardé */}
                        {cvMode === 'profile' && (
                            <select
                                value={selectedProfile}
                                onChange={(e) => setSelectedProfile(e.target.value)}
                                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            >
                                <option value="">Sélectionner un profil...</option>
                                {profiles.map((p) => (
                                    <option key={p.id} value={p.id}>{getProfileLabel(p)}</option>
                                ))}
                            </select>
                        )}

                        {/* Mode: upload PDF */}
                        {cvMode === 'upload' && (
                            <div>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                                        cvFile && extractedText
                                            ? 'border-emerald-300 bg-emerald-50'
                                            : 'border-slate-200 hover:border-violet-300 hover:bg-violet-50/50'
                                    }`}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    {extracting ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-6 h-6 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
                                            <p className="text-xs text-slate-500">Extraction du texte...</p>
                                        </div>
                                    ) : cvFile && extractedText ? (
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-2xl">✅</span>
                                            <p className="text-sm font-bold text-emerald-700">{cvFile.name}</p>
                                            <p className="text-[11px] text-emerald-600">{extractedText.length} caractères extraits</p>
                                            <p className="text-[10px] text-slate-400 mt-1">Cliquer pour changer de fichier</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">Importer votre CV</p>
                                                <p className="text-xs text-slate-400 mt-0.5">PDF · max 5 Mo</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {extractError && (
                                    <p className="text-xs text-red-600 mt-1.5 bg-red-50 border border-red-100 rounded-lg px-3 py-1.5">{extractError}</p>
                                )}
                            </div>
                        )}

                        {/* Mode: coller texte */}
                        {cvMode === 'paste' && (
                            <textarea
                                value={pastedCv}
                                onChange={(e) => setPastedCv(e.target.value)}
                                placeholder="Collez ici le texte de votre CV (expériences, compétences, formation...)..."
                                rows={7}
                                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                            />
                        )}
                    </div>

                    {/* ── Offre d'emploi ── */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                            {"Offre d'emploi"} <span className="text-violet-500">*</span>
                        </label>
                        <textarea
                            value={jobOffer}
                            onChange={(e) => setJobOffer(e.target.value)}
                            placeholder={"Collez ici le texte complet de l'offre d'emploi (ou un lien LinkedIn)..."}
                            rows={6}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {error && (
                        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading || extracting}
                        className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Démarrage...
                            </>
                        ) : (
                            <>
                                Démarrer la session
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                                </svg>
                            </>
                        )}
                    </button>
                </form>

                {/* Feature hints */}
                <div className="mt-6 grid grid-cols-3 gap-3">
                    {[
                        { icon: '💬', label: 'Chat expert' },
                        { icon: '🎯', label: "Prep d'entretien" },
                        { icon: '🧠', label: 'Quiz personnalisé' },
                    ].map((f) => (
                        <div key={f.label} className="text-center bg-white border border-slate-100 rounded-xl py-3 px-2">
                            <div className="text-xl mb-1">{f.icon}</div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{f.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
