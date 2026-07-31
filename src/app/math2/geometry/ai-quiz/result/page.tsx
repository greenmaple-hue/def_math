"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, Brain, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

export default function AiQuizResultPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [result, setResult] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<string>("저장 대기 중...");

  useEffect(() => {
    const stored = sessionStorage.getItem("latest_quiz_result");
    if (stored) {
      const parsed = JSON.parse(stored);
      setResult(parsed);
      saveToSupabase(parsed);
    } else {
      router.push("/math2/geometry");
    }
  }, []);

  const saveToSupabase = async (quizResult: any) => {
    if (!user || user.id === "admin") {
      setSaveStatus("로그인하지 않아 기록이 저장되지 않습니다.");
      return;
    }

    setSaveStatus("결과를 서버에 저장 중입니다...");
    
    const { error } = await supabase
      .from('ai_quiz_results')
      .insert([
        {
          student_id: user.id,
          chapter: quizResult.chapter,
          difficulty: quizResult.difficulty,
          question_count: quizResult.questionCount,
          score: quizResult.score,
          quiz_data: quizResult.quizData
        }
      ]);

    if (error) {
      console.error("Supabase Save Error:", error);
      setSaveStatus("결과 저장에 실패했습니다. (DB 테이블이 없는지 확인해주세요)");
    } else {
      setSaveStatus("학습 기록이 성공적으로 서버에 저장되었습니다.");
    }
  };

  if (!result) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">로딩 중...</div>;
  }

  const scorePercentage = Math.round((result.score / result.questionCount) * 100);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/math2/geometry" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
            <Home className="w-5 h-5" />
          </a>
          <div>
            <h1 className="text-xl font-bold text-gray-900">학습 결과 분석</h1>
            <p className="text-sm text-gray-500">{result.chapter} | 난이도: {result.difficulty}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-8 space-y-8">
        
        {/* Score Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="#f3f4f6" strokeWidth="12" fill="none" />
                <circle 
                  cx="64" cy="64" r="56" 
                  stroke={scorePercentage >= 80 ? "#22c55e" : scorePercentage >= 50 ? "#eab308" : "#ef4444"} 
                  strokeWidth="12" 
                  fill="none" 
                  strokeDasharray={`${(scorePercentage / 100) * 351} 351`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-gray-900">{scorePercentage}</span>
                <span className="text-xs font-bold text-gray-400">점</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                총 {result.questionCount}문제 중 {result.score}문제 정답!
              </h2>
              <p className="text-gray-500">
                {scorePercentage === 100 ? "완벽합니다! 다음 단원에 도전해보세요." 
                 : scorePercentage >= 80 ? "훌륭합니다! 조금만 더 다듬으면 완벽하겠어요."
                 : "틀린 문제를 다시 확인하고 복습해보세요."}
              </p>
              <p className={`text-sm font-medium pt-2 ${saveStatus.includes('성공') ? 'text-green-600' : 'text-gray-500'}`}>
                {saveStatus}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto">
            <button 
              onClick={() => router.push("/math2/geometry")}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
            >
              목록으로 돌아가기
            </button>
            <button 
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              오답 다시 풀기
            </button>
          </div>
        </div>

        {/* Question Review */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            문항별 상세 분석
          </h3>
          
          {result.quizData.map((q: any, idx: number) => (
            <div key={q.id} className={`p-6 rounded-2xl border ${q.isCorrect ? 'bg-green-50/30 border-green-100' : 'bg-red-50/30 border-red-100'}`}>
              <div className="flex gap-4 mb-4">
                <div className="pt-1">
                  {q.isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-4 leading-relaxed">
                    <span className="font-bold mr-2">Q{idx + 1}.</span>
                    {q.questionText}
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {q.options.map((opt: string, oIdx: number) => {
                      const isStudentAnswer = q.studentAnswer === oIdx;
                      const isCorrectAnswer = q.correctAnswer === oIdx;
                      
                      let btnClass = "bg-white border-gray-200 text-gray-500";
                      if (isCorrectAnswer) {
                        btnClass = "bg-green-100 border-green-400 text-green-800 font-bold ring-1 ring-green-400";
                      } else if (isStudentAnswer && !q.isCorrect) {
                        btnClass = "bg-red-50 border-red-300 text-red-700 line-through opacity-70";
                      }
                      
                      return (
                        <div key={oIdx} className={`p-3 rounded-xl border text-sm flex items-center gap-3 ${btnClass}`}>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${isStudentAnswer && !isCorrectAnswer ? 'bg-red-200' : ''}`}>
                            {isStudentAnswer && <div className="w-2 h-2 rounded-full bg-current" />}
                          </div>
                          {opt}
                        </div>
                      );
                    })}
                  </div>

                  {!q.isCorrect && (
                    <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm text-sm text-gray-600">
                      <span className="font-bold text-gray-900 block mb-1">💡 AI 해설</span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
