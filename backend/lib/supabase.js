import { createClient } from '@supabase/supabase-js'

// On récupère les variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// On récupère l'URL du site (définie sur Render)
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url-for-build.supabase.co', 
  supabaseAnonKey || 'placeholder-key-for-build', 
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      // On force Supabase à connaître l'URL de l'application
      flowType: 'pkce', // Recommandé pour SSR et la sécurité moderne
      redirectTo: siteUrl // Optionnel ici, mais utile pour certains flux
    }
  }
)