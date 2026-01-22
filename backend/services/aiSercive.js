// backend/services/aiService.js
import Groq from "groq-sdk";

// On initialise le client avec la clé stockée dans le fichier .env
const groq = new Groq({ 
    apiKey: process.env.GROQ_API_KEY 
});

export async function getAIResponse(userMessage) {
    try {
        const chatCompletion = await groq.chat.completions.create({
            // C'est ici qu'on définit le "nom" de l'IA à utiliser
            model: "llama-3.1-8b-instant", 
            messages: [
                {
                    role: "system",
                    content: "Tu es un assistant utile et concis pour une application de chat."
                },
                {
                    role: "user",
                    content: userMessage
                }
            ],
            temperature: 0.7, // Contrôle la créativité de la réponse
        });

        return chatCompletion.choices[0]?.message?.content || "Je n'ai pas pu générer de réponse.";
    } catch (error) {
        console.error("Erreur Groq API:", error);
        throw new Error("Impossible de contacter l'IA.");
    }
}