'use client';

import { useState } from 'react';
import QuizInterface from './QuizInterface';

const SAMPLE_QUESTIONS = [
    {
        q: "Parlez-moi de vous.",
        tip: "Structurez en 3 parties : parcours, compétences clés pour ce poste, motivation. Restez concis (2 minutes max).",
        answer: "Commencez par votre formation, décrivez vos 2-3 expériences les plus pertinentes pour le poste, puis terminez par ce qui vous attire dans cette opportunité spécifique.",
    },
    {
        q: "Quels sont vos points forts ?",
        tip: "Citez 3 qualités en lien direct avec la fiche de poste, illustrez chacune avec un exemple concret (méthode STAR).",
        answer: "Ne restez pas abstrait. Utilisez : 'Mon point fort est X, comme lorsque j'ai... ce qui a permis de...'",
    },
    {
        q: "Où vous voyez-vous dans 5 ans ?",
        tip: "Montrez de l'ambition alignée avec la trajectoire de l'entreprise. Évitez 'À votre place' ou des objectifs hors sujet.",
        answer: "Parlez d'expertise approfondie, de responsabilités croissantes, ou d'une spécialisation en lien avec le secteur.",
    },
    {
        q: "Pourquoi quittez-vous votre poste actuel ?",
        tip: "Restez positif. Parlez de recherche de nouveaux défis, d'évolution, jamais de critiques envers un ancien employeur.",
        answer: "Ex : 'Je cherche un environnement où je peux [X], et votre entreprise représente exactement cette opportunité.'",
    },
    {
        q: "Pourquoi notre entreprise ?",
        tip: "Montrez que vous avez fait vos recherches : valeurs, produits, actualité récente, culture d'équipe.",
        answer: "Citez un élément spécifique (projet, valeur, réputation) qui vous correspond personnellement.",
    },
    {
        q: "Décrivez une situation où vous avez géré un conflit.",
        tip: "Utilisez la méthode STAR (Situation, Tâche, Action, Résultat). Restez factuel, montrez de la maturité.",
        answer: "Privilégiez une situation où vous avez trouvé un compromis constructif, pas où vous avez 'gagné'.",
    },
    {
        q: "Quelles sont vos prétentions salariales ?",
        tip: "Préparez une fourchette basée sur le marché. Demandez d'abord : 'Quelle est votre enveloppe prévue pour ce poste ?'",
        answer: "Soyez ancré sur des données marché, jamais sur vos besoins personnels.",
    },
    {
        q: "Avez-vous des questions pour nous ?",
        tip: "Préparez 3-4 questions qui montrent votre curiosité : équipe, défis du poste, culture, KPIs du rôle.",
        answer: "Ex : 'Quels sont les principaux défis de la personne qui prendra ce poste ?' ou 'Comment mesurez-vous le succès sur ce rôle ?'",
    },
];

export default function InterviewPrep({ session }) {
    const [showQuiz, setShowQuiz] = useState(false);
    const [expanded, setExpanded] = useState(null);

    if (showQuiz) {
        return <QuizInterface session={session} onBack={() => setShowQuiz(false)} />;
    }

    return (
        <div className="flex flex-col flex-1 min-h-0">
            {/* Header */}
            <div className="px-4 pt-5 pb-3 border-b border-slate-100">
                <h2 className="text-base font-black text-slate-900">Préparation aux entretiens</h2>
                <p className="text-xs text-slate-500 mt-0.5">Questions fréquentes + conseils de réponse</p>
            </div>

            {/* Questions list */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
                {SAMPLE_QUESTIONS.map((item, i) => (
                    <div
                        key={i}
                        className="rounded-xl border border-slate-100 bg-white overflow-hidden shadow-sm"
                    >
                        <button
                            onClick={() => setExpanded(expanded === i ? null : i)}
                            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-2.5">
                                <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-[10px] font-black flex items-center justify-center shrink-0">
                                    {i + 1}
                                </span>
                                <span className="text-sm font-semibold text-slate-800">{item.q}</span>
                            </div>
                            <svg
                                className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ml-2 ${expanded === i ? 'rotate-180' : ''}`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                            </svg>
                        </button>

                        {expanded === i && (
                            <div className="px-4 pb-4 space-y-2.5 border-t border-slate-50">
                                <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg p-3">
                                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">Conseil</p>
                                    <p className="text-xs text-amber-800 leading-relaxed">{item.tip}</p>
                                </div>
                                <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Structure de réponse</p>
                                    <p className="text-xs text-slate-600 leading-relaxed">{item.answer}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Quiz CTA */}
            <div className="px-4 pb-5 pt-3 border-t border-slate-100 bg-white">
                <div className="bg-gradient-to-r from-violet-600 to-violet-700 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <p className="text-white font-black text-sm">Quiz de préparation</p>
                        <p className="text-violet-200 text-xs mt-0.5">15 questions sur-mesure générées par l{"'"}IA</p>
                    </div>
                    <button
                        onClick={() => setShowQuiz(true)}
                        className="bg-white text-violet-700 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-violet-50 transition-colors shrink-0 ml-3"
                    >
                        Lancer →
                    </button>
                </div>
            </div>
        </div>
    );
}
