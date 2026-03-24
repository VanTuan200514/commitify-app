import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import FocusTimer from "./FocusTimer";
import { Timer, Zap, Coffee, Brain } from "lucide-react";

export default async function FocusPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const commitments = await db.commitment.findMany({
    where: { user_id: session.id, status: "active" },
    orderBy: { start_date: "desc" }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 border-b-4 border-yellow-400 inline-block pb-2">Chế độ Tập trung (Pomodoro)</h1>
          <p className="text-gray-500 mt-2 font-medium">Bật sự tập trung cao độ để hoàn thành cam kết nhanh hơn!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Timer Display */}
        <div className="lg:col-span-2">
           <FocusTimer commitments={commitments} />
        </div>

        {/* Info & Tips */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                 <Brain className="w-5 h-5 text-purple-500" />
                 Quy trình Pomodoro
              </h3>
              <ul className="space-y-4 text-sm text-gray-600">
                 <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs shrink-0">1</span>
                    <p>Chọn một cam kết bạn muốn thực hiện.</p>
                 </li>
                 <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs shrink-0">2</span>
                    <p>Tập trung làm việc trong <b>25 phút</b> (không dùng điện thoại/mạng xã hội).</p>
                 </li>
                 <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs shrink-0">3</span>
                    <p>Hệ thống tự động <b>Check-in</b> sau khi hoàn thành!</p>
                 </li>
                 <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs shrink-0">4</span>
                    <p>Nghỉ ngắn 5 phút và bắt đầu lại.</p>
                 </li>
              </ul>
           </div>

           <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-3xl border border-yellow-100">
              <div className="flex items-center gap-2 mb-2">
                 <Zap className="w-5 h-5 text-yellow-600" />
                 <h4 className="font-bold text-yellow-800">Phần thưởng XP</h4>
              </div>
              <p className="text-sm text-yellow-700 leading-relaxed font-medium">
                 Hoàn thành 1 chu kỳ Pomodoro giúp bạn nhân đôi chỉ số tập trung và nhận ngay <b>+100 XP</b>!
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
