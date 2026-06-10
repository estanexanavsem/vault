import { useEffect } from 'react'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'

export function useAuthSession() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isAuthChecked = useAuthStore((s) => s.isAuthChecked)
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated)
  const setAuthChecked = useAuthStore((s) => s.setAuthChecked)

  useEffect(() => {
    let isMounted = true

    authService
      .checkSession()
      .then(() => {
        if (isMounted) {
          setAuthenticated(true)
        }
      })
      .catch(() => {
        if (isMounted) {
          setAuthenticated(false)
        }
      })
      .finally(() => {
        if (isMounted) {
          setAuthChecked(true)
        }
      })

    return () => {
      isMounted = false
    }
  }, [setAuthenticated, setAuthChecked])

  return {
    isAuthenticated,
    isAuthChecked,
    setAuthenticated,
  }
}
