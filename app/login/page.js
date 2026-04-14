"use client";
import { useState } from 'react';
import { supabase } from '@/frontend/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
    // mode: 'login' | 'signup' | 'forgot'
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const router = useRouter();

    const switchMode = (m) => {
        setMode(m);
        setMessage({ text: '', type: '' });
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            if (mode === 'forgot') {
                const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
                const redirectTo = `${siteUrl}/auth/callback?next=/auth/reset-password`;
                const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
                if (error) throw error;
                setMessage({
                    text: "Un lien de réinitialisation a été envoyé à votre adresse email. Vérifiez votre boîte de réception (et les spams).",
                    type: "success"
                });
                return;
            }

            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setMessage({
                    text: "Vérifiez votre boîte mail pour confirmer l'inscription.",
                    type: "success"
                });
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                if (data.user) {
                    setMessage({ text: "Connexion réussie...", type: "success" });
                    setTimeout(() => { window.location.href = "/"; }, 1000);
                }
            }
        } catch (err) {
            let errorMsg = err.message;
            if (err.message === "Invalid login credentials") errorMsg = "Email ou mot de passe incorrect.";
            if (err.message.includes("rate limit")) errorMsg = "Trop de tentatives. Réessayez dans quelques minutes.";
            setMessage({ text: errorMsg, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleOAuth = async (provider) => {
        // On utilise NEXT_PUBLIC_SITE_URL (défini au build) plutôt que
        // window.location.origin pour éviter que le proxy interne de Render
        // (0.0.0.0:10000) ne contamine l'URL de redirection OAuth.
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
        await supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo: `${siteUrl}/auth/callback` }
        });
    };

    return (
        <div className="flex min-h-screen bg-white font-sans overflow-hidden">
            
            {/* --- SECTION GAUCHE : VISUEL (Caché sur Mobile) --- */}
            <div className="hidden lg:flex w-1/2 bg-gray-900 relative items-center justify-center p-12 overflow-hidden">
                {/* Effet de lumières en arrière-plan */}
                <div className="absolute top-[-10%] left-[-10%] w-full h-full bg-blue-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-full h-full bg-purple-600/20 rounded-full blur-[120px]" />
                
                <div className="relative z-10 max-w-lg">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl shadow-2xl flex items-center justify-center text-white font-black italic">CP</div>
                        <span className="text-white font-black text-2xl tracking-tighter uppercase italic">Career<span className="text-blue-500">Pulse</span></span>
                    </div>
                    <h2 className="text-5xl font-black text-white leading-[1.1] mb-6 uppercase italic tracking-tighter">
                        L'intelligence <br />au service de <br />votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">succès</span>.
                    </h2>
                    <p className="text-gray-400 text-lg font-medium leading-relaxed">
                        Rejoignez des milliers de professionnels qui utilisent l'IA pour transformer leurs opportunités en réalités.
                    </p>
                </div>
            </div>

            {/* --- SECTION DROITE : FORMULAIRE --- */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-gray-50/30">
                <div className="w-full max-w-[440px]">
                    
                    {/* Header Mobile Only */}
                    <div className="lg:hidden flex items-center gap-2 mb-10">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg" />
                        <span className="font-black text-xl tracking-tighter uppercase italic">CareerPulse</span>
                    </div>

                    <div className="mb-10">
                        <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase italic tracking-tight">
                            {mode === 'signup' ? "Créer un compte" : mode === 'forgot' ? "Mot de passe oublié" : "Bon retour parmi nous"}
                        </h1>
                        <p className="text-gray-500 text-sm font-medium">
                            {mode === 'signup'
                                ? "Commencez votre ascension dès aujourd'hui."
                                : mode === 'forgot'
                                    ? "Saisissez votre email pour recevoir un lien de réinitialisation."
                                    : "Entrez vos accès pour continuer."}
                        </p>
                    </div>

                    {/* OAuth Buttons — masqués en mode "forgot" */}
                    {mode !== 'forgot' && (
                        <>
                            <div className="flex flex-col gap-3">
                                {/* Google */}
                                <button
                                    onClick={() => handleOAuth('google')}
                                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 py-3.5 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-[0.98]"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    Continuer avec Google
                                </button>

                                {/* GitHub */}
                                <button
                                    onClick={() => handleOAuth('github')}
                                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 py-3.5 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-[0.98]"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                                    Continuer avec GitHub
                                </button>
                            </div>

                            <div className="flex items-center my-8">
                                <div className="flex-1 h-[1px] bg-gray-100"></div>
                                <span className="px-4 text-[10px] font-black uppercase tracking-widest text-gray-300">Ou par email</span>
                                <div className="flex-1 h-[1px] bg-gray-100"></div>
                            </div>
                        </>
                    )}

                    {/* Formulaire */}
                    <form onSubmit={handleAuth} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[11px] font-black uppercase tracking-wider text-gray-400 ml-1">Email</label>
                            <input
                                type="email" placeholder="nom@exemple.com" value={email}
                                onChange={(e) => setEmail(e.target.value)} required
                                className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium"
                            />
                        </div>

                        {/* Mot de passe — masqué en mode "forgot" */}
                        {mode !== 'forgot' && (
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-black uppercase tracking-wider text-gray-400 ml-1">Mot de passe</label>
                                    {mode === 'login' && (
                                        <button
                                            type="button"
                                            onClick={() => switchMode('forgot')}
                                            className="text-[11px] font-bold text-blue-600 hover:underline"
                                        >
                                            Mot de passe oublié ?
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="password" placeholder="••••••••" value={password}
                                    onChange={(e) => setPassword(e.target.value)} required
                                    className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium"
                                />
                            </div>
                        )}

                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {loading
                                ? "Traitement..."
                                : mode === 'forgot'
                                    ? "Envoyer le lien"
                                    : mode === 'signup'
                                        ? "Créer mon compte"
                                        : "Se connecter"}
                        </button>
                    </form>

                    {/* Liens de navigation entre les modes */}
                    {mode === 'forgot' ? (
                        <p className="mt-8 text-center text-sm font-medium text-gray-500">
                            <button onClick={() => switchMode('login')} className="text-blue-600 font-bold hover:underline">
                                ← Retour à la connexion
                            </button>
                        </p>
                    ) : (
                        <p className="mt-8 text-center text-sm font-medium text-gray-500">
                            {mode === 'signup' ? "Vous avez déjà un compte ?" : "Nouveau sur la plateforme ?"}
                            <button
                                onClick={() => switchMode(mode === 'signup' ? 'login' : 'signup')}
                                className="ml-2 text-blue-600 font-bold hover:underline"
                            >
                                {mode === 'signup' ? "Se connecter" : "S'inscrire gratuitement"}
                            </button>
                        </p>
                    )}

                    {/* Messages de retour */}
                    {message.text && (
                        <div className={`mt-6 p-4 rounded-2xl text-xs font-bold flex items-start gap-3 ${
                            message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                            <div className={`w-2 h-2 rounded-full mt-0.5 flex-shrink-0 ${message.type === 'success' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                            {message.text}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}