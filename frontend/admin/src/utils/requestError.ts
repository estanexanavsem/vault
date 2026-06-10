import { isAxiosError } from 'axios'

export const getErrorMessage = (error: unknown) => {
  if (isAxiosError<{ error?: string }>(error)) {
    return error.response?.data?.error ?? error.message
  }
  return error instanceof Error ? error.message : 'Запрос не выполнен'
}
