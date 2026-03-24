"use client";

import { useEffect, useState } from "react";
import { Play, Pause, RotateCcw, CheckCircle2, Trophy, Loader2, Info } from "lucide-react";
import Celebration from "@/components/Celebration";

export default function FocusTimer({ commitments }: { commitments: any[] }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 Minutes
  const [isActive, setIsActive] = useState(false);
  const [selectedCommitment, setSelectedCommitment] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      handleFinish();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleFinish = async () => {
    setIsActive(false);
    setIsFinished(true);
    
    if (selectedCommitment) {
      setLoading(true);
      try {
        // Auto check-in logic
        const res = await fetch(`/api/commitments/${selectedCommitment}/checkin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "done", notes: "Hoàn thành qua Chế độ Tập trung (Pomodoro)" }),
        });
        if (res.ok) {
          setShowCelebration(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleTimer = () => {
    if (!selectedCommitment) {
      alert("Vui lòng chọn 1 cam kết để tập trung bạn nhé!");
      return;
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
    setIsFinished(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progressPercent = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-gray-100 flex flex-col items-center text-center relative overflow-hidden group">
      {/* Background Decor */}
      <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl transition-colors duration-1000 ${isActive ? 'bg-red-100 opacity-60' : 'bg-blue-100 opacity-40'}`}></div>
      <div className={`absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-3xl transition-colors duration-1000 ${isActive ? 'bg-orange-100 opacity-60' : 'bg-emerald-100 opacity-40'}`}></div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Commitment Select */}
        <div className="mb-10 text-left">
           <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Tập trung cho cam kết:</label>
           <select 
             className="w-full px-5 py-4 border-2 border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white outline-none font-bold text-slate-800 transition-all text-sm md:text-base cursor-pointer hover:border-slate-300"
             value={selectedCommitment}
             onChange={(e) => {
               setSelectedCommitment(e.target.value);
               resetTimer();
             }}
             disabled={isActive}
           >
             <option value="">-- Chọn mục tiêu của bạn --</option>
             {commitments.map((c) => (
               <option key={c.id} value={c.id}>{c.title}</option>
             ))}
           </select>
        </div>

        {/* Circular Display */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto mb-12">
           <svg className="w-full h-full transform -rotate-90">
             <circle 
               cx="50%" cy="50%" r="48%" 
               className="stroke-slate-100 fill-none" strokeWidth="12" 
             />
             <circle 
               cx="50%" cy="50%" r="48%" 
               className={`fill-none transition-all duration-1000 stroke-current ${isActive ? 'text-red-500' : 'text-blue-600'}`}
               strokeWidth="12" 
               strokeDasharray="100"
               strokeDashoffset={100 - progressPercent}
               strokeLinecap="round"
               pathLength="100"
             />
           </svg>
           <div className="absolute inset-0 flex flex-col items-center justify-center">
             <span className={`text-6xl md:text-7xl font-black tabular-nums transition-colors duration-500 ${isActive ? 'text-red-600 animate-pulse' : 'text-slate-900'}`}>{formatTime(timeLeft)}</span>
             <span className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">{isActive ? 'Đứng dậy là mất chu kỳ!' : 'Đã sẵn sàng...'}</span>
           </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
           <button 
             onClick={resetTimer}
             className="p-4 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all hover:rotate-180 transform duration-500 shadow-sm"
           >
             <RotateCcw className="w-6 h-6" />
           </button>
           
           <button 
             onClick={toggleTimer}
             className={`w-20 h-20 rounded-full flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 shadow-xl shadow-blue-500/30
               ${isActive 
                 ? 'bg-red-600 hover:bg-red-500 shadow-red-500/30 text-white' 
                 : 'bg-slate-900 hover:bg-blue-600 text-white'}`}
           >
             {isActive ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
           </button>

           <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
              {loading && <Loader2 className="w-8 h-8 animate-spin text-blue-600" />}
           </div>
        </div>

        {isFinished && !loading && (
          <div className="mt-8 p-4 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center gap-2 border border-emerald-100 font-bold animate-fade-in shadow-sm">
            <CheckCircle2 className="w-5 h-5" /> Đã hoàn thành và tự động Check-in!
          </div>
        )}
      </div>

      <Celebration 
        show={showCelebration} 
        message="Chúc mừng bạn đã hoàn thành 25 phút tập trung cao độ! +100 XP" 
        onComplete={() => setShowCelebration(false)} 
      />
    </div>
  );
}
