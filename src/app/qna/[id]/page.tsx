"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send, CheckCircle2, Loader2, MessageSquareWarning } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

export default function QnaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // For Admin Answer
  const [answerContent, setAnswerContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchPost(params.id as string);
    }
  }, [params.id]);

  const fetchPost = async (id: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('qna_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(error);
      alert("글을 불러오는데 실패했습니다.");
      router.push("/qna");
    } else {
      setPost(data);
      if (data.answer_content) {
        setAnswerContent(data.answer_content);
      }
    }
    setLoading(false);
  };

  const handleSubmitAnswer = async () => {
    if (!answerContent.trim()) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase
      .from('qna_posts')
      .update({
        answer_content: answerContent,
        answer_author_id: user?.id
      })
      .eq('id', post.id);

    if (error) {
      console.error(error);
      alert("답변 등록에 실패했습니다.");
    } else {
      alert("답변이 성공적으로 등록되었습니다.");
      fetchPost(post.id); // Reload
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  if (!post) {
    return null;
  }

  const isAdmin = user?.id === "admin";
  const hasAnswer = !!post.answer_content;
  
  const dateObj = new Date(post.created_at);
  const dateStr = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 line-clamp-1">{post.title}</h1>
            <p className="text-sm text-gray-500">{post.subject} | {post.author_name || "학생"}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-8 space-y-8">
        
        {/* Question Section */}
        <div className={`p-8 rounded-3xl border shadow-sm ${hasAnswer ? "bg-green-50/30 border-green-200" : "bg-red-50/30 border-red-200"}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 bg-white text-gray-600 text-sm font-bold rounded-lg shadow-sm border border-gray-100">
                {post.subject}
              </span>
              {hasAnswer ? (
                <span className="flex items-center gap-1 text-sm font-bold text-green-600 bg-green-100 px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="w-4 h-4" />
                  답변 완료
                </span>
              ) : (
                <span className="flex items-center gap-1 text-sm font-bold text-red-500 bg-red-100 px-3 py-1.5 rounded-full">
                  <MessageSquareWarning className="w-4 h-4" />
                  답변 대기 중
                </span>
              )}
            </div>
            <span className="text-sm text-gray-500">{dateStr}</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">{post.title}</h2>
          
          <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed mb-8">
            {post.content}
          </div>

          {post.image_url && (
            <div className="mt-6 border border-black/10 rounded-2xl overflow-hidden max-w-2xl bg-white p-2">
              <img src={post.image_url} alt="Question Attachment" className="w-full h-auto rounded-xl" />
            </div>
          )}
        </div>

        {/* Answer Section */}
        {hasAnswer && !isAdmin && (
          <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-green-400" />
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              선생님의 답변
            </h3>
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
              {post.answer_content}
            </div>
          </div>
        )}

        {/* Admin Answer Editor */}
        {isAdmin && (
          <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-400" />
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              {hasAnswer ? "답변 수정하기 (관리자)" : "답변 작성하기 (관리자)"}
            </h3>
            
            <textarea
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              placeholder="학생의 질문에 대한 답변을 작성해주세요..."
              rows={6}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4"
            />
            
            <div className="flex justify-end">
              <button
                onClick={handleSubmitAnswer}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {isSubmitting ? "등록 중..." : "답변 등록"}
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
