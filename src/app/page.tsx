import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 sm:p-16">
      <div className="w-full max-w-3xl rounded-3xl bg-white p-12 sm:p-20 shadow-lg shadow-gray-200/50 text-center flex flex-col items-center gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter text-black">
            환영합니다!
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-xl mx-auto tracking-tight">
            가장 직관적이고 아름다운 수학의 세계를 경험해보세요. 미니멀한 디자인과 압도적인 성능이 만나 새로운 기준을 제시합니다.
          </p>
        </div>
        
        <button className="group flex items-center gap-2 rounded-full bg-sky-500 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-sky-600 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">
          <span>시작하기</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
