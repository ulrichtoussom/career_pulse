"use client";
import { useState } from 'react';
import { supabase } from '@/backend/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false); // Bascule entre Login et Inscription
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' }); // Objet pour gérer le style du message
  
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        
        // Si la confirmation par mail est activée (par défaut)
        setMessage({ 
          text: "Compte créé ! Un email de confirmation vous a été envoyé. Veuillez cliquer sur le lien pour activer votre compte.", 
          type: "success" 
        });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
        
        if (data.user) {
          setMessage({ text: "Connexion réussie !", type: "success" });
          setTimeout(() => {
            window.location.href = `${siteUrl}/`; 
          }, 1500);
        }
      }
    } catch (err) {
      // Traduction des erreurs courantes pour l'étudiant
      let errorMsg = err.message;
      if (err.message === "Email not confirmed") errorMsg = "Veuillez confirmer votre email avant de vous connecter.";
      if (err.message === "Invalid login credentials") errorMsg = "Email ou mot de passe incorrect.";
      
      setMessage({ text: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  }

  const handleOAuth = async (provider) => {
    await supabase.auth.signInWithOAuth({ provider });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? "Créer un compte" : "Connexion"}
        </h1>

        <form onSubmit={handleAuth} className="space-y-4">
          <input 
            type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} required
            className="w-full p-2 border rounded"
          />
          <input 
            type="password" placeholder="Mot de passe" value={password}
            onChange={(e) => setPassword(e.target.value)} required
            className="w-full p-2 border rounded"
          />
          <button 
            type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {loading ? "Chargement..." : isSignUp ? "S'inscrire" : "Se connecter"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-500 text-sm underline"
          >
            {isSignUp ? "Déjà un compte ? Se connecter" : "Nouveau ? Créer un compte"}
          </button>
        </div>

        <hr className="my-6" />

        {/* Option Social Login (ex: GitHub) */}
        <button 
          onClick={() => handleOAuth('github')}
          className="w-full border border-gray-300 p-2 rounded flex items-center justify-center gap-2 hover:bg-gray-50"
        >
          <span>Continuer avec GitHub</span>
        </button>

        {message.text && (
            <div className={`mt-4 p-3 rounded text-sm text-center ${
                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
                {/* ERREUR ICI AVANT : Il faut bien préciser .text */}
                {message.text} 
            </div>)
        }
      </div>
    </div>
  );
}