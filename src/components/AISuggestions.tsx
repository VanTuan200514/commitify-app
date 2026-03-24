"use client";

import { Sparkles, Loader2, ArrowRight, BrainCircuit } from "lucide-react";
import { useState } from "react";

export default function AISuggestions({ onSelect }: { onSelect: (s: any) => void }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const getAISuggestions = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 mb-8 relative overflow-hidden group shadow-inner">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full opacity-30 -z-10 group-hover:scale-125 transition-transform duration-700"></div>
      
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
          <BrainCircuit className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-bold text-slate-800">Trợ lý AI gợi ý Cam kết</h3>
      </div>

      <p className="text-sm text-slate-600 mb-4 font-medium italic">
        "Bạn muốn đạt được điều gì? Hãy nhập ý tưởng vào đây nhé."
      </p>

      <div className="flex flex-col sm:flex-row gap-2">
        <input 
          type="text" 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ví dụ: tôi muốn học giỏi tiếng anh..."
          className="flex-1 px-4 py-2 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white placeholder:text-gray-400 font-medium"
        />
        <button 
          onClick={getAISuggestions}
          disabled={loading || !prompt}
          className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-4 h-4 text-yellow-400" /> Gợi ý AI</>}
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          {suggestions.map((s, idx) => (
            <div 
              key={idx} 
              onClick={() => onSelect(s)}
              className="bg-white p-4 border-2 border-blue-50 hover:border-blue-400 rounded-2xl cursor-pointer hover:shadow-md transition-all group/card flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-blue-100 text-blue-700 px-2 py-0.5 rounded-lg mb-2 inline-block">
                  {s.category}
                </span>
                <p className="font-bold text-slate-800 leading-snug mb-1">{s.title}</p>
              </div>
              <div className="mt-3 flex items-center justify-end">
                <span className="text-[10px] font-bold text-blue-600 group-hover/card:translate-x-1 transition-transform flex items-center gap-1">
                  Dùng ngay <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
