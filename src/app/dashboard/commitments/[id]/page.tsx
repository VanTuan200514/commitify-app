import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { ArrowLeft, Target, Calendar, CheckSquare, XCircle, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import CheckinClientForm from "./CheckinClientForm";

export default async function CommitmentDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession();
  if (!session) return null;

  const resolvedParams = await params;

  const commitment = await db.commitment.findUnique({
    where: { id: resolvedParams.id, user_id: session.id },
    include: {
      progress: {
        orderBy: { date: 'desc' },
        take: 7 // Showing last 7 days of progress
      }
    }
  });

  if (!commitment) notFound();

  // Check if today is already checked-in
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayProgress = commitment.progress.find((p: any) => {
    const pDate = new Date(p.date);
    pDate.setHours(0, 0, 0, 0);
    return pDate.getTime() === today.getTime();
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="p-2 hover:bg-gray-200 rounded-lg transition-colors bg-white shadow-sm border border-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Chi tiết cam kết</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex justify-between items-start mb-6">
              <span className={`px-3 py-1 text-sm font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200`}>
                {commitment.category}
              </span>
              <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                Hằng ngày
              </span>
            </div>
            
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">{commitment.title}</h2>
            
            {(commitment.description || "(Chưa ghi lý do)") && (
              <div className="bg-slate-50 p-4 rounded-xl mb-6">
                <h4 className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Động lực của bạn
                </h4>
                <p className="text-gray-600 italic">"{commitment.description || "Hãy tiếp tục cố gắng để đạt được mục tiêu!"}"</p>
              </div>
            )}

            <div className="flex flex-wrap gap-6 text-sm text-gray-600 border-t border-gray-100 pt-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Bắt đầu: {format(new Date(commitment.start_date), 'dd/MM/yyyy')}
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-500" />
                Trạng thái: <strong className="text-slate-900 capitalize">{commitment.status}</strong>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Lịch sử Check-in (7 ngày gần nhất)</h3>
            <div className="space-y-3">
              {commitment.progress.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  Chưa có lượt check-in nào.
                </div>
              ) : (
                commitment.progress.map((prog: any) => (
                  <div key={prog.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3">
                      {prog.status === 'done' ? <CheckSquare className="w-5 h-5 text-emerald-500" /> : 
                       prog.status === 'trying' ? <MoreHorizontal className="w-5 h-5 text-amber-500" /> : 
                       <XCircle className="w-5 h-5 text-red-500" />}
                      <span className="font-medium text-slate-900">{format(new Date(prog.date), 'dd/MM/yyyy')}</span>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-4">
                      {prog.note && <span className="italic"> "{prog.note}"</span>}
                     <span className={`px-2 py-1 rounded text-xs font-bold leading-none ${prog.status === 'done' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {prog.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right column check-in action */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Check-in Hôm nay</h3>
            <p className="text-sm text-gray-500 mb-6">Đánh dấu tiến độ của bạn cho ngày hôm nay để duy trì chuỗi thành tích.</p>
            
            <CheckinClientForm 
              commitmentId={commitment.id} 
              todayStatus={todayProgress?.status} 
              todayNote={todayProgress?.note} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
