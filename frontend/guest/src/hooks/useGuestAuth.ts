import { isAxiosError } from 'axios'
import { useEffect, useState, type FormEvent } from 'react'
import { guestAuthService } from '../services/guestAuthService'
import type { ApiErrorResponse, GuestData } from '../types/guest'

export function useGuestAuth() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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
    setPassword('')
  }

  return {
    data,
    error,
    handleSignOut,
    handleSubmit,
    isAuthChecked,
    loading,
    login,
    password,
    setLogin,
    setPassword,
  }
}
