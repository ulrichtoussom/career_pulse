// frontend/components/ChatInput.js
import { useState } from 'react';

export default function ChatInput({ onSendMessage, isLoading }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Écrivez votre message..."
        className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
      />
      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors disabled:bg-gray-400"
      >
        {isLoading ? '...' : 'Envoyer'}
      </button>
    </form>
  );
}