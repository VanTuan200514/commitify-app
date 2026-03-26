import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Users, Send, ArrowLeft, MessageSquare, Shield, Smile, Paperclip } from "lucide-react";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import ChatClient from "./ChatClient";

export default async function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const group = await db.groups.findUnique({
    where: { id: id },
    include: {
      members: {
        include: { user: true }
      },
      _count: { select: { members: true } }
    }
  });

  if (!group) return notFound();

  // Check if user is a member
  const isMember = group.members.some((m: any) => m.user_id === session.id);
  if (!isMember) {
     return (
       <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
         <Shield className="w-16 h-16 text-red-500 mb-6" />
         <h1 className="text-2xl font-black text-slate-800 mb-2">Bạn không thuộc nhóm này</h1>
         <p className="text-gray-500 mb-8 max-w-sm">Vui lòng quay lại hoặc yêu cầu quản trị viên thêm bạn vào nhóm.</p>
         <Link href="/dashboard/groups" className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold">Quay lại</Link>
       </div>
     );
  }

  // Pre-fetch some mock/existing messages
  // Since we just added the model, it's likely empty.
  const initialMessages = [
    { id: "1", content: "Chào mọi người! Tuần này bớt lười đi nhé 🔥", user: { name: "Hệ thống" }, created_at: new Date(Date.now() - 3600000) },
    { id: "2", content: "Ai hoàn thành check-in 7 ngày liên tục chưa ạ?", user: { name: "An (Admin)" }, created_at: new Date(Date.now() - 1800000) },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/groups" className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight">{group.name}</h1>
            <p className="text-sm font-bold text-emerald-600 flex items-center gap-1">
               <Users className="w-4 h-4" /> {group._count.members} thành viên đang online
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        {/* Chat Area */}
        <div className="lg:col-span-3 flex flex-col bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden relative">
           <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
           
           <ChatClient 
             groupId={group.id} 
             currentUser={session} 
             initialMessages={initialMessages} 
           />
        </div>

        {/* Sidebar Members */}
        <div className="hidden lg:flex flex-col bg-slate-50 rounded-3xl border border-slate-200/50 p-6 overflow-y-auto shadow-inner">
           <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              Thành viên nhóm
           </h3>
           <div className="space-y-4">
              {group.members.map((member: any) => (
                <div key={member.id} className="flex items-center gap-3 group">
                   <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center font-bold text-slate-600 shadow-sm border border-white">
                      {member.user.name.charAt(0)}
                   </div>
                   <div className="overflow-hidden">
                      <p className="text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                        {member.user.name}
                      </p>
                      <span className={`text-[10px] font-black uppercase ${member.role === 'owner' ? 'text-amber-500' : 'text-slate-400'}`}>
                        {member.role === 'owner' ? 'Trưởng nhóm' : 'Thành viên'}
                      </span>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
