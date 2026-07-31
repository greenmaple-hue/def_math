export default function Math2Page() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 sm:p-16">
      <div className="mx-auto max-w-4xl space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-gray-900">
            공통수학 2
          </h1>
          <p className="text-lg text-gray-500">
            이번 학기 학습공간입니다. 원하는 단원을 선택하여 학습을 시작하세요.
          </p>
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Chapter 1 */}
          <a href="/math2/geometry" className="group flex flex-col justify-between bg-white rounded-3xl p-8 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-sky-200 hover:-translate-y-1">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-xl">
                I
              </div>
              <h2 className="text-xl font-bold text-gray-900">도형의 방정식</h2>
              <p className="text-sm text-gray-500">
                평면좌표, 직선의 방정식, 원의 방정식, 그리고 도형의 이동(대칭이동/평행이동)을 학습합니다.
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between text-sm font-semibold text-sky-500 opacity-0 transform translate-y-2 transition-all group-hover:opacity-100 group-hover:translate-y-0">
              <span>학습하기</span>
              <span>&rarr;</span>
            </div>
          </a>

          {/* Chapter 2 */}
          <a href="/math2/sets-and-propositions" className="group flex flex-col justify-between bg-white rounded-3xl p-8 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-sky-200 hover:-translate-y-1">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-sky-100 flex items-center justify-center text-gray-600 group-hover:text-sky-600 font-bold text-xl transition-colors">
                II
              </div>
              <h2 className="text-xl font-bold text-gray-900">집합과 명제</h2>
              <p className="text-sm text-gray-500">
                집합의 뜻과 표현, 집합의 연산, 그리고 명제와 조건에 대해 학습합니다.
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between text-sm font-semibold text-sky-500 opacity-0 transform translate-y-2 transition-all group-hover:opacity-100 group-hover:translate-y-0">
              <span>학습하기</span>
              <span>&rarr;</span>
            </div>
          </a>

          {/* Chapter 3 */}
          <a href="/math2/functions-and-graphs" className="group flex flex-col justify-between bg-white rounded-3xl p-8 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-sky-200 hover:-translate-y-1">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-sky-100 flex items-center justify-center text-gray-600 group-hover:text-sky-600 font-bold text-xl transition-colors">
                III
              </div>
              <h2 className="text-xl font-bold text-gray-900">함수와 그래프</h2>
              <p className="text-sm text-gray-500">
                함수의 뜻과 그래프, 합성함수와 역함수, 유리함수와 무리함수를 학습합니다.
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between text-sm font-semibold text-sky-500 opacity-0 transform translate-y-2 transition-all group-hover:opacity-100 group-hover:translate-y-0">
              <span>학습하기</span>
              <span>&rarr;</span>
            </div>
          </a>

        </div>
      </div>
    </div>
  );
}
