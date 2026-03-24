"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Menu, 
  X, 
  LayoutDashboard, 
  Target, 
  Users, 
  Award, 
  Timer,
  LogOut
} from "lucide-react";

export default function MobileNav({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Tổng quan" },
    { href: "/dashboard/commitments", icon: Target, label: "Cam kết của tôi" },
    { href: "/dashboard/groups", icon: Users, label: "Cộng đồng" },
    { href: "/dashboard/achievements", icon: Award, label: "Bảng thành tích" },
    { href: "/dashboard/focus", icon: Timer, label: "Chế độ tập trung" },
  ];

  return (
    <>
      <header className="md:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-lg text-slate-900">Commitify</span>
        </div>
        <button 
          onClick={toggleMenu}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 md:hidden animate-fade-in"
          onClick={toggleMenu}
        >
          {/* Drawer Content */}
          <div 
            className="w-4/5 max-w-xs h-full bg-slate-900 text-white shadow-2xl flex flex-col animate-slide-in-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
              <TrendingUp className="h-6 w-6 text-blue-500 mr-2" />
              <span className="font-bold text-xl tracking-tight">Commitify</span>
            </div>

            <div className="p-4 flex flex-col gap-2 mt-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  onClick={toggleMenu}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all font-bold"
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>

            <div className="mt-auto p-6 border-t border-slate-800 bg-slate-950/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black text-white shadow-lg">
                  {session?.name?.charAt(0) || "U"}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold truncate">{session?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{session?.email}</p>
                </div>
              </div>
              
              <button 
                 onClick={() => {
                   window.location.href = "/api/auth/logout";
                 }}
                 className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-900/40 text-slate-300 hover:text-red-400 py-3 rounded-xl transition-all font-bold border border-slate-700"
              >
                 <LogOut className="h-5 w-5" />
                 Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
