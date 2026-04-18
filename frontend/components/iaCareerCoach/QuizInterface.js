'use client';

import { useState } from 'react';
import QuizResults from './QuizResults';

const DIFFICULTY_LABELS = { easy: 'Facile', medium: 'Intermédiaire', hard: 'Difficile' };
const DIFFICULTY_COLORS = { easy: 'text-emerald-600 bg-emerald-50', medium: 'text-blue-600 bg-blue-50', hard: 'text-red-600 bg-red-50' };

export default function QuizInterface({ session, onBack }) {
    const [phase, setPhase] = useState('intro'); // intro | loading | quiz | results
    const [questions, setQuestions] = useState([]);
    const [quizSessionId, setQuizSessionId] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [feedback, setFeedback] = useState(null); // { is_correct, finished, score, total }
    const [quizResult, setQuizResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const generateQuiz = async () => {
        setPhase('loading');
        setError('');
        try {
            const res = await fetch('/api/careerCoach/quiz/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: session.id }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setQuestions(data.questions);
            setQuizSessionId(data.quiz_session_id);
            setCurrentIndex(0);
            setSelected(null);
            setFeedback(null);
            setPhase('quiz');
        } catch (err) {
            setError(err.message);
            setPhase('intro');
        }
    };

    const submitAnswer = async () => {
        if (selected === null || submitting) return;
        setSubmitting(true);
        const q = questions[currentIndex];
        try {
            const res = await fetch('/api/careerCoach/quiz/answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question_id: q.id,
                    quiz_session_id: quizSessionId,
                    user_answer: selected,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setFeedback(data);

            if (data.finished) {
                // Fetch full results
                const r2 = await fetch(`/api/careerCoach/quiz/${quizSessionId}`);
                const full = await r2.json();
                setQuizResult(full);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const nextQuestion = () => {
        if (feedback?.finished) {
            setPhase('results');
            return;
        }
        setCurrentIndex((i) => i + 1);
        setSelected(null);
        setFeedback(null);
    };

    const restartQuiz = () => {
        setPhase('intro');
        setQuestions([]);
        setQuizSessionId(null);
        setCurrentIndex(0);
        setSelected(null);
        setFeedback(null);
        setQuizResult(null);
        setError('');
    };

    // --- INTRO ---
    if (phase === 'intro') {
        return (
            <div className="flex flex-col items-center justify-center flex-1 px-4 py-8 text-center">
                <div className="text-5xl mb-4">🧠</div>
                <h2 className="text-xl font-black text-slate-900 mb-2">Quiz de préparation</h2>
                <p className="text-sm text-slate-500 max-w-sm mb-2">
                    15 questions générées par l{"'"}IA selon votre profil et l{"'"}offre d{"'"}emploi, avec difficulté progressive.
                </p>
                <div className="flex gap-3 mb-6 mt-3">
                    {['5 Faciles', '5 Intermédiaires', '5 Difficiles'].map((l) => (
                        <span key={l} className="text-[10px] font-bold text-slate-500 bg-slate-100 rounded-full px-3 py-1">{l}</span>
                    ))}
                </div>
                {error && <p className="text-xs text-red-600 mb-4 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
                <button
                    onClick={generateQuiz}
                    className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm px-8 py-3 rounded-xl transition-colors"
                >
                    Générer le quiz
                </button>
                <button onClick={onBack} className="mt-3 text-xs text-slate-400 hover:text-slate-600 transition-colors">
                    Retour au chat
                </button>
            </div>
        );
    }

    // --- LOADING ---
    if (phase === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center flex-1 gap-4">
                <div className="w-10 h-10 border-3 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
                <p className="text-sm text-slate-500 font-medium">Génération du quiz en cours...</p>
                <p className="text-xs text-slate-400">{"L'IA analyse votre profil et l'offre d'emploi"}</p>
            </div>
        );
    }

    // --- RESULTS ---
    if (phase === 'results' && quizResult) {
        return <QuizResults quizSession={quizResult} onRestart={restartQuiz} />;
    }

    // --- QUIZ ---
    const q = questions[currentIndex];
    const options = q?.options || [];
    const progress = ((currentIndex) / questions.length) * 100;

    return (
        <div className="flex flex-col flex-1 min-h-0">
            {/* Progress bar */}
            <div className="px-4 pt-4 pb-2">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-500">Question {currentIndex + 1} / {questions.length}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[q?.difficulty] || ''}`}>
                        {DIFFICULTY_LABELS[q?.difficulty] || q?.difficulty}
                    </span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-violet-500 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Question + options */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                <p className="text-sm font-bold text-slate-900 leading-snug">{q?.question}</p>

                <div className="space-y-2">
                    {options.map((opt, i) => {
                        // selected est l'index (integer) de l'option choisie
                        const isSelected = selected === i;
                        const isCorrect  = i === q.correct_answer;

                        let style = 'border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50';
                        if (isSelected) {
                            style = feedback
                                ? feedback.is_correct
                                    ? 'border-emerald-400 bg-emerald-50'   // bonne réponse choisie
                                    : 'border-red-400 bg-red-50'           // mauvaise réponse choisie
                                : 'border-violet-500 bg-violet-50';        // sélectionné, pas encore validé
                        }
                        // Mettre en vert la bonne réponse après un mauvais choix
                        if (feedback && !feedback.is_correct && isCorrect) {
                            style = 'border-emerald-400 bg-emerald-50';
                        }

                        return (
                            <button
                                key={i}
                                onClick={() => !feedback && setSelected(i)}
                                disabled={!!feedback}
                                className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${style} ${!feedback ? 'cursor-pointer' : 'cursor-default'}`}
                            >
                                <span className="text-slate-400 mr-2 font-bold">{String.fromCharCode(65 + i)}.</span>
                                {opt}
                            </button>
                        );
                    })}
                </div>

                {/* Feedback */}
                {feedback && (
                    <div className={`rounded-xl border px-4 py-3 text-sm ${feedback.is_correct ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
                        <p className="font-bold mb-1">{feedback.is_correct ? '✓ Correct !' : '✗ Incorrect'}</p>
                        {q.explanation && <p className="text-xs opacity-80">{q.explanation}</p>}
                    </div>
                )}
            </div>

            {/* Footer actions */}
            <div className="px-4 pb-4 pt-2 border-t border-slate-100">
                {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
                {!feedback ? (
                    <button
                        onClick={submitAnswer}
                        disabled={selected === null || submitting}
                        className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold text-sm py-3 rounded-xl transition-colors"
                    >
                        {submitting ? 'Validation...' : 'Valider la réponse'}
                    </button>
                ) : (
                    <button
                        onClick={nextQuestion}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3 rounded-xl transition-colors"
                    >
                        {feedback.finished ? 'Voir les résultats' : 'Question suivante →'}
                    </button>
                )}
            </div>
        </div>
    );
}
