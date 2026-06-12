import { mutationOptions, queryOptions } from '@tanstack/react-query'
import { guestAuthService, type GuestProfileUpdatePayload } from '../services/guestAuthService'

interface LoginVariables {
  login: string
  password: string
}

export const guestQueryKeys = {
  all: ['guest'] as const,
  session: () => [...guestQueryKeys.all, 'session'] as const,
}

export const guestSessionOptions = () =>
  queryOptions({
    queryKey: guestQueryKeys.session(),
    queryFn: ({ signal }) => guestAuthService.checkSession({ signal }),
  })

export const guestLoginOptions = () =>
  mutationOptions({
    mutationFn: ({ login, password }: LoginVariables) => guestAuthService.login(login, password),
    mutationKey: ['guest', 'login'],
  })

export const guestLogoutOptions = () =>
  mutationOptions({
    mutationFn: guestAuthService.logout,
    mutationKey: ['guest', 'logout'],
  })

export const guestProfileUpdateOptions = () =>
  mutationOptions({
    mutationFn: (payload: GuestProfileUpdatePayload) => guestAuthService.updateProfile(payload),
    mutationKey: ['guest', 'profile'],
  })
