// app/api/chat/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getAIResponse } from '@/backend/services/aiSercive';

/**
 * ✅ Récupérer l'historique des messages
 */
export async function GET() {
    try {
        const messages = await prisma.message.findMany({
            orderBy: { createdAt: 'asc' }
        });
        return NextResponse.json(messages);
    } catch (error) {
        return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
    }
}

/**
 * ✅ Envoyer un message et obtenir une réponse de l'IA
 */
export async function POST(request) {
    try {
        const { content } = await request.json();

        // 1. Validation simple
        if (!content || content.trim() === "") {
            return NextResponse.json({ error: "Le message ne peut pas être vide" }, { status: 400 });
        }

        // 2. Enregistrement du message utilisateur (role: 'user')
        await prisma.message.create({
            data: {
                content: content,
                role: 'user'
            }
        });

        // 3. Appel au service IA (Groq)
        const aiResponse = await getAIResponse(content);

        // 4. Enregistrement de la réponse IA (role: 'assistant')
        const savedAiMsg = await prisma.message.create({
            data: {
                content: aiResponse,
                role: 'assistant'
            }
        });

        // On renvoie la réponse de l'IA au frontend pour affichage immédiat
        return NextResponse.json(savedAiMsg);

    } catch (error) {
        console.error("Erreur API Chat:", error);
        return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
    }
}