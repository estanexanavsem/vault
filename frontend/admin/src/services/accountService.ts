import type { Account } from '../types'
import { httpClient, readResponse } from './httpClient'

export interface CreateAccountPayload {
  login: string
  password: string
  holder_name?: string
  account_name?: string
  full_account_name?: string
  account_number?: string
  routing_number?: string
  email?: string
  phone?: string
}

export type UpdateAccountPayload = Partial<CreateAccountPayload>

export const accountService = {
  getAccounts: (): Promise<Account[]> => readResponse(httpClient.get<Account[]>('/accounts')),

  getAccount: (id: number): Promise<Account> =>
    readResponse(httpClient.get<Account>(`/accounts/${id}`)),

  createAccount: (account: CreateAccountPayload): Promise<Account> =>
    readResponse(httpClient.post<Account>('/accounts', account)),

  updateAccount: (id: number, account: UpdateAccountPayload): Promise<Account> =>
    readResponse(httpClient.put<Account>(`/accounts/${id}`, account)),

  deleteAccount: async (id: number): Promise<void> => {
    await httpClient.delete(`/accounts/${id}`)
  },
}
