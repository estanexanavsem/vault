import { toast } from 'sonner'
import {
  normalizeRequestError,
  shouldNotifyRequestError,
  type NormalizedRequestError,
} from './requestError'

interface NotifyRequestErrorOptions {
  id?: string
  notifyValidation?: boolean
  title: string
}

export const notifyRequestError = (
  error: unknown,
  { id, notifyValidation = false, title }: NotifyRequestErrorOptions,
): NormalizedRequestError => {
  const requestError = normalizeRequestError(error)

  if (notifyValidation || shouldNotifyRequestError(requestError)) {
    toast.error(title, {
      description: requestError.userMessage,
      id,
    })
  }

  return requestError
}
