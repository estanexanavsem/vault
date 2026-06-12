import { useAuthSession } from '../hooks/useAuthSession'
import { AdminShell } from './AdminShell'
import { AuthLoadingScreen } from './AuthLoadingScreen'
import { LoginPage } from './LoginPage'

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
