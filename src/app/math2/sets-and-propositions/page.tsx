"use client";

import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import AiQuizForm from "@/components/AiQuizForm";

export default function SetsAndPropositionsPage() {
  const [expandedChapter, setExpandedChapter] = useState<number>(1);
  const [expandedSub, setExpandedSub] = useState<number>(1);

  const getChapterName = (mainTitle: string, subTitle: string) => {
    return `공통수학 2 - 집합과 명제 - ${mainTitle} - ${subTitle}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/math2" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div>
            <h1 className="text-xl font-bold text-gray-900">II. 집합과 명제</h1>
            <p className="text-sm text-gray-500">학습할 소단원을 선택하세요.</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-8">
        <div className="space-y-4">
          
          {/* Chapter 1: 집합 */}
          <div className="bg-white rounded-2xl shadow-sm border border-sky-200 overflow-hidden ring-1 ring-sky-50">
            <button 
              onClick={() => {
                setExpandedChapter(expandedChapter === 1 ? 0 : 1);
                setExpandedSub(1);
              }}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors text-left"
            >
              <span className={`text-lg font-bold ${expandedChapter === 1 ? "text-sky-900" : "text-gray-900"}`}>1. 집합</span>
              {expandedChapter === 1 ? <ChevronDown className="text-sky-500" /> : <ChevronRight className="text-gray-400" />}
            </button>
            {expandedChapter === 1 && (
              <div className="px-6 pb-6 space-y-3">
                {[
                  { id: 1, title: "01. 집합" },
                  { id: 2, title: "02. 집합 사이의 포함 관계" },
                  { id: 3, title: "03. 합집합과 교집합" },
                  { id: 4, title: "04. 여집합과 차집합" }
                ].map(sub => (
                  <div key={sub.id} className={`rounded-xl overflow-hidden border ${expandedSub === sub.id ? "bg-sky-50/50 border-sky-100" : "bg-gray-50 border-gray-100"}`}>
                    <button 
                      onClick={() => setExpandedSub(expandedSub === sub.id ? 0 : sub.id)}
                      className={`w-full flex items-center gap-3 p-4 transition-colors text-left ${expandedSub === sub.id ? "hover:bg-sky-50" : "hover:bg-gray-100"}`}
                    >
                      <span className={`text-sm ${expandedSub === sub.id ? "font-bold text-sky-700" : "font-semibold text-gray-500"}`}>{sub.title}</span>
                    </button>
                    {expandedSub === sub.id && (
                      <div className="p-6 pt-2">
                        <AiQuizForm chapter={getChapterName("1. 집합", sub.title)} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chapter 2: 명제 */}
          <div className="bg-white rounded-2xl shadow-sm border border-sky-200 overflow-hidden ring-1 ring-sky-50">
            <button 
              onClick={() => {
                setExpandedChapter(expandedChapter === 2 ? 0 : 2);
                setExpandedSub(1);
              }}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors text-left"
            >
              <span className={`text-lg font-bold ${expandedChapter === 2 ? "text-sky-900" : "text-gray-900"}`}>2. 명제</span>
              {expandedChapter === 2 ? <ChevronDown className="text-sky-500" /> : <ChevronRight className="text-gray-400" />}
            </button>
            {expandedChapter === 2 && (
              <div className="px-6 pb-6 space-y-3">
                {[
                  { id: 1, title: "01. 명제와 조건" },
                  { id: 2, title: "02. 명제 사이의 관계" },
                  { id: 3, title: "03. 명제의 증명" }
                ].map(sub => (
                  <div key={sub.id} className={`rounded-xl overflow-hidden border ${expandedSub === sub.id ? "bg-sky-50/50 border-sky-100" : "bg-gray-50 border-gray-100"}`}>
                    <button 
                      onClick={() => setExpandedSub(expandedSub === sub.id ? 0 : sub.id)}
                      className={`w-full flex items-center gap-3 p-4 transition-colors text-left ${expandedSub === sub.id ? "hover:bg-sky-50" : "hover:bg-gray-100"}`}
                    >
                      <span className={`text-sm ${expandedSub === sub.id ? "font-bold text-sky-700" : "font-semibold text-gray-500"}`}>{sub.title}</span>
                    </button>
                    {expandedSub === sub.id && (
                      <div className="p-6 pt-2">
                        <AiQuizForm chapter={getChapterName("2. 명제", sub.title)} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
      </main>
    </div>
  );
}
