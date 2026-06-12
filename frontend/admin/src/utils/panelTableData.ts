import type { AccountFile, Transfer } from '../types'
import { formatCurrency, formatFileSize, formatTransactionDate } from './formatters'

export interface TransferDisplayData {
  amount: string
  date: string
  description: string
  mobileDescription: string
}

export interface FileDisplayData {
  size: string
  type: string
}

export const getTransferDisplayData = (transfer: Transfer): TransferDisplayData => ({
  amount: formatCurrency(transfer.amount),
  date: formatTransactionDate(transfer.transaction_date),
  description: transfer.description,
  mobileDescription: transfer.description || 'Описание не указано',
})

export const getFileDisplayData = (file: AccountFile): FileDisplayData => ({
  size: formatFileSize(file.size),
  type: file.type || 'Тип не указан',
})

export const filterTransfersByAccount = (
  transfers: Transfer[],
  selectedAccountId: number,
): Transfer[] => transfers.filter((transfer) => transfer.account_id === selectedAccountId)

export const filterFilesByAccount = (
  files: AccountFile[],
  selectedAccountId: number,
): AccountFile[] => files.filter((file) => file.account_id === selectedAccountId)
