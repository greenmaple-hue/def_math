"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { fetchUsers, registerUser, updateUser, useAuth, User } from "@/lib/auth";

type ModalMode = "login" | "signup" | "edit";

export default function LoginModal({ 
  isOpen, 
  onClose, 
  initialMode = "login" 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  initialMode?: ModalMode;
}) {
  const [mode, setMode] = useState<ModalMode>(initialMode);
  const { user, login } = useAuth(); // Changed setUser to login from zustand

  // Form states
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [school, setSchool] = useState("부산항공고등학교");

  // Error state
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setMode(initialMode);
      setError("");
      if (initialMode === "edit" && user) {
        setId(user.id);
        setName(user.name);
        setSchool(user.school);
        setPw(user.password || "");
      } else {
        setId("");
        setPw("");
        setName("");
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialMode, user]);

  const validateStudentId = (studentId: string) => {
    if (studentId === "admin") return true;
    if (school !== "부산항공고등학교") return true;
    const regex = /^[1-3][1-6](0[1-9]|1[0-6])$/;
    return regex.test(studentId);
  };

  const validatePassword = (password: string) => {
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    return specialCharRegex.test(password);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (id === "admin" && pw === "260301") {
      login({ id: "admin", name: "관리자", school: "System", password: pw });
      setIsLoading(false);
      onClose();
      window.location.href = "/admin";
      return;
    }

    const users = await fetchUsers();
    const foundUser = users.find(u => u.id === id && u.password === pw);

    if (foundUser) {
      login(foundUser);
      onClose();
    } else {
      setError("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!name.trim()) {
      setError("이름을 입력해주세요.");
      setIsLoading(false);
      return;
    }
    if (!validateStudentId(id)) {
      setError("유효하지 않은 부산항공고등학교 학번입니다. (예: 1학년 1반 1번 -> 1101)");
      setIsLoading(false);
      return;
    }
    if (!validatePassword(pw)) {
      setError("비밀번호에는 특수문자가 최소 1개 이상 포함되어야 합니다.");
      setIsLoading(false);
      return;
    }

    const users = await fetchUsers();
    if (users.find(u => u.id === id)) {
      setError("이미 가입된 학번입니다.");
      setIsLoading(false);
      return;
    }

    const newUser: User = { id, name, school, password: pw };
    const success = await registerUser(newUser);
    
    if (success) {
      alert("회원가입이 완료되었습니다. 로그인해주세요.");
      setMode("login");
      setPw("");
    } else {
      setError("서버 통신 오류로 회원가입에 실패했습니다.");
    }
    setIsLoading(false);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!user) {
      setIsLoading(false);
      return;
    }
    if (!validateStudentId(id)) {
      setError("유효하지 않은 학번입니다.");
      setIsLoading(false);
      return;
    }
    if (!validatePassword(pw)) {
      setError("비밀번호에는 특수문자가 최소 1개 이상 포함되어야 합니다.");
      setIsLoading(false);
      return;
    }

    const users = await fetchUsers();
    if (id !== user.id && users.find(u => u.id === id)) {
      setError("이미 존재하는 학번으로는 변경할 수 없습니다.");
      setIsLoading(false);
      return;
    }

    // Since ID is primary key in Supabase, updating ID directly requires deleting and re-inserting or cascade rules.
    // For simplicity, we just update the password and keep the same ID for now, or just warn them.
    if (id !== user.id) {
      setError("현재 학번 변경은 지원되지 않습니다. 비밀번호만 변경 가능합니다.");
      setIsLoading(false);
      return;
    }

    const success = await updateUser(user.id, { password: pw });
    if (success) {
      const updatedUser = { ...user, password: pw };
      login(updatedUser);
      alert("개인정보가 수정되었습니다.");
      onClose();
    } else {
      setError("서버 통신 오류로 정보 수정에 실패했습니다.");
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            {mode === "login" && "로그인"}
            {mode === "signup" && "회원가입"}
            {mode === "edit" && "개인정보 수정"}
          </h2>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {mode === "login" && (
            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">아이디 (학번)</label>
                <input 
                  type="text" 
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:bg-white focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all"
                  placeholder="학번을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
                <input 
                  type="password" 
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:bg-white focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
              
              <div className="pt-2 flex flex-col gap-3">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-sky-500 py-3.5 text-sm font-semibold text-white hover:bg-sky-600 transition-colors shadow-sm disabled:opacity-50"
                >
                  {isLoading ? "처리 중..." : "로그인"}
                </button>
                <button 
                  type="button"
                  onClick={() => setMode("signup")}
                  className="w-full rounded-xl bg-white border border-gray-200 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  회원가입
                </button>
              </div>
            </form>
          )}

          {mode === "signup" && (
            <form className="space-y-4" onSubmit={handleSignup}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:bg-white focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all"
                  placeholder="이름을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">소속 학교</label>
                <select 
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:bg-white focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all"
                >
                  <option value="부산항공고등학교">부산항공고등학교</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  학번 <span className="text-sky-500 text-[11px] ml-1 font-normal">* 아이디로 설정됩니다 (4자리)</span>
                </label>
                <input 
                  type="text"
                  maxLength={4} 
                  value={id}
                  onChange={(e) => setId(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:bg-white focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all"
                  placeholder="예: 20240001 (1학년 1반 1번 -> 1101)"
                />
                <p className="mt-1 text-[11px] text-gray-500">규칙: 첫자리(1~3), 둘째자리(1~6), 끝두자리(01~16)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호 <span className="text-sky-500 text-[11px] ml-1 font-normal">* 특수문자 포함</span>
                </label>
                <input 
                  type="password" 
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:bg-white focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all"
                  placeholder="특수문자가 포함된 비밀번호"
                />
              </div>
              
              <div className="pt-4 flex flex-col gap-3">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-black py-3.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50"
                >
                  {isLoading ? "처리 중..." : "가입하기"}
                </button>
                <button 
                  type="button"
                  onClick={() => setMode("login")}
                  className="w-full rounded-xl bg-white border border-gray-200 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  로그인으로 돌아가기
                </button>
              </div>
            </form>
          )}

          {mode === "edit" && (
            <form className="space-y-4" onSubmit={handleEdit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                <input 
                  type="text" 
                  value={name}
                  disabled
                  className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">소속 학교</label>
                <input 
                  type="text" 
                  value={school}
                  disabled
                  className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  새 학번 <span className="text-sky-500 text-[11px] ml-1 font-normal">* 변경 불가</span>
                </label>
                <input 
                  type="text"
                  maxLength={4} 
                  value={id}
                  disabled
                  className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  새 비밀번호 <span className="text-sky-500 text-[11px] ml-1 font-normal">* 특수문자 포함</span>
                </label>
                <input 
                  type="password" 
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:bg-white focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all"
                  placeholder="특수문자가 포함된 비밀번호"
                />
              </div>
              
              <div className="pt-4 flex flex-col gap-3">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-black py-3.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50"
                >
                  {isLoading ? "처리 중..." : "수정 완료"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
