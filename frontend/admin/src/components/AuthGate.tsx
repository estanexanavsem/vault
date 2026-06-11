import { useAuthSession } from '../hooks/useAuthSession'
import { AdminShell } from './AdminShell'
import { LoginPage } from './LoginPage'

function AuthLoadingScreen() {
  return <div className="min-h-screen bg-slate-950" />
}

export function AuthGate() {
  const { isAuthenticated, isAuthChecked, setAuthenticated } = useAuthSession()

  if (!isAuthChecked) {
    return <AuthLoadingScreen />
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setAuthenticated(true)} />
  }

  return <AdminShell />
}
