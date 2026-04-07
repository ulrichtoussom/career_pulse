"use client";
import { useState } from 'react';
import { supabase } from '@/frontend/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const router = useRouter();

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            if (isSignUp) {
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
            setMessage({ text: errorMsg, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleOAuth = async (provider) => {
        const currentOrigin = window.location.origin;
        await supabase.auth.signInWithOAuth({ 
            provider,
            options: { redirectTo: `${currentOrigin}/auth/callback` }
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
                            {isSignUp ? "Créer un compte" : "Bon retour parmi nous"}
                        </h1>
                        <p className="text-gray-500 text-sm font-medium">
                            {isSignUp ? "Commencez votre ascension dès aujourd'hui." : "Entrez vos accès pour continuer."}
                        </p>
                    </div>

                    {/* OAuth Button */}
                    <button 
                        onClick={() => handleOAuth('github')}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 py-3.5 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-[0.98]"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                        Continuer avec GitHub
                    </button>

                    <div className="flex items-center my-8">
                        <div className="flex-1 h-[1px] bg-gray-100"></div>
                        <span className="px-4 text-[10px] font-black uppercase tracking-widest text-gray-300">Ou par email</span>
                        <div className="flex-1 h-[1px] bg-gray-100"></div>
                    </div>

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
                        <div className="space-y-1">
                            <label className="text-[11px] font-black uppercase tracking-wider text-gray-400 ml-1">Mot de passe</label>
                            <input 
                                type="password" placeholder="••••••••" value={password}
                                onChange={(e) => setPassword(e.target.value)} required
                                className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium"
                            />
                        </div>

                        <button 
                            type="submit" disabled={loading}
                            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? "Traitement..." : isSignUp ? "Créer mon compte" : "Se connecter"}
                        </button>
                    </form>

                    {/* Toggle Login/SignUP */}
                    <p className="mt-8 text-center text-sm font-medium text-gray-500">
                        {isSignUp ? "Vous avez déjà un compte ?" : "Nouveau sur la plateforme ?"} 
                        <button 
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="ml-2 text-blue-600 font-bold hover:underline"
                        >
                            {isSignUp ? "Se connecter" : "S'inscrire gratuitement"}
                        </button>
                    </p>

                    {/* Messages de retour */}
                    {message.text && (
                        <div className={`mt-6 p-4 rounded-2xl text-xs font-bold flex items-center gap-3 ${
                            message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                            <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                            {message.text}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}