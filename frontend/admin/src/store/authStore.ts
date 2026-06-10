import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  isAuthChecked: boolean
  setAuthenticated: (value: boolean) => void
  setAuthChecked: (value: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isAuthChecked: false,
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setAuthChecked: (value) => set({ isAuthChecked: value }),
}))
