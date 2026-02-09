import { useState, useEffect } from 'react';
import { supabase } from '@/backend/lib/supabase';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger l'historique depuis Supabase au démarrage
  useEffect(() => {
    const fetchHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return;

      console.log("Valeur de supabase:", supabase)

      const { data, error } = await supabase
        .from('messages')
        .select('*') // <--- Très important !
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      

      if (error) setError("Erreur lors du chargement de l'historique");
      else setMessages(data);
    };

    fetchHistory();
  }, []);

  const sendMessage = async (content) => {
    setLoading(true);
    setError(null);
    try {

        //const { data: { user } } = await supabase.auth.getUser()
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        //const { data: { session } } = await supabase.auth.getSession()
        if (sessionError || !session) {
            throw new Error("Vous devez être connecté pour envoyer un message.");
        }

        const user = session.user; // On définit explicitement 'user' ici
        const token = session.access_token

      if (!token) throw new Error("Session expirée, reconnectez-vous.")

      // 1. Sauvegarde utilisateur dans Supabase
      const { data: userMsg, error: dbError } = await supabase
        .from('messages')
        .insert([{ content, role: 'user', user_id: user.id }])
        .select()
        .single();

      if (dbError) throw new Error("Erreur DB :"  + dbError.message)

      setMessages(prev => [...prev, userMsg])

      // 2. Appel API Next.js pour la réponse IA
    const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // <--- On envoie le badge d'identité ici
        },
        body: JSON.stringify({ content }),
    })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "L'IA n'a pas pu répondre")
    }

      const aiData = await res.json();
      // La réponse de l'IA est déjà enregistrée en DB par la route API
      setMessages(prev => [...prev, aiData]);

    } catch (err) {
        console.error("Erreur sendMessage:", err);
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  return { messages, sendMessage, loading, error };
}