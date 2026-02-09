import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Garde la session active au rafraîchissement
    autoRefreshToken: true, // Rafraîchit le token automatiquement
    detectSessionInUrl: true // Utile si tu ajoutes la connexion Google/GitHub plus tard
  }
})
