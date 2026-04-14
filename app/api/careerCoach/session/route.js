// app/api/careerCoach/session/route.js
// GET  → liste des sessions de l'utilisateur
// POST → créer une nouvelle session (CV + offre)

import { NextResponse } from 'next/server';
import { createClient } from '@/backend/lib/supabaseServer';

export async function GET() {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const { data, error } = await supabase
        .from('coach_sessions')
        .select('id, title, linkedin_url, created_at, career_profile_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function POST(req) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const body = await req.json();
    const { career_profile_id, job_offer_text, linkedin_url, cv_text, title } = body;

    if (!job_offer_text && !linkedin_url) {
        return NextResponse.json({ error: "L'offre d'emploi est requise." }, { status: 400 });
    }

    // Si un career_profile_id est fourni, on récupère le CV structuré
    let resolvedCvText = cv_text || '';
    if (career_profile_id && !cv_text) {
        const { data: profile } = await supabase
            .from('career_profiles')
            .select('structured_data, user_raw_profile')
            .eq('id', career_profile_id)
            .eq('user_id', user.id)
            .single();

        if (profile) {
            const b = profile.structured_data?.basics || {};
            resolvedCvText = profile.user_raw_profile
                || `${b.name || ''} — ${b.label || ''}\n${b.summary || ''}`;
        }
    }

    const sessionTitle = title
        || (job_offer_text ? job_offer_text.substring(0, 60) + '...' : 'Session LinkedIn');

    const { data, error } = await supabase
        .from('coach_sessions')
        .insert([{
            user_id: user.id,
            career_profile_id: career_profile_id || null,
            job_offer_text: job_offer_text || '',
            linkedin_url: linkedin_url || null,
            cv_text: resolvedCvText,
            title: sessionTitle,
        }])
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}
