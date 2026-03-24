"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";

export default function CheckinClientForm({ 
  commitmentId,
  todayStatus,
  todayNote
}: { 
  commitmentId: string;
  todayStatus?: string;
  todayNote?: string | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<string>(todayStatus || "");
  const [note, setNote] = useState(todayNote || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!status) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/commitments/${commitmentId}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note }),
      });

      if (!res.ok) throw new Error("Thất bại");

      router.refresh();
    } catch (err) {
      alert("Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  if (todayStatus) {
    return (
      <div className="text-center py-4 bg-gray-50 rounded-xl border border-gray-100">
        <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3 bg-emerald-100 text-emerald-600">
          <Check className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-slate-900">Đã check-in!</h4>
        <p className="text-sm text-gray-500 mt-1">Bạn đã cập nhật tiến độ cho hôm nay.</p>
        {todayNote && <p className="text-sm mt-3 italic text-gray-600 bg-white inline-block px-3 py-1 rounded shadow-sm border border-gray-100">"{todayNote}"</p>}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setStatus('done')}
          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${status === 'done' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-200 hover:bg-emerald-50/50'}`}
        >
          <Check className="w-6 h-6" />
          <span className="font-semibold text-sm">Hoàn thành</span>
        </button>
        <button
          type="button"
          onClick={() => setStatus('skipped')}
          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${status === 'skipped' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-600 hover:border-red-200 hover:bg-red-50/50'}`}
        >
          <X className="w-6 h-6" />
          <span className="font-semibold text-sm">Chưa làm</span>
        </button>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Ghi chú (Tùy chọn)</label>
        <textarea 
          className="w-full text-sm p-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 outline-none" 
          rows={3} 
          placeholder="Bạn cảm thấy thế nào hôm nay?"
          value={note}
          onChange={e => setNote(e.target.value)}
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={!status || loading}
        className="w-full flex justify-center py-3 bg-slate-900 border border-transparent rounded-xl text-white font-semibold hover:bg-slate-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Lưu check-in"}
      </button>
    </form>
  );
}
