import type { TransferSummary } from './transferSummary'

export type TransactionIconKind = 'check' | 'deposit' | 'intuit' | 'other'

const normalizeText = (value: string | undefined) => value?.trim().toLowerCase() ?? ''

export const getTransactionIconKind = (transfer: TransferSummary): TransactionIconKind => {
  const values = [
    transfer.status,
    transfer.transferType,
    transfer.label,
    transfer.fullDescription,
    transfer.category,
  ].map(normalizeText)

  if (values.some((value) => value.includes('intuit'))) {
    return 'intuit'
  }

  if (values.some((value) => value.startsWith('deposit'))) {
    return 'deposit'
  }

  if (values.some((value) => value.includes('check'))) {
    return 'check'
  }

  return 'other'
}
