import { httpClient } from './httpClient'
import { readResponse } from './httpClient'

export interface PanelLoginResponse {
  success: boolean
  token: string
  expires_at: string
}

export interface PanelLogoutResponse {
  success: boolean
}

export interface PanelSessionResponse {
  success: boolean
}

export const authService = {
  login: (password: string): Promise<PanelLoginResponse> =>
    readResponse(httpClient.post<PanelLoginResponse>('/panel/login', { password })),

  checkSession: (): Promise<PanelSessionResponse> =>
    readResponse(httpClient.get<PanelSessionResponse>('/panel/session')),

  logout: (): Promise<PanelLogoutResponse> =>
    readResponse(httpClient.post<PanelLogoutResponse>('/panel/logout')),
}
