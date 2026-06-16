import { formatCurrency } from '../../../utils/formatters'
import type { TransferSummary } from '../../../utils/transferSummary'

export interface TransactionDateGroup {
  date: string
  postedBalanceText: string
  transfers: TransferSummary[]
}

const getGroupTotal = (group: TransactionDateGroup) =>
  group.transfers.reduce((total, item) => total + item.amount, 0)

export const getTransactionDateGroups = (
  transfers: TransferSummary[],
  accountBalance: number,
): TransactionDateGroup[] => {
  const groups: TransactionDateGroup[] = []
  let currentGroup: TransactionDateGroup | undefined

  for (const transfer of transfers) {
    if (currentGroup?.date === transfer.date) {
      currentGroup.transfers.push(transfer)
      continue
    }

    currentGroup = {
      date: transfer.date,
      postedBalanceText: '',
      transfers: [transfer],
    }

    groups.push(currentGroup)
  }

  let runningBalance = accountBalance

  for (let index = groups.length - 1; index >= 0; index -= 1) {
    const group = groups[index]

    if (group) {
      runningBalance += getGroupTotal(group)
      group.postedBalanceText = formatCurrency(runningBalance)
    }
  }

  return groups
}
