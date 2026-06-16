import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, LoaderCircle, LockKeyhole, UserRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { TruistMark } from '../common/TruistMark'
import styles from './LoginScreen.module.css'

interface LoginScreenProps {
  error: string
  loading: boolean
  onSubmit: (login: string, password: string) => Promise<void>
}

const loginSchema = z.object({
  login: z.string().trim().min(1, 'Enter your login.'),
  password: z.string().min(1, 'Enter your password.'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginScreen({ error, loading, onSubmit }: LoginScreenProps) {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    defaultValues: {
      login: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  })
  const isBusy = loading || isSubmitting

  const submitLogin = async (values: LoginFormValues) => {
    await onSubmit(values.login.trim(), values.password)
  }

  return (
    <main className={styles.screen}>
      <section className={styles.panel} aria-labelledby="login-title">
        <div className={styles.brand}>
          <TruistMark className={styles.mark} />
          <div>
            <p>Truist</p>
            <h1 id="login-title">Guest access</h1>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(submitLogin)}>
          <label className={styles.field}>
            <span>Login</span>
            <span className={styles.shell}>
              <UserRound size={18} aria-hidden="true" />
              <input
                {...register('login')}
                autoCapitalize="none"
                autoComplete="username"
                autoCorrect="off"
                aria-invalid={errors.login ? 'true' : undefined}
                placeholder="Enter your login"
                required
                type="text"
              />
            </span>
            {errors.login?.message ? (
              <span className={styles.error}>{errors.login.message}</span>
            ) : null}
          </label>

          <label className={styles.field}>
            <span>Password</span>
            <span className={styles.shell}>
              <LockKeyhole size={18} aria-hidden="true" />
              <input
                {...register('password')}
                autoCapitalize="none"
                autoComplete="current-password"
                autoCorrect="off"
                aria-invalid={errors.password ? 'true' : undefined}
                placeholder="Enter your password"
                required
                type="password"
              />
            </span>
            {errors.password?.message ? (
              <span className={styles.error}>{errors.password.message}</span>
            ) : null}
          </label>

          {error && (
            <div className={styles.alert} role="alert">
              <AlertCircle size={18} aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <button
            className={styles.submit}
            disabled={isBusy}
            type="submit"
            aria-label={isBusy ? 'Checking access' : undefined}
          >
            {isBusy ? (
              <LoaderCircle className="motion-safe:animate-spin" size={20} aria-hidden="true" />
            ) : (
              'Enter'
            )}
          </button>
        </form>
      </section>
    </main>
  )
}
