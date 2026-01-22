// frontend/components/ChatList.js
export default function ChatList({ messages }) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-lg shadow-inner">
        {messages.map((msg, index) => (
          <div
            key={msg.id || index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <span className="text-[10px] opacity-70 mt-1 block">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }