// backend/services/aiService.js
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

/**
 * Multi-turn chat: accepts a history of messages + system prompt.
 * Used by the IA Career Coach module.
 */
export async function getChatResponse(messages, systemPrompt, maxTokens = 1024) {
    try {
        const chatCompletion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages,
            ],
            temperature: 0.7,
            max_tokens: maxTokens,
            top_p: 0.95,
        });
        return chatCompletion.choices[0]?.message?.content || "Désolé, je n'ai pas pu générer une réponse.";
    } catch (error) {
        console.error("ERREUR GROQ CHAT:", error.status, error.message);
        throw error;
    }
}

export async function getAIResponse(userMessage, systemPrompt) { // Ajoute systemPrompt en argument
    
    try {
        // Log de vérification (à retirer en production)
        console.log("Appel Groq avec le modèle 70b...")

        const chatCompletion = await groq.chat.completions.create({
            
            // On peut essayer le 70b si le 8b est trop "feignant"
            model: "llama-3.3-70b-versatile", 
            messages: [
                {
                    role: "system",
                    content: systemPrompt || "Tu es un expert en recrutement."
                },
                {
                    role: "user",
                    content: userMessage
                }
            ],
            temperature: 0.6, 
            max_tokens: 4096, // CRUCIAL : On autorise une réponse longue
            top_p: 0.95,      // Augmente la diversité du vocabulaire
        });

        return chatCompletion.choices[0]?.message?.content || "Je n'ai pas pu générer de réponse.";
    } catch (error) {
        // C'est ici qu'on va voir le vrai problème (401, 413, 429...)
        console.error("DÉTAIL ERREUR GROQ:", error.status, error.message);
        throw error; // On renvoie l'erreur originale pour mieux debugger
    }
}