import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  guestLoginOptions,
  guestLogoutOptions,
  guestQueryKeys,
  guestSessionOptions,
} from '../queries/guestAuthOptions'
import { notifyRequestError } from '../utils/notifications'
import { getLoginRequestErrorMessage, normalizeRequestError } from '../utils/requestError'

export function useGuestAuth() {
  const queryClient = useQueryClient()
  const [error, setError] = useState('')
  const [isSessionQueryEnabled, setSessionQueryEnabled] = useState(true)
  const sessionQuery = useQuery({
    ...guestSessionOptions(),
    enabled: isSessionQueryEnabled,
  })
  const loginMutation = useMutation({
    ...guestLoginOptions(),
    onSuccess: (sessionData) => {
      setSessionQueryEnabled(true)
      queryClient.setQueryData(guestQueryKeys.session(), sessionData)
    },
  })
  const logoutMutation = useMutation(guestLogoutOptions())

  useEffect(() => {
    if (!sessionQuery.isError) {
      return
    }

    const requestError = normalizeRequestError(sessionQuery.error)

    if (
      requestError.kind === 'network' ||
      requestError.kind === 'server' ||
      requestError.kind === 'timeout'
    ) {
      notifyRequestError(sessionQuery.error, {
        id: 'guest-session-check',
        title: "We couldn't verify your session",
      })
    }
  }, [sessionQuery.error, sessionQuery.isError])

  const handleSubmit = async (login: string, password: string) => {
    setError('')
    try {
      await loginMutation.mutateAsync({ login, password })
    } catch (error: unknown) {
      const requestError = normalizeRequestError(error)

      if (requestError.kind === 'validation' || requestError.kind === 'auth') {
        setError(getLoginRequestErrorMessage(error))
        return
      }

      notifyRequestError(error, {
        id: 'guest-login',
        title: "We couldn't sign you in",
      })
      setError(requestError.userMessage)
    }
  }

  const handleSignOut = () => {
    setSessionQueryEnabled(false)
    queryClient.removeQueries({ queryKey: guestQueryKeys.session() })

    void logoutMutation.mutateAsync().catch((error: unknown) => {
      notifyRequestError(error, {
        id: 'guest-logout',
        title: "We couldn't finish signing out",
      })
    })
  }

  return {
    data: sessionQuery.data ?? null,
    error,
    handleSignOut,
    handleSubmit,
    isAuthChecked: !isSessionQueryEnabled || !sessionQuery.isPending,
    loading: loginMutation.isPending,
  }
}
