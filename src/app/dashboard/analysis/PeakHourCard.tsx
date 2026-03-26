"use client";

import { useState } from "react";
import { Clock, Check, Edit2, Loader2 } from "lucide-react";

interface PeakHourCardProps {
  initialPeakHour: string;
}

export default function PeakHourCard({ initialPeakHour }: PeakHourCardProps) {
  const [peakHour, setPeakHour] = useState(initialPeakHour);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tempHour, setTempHour] = useState(initialPeakHour);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Mocking update for now since we don't have a dedicated endpoint yet
      // In a real app, we'd fetch('/api/user/settings', ...)
      await new Promise(resolve => setTimeout(resolve, 800));
      setPeakHour(tempHour);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const hourInt = parseInt(peakHour);
  const isMorning = hourInt >= 4 && hourInt < 12;
  const isAfternoon = hourInt >= 12 && hourInt < 18;
  const isEvening = hourInt >= 18 || hourInt < 4;
  
  let timeLabel = "sáng";
  if (isAfternoon) timeLabel = "chiều";
  if (isEvening) timeLabel = "tối";

  return (
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
      
      <div className="flex justify-between items-start mb-4">
        <Clock className="w-10 h-10 text-blue-500" />
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-blue-600"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Giờ cao điểm</h3>
      
      {isEditing ? (
        <div className="space-y-4">
           <div className="flex items-center gap-2">
              <input 
                type="number" 
                min="0" 
                max="23"
                value={tempHour}
                onChange={(e) => setTempHour(e.target.value)}
                className="text-3xl font-black text-slate-900 w-20 bg-slate-50 border-2 border-blue-100 rounded-xl px-2 py-1 outline-none focus:border-blue-500"
              />
              <span className="text-2xl font-black text-slate-900">:00</span>
           </div>
           <div className="flex gap-2">
              <button 
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Lưu
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-xl font-bold text-sm"
              >
                Hủy
              </button>
           </div>
        </div>
      ) : (
        <>
          <p className="text-3xl font-black text-slate-900">{peakHour}:00</p>
          <p className="text-sm text-gray-500 mt-4 font-medium leading-relaxed mb-6">
            Bạn có xu hướng kỷ luật nhất vào lúc <b>{peakHour} giờ {timeLabel}</b>. Đây là "giờ vàng" của bạn!
          </p>
          <div className="w-full py-2 bg-slate-50 text-blue-600 font-bold rounded-xl text-center text-sm border border-blue-50">
            Giờ vàng đã được thiết lập
          </div>
        </>
      )}
    </div>
  );
}
