// backend/utils/jsonCleaner.js

export const cleanAndValidateAIJson = (rawResponse) => {
    try {
        // 1. Nettoyage des balises Markdown
        let cleanedJson = rawResponse.replace(/```json/g, "").replace(/```/g, "").trim();
        
        // 2. Extraction du bloc JSON
        const jsonMatch = cleanedJson.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return null;

        const finalJsonString = jsonMatch[0].replace(/[\u0000-\u001F]+/g, " ");
        const parsed = JSON.parse(finalJsonString);

        // 3. MAPPING INTELLIGENT (Pour éviter les sections vides)
        // Si l'IA utilise "experience" au lieu de "work", on redresse.
        const work = parsed.work || parsed.experience || (parsed.cv && parsed.cv.experience) || [];
        const education = parsed.education || (parsed.cv && parsed.cv.education) || [];
        const skills = parsed.skills || (parsed.cv && parsed.cv.skills) || [];
        const languages = parsed.languages || (parsed.cv && parsed.cv.languages) || [];
        const interests = parsed.interests || (parsed.cv && parsed.cv.interests) || [];

        // 4. Reconstruction d'un objet propre et robuste
        return {
            basics: {
                name: parsed.basics?.name || "Candidat",
                label: parsed.basics?.label || "Expert Logiciel",
                email: parsed.basics?.email || "non-renseigne@email.com",
                phone: parsed.basics?.phone || "",
                summary: parsed.basics?.summary || parsed.summary || "Résumé en attente...",
                location: {
                    city: parsed.basics?.location?.city || "France",
                    address: parsed.basics?.location?.address || ""
                }
            },
            work: work.map(w => ({
                name: w.name || w.company || "Entreprise",
                position: w.position || w.role || "Poste",
                startDate: w.startDate || w.period || "",
                endDate: w.endDate || "",
                highlights: w.highlights || w.tasks || []
            })),
            education: education,
            skills: skills,
            languages: languages,
            interests: interests,
            cover_letter: parsed.cover_letter || parsed.letter || "Lettre en cours...",
            analysis: parsed.analysis || { strengths: [], gaps: [] }
        };
    } catch (e) {
        console.error("CRITICAL JSON ERROR:", e.message);
        return null;
    }
};