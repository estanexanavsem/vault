import { httpClient, readResponse } from './httpClient'

export type SettingsMap = Record<string, string>

export type UpdateSettingsPayload = SettingsMap

export const settingsService = {
  getSettings: (): Promise<SettingsMap> => readResponse(httpClient.get<SettingsMap>('/settings')),

  updateSettings: (settings: UpdateSettingsPayload): Promise<void> =>
    readResponse(httpClient.put('/settings', settings)),

  deleteTransferCategory: (category: string): Promise<void> =>
    readResponse(
      httpClient.delete(`/settings/transfer-categories/${encodeURIComponent(category)}`),
    ),
}
