// app/api/careerCoach/quiz/answer/route.js
// POST → soumettre une réponse à une question + calculer le score final si terminé

import { NextResponse } from 'next/server';
import { createClient } from '@/backend/lib/supabaseServer';

export async function POST(req) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const { question_id, quiz_session_id, user_answer } = await req.json();
    if (!question_id || !quiz_session_id || user_answer === undefined) {
        return NextResponse.json({ error: 'question_id, quiz_session_id et user_answer sont requis.' }, { status: 400 });
    }

    // Vérifier que la session quiz appartient à l'utilisateur
    const { data: quizSession } = await supabase
        .from('quiz_sessions')
        .select('id, status')
        .eq('id', quiz_session_id)
        .eq('user_id', user.id)
        .single();

    if (!quizSession) return NextResponse.json({ error: 'Session quiz introuvable.' }, { status: 404 });
    if (quizSession.status === 'completed') {
        return NextResponse.json({ error: 'Ce quiz est déjà terminé.' }, { status: 400 });
    }

    // Récupérer la question pour vérifier la bonne réponse
    const { data: question } = await supabase
        .from('quiz_questions')
        .select('correct_answer')
        .eq('id', question_id)
        .eq('quiz_session_id', quiz_session_id)
        .single();

    if (!question) return NextResponse.json({ error: 'Question introuvable.' }, { status: 404 });

    const is_correct = user_answer === question.correct_answer;

    // Enregistrer la réponse
    const { error: updateError } = await supabase
        .from('quiz_questions')
        .update({ user_answer, is_correct })
        .eq('id', question_id);

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

    // Vérifier si toutes les questions ont été répondues
    const { data: allQuestions } = await supabase
        .from('quiz_questions')
        .select('is_correct, user_answer')
        .eq('quiz_session_id', quiz_session_id);

    const answered = (allQuestions || []).filter(q => q.user_answer !== null);
    const isFinished = answered.length === (allQuestions || []).length;

    if (isFinished) {
        const score = answered.filter(q => q.is_correct).length;
        await supabase
            .from('quiz_sessions')
            .update({ status: 'completed', score })
            .eq('id', quiz_session_id);

        return NextResponse.json({ is_correct, finished: true, score, total: allQuestions.length });
    }

    return NextResponse.json({ is_correct, finished: false });
}
