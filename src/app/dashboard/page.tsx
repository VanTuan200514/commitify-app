import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { Target, CheckCircle2, Flame, Plus, Clock, Zap, Ribbon, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import WeeklyHeatmap from "@/components/WeeklyHeatmap";

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session) return null;

  const commitments = await db.commitment.findMany({
    where: { user_id: session.id },
    include: {
      progress: {
        where: {
          date: {
            gte: new Date(new Date().setHours(0,0,0,0)), // Today
          }
        }
      }
    },
    orderBy: { start_date: 'desc' },
    take: 5
  });

  const totalCommitments = await db.commitment.count({ where: { user_id: session.id } });
  const completedToday = commitments.filter((c: any) => c.progress.some((p: any) => p.status === 'done')).length;
  
  // XP & Gamification Logic
  const allProgress = await db.commitmentProgress.findMany({ where: { user_id: session.id } });
  const totalDone = allProgress.filter((p: any) => p.status === 'done').length;
  const xp = totalDone * 50; // 50 XP per accomplished check-in
  const currentLevel = Math.floor(Math.sqrt(xp / 100)) + 1;
  const currentStreak = totalDone > 0 ? 3 : 0; // Mock current streak
  
  // Calculate Progress to next level
  const nextLevelXp = Math.pow(currentLevel, 2) * 100;
  const currentLevelXp = Math.pow(currentLevel - 1, 2) * 100;
  const progressPercent = Math.min(100, Math.max(0, ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100));

  return (
    <div className="space-y-8">
      {/* Hello & Gamification Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-900 to-slate-800 p-6 md:p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 w-full md:w-auto">
          <h1 className="text-3xl font-extrabold mb-1">Chào {session.name} 👋</h1>
          <p className="text-slate-300 font-medium text-sm md:text-base">Mỗi ngày nỗ lực một chút, bạn sẽ thấy sự khác biệt!</p>
          
          {/* Level Progress Bar */}
          <div className="mt-5 max-w-sm">
            <div className="flex justify-between text-sm mb-1 font-bold">
              <span className="text-yellow-400 flex items-center gap-1"><Zap className="w-4 h-4" /> Lv {currentLevel}</span>
              <span className="text-slate-400">{xp} / {nextLevelXp} XP</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5 shadow-inner">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2.5 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(251,191,36,0.5)]" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 flex gap-4 w-full md:w-auto">
          <Link 
            href="/dashboard/commitments/new" 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            <span>Tạo cam kết</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <Target className="w-6 h-6" />
          </div>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Tổng mục tiêu</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">{totalCommitments}</p>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Hoàn thành hôm nay</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">{completedToday}</p>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-2xl flex items-center justify-center mb-4 shadow-md shadow-orange-500/20">
            <Flame className="w-6 h-6" />
          </div>
          <div className="flex justify-between items-end">
             <div>
               <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Lửa Kỷ Luật (Streak)</p>
               <p className="text-3xl font-extrabold text-slate-900 mt-1">{currentStreak} <span className="text-lg font-medium text-gray-400">ngày</span></p>
             </div>
             {currentStreak > 0 && <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-lg">Đang giữ lửa 🔥</span>}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Ribbon className="w-5 h-5 text-blue-600" />
            Nhiệm vụ cần làm hôm nay
          </h2>
          <Link href="/dashboard/commitments" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="divide-y divide-gray-100">
          {commitments.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Target className="w-12 h-12 text-blue-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Bạn chưa có mục tiêu nào!</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                Hành trình vạn dặm luôn bắt đầu bằng một bước chân nhỏ. Hãy tạo mục tiêu đầu tiên ngay hôm nay!
              </p>
              <Link 
                href="/dashboard/commitments/new" 
                className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-1"
              >
                <Plus className="w-6 h-6" /> Tạo cam kết đầu tiên
              </Link>
            </div>
          ) : (
            commitments.map((commitment: any) => {
              const checkedInToday = commitment.progress.length > 0;
              const status = checkedInToday ? commitment.progress[0].status : null;
              
              return (
                <div key={commitment.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-slate-50/80 transition-colors group">
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 text-xs font-extrabold rounded-lg uppercase tracking-wider
                        ${commitment.category === 'học tập' ? 'bg-blue-100 text-blue-700' : 
                          commitment.category === 'sức khỏe' ? 'bg-emerald-100 text-emerald-700' : 
                          commitment.category === 'tài chính' ? 'bg-amber-100 text-amber-700' : 
                          'bg-purple-100 text-purple-700'}`}>
                        {commitment.category}
                      </span>
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">{commitment.title}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-400" /> 
                        Từ {format(new Date(commitment.start_date), 'dd/MM')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 self-end sm:self-auto w-full sm:w-auto">
                    {checkedInToday ? (
                      <div className={`px-5 py-2.5 rounded-xl text-sm font-bold w-full sm:w-auto text-center flex items-center justify-center gap-2 shadow-sm
                        ${status === 'done' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 
                          status === 'trying' ? 'bg-amber-500 text-white shadow-amber-500/20' : 
                          'bg-red-500 text-white shadow-red-500/20'}`}>
                        {status === 'done' ? <><CheckCircle2 className="w-4 h-4"/> Đã Check-in (+50 XP)</> : 
                         status === 'trying' ? 'Đang cố gắng' : 'Bỏ qua hôm nay'}
                      </div>
                    ) : (
                      <Link 
                        href={`/dashboard/commitments/${commitment.id}`}
                        className="px-6 py-2.5 bg-white text-blue-600 hover:bg-blue-50 border-2 border-blue-600 rounded-xl text-sm font-extrabold transition-all w-full sm:w-auto text-center shadow-sm hover:shadow-blue-500/10"
                      >
                        ⚡ Check-in nhanh
                      </Link>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      
      {/* GitHub Heatmap! */}
      <WeeklyHeatmap progressData={allProgress} />
    </div>
  );
}
