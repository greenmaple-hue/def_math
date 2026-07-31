"use client";

import { useState } from "react";
import { Brain, Play } from "lucide-react";
import { useRouter } from "next/navigation";

interface AiQuizFormProps {
  chapter: string;
}

export default function AiQuizForm({ chapter }: AiQuizFormProps) {
  const router = useRouter();
  const [difficulties, setDifficulties] = useState<string[]>(["중"]);
  const [questionCount, setQuestionCount] = useState<number>(5);

  const handleStartAiQuiz = () => {
    const searchParams = new URLSearchParams({
      chapter,
      difficulty: difficulties.join(","),
      count: questionCount.toString()
    });
    router.push(`/math2/ai-quiz?${searchParams.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden mt-4">
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
          <label className="block text-sm font-semibold text-gray-700 mb-3">난이도 선택 (중복 가능)</label>
          <div className="flex flex-wrap gap-2">
            {["최하", "하", "중", "상", "최상"].map((level) => {
              const isSelected = difficulties.includes(level);
              return (
                <button
                  key={level}
                  onClick={() => {
                    setDifficulties(prev => {
                      if (prev.includes(level)) {
                        if (prev.length === 1) return prev; // prevent emptying
                        return prev.filter(d => d !== level);
                      } else {
                        return [...prev, level];
                      }
                    });
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isSelected 
                      ? "bg-purple-600 text-white shadow-md shadow-purple-200" 
                      : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {level}
                </button>
              );
            })}
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
  );
}
