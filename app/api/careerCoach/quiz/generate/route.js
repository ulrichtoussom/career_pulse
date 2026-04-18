// app/api/careerCoach/quiz/generate/route.js
// POST → génère un quiz de 15 questions et le sauvegarde en base

import { NextResponse } from 'next/server';
import { createClient } from '@/backend/lib/supabaseServer';
import { getChatResponse } from '@/backend/services/aiSercive';
import { getQuizPrompt } from '@/backend/prompts/quizPrompt';

export async function POST(req) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const { session_id, preferred_model } = await req.json();
    const preferredProvider = preferred_model || 'auto';
    if (!session_id) return NextResponse.json({ error: 'session_id requis.' }, { status: 400 });

    // Récupérer la session
    const { data: session, error: sessionError } = await supabase
        .from('coach_sessions')
        .select('*')
        .eq('id', session_id)
        .eq('user_id', user.id)
        .single();

    if (sessionError || !session) {
        return NextResponse.json({ error: 'Session introuvable.' }, { status: 404 });
    }

    if (!session.job_offer_text) {
        return NextResponse.json({ error: "L'offre d'emploi est requise pour générer un quiz." }, { status: 400 });
    }

    // Générer le quiz avec l'IA
    const prompt = getQuizPrompt(session.cv_text || '', session.job_offer_text);
    let rawResponse = '';
    try {
        rawResponse = await getChatResponse(
            [{ role: 'user', content: 'Génère le quiz de 15 questions.' }],
            prompt,
            4096,
            preferredProvider
        );
    } catch (err) {
        return NextResponse.json({ error: "Erreur IA : " + err.message }, { status: 500 });
    }

    // Parser la réponse JSON
    let quizData = null;
    try {
        const cleaned = rawResponse.replace(/```json|```/g, '').trim();
        const match = cleaned.match(/\{[\s\S]*\}/);
        if (match) quizData = JSON.parse(match[0]);
    } catch (_) {}

    if (!quizData?.questions || quizData.questions.length === 0) {
        return NextResponse.json({ error: "L'IA n'a pas retourné un quiz valide. Réessayez." }, { status: 500 });
    }

    const questions = quizData.questions.slice(0, 15);

    // Créer la session de quiz
    const { data: quizSession, error: quizError } = await supabase
        .from('quiz_sessions')
        .insert([{
            user_id: user.id,
            coach_session_id: session_id,
            job_offer_text: session.job_offer_text,
            cv_text: session.cv_text || null,
            status: 'in_progress',
        }])
        .select()
        .single();

    if (quizError) return NextResponse.json({ error: quizError.message }, { status: 500 });

    // Insérer les questions
    const questionsToInsert = questions.map((q, i) => ({
        quiz_session_id: quizSession.id,
        question_order: i + 1,
        difficulty: q.difficulty || (i < 5 ? 'easy' : i < 10 ? 'medium' : 'hard'),
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
    }));

    const { data: insertedQuestions, error: qError } = await supabase
        .from('quiz_questions')
        .insert(questionsToInsert)
        .select();

    if (qError) return NextResponse.json({ error: qError.message }, { status: 500 });

    return NextResponse.json({
        quiz_session_id: quizSession.id,
        questions: insertedQuestions,
    }, { status: 201 });
}
