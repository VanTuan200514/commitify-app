"use client";

import { useEffect, useState } from "react";
import { Trophy, Star, PartyPopper } from "lucide-react";

export default function Celebration({ show, message, onComplete }: { show: boolean, message: string, onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"></div>
      
      <div className="relative bg-white rounded-3xl p-8 shadow-2xl border-4 border-yellow-400 flex flex-col items-center animate-bounce-in max-w-sm text-center">
        <div className="absolute -top-12 bg-yellow-400 p-4 rounded-full shadow-lg border-4 border-white">
          <Trophy className="w-12 h-12 text-white" />
        </div>
        
        <div className="mt-8 space-y-4">
          <h2 className="text-3xl font-black text-slate-900 leading-tight">Tuyệt vời! 🔥</h2>
          <div className="flex gap-2 justify-center">
             <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
             <Star className="w-8 h-8 text-yellow-500 fill-yellow-500 -mt-2" />
             <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
          </div>
          <p className="text-lg font-bold text-slate-600">
            {message || "Bạn vừa nhận được +50 XP thành tích!"}
          </p>
          <div className="pt-2">
             <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-black text-sm uppercase tracking-widest shadow-sm">
                <PartyPopper className="w-4 h-4" /> Đã ghi nhận kỷ luật
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
