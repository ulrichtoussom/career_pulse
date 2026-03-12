// backend/utils/jsonCleaner.js

export const cleanAndValidateAIJson = (rawResponse) => {
    try {
        // 1. Nettoyage des balises Markdown (```json)
        let cleanedJson = rawResponse.replace(/```json/g, "").replace(/```/g, "").trim();
        
        // 2. Extraction du bloc JSON avec la Regex
        const jsonMatch = cleanedJson.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return null;

        // 3. Suppression des caractères de contrôle (ton correctif sur les \u0000-\u001F)
        const finalJsonString = jsonMatch[0].replace(/[\u0000-\u001F]+/g, " ");
        
        const structuredData = JSON.parse(finalJsonString);

        // 4. Sécurisation selon le nouveau format JSON Resume
        return {
            basics: structuredData.basics || {},
            work: structuredData.work || [],
            education: structuredData.education || [],
            skills: structuredData.skills || [],
            languages: structuredData.languages || [],
            interests: structuredData.interests || [],
            cover_letter: structuredData.cover_letter || structuredData.letter || "",
            analysis: structuredData.analysis || { strengths: [], gaps: [] }
        };
    } catch (e) {
        console.error("Erreur parsing JSON IA :", e.message);
        return null;
    }
};