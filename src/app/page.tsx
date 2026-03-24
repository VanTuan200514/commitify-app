import Link from "next/link";
import { ArrowRight, CheckCircle2, TrendingUp, Users } from "lucide-react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();
  
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-xl text-slate-900 tracking-tight">Commitify</span>
            </div>
            <div className="flex gap-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Đăng nhập
              </Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                Bắt đầu miễn phí
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="relative overflow-hidden pt-24 pb-32">
          {/* Background decoration */}
          <div className="absolute inset-y-0 w-full h-full pointer-events-none -z-10">
            <div className="absolute w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -top-24 -left-20" />
            <div className="absolute w-[600px] h-[600px] bg-cyan-100/50 rounded-full blur-3xl bottom-0 -right-20" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              Xây dựng thói quen, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Chinh phục mục tiêu
              </span>
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Nền tảng giúp sinh viên theo dõi cam kết cá nhân, quản lý thời gian và đạt được các mục tiêu học tập, sức khoẻ mỗi ngày.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="inline-flex justify-center items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                Tạo cam kết ngay
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#features" className="inline-flex justify-center items-center px-8 py-4 rounded-lg text-lg font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-all">
                Tìm hiểu thêm
              </a>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900">Tại sao chọn Commitify?</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-slate-50 rounded-2xl">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Theo dõi đơn giản</h3>
                <p className="text-gray-600 leading-relaxed">Check-in tiến độ mỗi ngày nhanh chóng chỉ với một chạm. Hệ thống thống kê tự động vẽ biểu đồ trực quan.</p>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Duy trì động lực</h3>
                <p className="text-gray-600 leading-relaxed">Nhận lời nhắc hằng ngày qua email/thông báo. Mở khóa huy hiệu khi đạt được chuỗi ngày cam kết liên tục.</p>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Tham gia cộng đồng</h3>
                <p className="text-gray-600 leading-relaxed">Chia sẻ mục tiêu với bạn bè và kết nối với những sinh viên có cùng chí hướng để cùng nhau phát triển.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="h-6 w-6 text-blue-500" />
            <span className="font-bold text-xl text-white tracking-tight">Commitify</span>
          </div>
          <p className="mb-6">Nền tảng hỗ trợ sinh viên xây dựng và theo dõi cam kết phát triển bản thân.</p>
          <p className="text-sm">© 2026 Commitify. Đồ án tạo bởi Antigravity.</p>
        </div>
      </footer>
    </div>
  );
}
