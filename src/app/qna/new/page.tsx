"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Image as ImageIcon, Send, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

const SUBJECTS = ["공통수학 1", "공통수학 2", "대수", "미적분 1", "미적분 2", "확률과 통계", "기하"];

function NewQnaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const initialSubject = searchParams.get("subject") || "";
  const validSubject = SUBJECTS.includes(initialSubject) ? initialSubject : SUBJECTS[0];
  
  const [subject, setSubject] = useState(validSubject);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If not logged in, show warning
  if (user === undefined) {
    return null;
  }

  if (user === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-xl font-bold mb-4">로그인이 필요합니다.</h2>
        <button onClick={() => window.history.back()} className="px-4 py-2 bg-gray-200 rounded-lg">돌아가기</button>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      let image_url = null;
      
      // Upload image if exists
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('qna_images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('qna_images')
          .getPublicUrl(filePath);
          
        image_url = publicUrl;
      }

      // Insert post
      const { error: insertError } = await supabase
        .from('qna_posts')
        .insert([{
          title,
          content,
          subject,
          image_url,
          author_id: user.id,
          author_name: user.name || "학생"
        }]);

      if (insertError) throw insertError;

      alert("질문이 성공적으로 등록되었습니다.");
      router.push("/qna");
      
    } catch (error: any) {
      console.error(error);
      alert("등록 중 오류가 발생했습니다: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">새 질문 작성하기</h1>
      </header>

      <main className="max-w-3xl w-full mx-auto p-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">과목 선택</label>
            <select 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {SUBJECTS.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">제목</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="질문 제목을 입력하세요"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">내용</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="모르는 문제나 개념에 대해 자세히 적어주세요."
              rows={8}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">사진 첨부 (선택)</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200">
                <ImageIcon className="w-4 h-4" />
                이미지 파일 선택
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden"
                />
              </label>
              {file && <span className="text-sm text-gray-500 truncate max-w-[200px]">{file.name}</span>}
            </div>
            
            {preview && (
              <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden max-w-sm">
                <img src={preview} alt="Preview" className="w-full h-auto" />
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-black hover:bg-gray-800 text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {isSubmitting ? "등록 중..." : "질문 등록하기"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function NewQnaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>}>
      <NewQnaForm />
    </Suspense>
  );
}
