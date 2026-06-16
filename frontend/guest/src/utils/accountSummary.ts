import type { MasterAccount } from '../types/guest'
import { formatCurrency, formatCurrentShortDate, getAccountName, getLastFour } from './formatters'

export interface AccountSummary {
  availableBalanceDate: string
  balance: number
  balanceText: string
  name: string
  suffix: string
  title: string
}

export const getAccountSummary = (account: MasterAccount): AccountSummary => {
  const name = getAccountName(account)
  const suffix = getLastFour(account.account_number)

  return {
    availableBalanceDate: formatCurrentShortDate(),
    balance: account.balance,
    balanceText: formatCurrency(account.balance),
    name,
    suffix,
    title: suffix ? `${name} ${suffix}` : name,
  }
}
