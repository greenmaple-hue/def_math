"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Pencil, MessageCircle, MessageSquareWarning } from "lucide-react";
import Link from "next/link";

const SUBJECTS = ["전체", "공통수학 1", "공통수학 2", "대수", "미적분 1", "미적분 2", "확률과 통계", "기하"];

export default function QnaListPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState("전체");

  useEffect(() => {
    fetchPosts();
  }, [filterSubject]);

  const fetchPosts = async () => {
    setLoading(true);
    let query = supabase
      .from('qna_posts')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (filterSubject !== "전체") {
      query = query.eq('subject', filterSubject);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching QNA:", error);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 sm:p-16">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Header Area */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-gray-900">QNA 게시판</h1>
            <p className="text-gray-500 mt-2">모르는 문제는 언제든지 질문해 보세요.</p>
          </div>
          <Link 
            href={`/qna/new?subject=${encodeURIComponent(filterSubject)}`}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-colors whitespace-nowrap shadow-sm"
          >
            <Pencil className="w-4 h-4" />
            질문 작성하기
          </Link>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map(sub => (
            <button
              key={sub}
              onClick={() => setFilterSubject(sub)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterSubject === sub 
                  ? "bg-sky-600 text-white shadow-md shadow-sky-200" 
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="py-20 text-center text-gray-500">불러오는 중...</div>
        ) : posts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">등록된 질문이 없습니다.</h3>
            <p className="text-gray-500 mt-1">첫 번째 질문을 남겨보세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map(post => {
              const hasAnswer = !!post.answer_content;
              const dateObj = new Date(post.created_at);
              const dateStr = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;
              
              return (
                <Link 
                  href={`/qna/${post.id}`} 
                  key={post.id}
                  className={`group relative p-6 rounded-3xl border transition-all hover:shadow-md hover:-translate-y-1 flex flex-col justify-between min-h-[160px] ${
                    hasAnswer 
                      ? "bg-green-50/50 border-green-200 hover:border-green-300" // 파스텔 초록
                      : "bg-red-50/50 border-red-200 hover:border-red-300" // 파스텔 빨강
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-1 bg-white text-gray-600 text-xs font-bold rounded-md shadow-sm border border-gray-100">
                        {post.subject}
                      </span>
                      {hasAnswer ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          <CheckIcon className="w-3 h-3" />
                          답변 완료
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-100 px-2 py-1 rounded-full">
                          <MessageSquareWarning className="w-3 h-3" />
                          답변 대기
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">
                      {post.title}
                    </h2>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-4 border-t border-black/5">
                    <span className="font-medium text-gray-600 truncate mr-4">
                      {post.author_name || "학생"}
                    </span>
                    <span className="text-xs whitespace-nowrap">{dateStr}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function CheckIcon(props: any) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}
