// components/career/CareerHistory.js
import { useState, useEffect } from 'react';
import { supabase } from '@/frontend/lib/supabaseClient'

export default function CareerHistory({ onSelect }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const { data, error } = await supabase
                .from('career_profiles')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) throw error;
            
            setHistory(data || []);
        } catch (error) {
            console.error("Erreur historique:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteEntry = async (e, id) => {
        e.stopPropagation(); // Empêche de sélectionner le CV quand on clique sur supprimer
        
        if (!confirm("Voulez-vous vraiment supprimer ce dossier ?")) return;

        try {
            const { data: { session } } = await supabase.auth.getSession();
        
            // On s'assure d'être bien authentifié pour supprimer
            const { error } = await supabase
                .from('career_profiles')
                .delete() // C'est ici qu'on supprime la LIGNE complète
                .eq('id', id)
                .eq('user_id', session.user.id); // Sécurité supplémentaire

                if (error) {
                    console.error("Erreur Supabase lors de la suppression:", error);
                    throw error;
                }
            
                // Mise à jour locale de la liste après suppression
                setHistory(prevHistory => prevHistory.filter(item => item.id !== id));                
        } catch (error) {
            alert("Erreur lors de la suppression : " + error.message);
        }
    };

    if (history.length === 0 && !loading) return null;
    
    // fonction pour mapper les differents CV de la base de donnee 

    const mapHistory = (item) => {

        if (!item.structured_data) return null 
        // On récupère le titre généré par l'IA ou la description fournie par l'utilisateur
        const displayTitle = item.structured_data.basics?.label || item.job_description || "Candidature Spontanée";

        return(
            <div key={item.id} className="group relative">
                <button
                    onClick={() => onSelect(item)}
                    className="w-full text-left p-3 rounded-xl border border-gray-100 bg-white hover:border-blue-300 hover:shadow-sm transition-all pr-10"
                >
                    <p className="text-[10px] font-bold text-gray-700 truncate group-hover:text-blue-600">
                        {displayTitle}
                    </p>
                    <p className="text-[8px] text-gray-400 font-medium mt-1">
                        {new Date(item.created_at).toLocaleDateString('fr-FR')}
                    </p>
                </button>
                
                {/* BOUTON SUPPRIMER */}
                <button 
                    onClick={(e) => deleteEntry(e, item.id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    title="Supprimer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        )

    }

    return (
        <div className="p-6 border-b bg-gray-50/50">
            <div className="flex justify-between items-center mb-4">
                <label className="text-xs font-black text-gray-400 uppercase tracking-wider">
                    Mes Dossiers Récents
                </label>
                <button 
                    onClick={fetchHistory}
                    className="text-[10px] text-blue-600 hover:underline font-bold"
                >
                    Actualiser
                </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                    <div className="text-[10px] italic text-gray-400 animate-pulse text-center py-4">Chargement...</div>
                ) : (
                    history.map((item) => mapHistory(item))
                )}
            </div>
        </div>
    );
}