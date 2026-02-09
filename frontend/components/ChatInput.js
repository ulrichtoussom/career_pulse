// frontend/components/ChatInput.js
import { useState } from 'react';

export default function ChatInput({ onSendMessage, disabled }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <div className="relative w-full">
      <form 
        onSubmit={handleSubmit} 
        className="group relative flex items-center bg-[#f0f4f9] hover:bg-[#e9eef6] focus-within:bg-white focus-within:shadow-lg focus-within:ring-1 focus-within:ring-gray-200 transition-all duration-200 rounded-[32px] px-6 py-3 min-h-[64px]"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          placeholder="Entrez une invite ici"
          className="flex-1 bg-transparent border-none outline-none text-gray-800 text-lg placeholder-gray-500 disabled:opacity-50"
        />

        <div className="flex items-center gap-2 ml-4">
          {/* Bouton d'envoi stylisé */}
          <button
            type="submit"
            disabled={disabled || !text.trim()}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
              text.trim() && !disabled
                ? 'bg-blue-600 text-white shadow-md hover:scale-110 active:scale-95'
                : 'text-gray-400 opacity-50 cursor-not-allowed'
            }`}
          >
            {disabled ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-5 h-5 -rotate-45"
              >
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}