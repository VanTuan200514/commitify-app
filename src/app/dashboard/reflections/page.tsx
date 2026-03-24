import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { BookOpen, Calendar, History, Sparkles } from "lucide-react";
import ReflectionClient from "./ReflectionClient";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default async function ReflectionsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const reflections = await db.reflection.findMany({
    where: { user_id: session.id },
    orderBy: { date: "desc" },
    take: 30
  });

  const moods: Record<string, string> = {
    happy: "😊 Tuyệt vời",
    motivated: "🔥 Đầy động lực",
    neutral: "😐 Bình thường",
    tired: "😴 Mệt mỏi",
    sad: "😢 Cần cố gắng hơn"
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Nhật ký Kỷ luật</h1>
          <p className="text-gray-500 font-medium mt-1">Ghi lại hành trình mỗi ngày để thấy mình trưởng thành hơn.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Entry Area */}
        <div className="lg:col-span-3 space-y-8">
           <ReflectionClient />
        </div>

        {/* History Area */}
        <div className="lg:col-span-2">
           <div className="flex items-center gap-2 mb-6">
              <History className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-slate-800">Nhìn lại hành trình</h2>
           </div>

           <div className="space-y-4">
              {reflections.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border border-dashed border-gray-200 text-center">
                   <p className="text-gray-400 text-sm italic">"Chưa có nhật ký nào. Hãy viết dòng đầu tiên nhé!"</p>
                </div>
              ) : (
                reflections.map((ref: any) => (
                  <div key={ref.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                     <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-black uppercase text-blue-500 bg-blue-50 px-2 py-1 rounded-lg tracking-widest">
                           {format(new Date(ref.date), 'dd/MM/yyyy', { locale: vi })}
                        </span>
                         <span className="text-sm font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded-lg group-hover:bg-blue-100 transition-colors">
                            {moods[ref.mood] || "😐"}
                         </span>
                      </div>
                      <p className="text-slate-700 text-sm font-medium leading-relaxed line-clamp-3">
                         {ref.content}
                      </p>
                   </div>
                ))
              )}
           </div>

           {reflections.length >= 30 && (
              <div className="mt-8 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl border border-blue-100 text-center">
                 <Sparkles className="w-8 h-8 text-blue-500 mx-auto mb-3 animate-pulse" />
                 <h4 className="font-bold text-slate-900 mb-1">Wow! Bạn đã đi được 30 ngày</h4>
                 <p className="text-xs text-slate-500 font-medium">Một thói quen đã được hình thành vững chắc!</p>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
