import type { MasterAccount, Transfer } from '../types/guest'

export const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', {
    currency: 'USD',
    minimumFractionDigits: 2,
    style: 'currency',
  })

export const formatSignedCurrency = (value: number) =>
  `${value >= 0 ? '+' : ''}${formatCurrency(value)}`

export const formatShortDate = (value: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(date)
}

export const getLastFour = (value: string) => {
  const digits = value.replace(/\D/g, '')
  return digits.length >= 4 ? digits.slice(-4) : ''
}

export const getAccountName = (account: MasterAccount) => {
  const name = account.account_name.trim()
  return name !== '' ? name : 'Checking'
}

export const getDisplayName = (account: MasterAccount) => {
  const holderName = account.holder_name.trim()
  return holderName !== '' ? holderName.split(/\s+/)[0] : account.login
}

export const getTimeGreeting = (date = new Date()) => {
  const hour = date.getHours()

  if (hour < 12) {
    return 'Good morning'
  }

  if (hour < 18) {
    return 'Good afternoon'
  }

  return 'Good evening'
}

export const getTransferDescription = (transfer: Transfer | undefined, fallback: string) => {
  const fullDescription = transfer?.full_description.trim() ?? ''
  if (fullDescription !== '') {
    return fullDescription
  }

  const description = transfer?.description.trim() ?? ''
  return description !== '' ? description : fallback
}

export const getTransferDate = (transfer: Transfer | undefined) =>
  transfer?.transaction_date ? formatShortDate(transfer.transaction_date) : ''
