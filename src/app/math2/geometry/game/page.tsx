"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

type Point = { x: number; y: number };

const INITIAL_SHAPE: Point[] = [
  { x: 2, y: 5 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: -1 }, 
  { x: 3, y: -1 }, { x: 3, y: 1 }, { x: 4, y: 1 }
];

const SVG_SIZE = 500;
const GRID_SIZE = 20; 
const STEP = SVG_SIZE / GRID_SIZE; 

export default function GeometryGamePage() {
  const { user } = useAuth();
  const [currentShape, setCurrentShape] = useState<Point[]>(INITIAL_SHAPE);
  const [targetShape, setTargetShape] = useState<Point[]>([]);
  const [moves, setMoves] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const transform = (type: "x-axis" | "y-axis" | "origin" | "y=x", shape: Point[]) => {
    return shape.map(p => {
      switch (type) {
        case "x-axis": return { x: p.x, y: -p.y };
        case "y-axis": return { x: -p.x, y: p.y };
        case "origin": return { x: -p.x, y: -p.y };
        case "y=x": return { x: p.y, y: p.x };
      }
    });
  };

  const handleTransform = (type: "x-axis" | "y-axis" | "origin" | "y=x") => {
    if (isSuccess) return;
    setCurrentShape(prev => transform(type, prev));
    setMoves(m => m + 1);
  };

  const generateTarget = () => {
    let shape = INITIAL_SHAPE;
    const types: ("x-axis" | "y-axis" | "origin" | "y=x")[] = ["x-axis", "y-axis", "origin", "y=x"];
    const numTransforms = Math.floor(Math.random() * 2) + 1; 
    
    for (let i = 0; i < numTransforms; i++) {
      const randomType = types[Math.floor(Math.random() * types.length)];
      shape = transform(randomType, shape);
    }
    
    if (JSON.stringify(shape) === JSON.stringify(INITIAL_SHAPE)) {
      shape = transform("y-axis", shape);
    }
    
    setTargetShape(shape);
    setCurrentShape(INITIAL_SHAPE);
    setMoves(0);
    setIsSuccess(false);
    setSaveMessage("");
  };

  useEffect(() => {
    generateTarget();
  }, []);

  const saveResultToSupabase = async (finalMoves: number) => {
    if (!user || user.id === "admin") {
      setSaveMessage("학습 데이터는 학생 계정으로만 저장됩니다.");
      return;
    }
    
    setSaveMessage("서버에 결과를 저장 중입니다...");
    
    const { error } = await supabase
      .from('geometry_game_results')
      .insert([
        {
          student_id: user.id,
          student_name: user.name,
          school: user.school,
          moves_count: finalMoves
        }
      ]);

    if (error) {
      console.error("Supabase Error:", error);
      setSaveMessage("데이터 저장에 실패했습니다. (DB 연결 확인 필요)");
    } else {
      setSaveMessage("결과가 성공적으로 서버에 저장되었습니다!");
    }
  };

  useEffect(() => {
    if (targetShape.length > 0 && JSON.stringify(currentShape) === JSON.stringify(targetShape)) {
      setIsSuccess(true);
      saveResultToSupabase(moves);
    }
  }, [currentShape, targetShape]);

  const toSvgX = (x: number) => (x + 10) * STEP;
  const toSvgY = (y: number) => (10 - y) * STEP;

  const pointsToSvgPolygon = (shape: Point[]) => {
    return shape.map(p => `${toSvgX(p.x)},${toSvgY(p.y)}`).join(" ");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/math2/geometry" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div>
            <h1 className="text-xl font-bold text-gray-900">정리하기 - 데칼코마니 게임</h1>
            <p className="text-sm text-gray-500">대칭이동을 이용해 반투명한 목표 비행기와 겹쳐보세요!</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 bg-white rounded-2xl p-8 border border-sky-100 shadow-sm w-full max-w-5xl">
          {/* Game Board */}
          <div className="relative bg-gray-50 rounded-3xl shadow-inner border border-gray-200 overflow-hidden" style={{ width: SVG_SIZE, height: SVG_SIZE }}>
            <svg width={SVG_SIZE} height={SVG_SIZE} className="absolute inset-0 pointer-events-none">
              {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => (
                <g key={i}>
                  <line 
                    x1={i * STEP} y1={0} x2={i * STEP} y2={SVG_SIZE} 
                    stroke={i === 10 ? "#94a3b8" : "#f1f5f9"} 
                    strokeWidth={i === 10 ? 2 : 1} 
                  />
                  <line 
                    x1={0} y1={i * STEP} x2={SVG_SIZE} y2={i * STEP} 
                    stroke={i === 10 ? "#94a3b8" : "#f1f5f9"} 
                    strokeWidth={i === 10 ? 2 : 1} 
                  />
                </g>
              ))}
              
              <line 
                x1={0} y1={SVG_SIZE} x2={SVG_SIZE} y2={0} 
                stroke="#e2e8f0" strokeWidth="2" strokeDasharray="5,5" 
              />
              <text x={SVG_SIZE - 40} y={30} fill="#94a3b8" fontSize="12" className="font-mono">y = x</text>
              <text x={SVG_SIZE - 20} y={SVG_SIZE / 2 - 10} fill="#94a3b8" fontSize="12" className="font-bold">x</text>
              <text x={SVG_SIZE / 2 + 10} y={20} fill="#94a3b8" fontSize="12" className="font-bold">y</text>

              <polygon 
                points={pointsToSvgPolygon(targetShape)} 
                fill="#cbd5e1" 
                className="opacity-50 transition-all duration-500"
              />
              
              <polygon 
                points={pointsToSvgPolygon(currentShape)} 
                fill={isSuccess ? "#22c55e" : "#0ea5e9"} 
                stroke={isSuccess ? "#16a34a" : "#0284c7"}
                strokeWidth="2"
                className="transition-all duration-500 ease-out"
              />
            </svg>

            {isSuccess && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                <div className="text-4xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">성공입니다!</h2>
                <p className="text-gray-600 mb-2">총 {moves}번의 이동으로 목표에 도달했습니다.</p>
                
                {saveMessage && (
                  <p className={`text-sm mb-6 ${saveMessage.includes('실패') ? 'text-red-600' : 'text-sky-600 font-medium'}`}>
                    {saveMessage}
                  </p>
                )}

                <button 
                  onClick={generateTarget}
                  className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl shadow-sm transition-transform hover:-translate-y-1"
                >
                  다음 단계 도전
                </button>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="w-full lg:w-64 flex flex-col gap-4">
            <div className="bg-sky-50/50 rounded-3xl p-6 shadow-sm border border-sky-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900">대칭이동 조작반</h3>
                <button 
                  onClick={generateTarget}
                  className="p-2 hover:bg-sky-100 text-sky-600 rounded-full transition-colors"
                  title="새로운 목표"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                <button 
                  disabled={isSuccess}
                  onClick={() => handleTransform("x-axis")}
                  className="w-full py-3 px-4 bg-white text-sky-700 hover:bg-sky-50 rounded-xl font-medium transition-colors border border-sky-100 disabled:opacity-50 shadow-sm"
                >
                  x축 대칭이동
                </button>
                <button 
                  disabled={isSuccess}
                  onClick={() => handleTransform("y-axis")}
                  className="w-full py-3 px-4 bg-white text-sky-700 hover:bg-sky-50 rounded-xl font-medium transition-colors border border-sky-100 disabled:opacity-50 shadow-sm"
                >
                  y축 대칭이동
                </button>
                <button 
                  disabled={isSuccess}
                  onClick={() => handleTransform("origin")}
                  className="w-full py-3 px-4 bg-white text-sky-700 hover:bg-sky-50 rounded-xl font-medium transition-colors border border-sky-100 disabled:opacity-50 shadow-sm"
                >
                  원점 대칭이동
                </button>
                <button 
                  disabled={isSuccess}
                  onClick={() => handleTransform("y=x")}
                  className="w-full py-3 px-4 bg-white text-sky-700 hover:bg-sky-50 rounded-xl font-medium transition-colors border border-sky-100 disabled:opacity-50 shadow-sm"
                >
                  y = x 대칭이동
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">이동 횟수</span>
                <span className="text-2xl font-bold text-gray-900">{moves}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
