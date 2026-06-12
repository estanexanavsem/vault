import { useEffect, useState } from 'react'
import { guestAuthService } from '../services/guestAuthService'
import type { GuestData, MasterAccount } from '../types/guest'
import { notifyRequestError } from '../utils/notifications'
import { getLoginRequestErrorMessage, normalizeRequestError } from '../utils/requestError'

export function useGuestAuth() {
  const [data, setData] = useState<GuestData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isAuthChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    guestAuthService
      .checkSession({ signal: controller.signal })
      .then((sessionData) => {
        if (isMounted) {
          setData(sessionData)
        }
      })
      .catch((error: unknown) => {
        const requestError = normalizeRequestError(error)

        if (requestError.kind === 'canceled') {
          return
        }

        if (isMounted) {
          setData(null)

          if (
            requestError.kind === 'network' ||
            requestError.kind === 'server' ||
            requestError.kind === 'timeout'
          ) {
            notifyRequestError(error, {
              id: 'guest-session-check',
              title: "We couldn't verify your session",
            })
          }
        }
      })
      .finally(() => {
        if (isMounted) {
          setAuthChecked(true)
        }
      })

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [])

  const handleSubmit = async (login: string, password: string) => {
    setLoading(true)
    setError('')
    try {
      const responseData = await guestAuthService.login(login, password)
      setData(responseData)
    } catch (error: unknown) {
      const requestError = normalizeRequestError(error)

      if (requestError.kind === 'validation' || requestError.kind === 'auth') {
        setError(getLoginRequestErrorMessage(error))
        return
      }

      notifyRequestError(error, {
        id: 'guest-login',
        title: "We couldn't sign you in",
      })
      setError(requestError.userMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    void guestAuthService.logout().catch((error: unknown) => {
      notifyRequestError(error, {
        id: 'guest-logout',
        title: "We couldn't finish signing out",
      })
    })
    setData(null)
  }

  const handleAccountUpdate = (account: MasterAccount) => {
    setData((current) => (current ? { ...current, master: account } : current))
  }

  return {
    data,
    error,
    handleAccountUpdate,
    handleSignOut,
    handleSubmit,
    isAuthChecked,
    loading,
  }
}
