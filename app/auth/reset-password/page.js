"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/frontend/lib/supabaseClient';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    // 'loading' | 'ready' | 'done' | 'error'
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // La session a déjà été établie par /auth/callback via exchangeCodeForSession.
        // On vérifie simplement qu'une session active existe.
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setStatus('ready');
            } else {
                setStatus('error');
            }
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) {
            setMessage('Les mots de passe ne correspondent pas.');
            return;
        }
        if (password.length < 6) {
            setMessage('Le mot de passe doit contenir au moins 6 caractères.');
            return;
        }
        setLoading(true);
        setMessage('');

        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
            setMessage(error.message);
            setLoading(false);
        } else {
            // Déconnecter pour forcer une reconnexion propre avec le nouveau mot de passe
            await supabase.auth.signOut();
            setStatus('done');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">

                {/* Logo */}
                <div className="flex items-center gap-2.5 mb-8">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12h6m-6 4h6M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"/>
                        </svg>
                    </div>
                    <span className="font-black text-lg tracking-tight">
                        Career<span className="text-blue-600">Pulse</span>
                    </span>
                </div>

                {/* ── CHARGEMENT ── */}
                {status === 'loading' && (
                    <div className="text-center py-8">
                        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-sm text-gray-500">Vérification en cours...</p>
                    </div>
                )}

                {/* ── LIEN INVALIDE ── */}
                {status === 'error' && (
                    <div className="text-center py-6">
                        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                            </svg>
                        </div>
                        <h2 className="text-xl font-black text-gray-900 mb-2">Lien invalide ou expiré</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Ce lien de réinitialisation est invalide ou a expiré (durée de vie : 1 heure).
                            Veuillez en demander un nouveau.
                        </p>
                        <a href="/login" className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl text-sm transition-colors">
                            Retour à la connexion
                        </a>
                    </div>
                )}

                {/* ── FORMULAIRE ── */}
                {status === 'ready' && (
                    <>
                        <h1 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">
                            Nouveau mot de passe
                        </h1>
                        <p className="text-sm text-gray-500 mb-8">
                            {"Choisissez un mot de passe sécurisé d'au moins 6 caractères."}
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[11px] font-black uppercase tracking-wider text-gray-400 ml-1">
                                    Nouveau mot de passe
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-black uppercase tracking-wider text-gray-400 ml-1">
                                    Confirmer le mot de passe
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
                                />
                            </div>

                            {message && (
                                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                                    {message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl text-sm uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
                            >
                                {loading ? "Mise à jour..." : "Enregistrer le nouveau mot de passe"}
                            </button>
                        </form>
                    </>
                )}

                {/* ── SUCCÈS ── */}
                {status === 'done' && (
                    <div className="text-center py-6">
                        <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                            </svg>
                        </div>
                        <h2 className="text-xl font-black text-gray-900 mb-2">Mot de passe mis à jour !</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Votre mot de passe a été réinitialisé. Connectez-vous avec votre nouveau mot de passe.
                        </p>
                        <a href="/login" className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl text-sm transition-colors">
                            Se connecter →
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
