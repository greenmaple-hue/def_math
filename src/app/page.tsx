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
        <div className={`absolute inset-0 transition-opacity duration-1000 ${phase === 0 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 border-[1px] border-sky-200 rounded-full animate-[spin_10s_linear_infinite]" />
          <div className="absolute top-1/2 right-1/4 w-96 h-96 border-[2px] border-indigo-100 rounded-full" style={{ animation: 'ping 6s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
          <div className="absolute bottom-1/4 left-1/3 w-48 h-48 border-[1.5px] border-pink-100 rounded-full" />
        </div>

        {/* Phase 1: Set Symbols */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${phase === 1 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute top-1/3 left-1/4 text-8xl text-sky-200/50 font-serif rotate-12 animate-pulse">∪</div>
          <div className="absolute bottom-1/3 right-1/4 text-9xl text-indigo-200/40 font-serif -rotate-12 animate-pulse delay-75">∩</div>
          <div className="absolute top-1/2 left-1/2 text-7xl text-pink-200/50 font-serif rotate-45 animate-pulse delay-150">∈</div>
          <div className="absolute top-1/4 right-1/3 text-8xl text-gray-200/60 font-serif -rotate-6 animate-pulse delay-300">⊂</div>
        </div>

        {/* Phase 2: Graphs */}
        <div className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center ${phase === 2 ? 'opacity-100' : 'opacity-0'}`}>
          <svg className="w-full h-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Rational function style */}
            <path d="M 50,0 Q 55,45 100,50" fill="none" stroke="#bae6fd" strokeWidth="0.5" />
            <path d="M 0,50 Q 45,55 50,100" fill="none" stroke="#bae6fd" strokeWidth="0.5" />
            {/* Irrational function style */}
            <path d="M 50,50 Q 75,25 100,20" fill="none" stroke="#c7d2fe" strokeWidth="0.5" />
            {/* Axes */}
            <line x1="50" y1="0" x2="50" y2="100" stroke="#e2e8f0" strokeWidth="0.2" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#e2e8f0" strokeWidth="0.2" />
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
