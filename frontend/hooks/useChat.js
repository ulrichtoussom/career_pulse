// frontend/hooks/useChat.js
import { useState, useEffect } from 'react';

export function useChat() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 1. Charger l'historique au démarrage
    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/chat');
            const data = await res.json();
            if (res.ok) setMessages(data);
        } catch (err) {
            setError("Impossible de charger les messages.");
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    // 2. Fonction pour envoyer un message
    const sendMessage = async (content) => {
        if (!content.trim()) return;

        setLoading(true);
        setError(null);

        // Optimisme : on ajoute immédiatement le message de l'utilisateur à l'écran
        const userMsg = { id: Date.now(), content, role: 'user', createdAt: new Date() };
        setMessages((prev) => [...prev, userMsg]);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });

            const aiMsg = await res.json();

            if (res.ok) {
                // On remplace ou on ajoute la réponse de l'IA
                setMessages((prev) => [...prev, aiMsg]);
            } else {
                setError(aiMsg.error || "Une erreur est survenue");
            }
        } catch (err) {
            setError("Erreur de connexion au serveur.");
        } finally {
            setLoading(false);
        }
    };

    return { messages, sendMessage, loading, error };
}