import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// On calcule l'URL de redirection de manière dynamique
// Si on est dans le navigateur, on prend l'URL actuelle (chaweb.onrender.com)
// Sinon (pendant le build), on met une chaîne vide
const getRedirectUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'https://chaweb.onrender.com'; // Valeur de secours pour le build
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url-for-build.supabase.co', 
  supabaseAnonKey || 'placeholder-key-for-build', 
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }
)

export const siteUrl = getRedirectUrl();