import type { Transfer } from '../types'
import { httpClient, readResponse } from './httpClient'

export interface CreateTransferPayload {
  account_id: number
  from_account?: string
  to_account?: string
  amount?: number
  description?: string
  full_description?: string
  category?: string
  reference?: string
  transfer_type?: string
  status?: string
  transaction_date?: string
}

export type UpdateTransferPayload = Partial<CreateTransferPayload>

export const transferService = {
  getTransfers: (): Promise<Transfer[]> => readResponse(httpClient.get<Transfer[]>('/transfers')),

  createTransfer: (transfer: CreateTransferPayload): Promise<Transfer> =>
    readResponse(httpClient.post<Transfer>('/transfers', transfer)),

  updateTransfer: (id: number, transfer: UpdateTransferPayload): Promise<Transfer> =>
    readResponse(httpClient.put<Transfer>(`/transfers/${id}`, transfer)),

  deleteTransfer: async (id: number): Promise<void> => {
    await httpClient.delete(`/transfers/${id}`)
  },
}
