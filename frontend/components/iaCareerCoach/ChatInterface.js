'use client';

import { useState, useEffect, useRef } from 'react';
import SuggestedQuestions from './SuggestedQuestions';

export default function ChatInterface({ session }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [suggestedQuestions, setSuggestedQuestions] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const bottomRef = useRef(null);

    // Load history on mount
    useEffect(() => {
        fetch(`/api/careerCoach/chat?session_id=${session.id}`)
            .then((r) => r.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setMessages(data.map((m) => ({ role: m.role, content: m.content })));
                }
            })
            .finally(() => setLoadingHistory(false));
    }, [session.id]);

    // Initial suggested questions
    useEffect(() => {
        setSuggestedQuestions([
            "Quels sont mes points forts pour ce poste ?",
            "Comment adapter mon CV à cette offre ?",
            "Quelles questions pourrais-je avoir en entretien ?",
            "Comment préparer ma lettre de motivation ?",
        ]);
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const sendMessage = async (text) => {
        const msg = text || input.trim();
        if (!msg || loading) return;
        setInput('');
        setSuggestedQuestions([]);

        const newMessages = [...messages, { role: 'user', content: msg }];
        setMessages(newMessages);
        setLoading(true);

        try {
            const res = await fetch('/api/careerCoach/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: session.id, message: msg }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
            if (data.suggestedQuestions?.length) {
                setSuggestedQuestions(data.suggestedQuestions);
            }
        } catch (err) {
            setMessages([...newMessages, { role: 'assistant', content: "Désolé, une erreur est survenue. Veuillez réessayer." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (loadingHistory) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
                {messages.length === 0 && (
                    <div className="text-center py-10">
                        <div className="text-3xl mb-3">💼</div>
                        <p className="text-sm font-semibold text-slate-700">Votre coach est prêt</p>
                        <p className="text-xs text-slate-400 mt-1">Posez votre première question ou choisissez une suggestion ci-dessous.</p>
                    </div>
                )}

                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {m.role === 'assistant' && (
                            <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center shrink-0 mr-2 mt-0.5 text-white text-[10px] font-bold">
                                AI
                            </div>
                        )}
                        <div
                            className={`max-w-[85%] md:max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                                m.role === 'user'
                                    ? 'bg-violet-600 text-white rounded-br-sm'
                                    : 'bg-white border border-slate-100 text-slate-800 rounded-bl-sm shadow-sm'
                            }`}
                        >
                            {m.content}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center shrink-0 mr-2 mt-0.5 text-white text-[10px] font-bold">
                            AI
                        </div>
                        <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                            <div className="flex gap-1.5 items-center">
                                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Suggested questions */}
            <SuggestedQuestions
                questions={suggestedQuestions}
                onSelect={(q) => sendMessage(q)}
                disabled={loading}
            />

            {/* Input */}
            <div className="border-t border-slate-100 px-4 py-3 bg-white">
                <div className="flex gap-2 items-end">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Posez votre question..."
                        rows={1}
                        className="flex-1 resize-none px-4 py-2.5 border border-slate-200 rounded-2xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-slate-50 max-h-32 overflow-y-auto"
                        style={{ minHeight: '44px' }}
                    />
                    <button
                        onClick={() => sendMessage()}
                        disabled={loading || !input.trim()}
                        className="w-10 h-10 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                        </svg>
                    </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 text-center">Entrée pour envoyer · Maj+Entrée pour sauter une ligne</p>
            </div>
        </div>
    );
}
