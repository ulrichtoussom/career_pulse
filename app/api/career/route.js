import { getAIResponse } from '@/backend/services/aiSercive';
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

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

        const { profile_summary, job_description, full_name } = await req.json();
        // LE PROMPT STRATÉGIQUE
        const systemPrompt = `
            Tu es un expert en recrutement international et rédacteur professionnel de CV. 
            Analyse le profil et l'offre d'emploi pour générer un dossier COMPLET et PERSUASIF.

            CONSIGNES DE RÉDACTION :
            1. RÉSUMÉ : Fais un paragraphe de 4-5 lignes captivant, utilisant des mots-clés de l'offre.
            2. EXPÉRIENCES : Pour chaque expérience, invente ou déduis 4 à 5 puces détaillées basées sur les standards du métier (ex: KPI, outils utilisés, travail d'équipe). 
            3. LETTRE : Rédige une lettre de motivation de 3 paragraphes (Vous, Moi, Nous) d'environ 250 mots.
            4. CONTACT : Si le nom est fourni, invente une adresse email professionnelle (ex: prenom.nom@email.com) et un numéro de téléphone fictif pour remplir le design.

            STRUCTURE JSON STRICTE :
            {
            "header": { "name": "Candidat"}", "title": "Titre du profil adapté à l'offre", "email": "...", "phone": "..." },
            "cv": {
                "summary": "Texte long et pro",
                "experience": [{ "company": "", "role": "", "period": "", "tasks": ["Tâche détaillée 1", "Tâche détaillée 2", "Tâche détaillée 3", "Tâche détaillée 4"] }],
                "skills": ["Compétence précise 1", "..."]
            },
            "letter": "Lettre longue et structurée avec formules de politesse",
            "analysis": { "strengths": ["Analyse détaillée"], "gaps": ["Conseils de progression"] }
            }

            PROFIL CANDIDAT : ${profile_summary}
            OFFRE D'EMPLOI : ${job_description}
            `;
        const aiRawResponse = await getAIResponse(systemPrompt);
        
                // Extraction du bloc JSON
        const jsonMatch = aiRawResponse.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error("L'IA n'a pas renvoyé de JSON");
        }
        let structuredData = null
        let cleanedJson = jsonMatch[0];

        try {
            // ÉTAPE CRUCIALE : On remplace les vrais retours à la ligne par des \n 
            // pour que JSON.parse ne plante pas
            cleanedJson = cleanedJson.replace(/\n/g, "\\n").replace(/\r/g, "\\r");
            
            // Mais attention, cela peut casser les structures JSON si on ne fait pas gaffe.
            // Une méthode plus robuste consiste à demander à l'IA de ne pas mettre de sauts de ligne
            // OU à utiliser ce correcteur plus précis :
            structuredData = JSON.parse(jsonMatch[0].replace(/[\u0000-\u001F]+/g, " "));
            
            // Si la ligne au-dessus ne suffit pas, utilise celle-ci qui est la plus "brutale" mais efficace :
            // const structuredData = JSON.parse(jsonMatch[0].replace(/\n/g, "\\n"));
        } catch (e) {
            console.error("Échec du parse final. Contenu reçu :", jsonMatch[0]);
            throw new Error("Le format généré par l'IA est corrompu");
        }

        // Sauvegarde
        const { data, error: dbError } = await supabase
            .from('career_profiles')
            .insert([{
                user_id: user.id,
                job_description,
                user_raw_profile: profile_summary,
                structured_data: structuredData
            }])
            .select().single();

        if (dbError) throw dbError;

        return NextResponse.json(data);
    } catch (error) {
        console.error("Career API Error:", error);
        return NextResponse.json({ error: "Erreur de génération" }, { status: 500 });
    }
}