"use client";

import { useState } from "react";
import LoginModal from "./LoginModal";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200/50 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-8">
          <div className="text-xl font-bold tracking-tighter">def_math</div>
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-black transition-colors">Features</a>
            <a href="#" className="hover:text-black transition-colors">Pricing</a>
            <a href="#" className="hover:text-black transition-colors">About</a>
            <button
              onClick={() => setIsModalOpen(true)}
              className="ml-2 rounded-full bg-black px-5 py-2 text-white hover:bg-gray-800 transition-colors shadow-sm"
            >
              로그인 / 회원가입
            </button>
          </nav>
        </div>
      </header>
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
