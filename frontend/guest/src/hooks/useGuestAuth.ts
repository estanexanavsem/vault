import { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { guestAuthService } from '../services/guestAuthService'
import type { ApiErrorResponse, GuestData, MasterAccount } from '../types/guest'

export function useGuestAuth() {
  const [data, setData] = useState<GuestData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isAuthChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    let isMounted = true

    guestAuthService
      .checkSession()
      .then((sessionData) => {
        if (isMounted) {
          setData(sessionData)
        }
      })
      .catch(() => {
        if (isMounted) {
          setData(null)
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
  }, [])

  const handleSubmit = async (login: string, password: string) => {
    setLoading(true)
    setError('')
    try {
      const responseData = await guestAuthService.login(login, password)
      setData(responseData)
    } catch (error: unknown) {
      if (isAxiosError<ApiErrorResponse>(error)) {
        setError(error.response?.data?.error ?? 'Connection error')
      } else if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Connection error')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    void guestAuthService.logout().catch(() => undefined)
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
