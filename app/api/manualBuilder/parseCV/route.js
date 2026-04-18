// app/api/manualBuilder/parseCV/route.js
// POST → reçoit un PDF, extrait le texte, demande à l'IA de le structurer en JSON Resume

import { NextResponse } from 'next/server';
import { createClient } from '@/backend/lib/supabaseServer';
import { extractText } from 'unpdf';
import { getChatResponse } from '@/backend/services/aiSercive';

const PARSE_PROMPT = `Tu es un expert en analyse de CV. On te donne le texte brut d'un CV.
Tu dois extraire toutes les informations et les retourner UNIQUEMENT en JSON valide, sans aucun texte avant ou après.

Le JSON doit respecter EXACTEMENT ce schéma (JSON Resume) :
{
  "basics": {
    "name": "Prénom Nom",
    "label": "Titre / Poste actuel",
    "email": "email@example.com",
    "phone": "0600000000",
    "url": "https://...",
    "summary": "Résumé professionnel",
    "location": {
      "address": "Adresse",
      "postalCode": "75000",
      "city": "Ville",
      "countryCode": "FR",
      "region": ""
    },
    "profiles": [
      { "network": "GitHub", "username": "user", "url": "https://github.com/user" }
    ]
  },
  "work": [
    {
      "name": "Nom de l'entreprise",
      "position": "Intitulé du poste",
      "url": "",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "summary": "Description du poste",
      "highlights": ["Réalisation 1", "Réalisation 2"]
    }
  ],
  "education": [
    {
      "institution": "École / Université",
      "url": "",
      "studyType": "Master / Licence / BTS...",
      "area": "Domaine d'études",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "score": "",
      "courses": []
    }
  ],
  "skills": [
    { "name": "JavaScript", "level": "Avancé", "keywords": [] }
  ],
  "languages": [
    { "language": "Français", "fluency": "Natif" }
  ],
  "projects": [
    {
      "name": "Nom du projet",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "description": "Description",
      "highlights": [],
      "url": ""
    }
  ],
  "volunteer": [],
  "awards": [],
  "certificates": [
    { "name": "", "date": "", "issuer": "", "url": "" }
  ],
  "publications": [],
  "interests": [],
  "references": []
}

Règles :
- Les dates DOIVENT être au format YYYY-MM (ex: "2023-06"). Si seulement l'année est disponible, utilise "YYYY-01".
- Si endDate est "présent" / "actuel" / "en cours", laisse endDate à "" (chaîne vide).
- Extrais TOUS les jobs, TOUTES les formations, TOUTES les compétences.
- Pour les highlights, extrais les bullet points ou réalisations listées pour chaque expérience.
- Si une information est absente du CV, laisse la valeur à "" ou [].
- Ne génère AUCUN texte hors du JSON.`;

export async function POST(req) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const formData = await req.formData();
    const cvFile = formData.get('cv_file');
    const preferredProvider = formData.get('preferred_model') || 'auto';

    if (!cvFile || cvFile.size === 0) {
        return NextResponse.json({ error: 'Aucun fichier fourni.' }, { status: 400 });
    }
    if (cvFile.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: 'Fichier trop volumineux (max 10 Mo).' }, { status: 400 });
    }

    // 1. Extraire le texte du PDF
    let rawText = '';
    try {
        const arrayBuffer = await cvFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const result = await extractText(uint8Array);

        if (typeof result === 'string') {
            rawText = result;
        } else if (typeof result?.text === 'string') {
            rawText = result.text;
        } else if (Array.isArray(result?.text)) {
            rawText = result.text.join('\n');
        } else if (result) {
            rawText = String(result);
        }
    } catch (err) {
        return NextResponse.json({ error: "Impossible de lire le PDF : " + err.message }, { status: 500 });
    }

    rawText = rawText.trim();
    if (!rawText) {
        return NextResponse.json({ error: 'Le PDF ne contient pas de texte lisible.' }, { status: 400 });
    }

    // Limiter la taille du texte envoyé à l'IA
    const truncatedText = rawText.length > 8000 ? rawText.substring(0, 8000) + '\n...' : rawText;

    // 2. Appeler l'IA pour structurer les données
    let aiResponse = '';
    try {
        aiResponse = await getChatResponse(
            [{ role: 'user', content: `Voici le texte brut du CV :\n\n${truncatedText}` }],
            PARSE_PROMPT,
            4096,
            preferredProvider
        );
    } catch (err) {
        return NextResponse.json({ error: "Erreur IA : " + err.message }, { status: 500 });
    }

    // 3. Parser le JSON retourné par l'IA
    let parsedData = null;
    try {
        const cleaned = aiResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        const match = cleaned.match(/\{[\s\S]*\}/);
        if (match) {
            parsedData = JSON.parse(match[0]);
        }
    } catch (_) {
        return NextResponse.json({ error: "L'IA n'a pas retourné un JSON valide. Réessayez." }, { status: 500 });
    }

    if (!parsedData?.basics) {
        return NextResponse.json({ error: "Données du CV incomplètes. Réessayez." }, { status: 500 });
    }

    // 4. S'assurer que toutes les clés requises existent
    const safe = {
        basics: {
            name: parsedData.basics.name || '',
            label: parsedData.basics.label || '',
            email: parsedData.basics.email || '',
            phone: parsedData.basics.phone || '',
            url: parsedData.basics.url || '',
            summary: parsedData.basics.summary || '',
            location: {
                address: parsedData.basics.location?.address || '',
                postalCode: parsedData.basics.location?.postalCode || '',
                city: parsedData.basics.location?.city || '',
                countryCode: parsedData.basics.location?.countryCode || 'FR',
                region: parsedData.basics.location?.region || '',
            },
            profiles: Array.isArray(parsedData.basics.profiles) ? parsedData.basics.profiles : [],
        },
        work: Array.isArray(parsedData.work) ? parsedData.work : [],
        education: Array.isArray(parsedData.education) ? parsedData.education : [],
        skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
        languages: Array.isArray(parsedData.languages) ? parsedData.languages : [],
        projects: Array.isArray(parsedData.projects) ? parsedData.projects : [],
        volunteer: Array.isArray(parsedData.volunteer) ? parsedData.volunteer : [],
        awards: Array.isArray(parsedData.awards) ? parsedData.awards : [],
        certificates: Array.isArray(parsedData.certificates) ? parsedData.certificates : [],
        publications: Array.isArray(parsedData.publications) ? parsedData.publications : [],
        interests: Array.isArray(parsedData.interests) ? parsedData.interests : [],
        references: Array.isArray(parsedData.references) ? parsedData.references : [],
    };

    return NextResponse.json(safe);
}
