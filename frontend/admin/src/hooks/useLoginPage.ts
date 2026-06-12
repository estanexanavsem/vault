import { useState, type FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { authService } from '../services/authService'

interface UseLoginPageParams {
  onLogin: () => void
}

export function useLoginPage({ onLogin }: UseLoginPageParams) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: onLogin,
    onError: (err: unknown) => {
      if (isAxiosError<{ error?: string }>(err)) {
        setError(err.response?.data?.error ?? 'Неверный пароль')
      } else {
        setError('Неверный пароль')
      }
    },
  })

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setError('')
    loginMutation.mutate(password)
  }

  return {
    password,
    error,
    loading: loginMutation.isPending,
    setPassword,
    handleSubmit,
  }
}
