import { create } from 'zustand';
import { supabase } from './supabase';

export interface User {
  id: string; // 학번 또는 admin
  name: string;
  school: string;
  password?: string; // 클라이언트에서는 비밀번호를 숨기는 것이 좋으나, 과제 요구사항상 포함
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

// 1. Zustand Store (상태 관리)
export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  login: (user) => {
    localStorage.setItem("currentUser", JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem("currentUser");
    set({ user: null });
  },
}));

// 초기화: 클라이언트 마운트 시 로컬스토리지 확인
if (typeof window !== "undefined") {
  const stored = localStorage.getItem("currentUser");
  if (stored) {
    try {
      useAuth.setState({ user: JSON.parse(stored), isLoading: false });
    } catch {
      useAuth.setState({ isLoading: false });
    }
  } else {
    useAuth.setState({ isLoading: false });
  }
}

// 2. Supabase DB 연동 함수들

export const fetchUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    console.error("Error fetching users from Supabase:", error);
    return [];
  }
  return data as User[];
};

export const registerUser = async (user: User): Promise<boolean> => {
  const { error } = await supabase.from('users').insert([user]);
  if (error) {
    console.error("Error registering user to Supabase:", error);
    return false;
  }
  return true;
};

export const updateUser = async (id: string, updates: Partial<User>): Promise<boolean> => {
  const { error } = await supabase.from('users').update(updates).eq('id', id);
  if (error) {
    console.error("Error updating user in Supabase:", error);
    return false;
  }
  return true;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) {
    console.error("Error deleting user from Supabase:", error);
    return false;
  }
  return true;
};
