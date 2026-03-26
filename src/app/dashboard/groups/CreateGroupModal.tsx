"use client";

import { useState } from "react";
import { Plus, X, Users, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateGroupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (res.ok) {
        setIsOpen(false);
        setName("");
        setDescription("");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-[20px] font-black transition-all shadow-xl hover:-translate-y-1 active:translate-y-0 group"
      >
        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
        Tạo cộng đồng mới
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsOpen(false)}></div>
          
          <div className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in duration-300">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0"></div>
             
             <div className="p-8 md:p-12 relative z-10">
                <div className="flex justify-between items-start mb-8">
                   <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Users className="w-8 h-8 text-white" />
                   </div>
                   <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                      <X className="w-6 h-6 text-slate-400" />
                   </button>
                </div>

                <div className="mb-8">
                   <h2 className="text-3xl font-black text-slate-900 mb-2">Xây dựng cộng đồng</h2>
                   <p className="text-slate-500 font-medium leading-relaxed">Kết nối những người cùng chí hướng để cùng nhau kỷ luật hơn.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tên nhóm kỷ luật</label>
                      <input 
                        required
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ví dụ: Chiến binh dậy sớm, Học thuật Gen Z..."
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-bold text-slate-900"
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mục tiêu chung</label>
                      <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Nêu vắn tắt cam kết chung của nhóm..."
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition h-32 resize-none font-bold text-slate-900"
                      />
                   </div>

                   <div className="pt-4 flex items-center gap-4">
                      <button 
                        type="submit" 
                        disabled={loading || !name.trim()}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-[20px] font-black transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                          <>
                             <Sparkles className="w-5 h-5" />
                             Bắt đầu ngay hôm nay
                          </>
                        )}
                      </button>
                   </div>
                   
                   <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1 mt-6">
                      <ShieldCheck className="w-3 h-3" /> Cam kết bảo mật & tôn trọng cộng đồng
                   </p>
                </form>
             </div>
          </div>
        </div>
      )}
    </>
  );
}
