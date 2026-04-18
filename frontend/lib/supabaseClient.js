// lib/supabaseClient.js
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// autoRefreshToken: true par défaut dans Supabase — on le laisse actif.
// En cas d'erreur réseau (bloqueur de pub, VPN, token expiré), le SDK
// réessaie indéfiniment et pollue la console. On branche un listener
// global pour détecter ces échecs et nettoyer la session corrompue.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Réduit l'intervalle de retry automatique (défaut Supabase : toutes les
    // quelques secondes). Le SDK ne l'expose pas directement, mais on peut
    // intercepter TOKEN_REFRESHED / SIGNED_OUT pour réagir proprement.
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Nettoie la session locale si le refresh token est définitivement invalide,
// afin d'arrêter la boucle de retry et rediriger vers le login.
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED' && !session) {
    // Le refresh a abouti mais sans session → token expiré côté serveur
    supabase.auth.signOut();
  }
});