import type { Settings, SettingsUpdateResult } from '../types'
import { httpClient, readResponse } from './httpClient'

export type UpdateSettingsPayload = Record<string, string>

export const settingsService = {
  getSettings: (): Promise<Settings> => readResponse(httpClient.get<Settings>('/settings')),

  updateSettings: (settings: UpdateSettingsPayload): Promise<SettingsUpdateResult> =>
    readResponse(httpClient.put<SettingsUpdateResult>('/settings', settings)),
}
