"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Info } from "lucide-react";

export default function WeeklyHeatmap({ progressData }: { progressData: any[] }) {
  // Tạo mảng 28 ngày qua
  const days = Array.from({ length: 28 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // Map progress to count per day
  const heatmapData = days.map((day) => {
    const hits = progressData.filter((p: any) => {
      const pDate = new Date(p.date);
      pDate.setHours(0, 0, 0, 0);
      return pDate.getTime() === day.getTime() && p.status === "done";
    }).length;
    return { date: day, count: hits };
  });

  const getDayColor = (count: number) => {
    if (count === 0) return "bg-gray-100 border-gray-200";
    if (count === 1) return "bg-emerald-200 border-emerald-300";
    if (count === 2) return "bg-emerald-400 border-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]";
    return "bg-emerald-600 border-emerald-700 shadow-[0_0_12px_rgba(5,150,105,0.6)]";
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mt-6">
      <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-emerald-600" />
          Mức độ Kỷ luật
        </h2>
      </div>
      <div className="p-6 md:p-8 flex flex-col items-center">
        <div className="flex gap-2">
          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {heatmapData.map((day, idx) => (
              <div 
                key={idx} 
                className={`w-4 h-4 md:w-8 md:h-8 rounded md:rounded-lg border transition-all hover:scale-125 cursor-pointer ${getDayColor(day.count)} group relative`}
              >
                {/* Tooltip */}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                  {day.date.toLocaleDateString('vi-VN')} ({day.count} mục tiêu)
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 flex items-center gap-3 text-xs text-gray-500 justify-center w-full">
          <span>Lười biếng</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded-sm"></div>
            <div className="w-3 h-3 bg-emerald-200 border border-emerald-300 rounded-sm"></div>
            <div className="w-3 h-3 bg-emerald-400 border border-emerald-500 rounded-sm"></div>
            <div className="w-3 h-3 bg-emerald-600 border border-emerald-700 rounded-sm"></div>
          </div>
          <span>Chăm chỉ</span>
        </div>
      </div>
    </div>
  );
}
