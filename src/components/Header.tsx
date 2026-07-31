"use client";

import { useState } from "react";
import LoginModal from "./LoginModal";
import { useAuth } from "@/lib/auth";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"login" | "signup" | "edit">("login");
  const { user, setUser } = useAuth();

  const handleOpenLogin = () => {
    setModalMode("login");
    setIsModalOpen(true);
  };

  const handleOpenEdit = () => {
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    setUser(null);
    alert("로그아웃 되었습니다.");
    window.location.href = "/";
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200/50 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-8">
          <a href="/" className="text-xl font-bold tracking-tighter">def_math</a>
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-black transition-colors py-4">
                학습과제
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-48 rounded-2xl bg-white shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 z-50">
                <div className="flex flex-col gap-1">
                  <button onClick={() => alert('준비 중입니다.')} className="text-left px-4 py-2 hover:bg-gray-50 rounded-xl transition-colors">공통수학 1</button>
                  <a href="/math2" className="text-left px-4 py-2 hover:bg-gray-50 rounded-xl transition-colors block">공통수학 2</a>
                  <button onClick={() => alert('준비 중입니다.')} className="text-left px-4 py-2 hover:bg-gray-50 rounded-xl transition-colors">대수</button>
                  <button onClick={() => alert('준비 중입니다.')} className="text-left px-4 py-2 hover:bg-gray-50 rounded-xl transition-colors">미적분 1</button>
                  <button onClick={() => alert('준비 중입니다.')} className="text-left px-4 py-2 hover:bg-gray-50 rounded-xl transition-colors">미적분 2</button>
                  <button onClick={() => alert('준비 중입니다.')} className="text-left px-4 py-2 hover:bg-gray-50 rounded-xl transition-colors">확률과 통계</button>
                  <button onClick={() => alert('준비 중입니다.')} className="text-left px-4 py-2 hover:bg-gray-50 rounded-xl transition-colors">기하</button>
                </div>
              </div>
            </div>
            
            {user ? (
              <div className="flex items-center gap-4 ml-2">
                <span className="font-medium text-black">
                  {user.name} 님 환영합니다
                </span>
                {user.id === "admin" && (
                  <a href="/admin" className="text-sky-500 hover:text-sky-600 font-bold transition-colors">
                    관리자 대시보드
                  </a>
                )}
                <button
                  onClick={handleOpenEdit}
                  className="rounded-full bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 transition-colors shadow-sm"
                >
                  개인정보 수정
                </button>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-black px-4 py-2 text-white hover:bg-gray-800 transition-colors shadow-sm"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <button
                onClick={handleOpenLogin}
                className="ml-2 rounded-full bg-black px-5 py-2 text-white hover:bg-gray-800 transition-colors shadow-sm"
              >
                로그인 / 회원가입
              </button>
            )}
          </nav>
        </div>
      </header>
      <LoginModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialMode={modalMode} 
      />
    </>
  );
}
