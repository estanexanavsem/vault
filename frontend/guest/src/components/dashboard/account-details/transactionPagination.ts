import type { TransferSummary } from '../../../utils/transferSummary'
import type { TransactionDateGroup } from './transactionGroups'

const TRANSACTION_PAGE_SIZE = 10

export const getTransferSignature = (transfers: TransferSummary[]) =>
  transfers
    .map((transfer, index) => transfer.id ?? `${transfer.date}-${transfer.amount}-${index}`)
    .join('|')

export const getNextVisibleTransactionGroupCount = (
  transactionGroups: TransactionDateGroup[],
  currentGroupCount: number,
) => {
  let nextGroupCount = currentGroupCount
  let addedTransferCount = 0

  while (
    nextGroupCount < transactionGroups.length &&
    (addedTransferCount < TRANSACTION_PAGE_SIZE || nextGroupCount === currentGroupCount)
  ) {
    addedTransferCount += transactionGroups[nextGroupCount]?.transfers.length ?? 0
    nextGroupCount += 1
  }

  return nextGroupCount
}
