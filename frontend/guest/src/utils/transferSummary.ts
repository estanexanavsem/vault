import type { Transfer } from '../types/guest'
import { formatSignedCurrency, getTransferDate, getTransferDescription } from './formatters'
import { toOptionalText } from './text'

export interface TransferSummary {
  amount: number
  amountText: string
  category?: string
  date: string
  fullDescription?: string
  isPositive: boolean
  label: string
  meta: string
  reference?: string
  transferType?: string
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
    category: toOptionalText(latestTransfer?.category),
    date,
    fullDescription: toOptionalText(latestTransfer?.full_description),
    isPositive: amount >= 0,
    label: getTransferDescription(latestTransfer, fallbackDescription),
    meta: date || latestTransfer?.status.trim() || '',
    reference: toOptionalText(latestTransfer?.reference),
    transferType: toOptionalText(latestTransfer?.transfer_type),
  }
}
