import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const getRedirectUrl = () => {
  // 1. Si on est dans le navigateur, on prend l'URL de la barre d'adresse (Fiable à 100%)
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // 2. Si on est côté serveur, on regarde si une URL est définie dans les variables (Render)
  // Sinon, par défaut pour le local, on utilise localhost
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

export const siteUrl = getRedirectUrl();

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