import type { MasterAccount } from '../types/guest'

export const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', {
    currency: 'USD',
    minimumFractionDigits: 2,
    style: 'currency',
  })

export const formatSignedCurrency = (value: number) =>
  `${value >= 0 ? '+' : ''}${formatCurrency(value)}`

export const getLastFour = (value: string) => {
  const digits = value.replace(/\D/g, '')
  return digits.length >= 4 ? digits.slice(-4) : '6973'
}

export const getAccountName = (account: MasterAccount) => {
  const name = account.account_name.trim()
  return name !== '' ? name : 'Checking'
}

export const getDisplayName = (account: MasterAccount) => {
  const holderName = account.holder_name.trim()
  return holderName !== '' ? holderName.split(/\s+/)[0] : account.login
}
