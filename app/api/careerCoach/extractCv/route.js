// app/api/careerCoach/extractCv/route.js
// POST → reçoit un fichier PDF/txt et retourne le texte extrait

import { NextResponse } from 'next/server';
import { createClient } from '@/backend/lib/supabaseServer';
import { extractText } from 'unpdf';

export async function POST(req) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const formData = await req.formData();
    const cvFile = formData.get('cv_file');

    if (!cvFile || cvFile.size === 0) {
        return NextResponse.json({ error: 'Aucun fichier fourni.' }, { status: 400 });
    }

    if (cvFile.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'Fichier trop volumineux (max 5 Mo).' }, { status: 400 });
    }

    let extractedText = '';
    try {
        const arrayBuffer = await cvFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const result = await extractText(uint8Array);

        if (typeof result === 'string') {
            extractedText = result;
        } else if (typeof result?.text === 'string') {
            extractedText = result.text;
        } else if (Array.isArray(result?.text)) {
            // unpdf peut retourner { text: string[] }
            extractedText = result.text.join('\n');
        } else if (result) {
            // Dernier recours : sérialiser ce qu'on a
            extractedText = String(result);
        }
    } catch (err) {
        return NextResponse.json({ error: "Impossible d'extraire le texte du PDF : " + err.message }, { status: 500 });
    }

    const finalText = String(extractedText || '').trim();
    if (!finalText) {
        return NextResponse.json({ error: 'Le fichier ne contient pas de texte lisible.' }, { status: 400 });
    }

    return NextResponse.json({ cv_text: finalText });
}
