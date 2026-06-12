import { useQueryClient } from '@tanstack/react-query'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'

export function useLogout() {
  const queryClient = useQueryClient()
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated)

  return async () => {
    await authService.logout().catch(() => undefined)
    queryClient.clear()
    setAuthenticated(false)
  }
}
