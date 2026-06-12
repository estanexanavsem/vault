import { useState, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { authService } from '../services/authService'
import { panelQueryKeys } from './usePanelData'

interface LoginErrorResponse {
  error?: string
}

interface UseLoginPageParams {
  onLogin: () => void
}

export function useLoginPage({ onLogin }: UseLoginPageParams) {
  const queryClient = useQueryClient()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: panelQueryKeys.accounts }),
        queryClient.invalidateQueries({ queryKey: panelQueryKeys.transfers }),
        queryClient.invalidateQueries({ queryKey: panelQueryKeys.files }),
      ])
      onLogin()
    },
    onError: (err: unknown) => {
      if (isAxiosError<LoginErrorResponse>(err)) {
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
