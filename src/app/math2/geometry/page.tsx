"use client";

import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronRight, Play, Brain, Gamepad2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GeometryPage() {
  const router = useRouter();
  const [expandedChapter, setExpandedChapter] = useState<number>(3);
  const [expandedSub, setExpandedSub] = useState<number>(2);

  // AI Quiz Form State
  const [difficulty, setDifficulty] = useState<"최하"|"하"|"중"|"상"|"최상">("중");
  const [questionCount, setQuestionCount] = useState<number>(5);

  const handleStartAiQuiz = () => {
    // Navigate to AI quiz page with query params
    const searchParams = new URLSearchParams({
      difficulty,
      count: questionCount.toString()
    });
    router.push(`/math2/geometry/ai-quiz?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/math2" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div>
            <h1 className="text-xl font-bold text-gray-900">I. 도형의 방정식</h1>
            <p className="text-sm text-gray-500">학습할 소단원을 선택하세요.</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-8">
        <div className="space-y-4">
          
          {/* Chapter 1 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button 
              onClick={() => setExpandedChapter(expandedChapter === 1 ? 0 : 1)}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors text-left"
            >
              <span className="text-lg font-bold text-gray-900">1. 평면좌표와 직선의 방정식</span>
              {expandedChapter === 1 ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
            </button>
            {expandedChapter === 1 && (
              <div className="px-6 pb-6 text-gray-500 text-sm">
                준비 중입니다.
              </div>
            )}
          </div>

          {/* Chapter 2 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button 
              onClick={() => setExpandedChapter(expandedChapter === 2 ? 0 : 2)}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors text-left"
            >
              <span className="text-lg font-bold text-gray-900">2. 원의 방정식</span>
              {expandedChapter === 2 ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
            </button>
            {expandedChapter === 2 && (
              <div className="px-6 pb-6 text-gray-500 text-sm">
                준비 중입니다.
              </div>
            )}
          </div>

          {/* Chapter 3 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden border-sky-200 ring-1 ring-sky-50">
            <button 
              onClick={() => setExpandedChapter(expandedChapter === 3 ? 0 : 3)}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors text-left"
            >
              <span className="text-lg font-bold text-sky-900">3. 도형의 이동</span>
              {expandedChapter === 3 ? <ChevronDown className="text-sky-500" /> : <ChevronRight className="text-sky-500" />}
            </button>
            
            {expandedChapter === 3 && (
              <div className="px-6 pb-6 space-y-3">
                {/* Sub 1 */}
                <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                  <button 
                    onClick={() => setExpandedSub(expandedSub === 1 ? 0 : 1)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-gray-100 transition-colors text-left"
                  >
                    <span className="text-sm font-semibold text-gray-500">01. 평행이동</span>
                  </button>
                  {expandedSub === 1 && (
                    <div className="p-4 pt-0 text-sm text-gray-500">
                      준비 중입니다.
                    </div>
                  )}
                </div>

                {/* Sub 2 */}
                <div className="bg-sky-50/50 rounded-xl overflow-hidden border border-sky-100">
                  <button 
                    onClick={() => setExpandedSub(expandedSub === 2 ? 0 : 2)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-sky-50 transition-colors text-left"
                  >
                    <span className="text-sm font-bold text-sky-700">02. 대칭이동</span>
                  </button>
                  
                  {expandedSub === 2 && (
                    <div className="p-6 border-t border-sky-100/50 flex flex-col gap-6">
                      
                      {/* Game Link */}
                      <a 
                        href="/math2/geometry/game" 
                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white rounded-2xl border border-sky-100 shadow-sm hover:shadow-md transition-all hover:border-sky-300 gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-sky-50 text-sky-500 rounded-xl group-hover:bg-sky-500 group-hover:text-white transition-colors">
                            <Gamepad2 className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 group-hover:text-sky-700 transition-colors">정리하기 - 데칼코마니 게임</h3>
                            <p className="text-sm text-gray-500">대칭이동의 개념을 시각적으로 복습해보세요.</p>
                          </div>
                        </div>
                        <div className="hidden sm:flex p-2 text-sky-400 group-hover:text-sky-600 transition-colors group-hover:translate-x-1">
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </a>

                      {/* AI Quiz Form */}
                      <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-purple-50 bg-gradient-to-r from-purple-50/50 to-white flex items-center gap-3">
                          <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <Brain className="w-5 h-5" />
                          </div>
                          <h3 className="font-bold text-gray-900">AI 생성 문제 풀기</h3>
                          <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full ml-auto">2022 개정 교육과정 반영</span>
                        </div>
                        
                        <div className="p-6 space-y-6">
                          {/* Difficulty */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">난이도 선택</label>
                            <div className="flex flex-wrap gap-2">
                              {["최하", "하", "중", "상", "최상"].map((level) => (
                                <button
                                  key={level}
                                  onClick={() => setDifficulty(level as any)}
                                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                    difficulty === level 
                                      ? "bg-purple-600 text-white shadow-md shadow-purple-200" 
                                      : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                                  }`}
                                >
                                  {level}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Question Count Slider */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <label className="block text-sm font-semibold text-gray-700">문제 수</label>
                              <span className="text-purple-600 font-bold">{questionCount} 문제</span>
                            </div>
                            <input 
                              type="range" 
                              min="1" 
                              max="20" 
                              value={questionCount}
                              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                              <span>1문제</span>
                              <span>20문제</span>
                            </div>
                          </div>
                          
                          {/* Submit */}
                          <button 
                            onClick={handleStartAiQuiz}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-md transition-colors"
                          >
                            <Play className="w-4 h-4" />
                            AI 문제 생성 및 풀기
                          </button>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
        </div>
      </main>
    </div>
  );
}
