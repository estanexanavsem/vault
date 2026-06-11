import axios from 'axios'
import { useState, type FormEvent } from 'react'
import { LoginScreen } from './components/auth/LoginScreen'
import { Dashboard } from './components/dashboard/Dashboard'
import type { ApiErrorResponse, GuestData, GuestLoginResponse } from './types/guest'

function App() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [data, setData] = useState<GuestData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data: response } = await axios.post<GuestLoginResponse>('/api/guest/login', {
        login,
        password,
      })
      if (response.success && response.data) {
        setData(response.data)
      } else {
        setError(response.error ?? 'Invalid credentials')
      }
    } catch (error: unknown) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        setError(error.response?.data?.error ?? 'Connection error')
      } else {
        setError('Connection error')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    setData(null)
    setPassword('')
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
