import { useAuthSession } from '../hooks/useAuthSession'
import LoginPage from './LoginPage'
import AdminShell from './AdminShell'

function AuthLoadingScreen() {
  return <div className="min-h-screen bg-slate-950" />
}

function AuthGate() {
  const { isAuthenticated, isAuthChecked, setAuthenticated } = useAuthSession()

  if (!isAuthChecked) {
    return <AuthLoadingScreen />
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setAuthenticated(true)} />
  }

  return <AdminShell />
}

export default AuthGate
