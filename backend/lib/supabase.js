import { createClient } from '@supabase/supabase-js'

// On récupère les variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// On crée le client avec une protection pour le build
// Si les variables manquent (pendant le build Render), on utilise des valeurs fictives.
// Dès que l'app est en ligne, elle utilisera les vraies variables de ton interface Render.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url-for-build.supabase.co', 
  supabaseAnonKey || 'placeholder-key-for-build', 
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true 
    }
  }
)
