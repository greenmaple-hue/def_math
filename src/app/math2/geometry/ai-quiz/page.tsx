"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, ChevronRight, Brain } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

// 더미 문제 생성기
const generateDummyQuestions = (count: number, difficulty: string) => {
  const dummyQuestions = [];
  for (let i = 1; i <= count; i++) {
    dummyQuestions.push({
      id: i,
      questionText: `다음 점을 원점에 대하여 대칭이동한 점의 좌표를 고르시오. (문제 ${i} - 난이도: ${difficulty})`,
      options: [
        "(2, 3)",
        "(-2, 3)",
        "(-2, -3)",
        "(2, -3)"
      ],
      correctAnswer: 2, // 3번째 옵션 (0-indexed)
      explanation: "원점 대칭이동은 x좌표와 y좌표의 부호를 모두 바꾸는 변환입니다. 따라서 (2,3) -> (-2,-3)이 됩니다."
    });
  }
  return dummyQuestions;
};

import { Suspense } from "react";

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const difficulty = searchParams.get("difficulty") || "중";
  const count = parseInt(searchParams.get("count") || "5", 10);

  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 향후 실제 LLM API 연동 시 이곳에서 fetch를 수행합니다.
    setQuestions(generateDummyQuestions(count, difficulty));
  }, [count, difficulty]);

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
      chapter: "도형의 이동 - 대칭이동",
      difficulty,
      questionCount: questions.length,
      score,
      quizData,
    };

    sessionStorage.setItem("latest_quiz_result", JSON.stringify(resultSummary));
    router.push("/math2/geometry/ai-quiz/result");
  };

  if (questions.length === 0) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p>문제 생성 중...</p></div>;
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
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-purple-100 text-purple-700 font-bold rounded-lg text-sm">
                {idx + 1}
              </span>
              <h2 className="text-lg font-medium text-gray-900 leading-relaxed pt-1">
                {q.questionText}
              </h2>
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
