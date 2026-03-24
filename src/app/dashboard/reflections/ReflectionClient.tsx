"use client";

import { useState } from "react";
import { Send, Smile, Info, PartyPopper, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ReflectionClient() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("neutral");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!content.trim()) {
      setError("Vui lòng nhập nội dung nhật ký của bạn.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reflections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, mood }),
      });

      if (res.ok) {
        setSuccess(true);
        setContent("");
        setMood("neutral");
        router.refresh();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Không thể lưu nhật ký. Vui lòng thử lại.");
      }
    } catch (err) {
      setError("Lỗi kết nối. Vui lòng kiểm tra mạng.");
    } finally {
      setLoading(false);
    }
  };

  const moodsList = [
    { id: "happy", emoji: "😊", label: "Tươi vui" },
    { id: "motivated", emoji: "🔥", label: "Hừng hực" },
    { id: "neutral", emoji: "😐", label: "Bình lặng" },
    { id: "tired", emoji: "😴", label: "Mệt mỏi" },
    { id: "sad", emoji: "😢", label: "Sầu đời" },
  ];

  return (
    <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-gray-100 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-full -z-10 group-hover:scale-125 transition-transform duration-700"></div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
             <PartyPopper className="w-5 h-5 text-emerald-500" />
             Ghi lại hành trình hôm nay
          </h2>
          
          <div className="flex flex-wrap gap-4 mb-8">
            {moodsList.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMood(m.id)}
                className={`flex-1 min-w-[80px] p-3 rounded-2xl flex flex-col items-center gap-1 transition-all border-2
                  ${mood === m.id 
                    ? 'bg-blue-600 border-blue-600 text-white scale-105 shadow-lg shadow-blue-500/20' 
                    : 'bg-slate-50 border-slate-50 text-slate-500 hover:border-slate-300'}`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">{m.label}</span>
              </button>
            ))}
          </div>

          <label className="block text-sm font-bold text-slate-700 mb-2">Hôm nay bạn thấy thế nào? Ghi lại nỗ lực của mình nhé!</label>
          <textarea
            placeholder="Ví dụ: Hôm nay dù trời mưa mình cũng đã hoàn thành 2km chạy bộ. Cảm thấy rất tự hào!"
            className="w-full px-6 py-5 border-2 border-slate-100 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition h-48 resize-none text-slate-700 font-medium placeholder:text-gray-400 bg-slate-50/50 focus:bg-white"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-bold flex items-center gap-2 border border-red-100 animate-shake shadow-sm">
             <Info className="w-5 h-5" /> {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-bold flex items-center gap-2 border border-emerald-100 animate-fade-in shadow-sm">
             <Smile className="w-5 h-5" /> Nhật ký của bạn đã được ghi lại thành công!
          </div>
        )}

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition disabled:opacity-50 flex items-center gap-2 shadow-xl hover:-translate-y-1 active:translate-y-0"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : (
              <>
                <Send className="w-4 h-4 ml-1" />
                Lưu lại khoảnh khắc
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
