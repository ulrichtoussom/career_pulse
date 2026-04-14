import { getAIResponse } from '@/backend/services/aiSercive';
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req) {
    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.split(' ')[1]

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
            cookies: {
                getAll() { return [] }, 
            },
        }
    )

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser(token)

        if (authError || !user) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
        }

        // On récupère content ET conversationId depuis le corps de la requête
        const { content, conversationId } = await req.json()

        if (!conversationId) {
            return NextResponse.json({ error: 'ID de conversation manquant' }, { status: 400 })
        }

        // 1. Obtenir la réponse de l'IA
        const aiResponse = await getAIResponse(content);

        // 2. Sauvegarder la réponse de l'IA liée à la conversation
        const { data: aiMsg, error: dbError } = await supabase
            .from('messages')
            .insert([
                { 
                    content: aiResponse, 
                    role: 'assistant', 
                    user_id: user.id,
                    conversation_id: conversationId // <--- Liaison cruciale ici
                }
            ])
            .select()
            .single();

        if (dbError) {
            console.error("Erreur insertion DB (IA):", dbError);
            throw dbError;
        }

        return NextResponse.json(aiMsg)

    } catch (error) {
        console.error("Erreur API Chat:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}