/**
 * backend/services/aiSercive.js
 *
 * Interface publique conservée à l'identique pour ne pas modifier les routes API.
 * Les appels sont routés via aiGateway qui gère le fallback multi-provider.
 *
 * Le paramètre optionnel `preferredProvider` permet à l'utilisateur de choisir
 * son modèle IA depuis la sidebar ('auto' | 'groq' | 'claude' | 'openai' | 'gemini').
 */

import aiGateway from './aiGateway.js';

/**
 * Multi-turn chat : accepte un historique de messages + system prompt.
 * Utilisé par le module IA Career Coach.
 *
 * @param {Array<{role: string, content: string}>} messages
 * @param {string} systemPrompt
 * @param {number} maxTokens
 * @param {string} preferredProvider  — modèle choisi par l'utilisateur ('auto' par défaut)
 * @returns {Promise<string>}
 */
export async function getChatResponse(messages, systemPrompt, maxTokens = 1024, preferredProvider = 'auto') {
    const fullMessages = [
        { role: 'system', content: systemPrompt },
        ...messages,
    ];

    try {
        return await aiGateway.complete(fullMessages, {
            maxTokens,
            temperature: 0.7,
            topP: 0.95,
            preferredProvider,
        });
    } catch (error) {
        console.error('[aiSercive] getChatResponse — tous les providers ont échoué:', error.message);
        return "Désolé, je n'ai pas pu générer une réponse. Veuillez réessayer dans quelques instants.";
    }
}

/**
 * Requête simple : un message utilisateur + system prompt.
 * Utilisé par le générateur de CV IA et le builder.
 *
 * @param {string} userMessage
 * @param {string} systemPrompt
 * @param {string} preferredProvider  — modèle choisi par l'utilisateur ('auto' par défaut)
 * @returns {Promise<string>}
 */
export async function getAIResponse(userMessage, systemPrompt, preferredProvider = 'auto') {
    const messages = [
        { role: 'system', content: systemPrompt || 'Tu es un expert en recrutement.' },
        { role: 'user', content: userMessage },
    ];

    try {
        return await aiGateway.complete(messages, {
            maxTokens: 4096,
            temperature: 0.6,
            topP: 0.95,
            preferredProvider,
        });
    } catch (error) {
        console.error('[aiSercive] getAIResponse — tous les providers ont échoué:', error.message);
        throw error;
    }
}
