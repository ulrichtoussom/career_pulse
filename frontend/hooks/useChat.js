import { useState, useEffect } from 'react';
import { supabase } from '@/frontend/lib/supabaseClient'

export function useChat(conversationId = null) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Reset visuel immédiat si on passe sur une nouvelle discussion
      if (!conversationId) {
        setMessages([]);
        return;
      }

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.id)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) setError("Erreur lors du chargement de l'historique");
      else setMessages(data);
    };

    fetchHistory();
  }, [conversationId]);

  const sendMessage = async (content) => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) throw new Error("Non connecté.");

      const user = session.user;
      const token = session.access_token;
      
      let currentId = conversationId;

      // 1. Si on est en mode "Nouvelle discussion", on crée la session d'abord
      if (!currentId) {
        const { data: newConv, error: convError } = await supabase
          .from('conversations')
          .insert([{ 
            title: content.substring(0, 40) + "...", 
            user_id: user.id 
          }])
          .select()
          .single();

        if (convError) throw new Error("Erreur création session : " + convError.message);
        currentId = newConv.id;
      }

      // 2. Sauvegarde du message utilisateur
      const { data: userMsg, error: dbError } = await supabase
        .from('messages')
        .insert([{ 
          content, 
          role: 'user', 
          user_id: user.id,
          conversation_id: currentId 
        }])
        .select()
        .single();

      if (dbError) throw new Error("Erreur DB :" + dbError.message);
      setMessages(prev => [...prev, userMsg]);

      // 3. Appel API
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          content, 
          conversationId: currentId 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "L'IA n'a pas pu répondre");
      }

      const aiData = await res.json();
      setMessages(prev => [...prev, aiData]);

      // TRÈS IMPORTANT : On retourne l'ID (qu'il soit nouveau ou ancien)
      return currentId;

    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading, error };
}