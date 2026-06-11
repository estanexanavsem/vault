import { AlertCircle, LockKeyhole, UserRound } from 'lucide-react'
import type { FormEvent } from 'react'
import { TruistMark } from '../common/TruistMark'

interface LoginScreenProps {
  error: string
  loading: boolean
  login: string
  password: string
  onLoginChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
}

export function LoginScreen({
  error,
  loading,
  login,
  password,
  onLoginChange,
  onPasswordChange,
  onSubmit,
}: LoginScreenProps) {
  return (
    <main className="login-screen">
      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-brand">
          <TruistMark />
          <div>
            <p>Truist</p>
            <h1 id="login-title">Guest access</h1>
          </div>
        </div>

        <form className="login-form" onSubmit={onSubmit}>
          {error && (
            <div className="error-banner" role="alert">
              <AlertCircle size={18} aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <label className="field">
            <span>Login</span>
            <span className="input-shell">
              <UserRound size={18} aria-hidden="true" />
              <input
                autoComplete="username"
                onChange={(event) => onLoginChange(event.target.value)}
                placeholder="Enter your login"
                required
                type="text"
                value={login}
              />
            </span>
          </label>

          <label className="field">
            <span>Password</span>
            <span className="input-shell">
              <LockKeyhole size={18} aria-hidden="true" />
              <input
                autoComplete="current-password"
                onChange={(event) => onPasswordChange(event.target.value)}
                placeholder="Enter your password"
                required
                type="password"
                value={password}
              />
            </span>
          </label>

          <button className="submit-button" disabled={loading} type="submit">
            {loading ? 'Checking access...' : 'Enter'}
          </button>
        </form>
      </section>
    </main>
  )
}
