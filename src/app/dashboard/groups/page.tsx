import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Users, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import CreateGroupModal from "./CreateGroupModal";

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
          <h1 className="text-3xl font-black text-slate-900 leading-tight">Cộng đồng & Nhóm</h1>
          <p className="text-gray-500 font-medium">Cùng nhau học tập và đạt mục tiêu nhanh hơn</p>
        </div>
        <CreateGroupModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {userGroups.length === 0 ? (
          <div className="col-span-1 md:col-span-3 bg-white p-12 rounded-[40px] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center shadow-inner">
            <div className="w-20 h-20 bg-blue-50 text-blue-500 flex items-center justify-center rounded-3xl mb-6 shadow-lg shadow-blue-500/10">
              <Users className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Chưa tìm thấy đồng đội?</h3>
            <p className="text-gray-500 max-w-sm mb-8 font-medium">
              Tham gia các nhóm học tập để nhận được sự hỗ trợ, cùng nhau cam kết và thi đua mỗi ngày.
            </p>
            <button className="text-blue-600 font-black hover:text-blue-700 flex items-center gap-2 bg-blue-50 px-6 py-2 rounded-xl transition-all">
              Khám phá các nhóm <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          userGroups.map((member: any) => (
            <div key={member.id} className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 group">
              <div className="h-28 bg-gradient-to-br from-blue-600 to-indigo-700 relative">
                 <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-xl text-slate-900 line-clamp-1">{member.group.name}</h3>
                  {member.role === "owner" && (
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-black uppercase px-2 py-1 rounded-lg flex items-center gap-1 border border-amber-200">
                      <Shield className="w-3 h-3" /> Admin
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-6 h-10 leading-relaxed">
                  {member.group.description || "Nhóm học tập phát triển bản thân mỗi ngày."}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                    <Users className="w-4 h-4" />
                    <span>{member.group._count.members} Mem</span>
                  </div>
                  <Link 
                    href={`/dashboard/groups/${member.group.id}`}
                    className="text-sm font-black text-blue-600 bg-blue-50 px-6 py-2 rounded-xl border border-blue-100 transition-all hover:bg-blue-600 hover:text-white shadow-lg shadow-blue-500/5"
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
      <div className="mt-16">
        <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
          <Trophy className="w-8 h-8 text-amber-500" />
          Đấu trường Kỷ luật
        </h2>
        <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Hạng</th>
                <th className="px-8 py-6">Tên nhóm</th>
                <th className="px-8 py-6">Quy mô</th>
                <th className="px-8 py-6 text-right">Tổng XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { rank: 1, name: "Thợ Săn Học Bổng", members: 124, score: 28430, icon: "🥇" },
                { rank: 2, name: "Cộng Đồng Gymers HN", members: 89, score: 21500, icon: "🥈" },
                { rank: 3, name: "Thắp Sáng Ước Mơ", members: 56, score: 18900, icon: "🥉" },
                { rank: 4, name: "Nhóm Tiết Kiệm Gen Z", members: 210, score: 14200, icon: "🔥" },
              ].map((item) => (
                <tr key={item.rank} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-6 font-black text-slate-400 group-hover:text-blue-600 transition-colors">
                    {item.rank === 1 ? <span className="text-2xl">🥇</span> : 
                     item.rank === 2 ? <span className="text-2xl">🥈</span> :
                     item.rank === 3 ? <span className="text-2xl">🥉</span> : `#${item.rank}`}
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{item.name}</span>
                  </td>
                  <td className="px-8 py-6 text-slate-500 font-bold text-sm">
                    {item.members} thành viên
                  </td>
                  <td className="px-8 py-6 text-right font-black text-blue-600 text-lg">
                    {item.score.toLocaleString()} <span className="text-[10px] text-slate-400">XP</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-6 bg-slate-50 text-center border-t border-slate-100">
             <button className="text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-blue-600 transition-colors">Xem bảng xếp hạng toàn cầu</button>
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
