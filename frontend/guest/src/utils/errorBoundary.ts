import type { ErrorInfo } from 'react'

export const logBoundaryError = (error: unknown, info: ErrorInfo) => {
  console.error('Unexpected UI error', {
    componentStack: info.componentStack,
    error,
  })
}
