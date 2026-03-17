// lib/supabaseClient.js
import { createBrowserClient } from '@supabase/ssr'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Ce client est léger et parfait pour useEffect et les évènements onClick
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);