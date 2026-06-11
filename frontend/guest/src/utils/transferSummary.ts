import type { Transfer } from '../types/guest'
import { formatSignedCurrency, getTransferDate, getTransferDescription } from './formatters'

export interface TransferSummary {
  amount: number
  amountText: string
  date: string
  isPositive: boolean
  label: string
  meta: string
}

export const getLatestTransferSummary = (
  transfers: Transfer[],
  fallbackDescription: string,
): TransferSummary => {
  const latestTransfer = transfers[0]
  const amount = latestTransfer?.amount ?? 10
  const date = getTransferDate(latestTransfer)

  return {
    amount,
    amountText: formatSignedCurrency(amount),
    date,
    isPositive: amount >= 0,
    label: getTransferDescription(latestTransfer, fallbackDescription),
    meta: date || latestTransfer?.status.trim() || '',
  }
}
