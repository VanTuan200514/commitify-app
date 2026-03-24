import Link from "next/link";
import { 
  LayoutDashboard, 
  Target, 
  TrendingUp, 
  Settings, 
  LogOut,
  Menu
} from "lucide-react";
import { getSession } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-white shadow-xl flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <TrendingUp className="h-6 w-6 text-blue-500 mr-2" />
          <span className="font-bold text-xl tracking-tight">Commitify</span>
        </div>
        
        <div className="p-4 flex flex-col gap-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
            <LayoutDashboard className="h-5 w-5" />
            <span className="font-medium">Tổng quan</span>
          </Link>
          <Link href="/dashboard/commitments" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
            <Target className="h-5 w-5" />
            <span className="font-medium">Cam kết của tôi</span>
          </Link>
        </div>

        <div className="mt-auto p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
              {session?.name?.charAt(0) || "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{session?.name}</p>
              <p className="text-xs text-slate-400 truncate">{session?.email}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-lg text-slate-900">Commitify</span>
          </div>
          <button className="text-gray-500 hover:text-gray-700">
            <Menu className="h-6 w-6" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}


