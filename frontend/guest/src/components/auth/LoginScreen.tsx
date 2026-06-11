import { AlertCircle, LockKeyhole, UserRound } from 'lucide-react'
import type { FormEvent } from 'react'
import { TruistMark } from '../common/TruistMark'
import styles from './auth.module.css'

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
    <main className={styles.screen}>
      <section className={styles.panel} aria-labelledby="login-title">
        <div className={styles.brand}>
          <TruistMark className={styles.brandMark} />
          <div>
            <p>Truist</p>
            <h1 id="login-title">Guest access</h1>
          </div>
        </div>

        <form className={styles.form} onSubmit={onSubmit}>
          {error && (
            <div className={styles.errorBanner} role="alert">
              <AlertCircle size={18} aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <label className={styles.field}>
            <span>Login</span>
            <span className={styles.inputShell}>
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

          <label className={styles.field}>
            <span>Password</span>
            <span className={styles.inputShell}>
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

          <button className={styles.submitButton} disabled={loading} type="submit">
            {loading ? 'Checking access...' : 'Enter'}
          </button>
        </form>
      </section>
    </main>
  )
}
