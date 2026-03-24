import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { Target, CheckCircle2, Flame, Plus, Clock } from "lucide-react";
import { format } from "date-fns";

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tiến độ hôm nay</h1>
          <p className="text-gray-600">Chào {session.name}, hãy giữ vững phong độ nhé!</p>
        </div>
        <Link 
          href="/dashboard/commitments/new" 
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Cam kết mới</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Tổng mục tiêu</p>
            <p className="text-2xl font-bold text-slate-900">{totalCommitments}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Đã check-in (Hôm nay)</p>
            <p className="text-2xl font-bold text-slate-900">{completedToday}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Chuỗi ngày (Streak)</p>
            <p className="text-2xl font-bold text-slate-900">0</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">Nhiệm vụ gần đây</h2>
          <Link href="/dashboard/commitments" className="text-sm text-blue-600 hover:underline">
            Xem tất cả
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {commitments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Bạn chưa có cam kết nào. Bắt đầu bằng việc <Link href="/dashboard/commitments/new" className="text-blue-600 underline">tạo cam kết mới</Link>.
            </div>
          ) : (
            commitments.map((commitment: any) => {
              const checkedInToday = commitment.progress.length > 0;
              const status = checkedInToday ? commitment.progress[0].status : null;
              
              return (
                <div key={commitment.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full 
                        ${commitment.category === 'học tập' ? 'bg-blue-100 text-blue-700' : 
                          commitment.category === 'sức khỏe' ? 'bg-emerald-100 text-emerald-700' : 
                          commitment.category === 'tài chính' ? 'bg-amber-100 text-amber-700' : 
                          'bg-purple-100 text-purple-700'}`}>
                        {commitment.category}
                      </span>
                      <h3 className="font-semibold text-slate-900">{commitment.title}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> 
                        Bắt đầu: {format(new Date(commitment.start_date), 'dd/MM/yyyy')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 self-end sm:self-auto w-full sm:w-auto">
                    {checkedInToday ? (
                      <div className={`px-4 py-2 rounded-lg text-sm font-medium w-full sm:w-auto text-center
                        ${status === 'done' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                          status === 'trying' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 
                          'bg-red-50 text-red-700 border border-red-200'}`}>
                        {status === 'done' ? 'Hoàn thành' : status === 'trying' ? 'Đang cố gắng' : 'Bỏ qua'}
                      </div>
                    ) : (
                      <Link 
                        href={`/dashboard/commitments/${commitment.id}`}
                        className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-semibold transition-colors border border-blue-200 w-full sm:w-auto text-center"
                      >
                        Check-in hôm nay
                      </Link>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
