import { getAIResponse } from '@/backend/services/aiSercive';
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { extractText } from 'unpdf'; 

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
            console.log("Tentative d'extraction du fichier avec unpdf :", cvFile.name);
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

        const systemPrompt = `
            Tu es un expert en recrutement international. 
            ${(!hasInput && !hasJob) 
                ? "L'utilisateur n'a rien fourni. Génère un dossier EXEMPLE pour Ulrich Toussom, Développeur Web Senior." 
                : "Génère un dossier personnalisé basé sur les données fournies."}

            CONSIGNES :
            - RÉSUMÉ : 4-5 lignes percutantes.
            - EXPERIENCES : 3-4 postes détaillés avec des puces.
            - LETTRE : Ton professionnel, environ 250 mots.
            - IMPORTANT : Réponds UNIQUEMENT en JSON pur, sans texte explicatif.

            STRUCTURE JSON STRICTE :
            {
                "header": { "name": "...", "title": "...", "email": "...", "phone": "...", "location": "..." },
                "cv": {
                    "summary": "...",
                    "experience": [{ "company": "", "role": "", "period": "", "tasks": [] }],
                    "education": [{ "school": "", "degree": "", "year": "", "description": "" }],
                    "skills": [],
                    "languages": [],
                    "interests": []
                },
                "letter": "...",
                "analysis": { "strengths": [], "gaps": [] }
            }

            DONNÉES CANDIDAT : ${fullContext}
            OFFRE : ${safeJobDescription || "Candidature libre"}
        `;

        console.log("Envoi à l'IA...");
        const aiRawResponse = await getAIResponse(systemPrompt);
        
        // Nettoyage des balises Markdown (```json) que l'IA ajoute parfois
        let cleanedJson = aiRawResponse.replace(/```json/g, "").replace(/```/g, "").trim();
        
        const jsonMatch = cleanedJson.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error("Réponse IA sans JSON valide");
            throw new Error("L'IA n'a pas renvoyé de format exploitable");
        }

        let structuredData = null;
        

        try {
            // La regex doit être bien fermée avec g, " " et la parenthèse
            const finalJsonString = jsonMatch[0].replace(/[\u0000-\u001F]+/g, " ");
            
            structuredData = JSON.parse(finalJsonString);

            // 2. Sécurisation des nouvelles sections (APRES le parse)
            if (!structuredData.cv) structuredData.cv = {};
            if (!structuredData.cv.experience) structuredData.cv.experience = [];
            if (!structuredData.cv.education) structuredData.cv.education = [];
            if (!structuredData.cv.interests) structuredData.cv.interests = [];
            if (!structuredData.cv.languages) structuredData.cv.languages = [];
            if (!structuredData.cv.skills) structuredData.cv.skills = [];

            if (!structuredData.analysis) structuredData.analysis = { strengths: [], gaps: [] };
        } catch (e) {
            console.error("Erreur parsing JSON IA :", e.message);
            throw new Error("Données JSON corrompues");
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