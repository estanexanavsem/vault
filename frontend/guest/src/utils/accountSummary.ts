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

export const getAccountSummary = (account: MasterAccount, balance: number): AccountSummary => {
  const name = getAccountName(account)
  const suffix = getLastFour(account.account_number)

  return {
    availableBalanceDate: formatCurrentShortDate(),
    balance,
    balanceText: formatCurrency(balance),
    name,
    suffix,
    title: suffix ? `${name} ${suffix}` : name,
  }
}
