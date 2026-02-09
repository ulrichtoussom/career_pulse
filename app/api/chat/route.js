import { getAIResponse } from '@/backend/services/aiSercive';
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// ... (tes imports)

export async function POST(req) {

        console.log("Cookies reçus par l'API :", (await cookies()).getAll().length)

        const authHeader = req.headers.get('Authorization')
        const token = authHeader?.split(' ')[1]

        //const cookieStore = await cookies()

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            //process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            process.env.SUPABASE_SERVICE_ROLE_KEY,
            {
                cookies: {
                    // On garde cette structure pour la compatibilité SSR
                    getAll() { return [] }, 
                },
            }
        )
        /* const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          cookies: {
            // Cette syntaxe est la plus robuste pour lire les cookies
            getAll() {
              return cookieStore.getAll()
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) =>
                  cookieStore.set(name, value, options)
                )
              } catch {
                // Le middleware gère généralement l'écriture, on peut ignorer ici
              }
            },
          },
        }
      ) */

    try {
       // Utiliser getUser() au lieu de getSession() pour plus de fiabilité
       const { data: { user }, error: authError } = await supabase.auth.getUser(token)

        if (authError || !user) {
            console.error("Auth Error avec Token:", authError) // Regarde ton terminal !
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
        }

        const { content } = await req.json()

        // 1. Obtenir la réponse de l'IA
        const aiResponse = await getAIResponse(content);

        // 2. Sauvegarder ET récupérer l'objet créé
        // Note : on utilise user.id (récupéré plus haut via getUser) au lieu de session.user.id
        console.log("Tentative insertion IA pour user:", user.id)
        const { data: aiMsg, error: dbError } = await supabase
            .from('messages')
            .insert([
                { 
                    content: aiResponse, 
                    role: 'assistant', 
                    user_id: user.id // <--- Correction ici
                }
            ])
            .select()
            .single();

        if (dbError) {
            console.error("Erreur insertion DB:", dbError);
            throw dbError;
        }

        // 3. On renvoie l'objet complet (id, content, role, user_id, created_at)
        return NextResponse.json(aiMsg)

    } catch (error) {
        console.error("Erreur API Chat:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}