import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useGuestAuth } from '../../hooks/useGuestAuth'
import { AuthLoadingScreen } from './AuthLoadingScreen'

const Dashboard = lazy(() =>
  import('../dashboard/Dashboard').then((module) => ({ default: module.Dashboard })),
)
const LoginScreen = lazy(() =>
  import('./LoginScreen').then((module) => ({ default: module.LoginScreen })),
)

export function GuestAuthGate() {
  const { data, error, handleAccountUpdate, handleSignOut, handleSubmit, isAuthChecked, loading } =
    useGuestAuth()

  if (!isAuthChecked) {
    return <AuthLoadingScreen />
  }

  if (!data) {
    return (
      <Suspense fallback={<AuthLoadingScreen />}>
        <LoginScreen error={error} loading={loading} onSubmit={handleSubmit} />
      </Suspense>
    )
  }

  return (
    <Suspense fallback={<AuthLoadingScreen />}>
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              data={data}
              onAccountUpdate={handleAccountUpdate}
              onSignOut={handleSignOut}
            />
          }
        />
        <Route
          path="/accounts/:accountId"
          element={
            <Dashboard
              data={data}
              onAccountUpdate={handleAccountUpdate}
              onSignOut={handleSignOut}
            />
          }
        />
        <Route
          path="/security-center"
          element={
            <Dashboard
              data={data}
              onAccountUpdate={handleAccountUpdate}
              onSignOut={handleSignOut}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
