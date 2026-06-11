import { isAxiosError } from 'axios'
import { useEffect, useState, type FormEvent } from 'react'
import { LoginScreen } from './components/auth/LoginScreen'
import { Dashboard } from './components/dashboard/Dashboard'
import { guestAuthService } from './services/guestAuthService'
import type { ApiErrorResponse, GuestData } from './types/guest'

function AuthLoadingScreen() {
  return <main className="login-screen" aria-label="Checking session" />
}

function App() {
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

  if (!isAuthChecked) {
    return <AuthLoadingScreen />
  }

  if (data) {
    return <Dashboard data={data} onSignOut={handleSignOut} />
  }

  return (
    <LoginScreen
      error={error}
      loading={loading}
      login={login}
      password={password}
      onLoginChange={setLogin}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
    />
  )
}

export default App
