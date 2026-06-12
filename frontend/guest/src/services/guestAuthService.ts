import type {
  GuestData,
  GuestLoginResponse,
  GuestLogoutResponse,
  GuestProfileUpdateResponse,
  GuestSessionResponse,
  MasterAccount,
} from '../types/guest'
import { httpClient, readResponse } from './httpClient'

interface GuestSessionOptions {
  signal?: AbortSignal
}

export type GuestProfileUpdatePayload =
  | {
      email: string
      phone?: never
    }
  | {
      email?: never
      phone: string
    }

export const guestAuthService = {
  login: async (login: string, password: string): Promise<GuestData> => {
    const response = await readResponse(
      httpClient.post<GuestLoginResponse>('/guest/login', { login, password }),
    )

    if (!response.success) {
      throw new Error(response.error ?? 'Invalid credentials')
    }

    return response.data
  },

  checkSession: async (options: GuestSessionOptions = {}): Promise<GuestData> => {
    const response = await readResponse(
      httpClient.get<GuestSessionResponse>('/guest/session', {
        signal: options.signal,
      }),
    )

    if (!response.success) {
      throw new Error(response.error ?? 'Session expired')
    }

    return {
      master: response.master,
      transfers: response.transfers,
      files: response.files,
    }
  },

  logout: (): Promise<GuestLogoutResponse> =>
    readResponse(httpClient.post<GuestLogoutResponse>('/guest/logout')),

  updateProfile: async (payload: GuestProfileUpdatePayload): Promise<MasterAccount> => {
    const response = await readResponse(
      httpClient.put<GuestProfileUpdateResponse>('/guest/profile', payload),
    )

    if (!response.success) {
      throw new Error(response.error ?? 'Could not update profile')
    }

    return response.master
  },
}
