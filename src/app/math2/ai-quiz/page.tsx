"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, ChevronRight, Brain, Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const difficulty = searchParams.get("difficulty") || "중";
  const count = parseInt(searchParams.get("count") || "5", 10);
  const chapter = searchParams.get("chapter") || "공통수학 2";

  // Parse chapter for display (e.g. "공통수학 2 - 도형의 방정식 - 도형의 이동(대칭이동, 평행이동)")
  const chapterParts = chapter.split(" - ");
  const shortChapter = chapterParts[chapterParts.length - 1] || chapter;

  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/generate-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ difficulty, count, chapter })
        });
        
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          console.error("API Error Response:", data);
          throw new Error(data.details || data.error || "문제를 생성하는데 실패했습니다.");
        }
        
        setQuestions(data.questions);
      } catch (err: any) {
        setError(err.message);
      }
    };
    
    fetchQuestions();
  }, [count, difficulty, chapter]);

  const handleSelectOption = (qId: number, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      const confirmSubmit = window.confirm("아직 풀지 않은 문제가 있습니다. 그래도 제출하시겠습니까?");
      if (!confirmSubmit) return;
    }

    setIsSubmitting(true);

    let score = 0;
    const quizData = questions.map((q) => {
      const isCorrect = answers[q.id] === q.correctAnswer;
      if (isCorrect) score++;
      return {
        ...q,
        studentAnswer: answers[q.id] ?? null,
        isCorrect
      };
    });

    const resultSummary = {
      chapter: chapter,
      difficulty,
      questionCount: questions.length,
      score,
      quizData,
    };

    sessionStorage.setItem("latest_quiz_result", JSON.stringify(resultSummary));
    router.push("/math2/geometry/ai-quiz/result");
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <p className="text-red-500 font-bold">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg">다시 시도</button>
      </div>
    );
  }

  if (questions.length === 0 || !questions) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-6">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">AI가 문제를 생성하고 있습니다...</h2>
          <p className="text-gray-500">2022 개정 교육과정에 맞춘 최적의 문제들을 준비 중입니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-purple-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <a href="/math2/geometry" className="p-2 -ml-2 rounded-full hover:bg-purple-50 transition-colors text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              AI 맞춤형 문제 풀이
            </h1>
            <p className="text-sm text-gray-500">2022 개정 교육과정 | 난이도: {difficulty} | 총 {count}문제</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl transition-colors text-sm font-bold shadow-md disabled:opacity-50"
        >
          {isSubmitting ? "제출 중..." : "채점하기"}
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-8 space-y-8">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex gap-4 mb-6">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-purple-100 text-purple-700 font-bold rounded-lg text-sm mt-1">
                {idx + 1}
              </span>
              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs font-bold border border-gray-200">
                    난이도: {q.difficulty || difficulty}
                  </span>
                </div>
                <h2 className="text-lg font-medium text-gray-900 leading-relaxed">
                  {q.questionText}
                </h2>
                
                {q.imageSvg && (
                  <div 
                    className="w-full max-w-sm mx-auto my-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center svg-container"
                    dangerouslySetInnerHTML={{ __html: q.imageSvg }}
                  />
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-12">
              {q.options.map((opt: string, oIdx: number) => {
                const isSelected = answers[q.id] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(q.id, oIdx)}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                      isSelected 
                        ? "bg-purple-50 border-purple-400 ring-1 ring-purple-400" 
                        : "bg-white border-gray-200 hover:border-purple-200 hover:bg-purple-50/30"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected ? "border-purple-600 bg-purple-600" : "border-gray-300"
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span className={isSelected ? "text-purple-900 font-medium" : "text-gray-700"}>
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="pt-8 pb-12 flex justify-end">
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl transition-colors font-bold shadow-lg shadow-purple-200 disabled:opacity-50"
          >
            답안 제출 및 채점하기
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
}

export default function AiQuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><p>Loading...</p></div>}>
      <QuizContent />
    </Suspense>
  );
}
