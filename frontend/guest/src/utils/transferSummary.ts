import type { Transfer } from '../types/guest'
import {
  formatSignedCurrency,
  formatStatusLabel,
  getTransferDate,
  getTransferDescription,
} from './formatters'
import { toOptionalText } from './text'

export interface TransferSummary {
  amount: number
  amountText: string
  category?: string
  date: string
  fullDescription?: string
  id?: number
  isPositive: boolean
  label: string
  meta: string
  reference?: string
  status: string
  transferType?: string
}

export const getTransferSummary = (transfer: Transfer): TransferSummary => {
  const amount = transfer.amount
  const date = getTransferDate(transfer)

  return {
    amount,
    amountText: formatSignedCurrency(amount),
    category: toOptionalText(transfer.category),
    date,
    fullDescription: toOptionalText(transfer.full_description),
    id: transfer.id,
    isPositive: amount >= 0,
    label: getTransferDescription(transfer),
    meta: date || transfer.status.trim(),
    reference: toOptionalText(transfer.reference),
    status: formatStatusLabel(transfer.status),
    transferType: toOptionalText(transfer.transfer_type),
  }
}

export const getTransferSummaries = (transfers: Transfer[]): TransferSummary[] =>
  transfers.map((transfer) => getTransferSummary(transfer))

export const getLatestTransferSummary = (transfers: Transfer[]): TransferSummary | undefined =>
  transfers[0] ? getTransferSummary(transfers[0]) : undefined
