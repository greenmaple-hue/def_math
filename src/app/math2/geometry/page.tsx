"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";

type Point = { x: number; y: number };

// Simple airplane shape
const INITIAL_SHAPE: Point[] = [
  { x: 2, y: 5 },   // Nose
  { x: 0, y: 1 },   // Left Wing Tip
  { x: 1, y: 1 },   // Left Wing Inner
  { x: 1, y: -1 },  // Left Tail
  { x: 3, y: -1 },  // Right Tail
  { x: 3, y: 1 },   // Right Wing Inner
  { x: 4, y: 1 },   // Right Wing Tip
];

const SVG_SIZE = 600;
const GRID_SIZE = 20; // -10 to 10
const STEP = SVG_SIZE / GRID_SIZE; // 30px per unit

export default function GeometryGame() {
  const [currentShape, setCurrentShape] = useState<Point[]>(INITIAL_SHAPE);
  const [targetShape, setTargetShape] = useState<Point[]>([]);
  const [moves, setMoves] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  // Transformations
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
    const numTransforms = Math.floor(Math.random() * 2) + 1; // 1 or 2 transforms
    
    for (let i = 0; i < numTransforms; i++) {
      const randomType = types[Math.floor(Math.random() * types.length)];
      shape = transform(randomType, shape);
    }
    
    // Ensure it's not the exact same as initial
    if (JSON.stringify(shape) === JSON.stringify(INITIAL_SHAPE)) {
      shape = transform("y-axis", shape);
    }
    
    setTargetShape(shape);
    setCurrentShape(INITIAL_SHAPE);
    setMoves(0);
    setIsSuccess(false);
  };

  useEffect(() => {
    generateTarget();
  }, []);

  useEffect(() => {
    if (targetShape.length > 0 && JSON.stringify(currentShape) === JSON.stringify(targetShape)) {
      setIsSuccess(true);
    }
  }, [currentShape, targetShape]);

  // Convert game coordinates (-10 to 10) to SVG coordinates (0 to 600)
  const toSvgX = (x: number) => (x + 10) * STEP;
  const toSvgY = (y: number) => (10 - y) * STEP; // Y is flipped in SVG

  const pointsToSvgPolygon = (shape: Point[]) => {
    return shape.map(p => `${toSvgX(p.x)},${toSvgY(p.y)}`).join(" ");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/math2" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div>
            <h1 className="text-xl font-bold text-gray-900">도형의 방정식: 데칼코마니 게임</h1>
            <p className="text-sm text-gray-500">대칭이동을 이용해 반투명한 목표 비행기와 겹쳐보세요!</p>
          </div>
        </div>
        <button 
          onClick={generateTarget}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          새로운 목표
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-8 gap-12">
        {/* Game Board */}
        <div className="relative bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden" style={{ width: SVG_SIZE, height: SVG_SIZE }}>
          <svg width={SVG_SIZE} height={SVG_SIZE} className="absolute inset-0 pointer-events-none">
            {/* Grid lines */}
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
            
            {/* y = x line */}
            <line 
              x1={0} y1={SVG_SIZE} x2={SVG_SIZE} y2={0} 
              stroke="#e2e8f0" strokeWidth="2" strokeDasharray="5,5" 
            />
            <text x={SVG_SIZE - 40} y={30} fill="#94a3b8" fontSize="12" className="font-mono">y = x</text>
            <text x={SVG_SIZE - 20} y={SVG_SIZE / 2 - 10} fill="#94a3b8" fontSize="12" className="font-bold">x</text>
            <text x={SVG_SIZE / 2 + 10} y={20} fill="#94a3b8" fontSize="12" className="font-bold">y</text>

            {/* Target Shape */}
            <polygon 
              points={pointsToSvgPolygon(targetShape)} 
              fill="#cbd5e1" 
              className="opacity-50 transition-all duration-500"
            />
            
            {/* Current Shape */}
            <polygon 
              points={pointsToSvgPolygon(currentShape)} 
              fill={isSuccess ? "#22c55e" : "#0ea5e9"} 
              stroke={isSuccess ? "#16a34a" : "#0284c7"}
              strokeWidth="2"
              className="transition-all duration-500 ease-out"
            />
          </svg>

          {isSuccess && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
              <div className="text-4xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">성공입니다!</h2>
              <p className="text-gray-600 mb-6">총 {moves}번의 이동으로 목표에 도달했습니다.</p>
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
        <div className="w-64 flex flex-col gap-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-1">대칭이동 조작반</h3>
            <p className="text-xs text-gray-500 mb-6">아래 버튼을 눌러 비행기를 이동시키세요.</p>
            
            <div className="space-y-3">
              <button 
                disabled={isSuccess}
                onClick={() => handleTransform("x-axis")}
                className="w-full py-3 px-4 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-xl font-medium transition-colors border border-sky-100 disabled:opacity-50"
              >
                x축 대칭이동
              </button>
              <button 
                disabled={isSuccess}
                onClick={() => handleTransform("y-axis")}
                className="w-full py-3 px-4 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-xl font-medium transition-colors border border-sky-100 disabled:opacity-50"
              >
                y축 대칭이동
              </button>
              <button 
                disabled={isSuccess}
                onClick={() => handleTransform("origin")}
                className="w-full py-3 px-4 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-xl font-medium transition-colors border border-sky-100 disabled:opacity-50"
              >
                원점 대칭이동
              </button>
              <button 
                disabled={isSuccess}
                onClick={() => handleTransform("y=x")}
                className="w-full py-3 px-4 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-xl font-medium transition-colors border border-sky-100 disabled:opacity-50"
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
      </main>
    </div>
  );
}
