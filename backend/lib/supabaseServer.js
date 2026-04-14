'use server'

import { createServerClient } from "@supabase/ssr"; 
import { cookies } from "next/headers";


// On transforme la logique en fonction asynchrone pour respecter le 'use server'
export async function getSiteUrl() {
  // Note: 'window' n'existe jamais sur le serveur, donc on simplifie
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}


export async function createClient() {
  // On appelle cookies() UNIQUEMENT quand la fonction est exécutée
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            // Le middleware s'occupera du rafraîchissement si on est en lecture seule
          }
        },
      },
    }
  );
}

