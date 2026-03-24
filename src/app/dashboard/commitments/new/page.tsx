"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Flag, Info, Calendar, Sparkles } from "lucide-react";
import Link from "next/link";
import AISuggestions from "@/components/AISuggestions";

export default function NewCommitmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "học tập",
    targetType: "daily",
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
  });

  const handleSelectSuggestion = (s: any) => {
    setFormData({
      ...formData,
      title: s.title,
      description: s.description,
      category: s.category || "học tập",
      targetType: s.targetType || "daily"
    });
    // Scroll to form to show user it populated
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/commitments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không thể tạo cam kết");

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tạo mới cam kết</h1>
          <p className="text-gray-500">Đặt mục tiêu và theo dõi hành trình của bạn.</p>
        </div>
      </div>

      {/* AI Assistant! */}
      <AISuggestions onSelect={handleSelectSuggestion} />

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-full -z-10"></div>
        
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
           <Flag className="w-5 h-5 text-blue-600" />
           Thông tin cam kết
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Tên cam kết *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white placeholder:text-gray-400 font-medium"
                placeholder="Ví dụ: Đọc 30 trang sách mỗi ngày"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Danh mục
                </label>
                <select
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white placeholder:text-gray-400 font-medium"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="học tập">📚 Học tập</option>
                  <option value="kỷ luật">⏳ Kỷ luật</option>
                  <option value="sức khỏe">🏃‍♂️ Sức khỏe</option>
                  <option value="tài chính">💰 Tài chính</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Tần suất
                </label>
                <select
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white placeholder:text-gray-400 font-medium"
                  value={formData.targetType}
                  onChange={(e) => setFormData({ ...formData, targetType: e.target.value })}
                >
                  <option value="daily">Hằng ngày</option>
                  <option value="weekly">Hằng tuần</option>
                  <option value="monthly">Hằng tháng</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Ngày bắt đầu *
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white placeholder:text-gray-400 font-medium"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Kết thúc (Nếu có)
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white placeholder:text-gray-400 font-medium"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Lý do cam kết (Động lực)
              </label>
              <textarea
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition h-32 resize-none text-gray-900 bg-white placeholder:text-gray-400 font-medium"
                placeholder="Ghi lại lý do cụ thể sẽ giúp bạn có thêm động lực..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm flex items-start gap-2 border border-red-100 shadow-sm animate-shake">
              <Info className="w-5 h-5 shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <div className="pt-6 flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-100">
            <Link 
              href="/dashboard"
              className="px-8 py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition text-center"
            >
              Hủy
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  Ký kết hứa hẹn
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Loader2(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M4.93 4.93l2.83 2.83" />
      <path d="M16.24 16.24l2.83 2.83" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <path d="M4.93 19.07l2.83-2.83" />
      <path d="M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

