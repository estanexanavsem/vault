import { Navigate, Route, Routes } from 'react-router-dom'
import { useGuestAuth } from '../../hooks/useGuestAuth'
import { Dashboard } from '../dashboard/Dashboard'
import { AuthLoadingScreen } from './AuthLoadingScreen'
import { LoginScreen } from './LoginScreen'

export function GuestAuthGate() {
  const {
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
  } = useGuestAuth()

  if (!isAuthChecked) {
    return <AuthLoadingScreen />
  }

  if (!data) {
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

  return (
    <Routes>
      <Route path="/" element={<Dashboard data={data} onSignOut={handleSignOut} />} />
      <Route
        path="/accounts/:accountId"
        element={<Dashboard data={data} onSignOut={handleSignOut} />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
