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

const notifySessionCheckError = (error: unknown) => {
  if (!error) {
    return
  }

  const requestError = normalizeRequestError(error)

  if (
    requestError.kind === 'network' ||
    requestError.kind === 'server' ||
    requestError.kind === 'timeout'
  ) {
    notifyRequestError(error, {
      id: 'guest-session-check',
      title: "We couldn't verify your session",
    })
  }
}

export function useGuestAuth() {
  const queryClient = useQueryClient()
  const [error, setError] = useState('')
  const [isSessionQueryEnabled, setSessionQueryEnabled] = useState(true)
  const {
    data: sessionData,
    error: sessionError,
    isPending: isSessionPending,
  } = useQuery({
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
    notifySessionCheckError(sessionError)
  }, [sessionError])

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
    data: sessionData ?? null,
    error,
    handleSignOut,
    handleSubmit,
    isAuthChecked: !isSessionQueryEnabled || !isSessionPending,
    loading: loginMutation.isPending,
  }
}
