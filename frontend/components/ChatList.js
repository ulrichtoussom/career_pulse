// frontend/components/ChatList.js
export default function ChatList({ messages, loading }) {
  
  // Fonction utilitaire pour formater la date sans casser le rendu
  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-4">
      {messages.map((msg, index) => (
        <div
          key={msg.id || index}
          className={`flex gap-4 ${
            msg.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`flex max-w-[90%] md:max-w-[80%] gap-3 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar stylisé */}
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold shadow-sm
              ${msg.role === 'user' 
                ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white' 
                : 'bg-gradient-to-br from-indigo-400 to-purple-500 text-white'}`}>
              {msg.role === 'user' ? 'U' : 'AI'}
            </div>

            {/* Contenu du message */}
            <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`text-sm md:text-base leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#f0f4f9] text-gray-800 px-5 py-3 rounded-[24px] rounded-tr-none'
                    : 'text-[#1f1f1f] pt-1'
                }`}
              >
                {msg.content}
              </div>
              
              {/* Affichage conditionnel de l'heure */}
              {msg.created_at && (
                <span className="text-[10px] text-gray-400 mt-2 px-1">
                  {formatTime(msg.created_at)}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Animation de chargement style Gemini */}
      {loading && (
        <div className="flex gap-4">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full animate-pulse" />
          <div className="flex-1 space-y-3 pt-2">
            <div className="h-3 bg-[#f0f4f9] rounded-full w-3/4 animate-pulse" />
            <div className="h-3 bg-[#f0f4f9] rounded-full w-1/2 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}