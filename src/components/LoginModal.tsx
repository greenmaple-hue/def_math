"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

type ModalMode = "login" | "signup";

export default function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<ModalMode>("login");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setMode("login"); // Reset to login when opened
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            {mode === "login" ? "로그인" : "회원가입"}
          </h2>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          {mode === "login" ? (
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
                <input 
                  type="text" 
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:bg-white focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all"
                  placeholder="아이디를 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
                <input 
                  type="password" 
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:bg-white focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
              
              <div className="pt-2 flex flex-col gap-3">
                <button 
                  type="submit"
                  className="w-full rounded-xl bg-sky-500 py-3.5 text-sm font-semibold text-white hover:bg-sky-600 transition-colors shadow-sm"
                >
                  로그인
                </button>
                <button 
                  type="button"
                  onClick={() => setMode("signup")}
                  className="w-full rounded-xl bg-white border border-gray-200 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  회원가입
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                <input 
                  type="text" 
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:bg-white focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all"
                  placeholder="이름을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">소속 학교</label>
                <input 
                  type="text" 
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:bg-white focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all"
                  placeholder="학교 이름을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  학번 <span className="text-sky-500 text-[11px] ml-1 font-normal">* 아이디로 설정됩니다</span>
                </label>
                <input 
                  type="text" 
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:bg-white focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all"
                  placeholder="학번을 입력하세요 (예: 20240001)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호 <span className="text-sky-500 text-[11px] ml-1 font-normal">* 생년월일 6자리</span>
                </label>
                <input 
                  type="password" 
                  maxLength={6}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:bg-white focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all"
                  placeholder="YYMMDD"
                />
              </div>
              
              <div className="pt-4 flex flex-col gap-3">
                <button 
                  type="submit"
                  className="w-full rounded-xl bg-black py-3.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors shadow-sm"
                >
                  가입하기
                </button>
                <button 
                  type="button"
                  onClick={() => setMode("login")}
                  className="w-full rounded-xl bg-white border border-gray-200 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  이전으로 돌아가기
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
