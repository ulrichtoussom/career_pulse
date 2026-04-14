// app/api/careerCoach/chat/route.js
// POST → envoie un message dans une session, retourne la réponse IA + questions suggérées

import { NextResponse } from 'next/server';
import { createClient } from '@/backend/lib/supabaseServer';
import { getChatResponse } from '@/backend/services/aiSercive';
import { getCoachSystemPrompt, getSuggestedQuestionsPrompt } from '@/backend/prompts/careerCoachPrompt';

export async function POST(req) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const { session_id, message } = await req.json();
    if (!session_id || !message?.trim()) {
        return NextResponse.json({ error: 'session_id et message sont requis.' }, { status: 400 });
    }

    // 1. Récupérer la session (contexte CV + offre)
    const { data: session, error: sessionError } = await supabase
        .from('coach_sessions')
        .select('*')
        .eq('id', session_id)
        .eq('user_id', user.id)
        .single();

    if (sessionError || !session) {
        return NextResponse.json({ error: 'Session introuvable.' }, { status: 404 });
    }

    // 2. Charger l'historique des messages (max 20 derniers pour rester dans le contexte)
    const { data: history } = await supabase
        .from('coach_messages')
        .select('role, content')
        .eq('session_id', session_id)
        .order('created_at', { ascending: true })
        .limit(20);

    const pastMessages = (history || []).map(m => ({ role: m.role, content: m.content }));

    // 3. Construire le prompt système avec le contexte
    const systemPrompt = getCoachSystemPrompt(
        session.cv_text || '',
        session.job_offer_text || ''
    );

    // 4. Appeler l'IA avec l'historique + le nouveau message
    const messagesForAI = [...pastMessages, { role: 'user', content: message }];
    let aiReply = '';
    try {
        aiReply = await getChatResponse(messagesForAI, systemPrompt, 1024);
    } catch (err) {
        return NextResponse.json({ error: "Erreur IA : " + err.message }, { status: 500 });
    }

    // 5. Sauvegarder le message utilisateur + la réponse IA
    await supabase.from('coach_messages').insert([
        { session_id, role: 'user', content: message },
        { session_id, role: 'assistant', content: aiReply },
    ]);

    // 6. Générer des questions suggérées (en parallèle, non bloquant)
    let suggestedQuestions = [];
    try {
        const suggestPrompt = getSuggestedQuestionsPrompt(
            session.cv_text || '',
            session.job_offer_text || ''
        );
        const raw = await getChatResponse(
            [{ role: 'user', content: 'Génère les 4 questions suggérées.' }],
            suggestPrompt,
            256
        );
        const match = raw.match(/\[[\s\S]*?\]/);
        if (match) suggestedQuestions = JSON.parse(match[0]);
    } catch (_) {
        // Non critique : les suggestions sont optionnelles
    }

    return NextResponse.json({ reply: aiReply, suggestedQuestions });
}

// GET → récupère l'historique d'une session
export async function GET(req) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get('session_id');
    if (!session_id) return NextResponse.json({ error: 'session_id requis.' }, { status: 400 });

    const { data, error } = await supabase
        .from('coach_messages')
        .select('id, role, content, created_at')
        .eq('session_id', session_id)
        .order('created_at', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
