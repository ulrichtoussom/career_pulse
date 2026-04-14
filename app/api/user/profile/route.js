// app/api/user/profile/route.js
// GET  → retourne le profil (plan, preferred_ai_model) de l'utilisateur connecté
// PATCH → met à jour preferred_ai_model (et plan via service_role si besoin)

import { NextResponse } from 'next/server';
import { createClient } from '@/backend/lib/supabaseServer';

// Modèles réservés aux utilisateurs premium
const PREMIUM_ONLY_MODELS = ['claude'];

export async function GET() {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('plan, preferred_ai_model, updated_at')
        .eq('user_id', user.id)
        .single();

    if (error) {
        // Profil absent (edge case) → on le crée à la volée
        if (error.code === 'PGRST116') {
            const { data: newProfile } = await supabase
                .from('user_profiles')
                .insert({ user_id: user.id })
                .select('plan, preferred_ai_model, updated_at')
                .single();
            return NextResponse.json(newProfile);
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(profile);
}

export async function PATCH(request) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { preferred_ai_model } = body;

    const VALID_MODELS = ['auto', 'groq', 'openai', 'gemini', 'claude'];
    if (!VALID_MODELS.includes(preferred_ai_model)) {
        return NextResponse.json({ error: 'Modèle invalide' }, { status: 400 });
    }

    // Vérifier que l'utilisateur a bien le plan premium pour Claude
    if (PREMIUM_ONLY_MODELS.includes(preferred_ai_model)) {
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('plan')
            .eq('user_id', user.id)
            .single();

        if (profile?.plan !== 'premium') {
            return NextResponse.json(
                { error: 'Ce modèle est réservé aux utilisateurs premium.', code: 'PREMIUM_REQUIRED' },
                { status: 403 }
            );
        }
    }

    const { data, error } = await supabase
        .from('user_profiles')
        .update({ preferred_ai_model })
        .eq('user_id', user.id)
        .select('plan, preferred_ai_model')
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
