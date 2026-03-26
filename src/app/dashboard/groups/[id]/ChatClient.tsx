"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Smile, Paperclip, Loader2, Sparkles, MessageSquare } from "lucide-react";
import { format } from "date-fns";

export default function ChatClient({ groupId, currentUser, initialMessages }: { groupId: string, currentUser: any, initialMessages: any[] }) {
  const [messages, setMessages] = useState<any[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Poll for new messages every 3 seconds (simple real-time)
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/messages?groupId=${groupId}`);
        if (res.ok) {
          const data = await res.json();
          // Map to distinguish "isMe"
          const mapped = data.map((m: any) => ({
             ...m,
             isMe: m.user_id === currentUser.id || m.user.name === currentUser.name
          }));
          setMessages(mapped);
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [groupId, currentUser]);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const msgContent = newMessage;
    setNewMessage("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ group_id: groupId, content: msgContent }),
      });

      if (res.ok) {
        const savedMsg = await res.json();
        setMessages([...messages, { ...savedMsg, isMe: true }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Top Gradient */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent z-10"></div>

      {/* Messages Window */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pt-10 scroll-smooth"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} max-w-full animate-fade-in`}
          >
            <div className={`flex items-center gap-2 mb-1`}>
              {!msg.isMe && <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{msg.user.name}</span>}
              <span className="text-[10px] text-slate-300 font-bold">{format(new Date(msg.created_at), 'HH:mm')}</span>
            </div>
            
            <div 
              className={`px-5 py-3 rounded-[24px] max-w-[85%] md:max-w-md shadow-sm border font-medium text-sm leading-relaxed
                ${msg.isMe 
                  ? 'bg-blue-600 text-white rounded-tr-none border-blue-500 shadow-blue-500/20' 
                  : 'bg-slate-100 text-slate-900 rounded-tl-none border-slate-200 shadow-slate-200/20'}`}
              style={{ color: msg.isMe ? 'white' : 'black' }} 
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
          className="relative flex items-center gap-2 bg-white rounded-3xl border-2 border-slate-200 focus-within:border-blue-500 transition-all shadow-xl shadow-slate-100 p-2"
        >
          <button type="button" className="p-3 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400 hover:text-blue-600">
            <Paperclip className="w-5 h-5" />
          </button>
          
          <input 
            type="text" 
            value={newMessage}
            disabled={sending}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Viết tin nhắn khích lệ nhóm tại đây..."
            className="flex-1 bg-transparent py-4 px-2 text-slate-900 outline-none font-bold placeholder:text-slate-400"
          />
          
          <div className="flex items-center gap-1">
            <button type="button" className="hidden sm:flex p-3 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400 hover:text-amber-500">
              <Smile className="w-5 h-5" />
            </button>
            <button 
              type="submit" 
              disabled={!newMessage.trim() || sending}
              className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-2xl transition-all disabled:opacity-50 disabled:grayscale shadow-xl shadow-blue-500/30 hover:-translate-y-1 active:translate-y-0"
            >
              {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
