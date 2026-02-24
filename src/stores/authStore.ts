/**
 * Auth Store (Zustand)
 * 
 * WHY ZUSTAND?
 * - Minimal boilerplate compared to Redux (no actions/reducers/providers)
 * - Built-in persistence middleware for localStorage
 * - Simple API: just define state + actions in one place
 * - Great TypeScript support out of the box
 * - Lightweight (~1KB) — perfect for a fresher-level project
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || 'Invalid credentials');
          }

          const data = await res.json();
          set({
            token: data.accessToken,
            user: {
              id: data.id,
              username: data.username,
              email: data.email,
              firstName: data.firstName,
              lastName: data.lastName,
              image: data.image,
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },

      logout: () => {
        set({ token: null, user: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
