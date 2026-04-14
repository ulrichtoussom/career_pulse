'use client';

export default function QuizResults({ quizSession, onRestart }) {
    const questions = quizSession.questions || [];
    const score = quizSession.score ?? 0;
    const total = questions.length;
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;

    const level = pct >= 80 ? { label: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', ring: 'ring-emerald-500' }
        : pct >= 60 ? { label: 'Bien', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', ring: 'ring-blue-500' }
        : { label: 'À revoir', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', ring: 'ring-amber-500' };

    return (
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
            {/* Score summary */}
            <div className={`rounded-2xl border ${level.border} ${level.bg} p-6 text-center`}>
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ring-4 ${level.ring} bg-white mb-4`}>
                    <span className={`text-2xl font-black ${level.color}`}>{pct}%</span>
                </div>
                <p className={`text-lg font-black ${level.color}`}>{level.label}</p>
                <p className="text-sm text-slate-500 mt-1">{score} bonne{score > 1 ? 's' : ''} réponse{score > 1 ? 's' : ''} sur {total}</p>
            </div>

            {/* Question review */}
            <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Correction détaillée</h3>
                {questions.map((q, i) => (
                    <div
                        key={q.id}
                        className={`rounded-xl border p-4 ${q.is_correct ? 'border-emerald-100 bg-emerald-50/50' : 'border-red-100 bg-red-50/50'}`}
                    >
                        <div className="flex items-start gap-2 mb-2">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-bold mt-0.5 ${q.is_correct ? 'bg-emerald-500' : 'bg-red-400'}`}>
                                {q.is_correct ? '✓' : '✗'}
                            </span>
                            <p className="text-sm font-semibold text-slate-800 flex-1">
                                <span className="text-slate-400 mr-1">Q{i + 1}.</span> {q.question}
                            </p>
                        </div>

                        <div className="ml-7 space-y-1">
                            {!q.is_correct && (
                                <p className="text-xs text-red-600">
                                    <span className="font-bold">Votre réponse :</span> {q.user_answer}
                                </p>
                            )}
                            <p className="text-xs text-emerald-700 font-semibold">
                                <span className="font-bold">Bonne réponse :</span> {q.correct_answer}
                            </p>
                            {q.explanation && (
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{q.explanation}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Restart */}
            <button
                onClick={onRestart}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold py-3 rounded-xl transition-colors"
            >
                Nouveau quiz
            </button>
        </div>
    );
}
