import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Users, Plus, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function GroupsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const userGroups = await db.groupMembers.findMany({
    where: { user_id: session.id },
    include: {
      group: {
        include: {
          _count: { select: { members: true } }
        }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cộng đồng & Nhóm</h1>
          <p className="text-gray-500">Cùng nhau học tập và đạt mục tiêu nhanh hơn</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
          Tạo nhóm mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {userGroups.length === 0 ? (
          <div className="col-span-1 md:col-span-3 bg-white p-8 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 flex items-center justify-center rounded-full mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Bạn chưa tham gia nhóm nào</h3>
            <p className="text-gray-500 max-w-md mb-6">
              Tham gia các nhóm học tập để nhận được sự hỗ trợ, cùng nhau cam kết và thi đua mỗi ngày.
            </p>
            <button className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
              Khám phá các nhóm <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          userGroups.map((member: any) => (
            <div key={member.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{member.group.name}</h3>
                  {member.role === "owner" && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Admin
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">
                  {member.group.description || "Nhóm học tập phát triển bản thân mỗi ngày."}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{member.group._count.members} thành viên</span>
                  </div>
                  <Link 
                    href={`/dashboard/groups/${member.group.id}`}
                    className="text-sm font-black text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 transition-all hover:bg-blue-600 hover:text-white"
                  >
                    Vào nhóm
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Bảng xếp hạng Nhóm nổi bật */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Đấu trường Kỷ luật (Group Leaderboard)
        </h2>
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Hạng</th>
                <th className="px-6 py-4">Tên nhóm</th>
                <th className="px-6 py-4">Thành viên</th>
                <th className="px-6 py-4 text-right">Tổng Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { rank: 1, name: "Thợ Săn Học Bổng", members: 124, score: 2840, icon: "🥇" },
                { rank: 2, name: "Cộng Đồng Gymers HN", members: 89, score: 2150, icon: "🥈" },
                { rank: 3, name: "Thắp Sáng Ước Mơ", members: 56, score: 1890, icon: "🥉" },
                { rank: 4, name: "Nhóm Tiết Kiệm Gen Z", members: 210, score: 1420, icon: "" },
              ].map((item) => (
                <tr key={item.rank} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-600">
                    {item.icon ? item.icon : `#${item.rank}`}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900">{item.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {item.members} thành viên
                  </td>
                  <td className="px-6 py-4 text-right font-black text-blue-600">
                    {item.score.toLocaleString()} XP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 bg-blue-50 text-center">
             <button className="text-blue-600 font-bold text-sm hover:underline">Xem thêm bảng xếp hạng toàn cầu</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Trophy(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

