import { create } from 'zustand';

/**
 * 用户信息类型（后续会从后端 API 获取）
 */
export interface User {
  id: number;
  username: string;
  email: string;
  profile?: {
    height?: number;
    weight?: number;
    age?: number;
    gender?: 'male' | 'female';
  } | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * 认证状态接口
 */
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

/**
 * 认证 Store
 * 使用 Zustand 管理用户认证状态
 */
export const useAuthStore = create<AuthState>((set) => ({
  // 初始状态
  user: null,
  token: null,
  isAuthenticated: false,

  // Actions
  login: (user, token) => {
    set({
      user,
      token,
      isAuthenticated: true,
    });
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  setUser: (user) => {
    set((state) => ({
      user,
      isAuthenticated: !!user && !!state.token,
    }));
  },
}));
