'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoggedIn: () => boolean;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,

      // Actions
      login: (userData) => {
        set({
          user: userData,
          isAuthenticated: true,
        });

        // Cookie に認証情報を保存（SSR 対応）
        if (typeof window !== 'undefined') {
          Cookies.set('auth_token', userData.id, {
            expires: 7, // 7日間
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
          });
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });

        // Cookie から削除
        if (typeof window !== 'undefined') {
          Cookies.remove('auth_token');
        }
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      isLoggedIn: () => {
        return get().isAuthenticated;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => {
        // SSR 対応
        if (typeof window !== 'undefined') {
          return window.localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);

export default useAuthStore;
