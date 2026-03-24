import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Award, Zap, Flame, Trophy, Star } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AchievementsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const achievements = await db.achievements.findMany({
    where: { user_id: session.id },
    orderBy: { earned_at: "desc" },
  });

  const allProgress = await db.commitmentProgress.findMany({
    where: { user_id: session.id },
  });
  
  const completedCheckins = allProgress.filter(p => p.status === "done").length;
  // Calculate a mock streak just for presentation natively
  const currentStreak = completedCheckins > 0 ? 3 : 0; 
  const currentLevel = Math.floor(Math.sqrt(completedCheckins * 2)) + 1;

  const ALL_BADGES = [
    { id: "first_blood", name: "Bước Đầu Chinh Phục", desc: "Tạo cam kết đầu tiên", icon: <Star className="w-8 h-8" />, color: "bg-amber-100 text-amber-500", border: "border-amber-200" },
    { id: "streak_3", name: "Kỷ Luật Sắt - 3 Ngày", desc: "Hoàn thành check-in 3 ngày liên tục", icon: <Flame className="w-8 h-8" />, color: "bg-red-100 text-red-500", border: "border-red-200" },
    { id: "master_scholar", name: "Học Giả", desc: "Hoàn thành 30 ngày mục tiêu Học tập", icon: <Award className="w-8 h-8" />, color: "bg-blue-100 text-blue-500", border: "border-blue-200" },
    { id: "wealthy", name: "Quản Lý Tài Chính", desc: "Giữ cam kết tiết kiệm trong 1 tháng", icon: <Trophy className="w-8 h-8" />, color: "bg-emerald-100 text-emerald-500", border: "border-emerald-200" },
    { id: "early_bird", name: "Chim Sớm", desc: "Check-in thành công trước 6h sáng", icon: <Zap className="w-8 h-8" />, color: "bg-purple-100 text-purple-500", border: "border-purple-200" }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Thành tích & Huy hiệu</h1>
        <p className="text-gray-500">Ghi nhận từng chặng đường phấn đấu và nỗ lực của bạn</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Level Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col items-center justify-center text-center">
          <div className="absolute -top-4 -right-4 bg-white/10 w-32 h-32 rounded-full blur-2xl"></div>
          <Award className="w-12 h-12 mb-2 text-yellow-300" />
          <h2 className="text-xl font-bold opacity-90">Hạng Sinh Viên</h2>
          <div className="text-5xl font-extrabold my-2">Cấp {currentLevel}</div>
          <p className="text-sm opacity-80 mt-2">Đã check-in {completedCheckins} lần</p>
        </div>

        {/* Streak Card */}
        <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col items-center justify-center text-center">
          <div className="absolute -bottom-6 -left-6 bg-white/10 w-40 h-40 rounded-full blur-2xl"></div>
          <Flame className="w-12 h-12 mb-2 text-yellow-200" />
          <h2 className="text-xl font-bold opacity-90">Chuỗi Kỷ Luật (Streak)</h2>
          <div className="text-5xl font-extrabold my-2">{currentStreak} <span className="text-2xl font-medium">ngày</span></div>
          <p className="text-sm opacity-80 mt-2">Duy trì thói quen để nhận thưởng!</p>
        </div>
      </div>

      {/* Badges Collection */}
      <div className="pt-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" />
          Bộ sưu tập Huy hiệu
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {ALL_BADGES.map((badge, idx) => {
            // Check if user has this badge (for MVP we mock random logic based on index or actual data)
            const hasBadge = achievements.find(a => a.name === badge.name) || (completedCheckins > 0 && idx === 0);
            
            return (
              <div 
                key={badge.id} 
                className={`relative flex flex-col items-center p-5 rounded-2xl border-2 transition-all cursor-crosshair
                  ${hasBadge 
                    ? `${badge.color} ${badge.border} bg-white shadow-sm hover:scale-105` 
                    : `border-dashed border-gray-200 bg-gray-50 opacity-60 grayscale`
                  }`}
              >
                {!hasBadge && (
                  <div className="absolute top-2 right-2">
                    <LockIcon className="w-4 h-4 text-gray-400" />
                  </div>
                )}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-inner ${hasBadge ? badge.color : 'bg-gray-200 text-gray-400'}`}>
                  {badge.icon}
                </div>
                <h3 className={`font-bold text-center text-sm leading-tight mb-1 ${hasBadge ? 'text-gray-900' : 'text-gray-500'}`}>
                  {badge.name}
                </h3>
                <p className="text-xs text-center text-gray-500 leading-snug">
                  {badge.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LockIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
