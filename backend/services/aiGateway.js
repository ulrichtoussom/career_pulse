/**
 * AI Gateway — backend/services/aiGateway.js
 *
 * Fournit une interface unique pour plusieurs LLM providers.
 * En cas d'erreur de quota/rate-limit (429) ou d'indisponibilité (5xx),
 * le gateway bascule automatiquement vers le provider suivant dans la liste.
 *
 * Providers supportés (dans l'ordre de priorité par défaut) :
 *   1. Groq      — llama-3.3-70b-versatile   (GROQ_API_KEY)
 *   2. Claude    — claude-haiku-4-5           (ANTHROPIC_API_KEY)
 *   3. OpenAI    — gpt-4o-mini               (OPENAI_API_KEY)
 *   4. Gemini    — gemini-1.5-flash           (GEMINI_API_KEY)
 *
 * Chaque provider peut être désactivé en ne définissant pas sa clé API.
 * L'ordre de fallback est contrôlable via AI_PROVIDER_ORDER (env var).
 *
 * Interface publique :
 *   gateway.complete(messages, options) → Promise<string>
 */

import Groq from 'groq-sdk';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ─────────────────────────────────────────────────────────────
// Codes d'erreur qui déclenchent un fallback vers le prochain provider
// ─────────────────────────────────────────────────────────────
const FALLBACK_STATUS_CODES = new Set([
    429, // Rate limit / quota dépassé
    503, // Service indisponible
    529, // Overloaded (Anthropic)
    500, // Erreur serveur interne
    502, // Bad gateway
]);

const FALLBACK_ERROR_MESSAGES = [
    'rate_limit',
    'quota',
    'overloaded',
    'capacity',
    'too many requests',
    'service unavailable',
    'insufficient_quota',
];

function isFallbackError(error) {
    if (!error) return false;
    const status = error.status ?? error.statusCode ?? error.code;
    if (FALLBACK_STATUS_CODES.has(Number(status))) return true;
    const msg = (error.message || '').toLowerCase();
    return FALLBACK_ERROR_MESSAGES.some((keyword) => msg.includes(keyword));
}

// ─────────────────────────────────────────────────────────────
// Adaptateurs — un par provider
// Chaque adaptateur expose : { name, isAvailable(), complete(messages, options) }
// messages = [{ role: 'system'|'user'|'assistant', content: string }]
// ─────────────────────────────────────────────────────────────

const groqAdapter = {
    name: 'Groq (LLaMA)',
    model: 'llama-3.3-70b-versatile',

    isAvailable() {
        return Boolean(process.env.GROQ_API_KEY);
    },

    async complete(messages, options = {}) {
        const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const response = await client.chat.completions.create({
            model: this.model,
            messages,
            temperature: options.temperature ?? 0.7,
            max_tokens: options.maxTokens ?? 4096,
            top_p: options.topP ?? 0.95,
        });
        return response.choices[0]?.message?.content ?? '';
    },
};

const claudeAdapter = {
    name: 'Claude (Anthropic)',
    model: 'claude-haiku-4-5-20251001',

    isAvailable() {
        return Boolean(process.env.ANTHROPIC_API_KEY);
    },

    async complete(messages, options = {}) {
        const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

        // Anthropic sépare le system prompt des autres messages
        const systemMsg = messages.find((m) => m.role === 'system');
        const conversationMessages = messages
            .filter((m) => m.role !== 'system')
            .map((m) => ({ role: m.role, content: m.content }));

        const response = await client.messages.create({
            model: this.model,
            max_tokens: options.maxTokens ?? 4096,
            system: systemMsg?.content,
            messages: conversationMessages,
            temperature: options.temperature ?? 0.7,
        });
        return response.content[0]?.text ?? '';
    },
};

const openaiAdapter = {
    name: 'OpenAI (GPT)',
    model: 'gpt-4o-mini',

    isAvailable() {
        return Boolean(process.env.OPENAI_API_KEY);
    },

    async complete(messages, options = {}) {
        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const response = await client.chat.completions.create({
            model: this.model,
            messages,
            temperature: options.temperature ?? 0.7,
            max_tokens: options.maxTokens ?? 4096,
        });
        return response.choices[0]?.message?.content ?? '';
    },
};

const geminiAdapter = {
    name: 'Gemini (Google)',
    model: 'gemini-1.5-flash',

    isAvailable() {
        return Boolean(process.env.GEMINI_API_KEY);
    },

    async complete(messages, options = {}) {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: this.model });

        // Gemini a une API de chat différente — on reconstruit l'historique
        const systemMsg = messages.find((m) => m.role === 'system');
        const conversationMessages = messages.filter((m) => m.role !== 'system');

        // Dernier message = prompt utilisateur courant
        const lastMessage = conversationMessages.at(-1);
        const history = conversationMessages.slice(0, -1).map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
        }));

        const systemInstruction = systemMsg?.content;
        const modelWithSystem = systemInstruction
            ? genAI.getGenerativeModel({ model: this.model, systemInstruction })
            : model;

        const chat = modelWithSystem.startChat({
            history,
            generationConfig: {
                temperature: options.temperature ?? 0.7,
                maxOutputTokens: options.maxTokens ?? 4096,
            },
        });

        const result = await chat.sendMessage(lastMessage?.content ?? '');
        return result.response.text() ?? '';
    },
};

// ─────────────────────────────────────────────────────────────
// Registre des providers dans l'ordre de priorité par défaut
// ─────────────────────────────────────────────────────────────
const ALL_PROVIDERS = {
    groq: groqAdapter,
    claude: claudeAdapter,
    openai: openaiAdapter,
    gemini: geminiAdapter,
};

function getOrderedProviders() {
    const orderEnv = process.env.AI_PROVIDER_ORDER; // ex: "groq,claude,openai,gemini"
    const order = orderEnv
        ? orderEnv.split(',').map((s) => s.trim().toLowerCase())
        : ['groq', 'claude', 'openai', 'gemini'];

    return order
        .map((key) => ALL_PROVIDERS[key])
        .filter(Boolean)
        .filter((p) => p.isAvailable());
}

// ─────────────────────────────────────────────────────────────
// Gateway principal
// ─────────────────────────────────────────────────────────────
const aiGateway = {
    /**
     * Envoie un ensemble de messages à un LLM.
     * Bascule automatiquement vers le prochain provider si le courant échoue.
     *
     * @param {Array<{role: string, content: string}>} messages
     * @param {Object} options  { temperature, maxTokens, topP }
     * @returns {Promise<string>}
     */
    async complete(messages, options = {}) {
        const providers = getOrderedProviders();

        if (providers.length === 0) {
            throw new Error(
                '[AI Gateway] Aucun provider disponible. Vérifiez vos clés API (GROQ_API_KEY, ANTHROPIC_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY).'
            );
        }

        let lastError;

        for (const provider of providers) {
            try {
                console.log(`[AI Gateway] Tentative via ${provider.name}...`);
                const result = await provider.complete(messages, options);
                console.log(`[AI Gateway] Succès via ${provider.name}`);
                return result;
            } catch (error) {
                const shouldFallback = isFallbackError(error);
                console.warn(
                    `[AI Gateway] ${provider.name} a échoué (${error.status ?? error.message}).`,
                    shouldFallback ? 'Basculement vers le prochain provider.' : 'Erreur non-récupérable.'
                );

                lastError = error;

                // Erreur non liée au quota (ex: prompt invalide, 401) → ne pas essayer les autres
                if (!shouldFallback) throw error;
            }
        }

        // Tous les providers ont échoué
        throw new Error(
            `[AI Gateway] Tous les providers ont échoué. Dernière erreur : ${lastError?.message}`
        );
    },
};

export default aiGateway;
