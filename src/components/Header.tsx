"use client";

import { useState } from "react";
import LoginModal from "./LoginModal";
import { useAuth } from "@/lib/auth";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"login" | "signup" | "edit">("login");
  const { user, logout } = useAuth();

  const handleOpenLogin = () => {
    setModalMode("login");
    setIsModalOpen(true);
  };

  const handleOpenEdit = () => {
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    alert("로그아웃 되었습니다.");
    window.location.href = "/";
  };

  const subjects = [
    { name: "공통수학 1", link: null },
    { name: "공통수학 2", link: "/math2" },
    { name: "대수", link: null },
    { name: "미적분 1", link: null },
    { name: "미적분 2", link: null },
    { name: "확률과 통계", link: null },
    { name: "기하", link: null },
  ];

  const DropdownList = () => (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-48 rounded-2xl bg-white shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 z-50">
      <div className="flex flex-col gap-1">
        {subjects.map((sub, idx) => (
          sub.link ? (
            <a key={idx} href={sub.link} className="text-left px-4 py-2 hover:bg-gray-50 rounded-xl transition-colors block text-gray-700">
              {sub.name}
            </a>
          ) : (
            <button key={idx} onClick={() => alert('준비 중입니다.')} className="text-left px-4 py-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-700">
              {sub.name}
            </button>
          )
        ))}
      </div>
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200/50 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-8 relative">
          
          {/* Left: Logo */}
          <div className="absolute left-8">
            <a href="/" className="text-xl font-bold tracking-tighter">def_math</a>
          </div>
          
          {/* Center: Menus */}
          <nav className="flex-1 flex justify-center items-center gap-8 text-sm font-medium text-gray-600">
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-black transition-colors py-4">
                학습공간
              </button>
              <DropdownList />
            </div>
            
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-black transition-colors py-4">
                학습과제
              </button>
              <DropdownList />
            </div>
            
            <a href="/qna" className="hover:text-black transition-colors py-4">
              QNA 게시판
            </a>
          </nav>

          {/* Right: User actions */}
          <div className="absolute right-8 flex items-center">
            {user ? (
              <div className="flex items-center gap-4 text-sm">
                <span className="font-medium text-black hidden sm:inline">
                  {user.name} 님
                </span>
                {user.id === "admin" && (
                  <a href="/admin" className="text-sky-500 hover:text-sky-600 font-bold transition-colors">
                    대시보드
                  </a>
                )}
                <button
                  onClick={handleOpenEdit}
                  className="rounded-full bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 transition-colors shadow-sm"
                >
                  수정
                </button>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-black px-4 py-2 text-white hover:text-gray-300 hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <button
                onClick={handleOpenLogin}
                className="rounded-full bg-black px-5 py-2 text-sm text-white hover:text-gray-300 hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
              >
                로그인 / 회원가입
              </button>
            )}
          </div>

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
