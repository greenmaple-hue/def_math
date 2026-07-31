"use client";

import { useState, useEffect } from "react";

export interface User {
  id: string; // 학번 (아이디로 사용)
  name: string;
  school: string;
  password?: string; // 클라이언트 사이드 mock이므로 해싱은 생략하거나 간단히 저장
}

const USERS_KEY = "def_math_users";
const CURRENT_USER_KEY = "def_math_current_user";

export function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveUsers(users: User[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function setCurrentUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
  window.dispatchEvent(new Event("auth-change"));
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial load
    setUser(getCurrentUser());
    setIsLoading(false);

    // Listen to changes
    const handleAuthChange = () => setUser(getCurrentUser());
    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, []);

  return { user, setUser: setCurrentUser, isLoading };
}
