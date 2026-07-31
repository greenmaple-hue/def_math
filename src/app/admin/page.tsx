"use client";

import { useEffect, useState } from "react";
import { User, fetchUsers, updateUser, deleteUser, useAuth } from "@/lib/auth";
import { ChevronRight, ChevronDown, School, Users, User as UserIcon } from "lucide-react";

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Tree state
  const [expandedSchools, setExpandedSchools] = useState<Record<string, boolean>>({});
  const [expandedGrades, setExpandedGrades] = useState<Record<string, boolean>>({});
  const [expandedClasses, setExpandedClasses] = useState<Record<string, boolean>>({});

  // States for actions
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    
    // Basic protection
    if (!user || user.id !== "admin") {
      alert("접근 권한이 없습니다.");
      window.location.href = "/";
      return;
    }
    
    const loadUsers = async () => {
      const data = await fetchUsers();
      setUsers(data);
    };
    loadUsers();
  }, [user, isLoading]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-gray-500">로딩 중...</p></div>;
  }

  if (!user || user.id !== "admin") return null;

  const validatePassword = (password: string) => {
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    return specialCharRegex.test(password);
  };

  const handleUpdatePassword = async () => {
    if (!selectedUser) return;
    if (!validatePassword(newPassword)) {
      return alert("비밀번호에는 특수문자가 최소 1개 이상 포함되어야 합니다.");
    }
    
    const success = await updateUser(selectedUser.id, { password: newPassword });
    if (success) {
      const updatedUsers = users.map(u => 
        u.id === selectedUser.id ? { ...u, password: newPassword } : u
      );
      setUsers(updatedUsers);
      setSelectedUser({ ...selectedUser, password: newPassword });
      setNewPassword("");
      alert("비밀번호가 성공적으로 변경되었습니다.");
    } else {
      alert("비밀번호 변경에 실패했습니다. DB 연결을 확인해주세요.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!selectedUser) return;
    if (deletePassword !== "260301") {
      return alert("관리자 비밀번호가 일치하지 않습니다.");
    }

    const success = await deleteUser(selectedUser.id);
    if (success) {
      const updatedUsers = users.filter(u => u.id !== selectedUser.id);
      setUsers(updatedUsers);
      setSelectedUser(null);
      setShowDeleteConfirm(false);
      setDeletePassword("");
      alert("계정이 성공적으로 삭제되었습니다.");
    } else {
      alert("계정 삭제에 실패했습니다. DB 연결을 확인해주세요.");
    }
  };

  // Build Hierarchy: School -> Grade -> Class -> User[]
  // ID format: 1st digit = grade, 2nd digit = class
  const hierarchy: Record<string, Record<string, Record<string, User[]>>> = {};
  
  users.forEach(u => {
    if (u.id === "admin") return;
    
    const schoolName = u.school;
    const grade = u.id.charAt(0) || "Unknown";
    const classNum = u.id.charAt(1) || "Unknown";
    
    if (!hierarchy[schoolName]) hierarchy[schoolName] = {};
    if (!hierarchy[schoolName][grade]) hierarchy[schoolName][grade] = {};
    if (!hierarchy[schoolName][grade][classNum]) hierarchy[schoolName][grade][classNum] = [];
    
    hierarchy[schoolName][grade][classNum].push(u);
  });

  const toggleSchool = (school: string) => setExpandedSchools(prev => ({ ...prev, [school]: !prev[school] }));
  const toggleGrade = (gradeKey: string) => setExpandedGrades(prev => ({ ...prev, [gradeKey]: !prev[gradeKey] }));
  const toggleClass = (classKey: string) => setExpandedClasses(prev => ({ ...prev, [classKey]: !prev[classKey] }));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">관리자 대시보드</h1>
          <a href="/" className="text-sky-500 hover:text-sky-600 font-medium">홈으로 돌아가기</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tree List */}
          <div className="md:col-span-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col h-[600px] overflow-hidden">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-4">학생 가입 명단</h2>
            <div className="overflow-y-auto flex-1 pr-2 space-y-2">
              {Object.keys(hierarchy).length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">가입된 학생이 없습니다.</p>
              ) : (
                Object.entries(hierarchy).map(([schoolName, grades]) => (
                  <div key={schoolName} className="space-y-1">
                    <button 
                      onClick={() => toggleSchool(schoolName)}
                      className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left font-semibold text-gray-800"
                    >
                      {expandedSchools[schoolName] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      <School className="w-4 h-4 text-sky-500" />
                      {schoolName}
                    </button>
                    
                    {expandedSchools[schoolName] && (
                      <div className="pl-6 space-y-1">
                        {Object.entries(grades).map(([grade, classes]) => {
                          const gradeKey = `${schoolName}-${grade}`;
                          return (
                            <div key={gradeKey} className="space-y-1">
                              <button 
                                onClick={() => toggleGrade(gradeKey)}
                                className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left text-sm font-medium text-gray-700"
                              >
                                {expandedGrades[gradeKey] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                {grade}학년
                              </button>

                              {expandedGrades[gradeKey] && (
                                <div className="pl-4 space-y-1">
                                  {Object.entries(classes).map(([classNum, studentList]) => {
                                    const classKey = `${gradeKey}-${classNum}`;
                                    return (
                                      <div key={classKey} className="space-y-1">
                                        <button 
                                          onClick={() => toggleClass(classKey)}
                                          className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left text-sm text-gray-600"
                                        >
                                          {expandedClasses[classKey] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                          <Users className="w-3 h-3 text-indigo-400" />
                                          {classNum}반
                                        </button>

                                        {expandedClasses[classKey] && (
                                          <div className="pl-6 space-y-1">
                                            {studentList.map(student => (
                                              <button
                                                key={student.id}
                                                onClick={() => {
                                                  setSelectedUser(student);
                                                  setShowDeleteConfirm(false);
                                                  setNewPassword("");
                                                }}
                                                className={`w-full flex items-center gap-2 p-2 text-sm rounded-lg transition-colors text-left ${
                                                  selectedUser?.id === student.id 
                                                    ? "bg-sky-50 text-sky-700 font-semibold" 
                                                    : "hover:bg-gray-50 text-gray-600"
                                                }`}
                                              >
                                                <UserIcon className="w-3 h-3" />
                                                {student.name} ({student.id})
                                              </button>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* User Detail Panel */}
          <div className="md:col-span-2">
            {selectedUser ? (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8 h-[600px] overflow-y-auto">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">학생 상세 정보</h2>
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <div className="text-gray-500">이름</div>
                    <div className="font-medium text-gray-900">{selectedUser.name}</div>
                    
                    <div className="text-gray-500">소속 학교</div>
                    <div className="font-medium text-gray-900">{selectedUser.school}</div>
                    
                    <div className="text-gray-500">학번 (아이디)</div>
                    <div className="font-medium text-gray-900">{selectedUser.id}</div>
                    
                    <div className="text-gray-500">현재 비밀번호</div>
                    <div className="font-medium text-gray-900">{selectedUser.password}</div>
                  </div>
                </div>

                {/* Password Change Action */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4">비밀번호 강제 변경</h3>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="새 비밀번호 (특수문자 포함)"
                      className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                    <button
                      onClick={handleUpdatePassword}
                      className="rounded-xl bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
                    >
                      변경하기
                    </button>
                  </div>
                </div>

                {/* Delete Action */}
                <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                  <h3 className="font-semibold text-red-700 mb-2">위험 구역</h3>
                  <p className="text-sm text-red-600/80 mb-4">
                    계정을 삭제하면 데이터를 복구할 수 없습니다. 신중하게 결정해주세요.
                  </p>
                  
                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors shadow-sm"
                    >
                      계정 삭제 모드 활성화
                    </button>
                  ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                      <div className="bg-white rounded-xl p-4 border border-red-200 text-sm">
                        <strong className="text-red-700 block mb-1">정말 삭제하시겠습니까?</strong>
                        이 작업은 취소할 수 없습니다. 계속하려면 <strong>관리자 비밀번호</strong>를 한 번 더 입력해주세요.
                      </div>
                      <div className="flex gap-3">
                        <input
                          type="password"
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          placeholder="관리자 비밀번호"
                          className="flex-1 rounded-xl border border-red-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        />
                        <button
                          onClick={handleDeleteAccount}
                          className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors shadow-sm"
                        >
                          영구 삭제
                        </button>
                        <button
                          onClick={() => {
                            setShowDeleteConfirm(false);
                            setDeletePassword("");
                          }}
                          className="rounded-xl bg-white border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 h-full flex flex-col items-center justify-center text-gray-400">
                <div className="mb-4">
                  <svg className="w-16 h-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p>좌측 트리를 열어 학생을 선택해주세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
