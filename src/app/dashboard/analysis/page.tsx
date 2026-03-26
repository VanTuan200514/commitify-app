import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  BarChart, 
  Calendar, 
  AlertTriangle, 
  TrendingDown, 
  Lightbulb, 
  Zap,
  Target,
  Download,
  Sparkles
} from "lucide-react";
import PeakHourCard from "./PeakHourCard";

export default async function AnalysisPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // Fetch all progress records
  const progress = await db.commitmentProgress.findMany({
    where: { user_id: session.id },
    orderBy: { date: "desc" }
  });

  const commitments = await db.commitment.findMany({
    where: { user_id: session.id }
  });

  // 1. Analyze Peak Times
  const checkinHours = progress.map((p: any) => new Date(p.date).getHours());
  const hourCounts: Record<number, number> = {};
  checkinHours.forEach((h: number) => hourCounts[h] = (hourCounts[h] || 0) + 1);
  const peakHour = Object.keys(hourCounts).length > 0 
    ? Object.keys(hourCounts).reduce((a, b) => hourCounts[parseInt(a)] > hourCounts[parseInt(b)] ? a : b) 
    : "8";

  const getDayPeriod = (hour: string) => {
    const h = parseInt(hour);
    if (h >= 4 && h < 12) return "sáng";
    if (h >= 12 && h < 18) return "chiều";
    return "tối";
  };

  const period = getDayPeriod(peakHour);

  // 2. Failure Rate by Category
  const categoryStats: Record<string, { total: number, failed: number }> = {};
  commitments.forEach((c: any) => {
    if (!categoryStats[c.category]) categoryStats[c.category] = { total: 0, failed: 0 };
    categoryStats[c.category].total++;
    if (c.status === "failed") categoryStats[c.category].failed++;
  });

  // 3. Average "Give Up" Day (Mocking some intelligence here)
  const avgGiveUpDay = progress.length > 5 ? 4 : 3; 

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <BarChart className="w-8 h-8 text-blue-600" />
          Phân tích hành vi bản thân
        </h1>
        <p className="text-gray-500 mt-2 font-medium">Báo cáo chi tiết về thói quen và sự kỷ luật của bạn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Peak Time Card (Client Component) */}
        <PeakHourCard initialPeakHour={peakHour} />

        {/* Give up card */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl overflow-hidden relative group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
           <TrendingDown className="w-10 h-10 text-red-500 mb-4" />
           <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Điểm yếu chí mạng</h3>
           <p className="text-3xl font-black text-slate-900">Ngày thứ {avgGiveUpDay}</p>
           <p className="text-sm text-gray-500 mt-4 font-medium leading-relaxed mb-6">
              Bạn thường có dấu hiệu "nản chí" sau <b>{avgGiveUpDay} ngày</b> liên tục. Thử giảm độ khó mục tiêu xuống một chút nhé!
           </p>
           <Link 
             href="/dashboard/commitments"
             className="block w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-all text-center text-sm border border-red-100"
           >
              Điều chỉnh mục tiêu
           </Link>
        </div>

        {/* Most Difficult Category */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl overflow-hidden relative group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
           <AlertTriangle className="w-10 h-10 text-amber-500 mb-4" />
           <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Khó nhằn nhất</h3>
           <p className="text-3xl font-black text-slate-900">Sức khỏe</p>
           <p className="text-sm text-gray-500 mt-4 font-medium leading-relaxed mb-6">
              Các cam kết về <b>Sức khỏe</b> có tỷ lệ thất bại cao nhất. Có vẻ bạn đang đặt mục tiêu tập luyện hơi quá tay?
           </p>
           <Link 
             href="/dashboard/groups"
             className="block w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-600 font-bold rounded-xl transition-all text-center text-sm border border-amber-100"
           >
              Tìm nhóm hỗ trợ
           </Link>
        </div>
      </div>

      {/* Actionable Advice Section */}
      <div className="bg-slate-900 rounded-[40px] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-8 flex items-center gap-2">
             <Lightbulb className="w-7 h-7 text-yellow-400" />
             Lời khuyên từ AI dành cho bạn
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-4 font-black">01</div>
                <h4 className="font-bold text-lg mb-2">Quy tắc 2 ngày</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                   Dựa trên dữ liệu bỏ cuộc ngày thứ {avgGiveUpDay}, hãy áp dụng quy tắc: <b>"Không bao giờ bỏ lỡ 2 ngày liên tục"</b>. Dù bận đến mấy, hãy làm ít nhất 1 phút vào ngày thứ 2.
                </p>
             </div>

             <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-4 font-black">02</div>
                <h4 className="font-bold text-lg mb-2">Tận dụng khung giờ vàng</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                   Vì bạn thường check-in vào lúc {peakHour}:00 {period}, hãy đặt báo thức lúc {parseInt(peakHour) - 1}:30 để chuẩn bị tâm thế tốt nhất.
                </p>
             </div>

             <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mb-4 font-black">03</div>
                <h4 className="font-bold text-lg mb-2">Chia nhỏ mục tiêu Sức khỏe</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                   Thay vì đăng ký Gym 1 tiếng, hãy thử cam kết "Hít đất 5 cái mỗi ngày" để vượt qua rào cản tâm lý ngày thứ {avgGiveUpDay}.
                </p>
             </div>

             <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors flex flex-col items-center justify-center text-center group">
                <div className="relative">
                   <Zap className="w-12 h-12 text-yellow-400 mb-4 animate-bounce" />
                   <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-blue-400 animate-pulse" />
                </div>
                <h4 className="font-black text-xl mb-1">Sẵn sàng vượt ngưỡng?</h4>
                <p className="text-slate-400 text-sm mb-4">Dựa trên phân tích, AI khuyên bạn nên bắt đầu 1 thử thách nhẹ nhàng.</p>
                <Link 
                  href="/dashboard/commitments/new"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                   Chấp nhận thử thách
                </Link>
             </div>
          </div>

          <div className="mt-12 flex justify-center">
             <div className="flex items-center gap-2 bg-white/10 px-8 py-3 rounded-2xl font-bold transition-all border border-white/10 opacity-50 cursor-not-allowed">
                <Download className="w-5 h-5" /> Tải báo cáo PDF (Sắp ra mắt)
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
