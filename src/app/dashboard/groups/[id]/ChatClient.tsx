"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Smile, Paperclip, MessageSquare, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function ChatClient({ groupId, currentUser, initialMessages }: { groupId: string, currentUser: any, initialMessages: any[] }) {
  const [messages, setMessages] = useState<any[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Simulate real-time send
    const tempMsg = {
      id: Date.now().toString(),
      content: newMessage,
      user: { name: currentUser.name },
      isMe: true,
      created_at: new Date()
    };

    setMessages([...messages, tempMsg]);
    setNewMessage("");

    // Here you would normally push to DB via API
    // fetch('/api/messages', { method: 'POST', body: JSON.stringify({ groupId, content: newMessage }) });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Window */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pt-10"
      >
        {messages.map((msg, idx) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.isMe || msg.user.name === currentUser.name ? 'items-end' : 'items-start'} max-w-full animate-fade-in`}
          >
            <div className={`flex items-center gap-2 mb-1`}>
              {!msg.isMe && <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{msg.user.name}</span>}
              <span className="text-[10px] text-gray-300 font-bold">{format(new Date(msg.created_at), 'HH:mm')}</span>
            </div>
            
            <div 
              className={`px-4 py-2 rounded-2xl max-w-[85%] md:max-w-md shadow-sm border font-medium text-sm leading-relaxed
                ${msg.isMe || msg.user.name === currentUser.name 
                  ? 'bg-blue-600 text-white rounded-tr-none border-blue-500 shadow-blue-500/20' 
                  : 'bg-slate-100 text-slate-800 rounded-tl-none border-slate-200 shadow-slate-200/20'}`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-200/50">
        <form 
          onSubmit={handleSendMessage}
          className="relative flex items-center gap-2 bg-white rounded-2xl border-2 border-slate-200 focus-within:border-blue-500 transition-all shadow-lg shadow-slate-100 p-2"
        >
          <button type="button" className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-blue-600">
            <Paperclip className="w-5 h-5" />
          </button>
          
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Viết tin nhắn khích lệ nhóm tại đây..."
            className="flex-1 bg-transparent py-2 px-1 text-slate-700 outline-none font-medium placeholder:text-slate-400"
          />
          
          <div className="flex items-center gap-1">
            <button type="button" className="hidden sm:flex p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-amber-500">
              <Smile className="w-5 h-5" />
            </button>
            <button 
              type="submit" 
              disabled={!newMessage.trim()}
              className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-blue-500/30 hover:-translate-y-0.5"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
