import { isAxiosError } from 'axios'

export type RequestErrorKind =
  | 'auth'
  | 'canceled'
  | 'network'
  | 'server'
  | 'timeout'
  | 'unknown'
  | 'validation'

export interface NormalizedRequestError {
  code?: string
  kind: RequestErrorKind
  serverMessage?: string
  status?: number
  userMessage: string
}

const unsafeServerMessagePatterns = [/database/i, /exception/i, /internal/i, /sql/i, /stack/i]

const safeErrorMessages = new Map<string, string>([
  ['email cannot be empty', 'Enter an email address.'],
  ['email or phone required', 'Choose contact information to update.'],
  ['invalid email address', 'Enter a valid email address.'],
  ['invalid credentials', 'Invalid login or password.'],
  ['invalid request', 'Check your information and try again.'],
  ['login and password required', 'Enter your login and password.'],
])

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const readApiErrorMessage = (data: unknown): string | undefined => {
  if (!isRecord(data)) {
    return undefined
  }

  const rawMessage = typeof data.error === 'string' ? data.error : data.message
  return typeof rawMessage === 'string' && rawMessage.trim() !== '' ? rawMessage.trim() : undefined
}

const sentenceCase = (message: string) => {
  const trimmed = message.trim()

  if (trimmed === '') {
    return trimmed
  }

  const sentence = `${trimmed[0].toUpperCase()}${trimmed.slice(1)}`
  return /[.!?]$/.test(sentence) ? sentence : `${sentence}.`
}

const getSafeServerMessage = (message: string | undefined) => {
  if (!message) {
    return undefined
  }

  const safeMessage = safeErrorMessages.get(message.toLowerCase())
  if (safeMessage) {
    return safeMessage
  }

  if (unsafeServerMessagePatterns.some((pattern) => pattern.test(message))) {
    return undefined
  }

  return sentenceCase(message)
}

const getStatusKind = (status: number | undefined): RequestErrorKind => {
  if (status === 401 || status === 403) {
    return 'auth'
  }

  if (status && status >= 400 && status < 500) {
    return 'validation'
  }

  if (status && status >= 500) {
    return 'server'
  }

  return 'unknown'
}

const getDefaultMessage = (kind: RequestErrorKind) => {
  switch (kind) {
    case 'auth':
      return 'Your session has expired. Please sign in again.'
    case 'canceled':
      return 'The request was canceled.'
    case 'network':
      return "We couldn't reach the service. Check your connection and try again."
    case 'server':
      return "We couldn't complete the request right now. Try again in a moment."
    case 'timeout':
      return 'The request took too long. Try again.'
    case 'validation':
      return 'Check your information and try again.'
    case 'unknown':
      return 'Something went wrong. Try again.'
  }
}

export const normalizeRequestError = (error: unknown): NormalizedRequestError => {
  if (isAxiosError(error)) {
    const status = error.response?.status ?? error.status
    const code = error.code
    const serverMessage = readApiErrorMessage(error.response?.data)

    if (code === 'ERR_CANCELED') {
      return {
        code,
        kind: 'canceled',
        status,
        userMessage: getDefaultMessage('canceled'),
      }
    }

    if (code === 'ECONNABORTED' || code === 'ETIMEDOUT') {
      return {
        code,
        kind: 'timeout',
        status,
        userMessage: getDefaultMessage('timeout'),
      }
    }

    if (!error.response) {
      return {
        code,
        kind: 'network',
        userMessage: getDefaultMessage('network'),
      }
    }

    const kind = getStatusKind(status)
    const safeServerMessage =
      kind === 'validation' ? getSafeServerMessage(serverMessage) : undefined

    return {
      code,
      kind,
      serverMessage,
      status,
      userMessage: safeServerMessage ?? getDefaultMessage(kind),
    }
  }

  if (error instanceof Error) {
    const userMessage = getSafeServerMessage(error.message)
    return {
      kind: userMessage ? 'validation' : 'unknown',
      serverMessage: error.message,
      userMessage: userMessage ?? getDefaultMessage('unknown'),
    }
  }

  return {
    kind: 'unknown',
    userMessage: getDefaultMessage('unknown'),
  }
}

export const getLoginRequestErrorMessage = (error: unknown) => {
  const requestError = normalizeRequestError(error)

  if (requestError.status === 401 || requestError.serverMessage === 'invalid credentials') {
    return 'Invalid login or password.'
  }

  return requestError.userMessage
}

export const shouldNotifyRequestError = (error: NormalizedRequestError) =>
  error.kind === 'auth' ||
  error.kind === 'network' ||
  error.kind === 'server' ||
  error.kind === 'timeout'
