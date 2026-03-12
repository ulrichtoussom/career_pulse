import { getAIResponse } from '@/backend/services/aiSercive';
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { extractText } from 'unpdf'; 
import { getCareerSystemPrompt } from '@/backend/prompts/careerPrompts';
import { cleanAndValidateAIJson } from '@/backend/utils/jsonCleaner';


export async function POST(req) {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { cookies: { getAll() { return [] } } }
    );

    try {
        const { data: { user } } = await supabase.auth.getUser(token);
        if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

        const formData = await req.formData();
        const profile_summary = formData.get('profile_summary') || "";
        const job_description = formData.get('job_description') || "";
        const cvFile = formData.get('cv_file');

        let extractedText = "";

        // --- EXTRACTION PDF AVEC UNPDF (STABLE & SÉCURISÉE) ---
        if (cvFile && cvFile.size > 0) {
            // console.log("Tentative d'extraction du fichier avec unpdf :", cvFile.name);
            try {
                const arrayBuffer = await cvFile.arrayBuffer();
                const uint8Array = new Uint8Array(arrayBuffer); 

                const result = await extractText(uint8Array);
                
                // CORRECTIF : Vérification du type de retour de unpdf
                if (typeof result === 'string') {
                    extractedText = result;
                } else if (result && result.text) {
                    extractedText = result.text;
                }
                
                if (extractedText) {
                    console.log("✅ Texte extrait avec succès !");
                }
            } catch (pdfErr) {
                console.error("❌ Échec de la lecture PDF :", pdfErr.message);
                extractedText = ""; 
            }
        }

        // --- LOGIQUE DE SÉCURITÉ (Garantir des strings pour .trim()) ---
        const safeProfileSummary = String(profile_summary || "");
        const safeExtractedText = String(extractedText || "");
        const safeJobDescription = String(job_description || "");

        const hasInput = safeProfileSummary.trim().length > 5 || safeExtractedText.trim().length > 5;
        const hasJob = safeJobDescription.trim().length > 5;

        // Nettoyage des espaces et sauts de ligne pour le prompt
        const cleanExtracted = safeExtractedText.replace(/\s+/g, ' ').trim();

        const fullContext = `
            RÉSUMÉ SAISI : ${safeProfileSummary || "Aucun"}
            TEXTE PDF : ${cleanExtracted || "Aucun"}
        `;

        // isolation du prompt Engeniring e
        const systemPrompt = getCareerSystemPrompt(hasInput, hasJob, fullContext, safeJobDescription);

        console.log("Envoi à l'IA...");
        const aiRawResponse = await getAIResponse(systemPrompt);
        
       // UTILISATION DE L'UTILITAIRE POUR NETOYER LA RESULTAT ENVOYER PAS L'IA
        const structuredData = cleanAndValidateAIJson(aiRawResponse);

        if (!structuredData) {
            throw new Error("L'IA a renvoyé un format invalide après 3 tentatives de nettoyage.");
        }

        // Sauvegarde Supabase
        const { data, error: dbError } = await supabase
            .from('career_profiles')
            .insert([{
                user_id: user.id,
                job_description: safeJobDescription || "Démo / Spontanée",
                user_raw_profile: fullContext.substring(0, 3000),
                structured_data: structuredData
            }])
            .select().single();

        if (dbError) throw dbError;

        return NextResponse.json(data);

    } catch (error) {
        console.error("GLOBAL API ERROR:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
