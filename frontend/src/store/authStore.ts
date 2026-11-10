import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  getCurrentUser,
  loginRequest,
  logoutRequest,
} from '../features/auth/api/auth'
import type { AuthUser } from '../features/auth/types/auth.types'

interface AuthState {
  user: AuthUser | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,

      login: async (username, password) => {
        await loginRequest(username, password)
        const user = await getCurrentUser()

        set({ user, loading: false })
      },

      logout: async () => {
        try {
          await logoutRequest()
        } finally {
          set({ user: null, loading: false })
        }
      },

      checkSession: async () => {
        try {
          const user = await getCurrentUser()
          set({ user, loading: false })
        } catch {
          set({ user: null, loading: false })
        }
      },

      clearSession: () => set({ user: null, loading: false }),
    }),
    {
      name: 'food-store-auth',
      partialize: (state) => ({ user: state.user }),
    },
  ),
)