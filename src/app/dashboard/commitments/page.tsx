import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { Plus, Target, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";

export default async function CommitmentsPage() {
  const session = await getSession();
  if (!session) return null;

  const commitments = await db.commitment.findMany({
    where: { user_id: session.id },
    orderBy: { start_date: 'desc' },
    include: {
      progress: true
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Cam kết của tôi</h1>
            <p className="text-gray-500 text-sm mt-1">Quản lý và theo dõi tiến độ các mục tiêu</p>
          </div>
        </div>
        <Link 
          href="/dashboard/commitments/new" 
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Tạo mới</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {commitments.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-dashed border-gray-300">
            <Target className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Chưa có cam kết nào</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">Tạo một cam kết nhỏ và duy trì nó mỗi ngày để thấy sự thay đổi lớn lao!</p>
            <Link 
              href="/dashboard/commitments/new" 
              className="inline-flex flex-col items-center gap-2 text-blue-600 font-medium hover:underline"
            >
              Bắt đầu ngay
            </Link>
          </div>
        ) : (
          commitments.map((commitment: any) => {
            const daysCount = commitment.progress.length;
            const completedDays = commitment.progress.filter((p: any) => p.status === 'done').length;
            const percentage = daysCount > 0 ? Math.round((completedDays / daysCount) * 100) : 0;

            const categoryColors: Record<string, string> = {
              'học tập': 'bg-blue-50 text-blue-700 border-blue-200',
              'kỷ luật': 'bg-purple-50 text-purple-700 border-purple-200',
              'sức khỏe': 'bg-emerald-50 text-emerald-700 border-emerald-200',
              'tài chính': 'bg-amber-50 text-amber-700 border-amber-200',
            };

            const colorClass = categoryColors[commitment.category] || 'bg-gray-50 text-gray-700 border-gray-200';

            return (
              <Link key={commitment.id} href={`/dashboard/commitments/${commitment.id}`}>
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-100 transition-all cursor-pointer h-full flex flex-col group hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${colorClass}`}>
                      {commitment.category.toUpperCase()}
                    </span>
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium">
                      {commitment.target_type === 'daily' ? 'Hằng ngày' : commitment.target_type === 'weekly' ? 'Hằng tuần' : 'Hằng tháng'}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {commitment.title}
                  </h3>
                  
                  {commitment.description && (
                    <p className="text-sm text-gray-500 mb-6 line-clamp-2 flex-grow">
                      {commitment.description}
                    </p>
                  )}

                  <div className="mt-auto pt-4 border-t border-gray-100 space-y-4">
                    <div className="flex items-center text-xs text-gray-500 gap-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(commitment.start_date), 'dd/MM/yyyy')}
                      </div>
                      <div className="flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500" title="Tổng số lần check-in">
                        <Target className="w-4 h-4" />
                        {daysCount} ngày
                      </div>
                    </div>

                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className={`bg-blue-600 h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  );
}
