import { isAxiosError } from 'axios'

interface ApiErrorResponse {
  error?: string
}

export const getErrorMessage = (error: unknown) => {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.error ?? error.message
  }
  return error instanceof Error ? error.message : 'Запрос не выполнен'
}
