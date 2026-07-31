"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(p => (p + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center p-8 sm:p-16 overflow-hidden">
      
      {/* Background Animation Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        
        {/* Phase 0: Circles */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${phase === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <circle cx="30%" cy="30%" r="150" fill="none" stroke="#bae6fd" strokeWidth="1.5" className="animate-draw-fast" />
            <circle cx="70%" cy="60%" r="200" fill="none" stroke="#c7d2fe" strokeWidth="2" className="animate-draw" />
            <circle cx="40%" cy="80%" r="100" fill="none" stroke="#fbcfe8" strokeWidth="1.5" className="animate-draw-delayed" />
          </svg>
        </div>

        {/* Phase 1: Venn Diagram */}
        <div className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center ${phase === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" className="w-full h-full max-w-2xl pointer-events-none opacity-80">
            {/* Intersection Area */}
            <path d="M 200 86.6 A 100 100 0 0 0 200 213.4 A 100 100 0 0 0 200 86.6 Z" fill="#bae6fd" className="animate-fill" />
            {/* Left Circle A */}
            <circle cx="150" cy="150" r="100" fill="none" stroke="#94a3b8" strokeWidth="2" className="animate-draw" />
            {/* Right Circle B */}
            <circle cx="250" cy="150" r="100" fill="none" stroke="#94a3b8" strokeWidth="2" className="animate-draw-delayed" />
            
            {/* Labels */}
            <text x="100" y="150" fill="#94a3b8" fontSize="24" className="animate-fill font-serif">A</text>
            <text x="300" y="150" fill="#94a3b8" fontSize="24" className="animate-fill font-serif">B</text>
          </svg>
        </div>

        {/* Phase 2: Graphs */}
        <div className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center ${phase === 2 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full opacity-60 pointer-events-none">
            {/* Axes */}
            <line x1="50" y1="0" x2="50" y2="100" stroke="#cbd5e1" strokeWidth="0.2" className="animate-draw-fast" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#cbd5e1" strokeWidth="0.2" className="animate-draw-fast" />
            
            {/* Rational function style */}
            <path d="M 50,0 Q 55,45 100,50" fill="none" stroke="#bae6fd" strokeWidth="0.5" className="animate-draw-delayed" />
            <path d="M 0,50 Q 45,55 50,100" fill="none" stroke="#bae6fd" strokeWidth="0.5" className="animate-draw-delayed" />
            
            {/* Irrational function style */}
            <path d="M 50,50 Q 75,25 100,20" fill="none" stroke="#c7d2fe" strokeWidth="0.5" className="animate-draw" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-3xl rounded-3xl bg-white/80 backdrop-blur-xl p-12 sm:p-20 shadow-xl shadow-gray-200/50 text-center flex flex-col items-center gap-8 border border-white/40">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter text-black">
            환영합니다!
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-xl mx-auto tracking-tight">
            가장 직관적이고 아름다운 수학의 세계를 경험해보세요.
          </p>
        </div>
        
        <a href="/math2" className="group flex items-center gap-2 rounded-full bg-sky-300 px-8 py-4 text-sm font-bold text-sky-900 transition-all hover:bg-sky-400 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2">
          <span>공통수학 2 학습하기</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
}
