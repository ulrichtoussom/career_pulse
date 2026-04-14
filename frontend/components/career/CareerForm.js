'use client';
// components/career/CareerForm.js
import { useState, useRef } from 'react';

export default function CareerForm({ generate, loading, fileName, setFileName }) {
    const [profileMode, setProfileMode] = useState('paste'); // 'paste' | 'upload'
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        setFileName(file?.name || '');
    };

    const handleModeSwitch = (mode) => {
        setProfileMode(mode);
        // Reset file selection when switching away from upload
        if (mode === 'paste') {
            setFileName('');
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full bg-white p-4 md:p-6 overflow-y-auto">
            <h2 className="text-base font-black text-slate-900 mb-5 tracking-tight">
                Career<span className="text-blue-600">Studio</span>
            </h2>

            <form onSubmit={generate} className="space-y-5">

                {/* ── SECTION PROFIL ── */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        1. Mon Profil
                    </label>

                    {/* Mode toggle */}
                    <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
                        <button
                            type="button"
                            onClick={() => handleModeSwitch('paste')}
                            className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg transition-all ${
                                profileMode === 'paste'
                                    ? 'bg-white text-blue-700 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            Décrire / Coller
                        </button>
                        <button
                            type="button"
                            onClick={() => handleModeSwitch('upload')}
                            className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg transition-all ${
                                profileMode === 'upload'
                                    ? 'bg-white text-blue-700 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            Importer un PDF
                        </button>
                    </div>

                    {/* Mode paste : textarea */}
                    {profileMode === 'paste' && (
                        <>
                            <textarea
                                name="profile_summary"
                                placeholder="Décrivez votre parcours, compétences, expériences... Ou collez directement le texte de votre CV."
                                className="w-full h-32 p-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-slate-50"
                            />
                            {/* Hidden file input vide pour que le FormData ne contienne pas de fichier */}
                            <input type="hidden" name="cv_file" value="" />
                        </>
                    )}

                    {/* Mode upload : zone fichier */}
                    {profileMode === 'upload' && (
                        <>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative border-2 border-dashed rounded-xl p-5 cursor-pointer transition-colors ${
                                    fileName
                                        ? 'border-blue-300 bg-blue-50'
                                        : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 bg-slate-50'
                                }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    name="cv_file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <div className="text-center">
                                    {fileName ? (
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-2xl">📄</span>
                                            <p className="text-sm font-bold text-blue-700">{fileName}</p>
                                            <p className="text-[10px] text-slate-400">Cliquer pour changer de fichier</p>
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
                            </div>
                            {/* Champ profil vide pour que le backend n'essaie pas de lire profile_summary */}
                            <input type="hidden" name="profile_summary" value="" />
                        </>
                    )}
                </div>

                {/* ── SECTION OFFRE ── */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        2. L{"'"}Offre / Annonce
                    </label>
                    <textarea
                        name="job_description"
                        placeholder={"Collez le texte de l'offre d'emploi, un lien LinkedIn ou toute URL d'annonce..."}
                        className="w-full h-32 p-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-none bg-slate-50"
                    />
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <span>💡</span>
                        Lien LinkedIn, Indeed, Welcome to the Jungle, ou texte brut acceptés
                    </p>
                </div>

                <button
                    disabled={loading || (profileMode === 'upload' && !fileName)}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-sm hover:bg-blue-700 transition-all disabled:opacity-50 text-sm"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            IA en cours...
                        </span>
                    ) : 'Générer le dossier'}
                </button>
            </form>
        </div>
    );
}
