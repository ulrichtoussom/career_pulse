// app/api/careerCoach/quiz/[id]/route.js
// GET → récupère un quiz complet avec toutes ses questions et résultats

import { NextResponse } from 'next/server';
import { createClient } from '@/backend/lib/supabaseServer';

export async function GET(req, { params }) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const { id } = await params;

    const { data: quizSession, error } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (error || !quizSession) {
        return NextResponse.json({ error: 'Quiz introuvable.' }, { status: 404 });
    }

    const { data: questions, error: qError } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_session_id', id)
        .order('question_order', { ascending: true });

    if (qError) return NextResponse.json({ error: qError.message }, { status: 500 });

    return NextResponse.json({ ...quizSession, questions: questions || [] });
}
