import { formatCurrency } from '../../../utils/formatters'
import type { TransferSummary } from '../../../utils/transferSummary'

export interface TransactionDateGroup {
  date: string
  postedBalanceText: string
  transfers: TransferSummary[]
}

export const getTransactionDateGroups = (transfers: TransferSummary[]): TransactionDateGroup[] =>
  transfers.reduce<TransactionDateGroup[]>((groups, transfer) => {
    const group = groups.find((item) => item.date === transfer.date)

    if (group) {
      group.transfers.push(transfer)
      group.postedBalanceText = formatCurrency(
        group.transfers.reduce((total, item) => total + item.amount, 0),
      )
      return groups
    }

    groups.push({
      date: transfer.date,
      postedBalanceText: formatCurrency(transfer.amount),
      transfers: [transfer],
    })

    return groups
  }, [])
