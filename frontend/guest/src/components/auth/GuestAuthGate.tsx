import { Navigate, Route, Routes } from 'react-router-dom'
import { useGuestAuth } from '../../hooks/useGuestAuth'
import { Dashboard } from '../dashboard/Dashboard'
import { AuthLoadingScreen } from './AuthLoadingScreen'
import { LoginScreen } from './LoginScreen'

export function GuestAuthGate() {
  const { data, error, handleAccountUpdate, handleSignOut, handleSubmit, isAuthChecked, loading } =
    useGuestAuth()

  if (!isAuthChecked) {
    return <AuthLoadingScreen />
  }

  if (!data) {
    return <LoginScreen error={error} loading={loading} onSubmit={handleSubmit} />
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Dashboard data={data} onAccountUpdate={handleAccountUpdate} onSignOut={handleSignOut} />
        }
      />
      <Route
        path="/accounts/:accountId"
        element={
          <Dashboard data={data} onAccountUpdate={handleAccountUpdate} onSignOut={handleSignOut} />
        }
      />
      <Route
        path="/security-center"
        element={
          <Dashboard data={data} onAccountUpdate={handleAccountUpdate} onSignOut={handleSignOut} />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
