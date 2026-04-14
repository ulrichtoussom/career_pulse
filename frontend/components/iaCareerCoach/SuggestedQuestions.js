'use client';

export default function SuggestedQuestions({ questions, onSelect, disabled }) {
    if (!questions || questions.length === 0) return null;

    return (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
            {questions.map((q, i) => (
                <button
                    key={i}
                    onClick={() => onSelect(q)}
                    disabled={disabled}
                    className="text-[11px] font-medium text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-full px-3 py-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                >
                    {q}
                </button>
            ))}
        </div>
    );
}
