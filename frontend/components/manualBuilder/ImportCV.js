'use client'
import { useState, useRef } from 'react';

export default function ImportCV({ onImport }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError('');
        setFileName(file.name);
        setIsLoading(true);

        try {
            const fd = new FormData();
            fd.append('cv_file', file);

            const res = await fetch('/api/manualBuilder/parseCV', {
                method: 'POST',
                body: fd,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Erreur lors de l'analyse du CV");

            onImport(data);
        } catch (err) {
            setError(err.message);
            setFileName('');
            if (fileInputRef.current) fileInputRef.current.value = '';
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-center">
                {/* Zone d'upload */}
                <div
                    onClick={() => !isLoading && fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 mb-4 cursor-pointer transition-all ${
                        isLoading
                            ? 'border-blue-200 bg-blue-50 cursor-not-allowed'
                            : fileName
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
                    }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        disabled={isLoading}
                        className="hidden"
                    />

                    {isLoading ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                            <div>
                                <p className="text-sm font-bold text-blue-700">Analyse IA en cours...</p>
                                <p className="text-xs text-slate-400 mt-1">{"L'IA structure votre CV"}</p>
                            </div>
                        </div>
                    ) : fileName ? (
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-3xl">✅</span>
                            <p className="text-sm font-bold text-blue-700">{fileName}</p>
                            <p className="text-xs text-slate-400">Cliquer pour changer de fichier</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                                <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-700">Importer votre CV (PDF)</p>
                                <p className="text-xs text-slate-400 mt-1">Cliquer pour sélectionner · max 10 Mo</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Ce que l'IA extrait */}
                {!isLoading && !fileName && (
                    <div className="grid grid-cols-2 gap-2 text-left mb-4">
                        {[
                            '✓ Informations personnelles',
                            '✓ Expériences professionnelles',
                            '✓ Formations & diplômes',
                            '✓ Compétences techniques',
                            '✓ Langues & niveaux',
                            '✓ Projets personnels',
                        ].map((item) => (
                            <p key={item} className="text-[11px] text-slate-500 font-medium">{item}</p>
                        ))}
                    </div>
                )}

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm text-left">
                        ⚠️ {error}
                    </div>
                )}
            </div>
        </div>
    );
}
