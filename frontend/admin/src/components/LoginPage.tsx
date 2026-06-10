import { useState, type FormEvent } from 'react'
import { isAxiosError } from 'axios'
import { Paper, PasswordInput, Text, Stack, Button, Alert } from '@mantine/core'
import { Lock } from 'lucide-react'
import { authService } from '../services/authService'

interface Props {
  onLogin: () => void
}

function LoginPage({ onLogin }: Props) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await authService.login(password)
      onLogin()
    } catch (err: unknown) {
      if (isAxiosError<{ error?: string }>(err)) {
        setError(err.response?.data?.error ?? 'Неверный пароль')
      } else {
        setError('Неверный пароль')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Paper shadow="xl" p="xl" className="w-full max-w-sm rounded-xl bg-white">
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                <Lock className="text-white" size={20} />
              </div>
              <Text size="xl" fw={700}>
                Хранилище
              </Text>
            </div>
            <Text c="dimmed" size="sm">
              Введите пароль для доступа к данным
            </Text>

            {error && (
              <Alert color="red" variant="light">
                {error}
              </Alert>
            )}

            <PasswordInput
              label="Пароль"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
            />

            <Button type="submit" fullWidth loading={loading}>
              Войти
            </Button>
          </Stack>
        </form>
      </Paper>
    </div>
  )
}

export default LoginPage
