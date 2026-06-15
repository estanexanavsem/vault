import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js/min'
import type { MasterAccount, Transfer } from '../types/guest'

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  day: '2-digit',
  month: '2-digit',
  timeZone: 'UTC',
  year: 'numeric',
})

const easternDateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  day: '2-digit',
  hour: '2-digit',
  hour12: true,
  minute: '2-digit',
  month: '2-digit',
  timeZone: 'America/New_York',
  timeZoneName: 'short',
  year: 'numeric',
})

const profileMenuDateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  hour: 'numeric',
  hour12: true,
  minute: '2-digit',
  month: 'long',
  timeZone: 'America/New_York',
  year: 'numeric',
})

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

  return shortDateFormatter.format(date)
}

export const formatEasternDateTime = (value: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const formatted = easternDateTimeFormatter.formatToParts(date)

  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    formatted.find((part) => part.type === type)?.value ?? ''

  return `${getPart('hour')}:${getPart('minute')} ${getPart('dayPeriod')} ${getPart('timeZoneName')} on ${getPart('month')}/${getPart('day')}/${getPart('year')}`
}

export const formatProfileMenuDateTime = (value: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return profileMenuDateTimeFormatter.format(date).replace(/\b(AM|PM)\b/, (match) =>
    match.toLowerCase(),
  )
}

export const formatUsPhoneNumber = (value: string) => {
  const phoneNumber = parsePhoneNumberFromString(value, 'US')
  return phoneNumber?.isPossible() ? phoneNumber.formatNational() : value
}

export const formatUsPhoneInput = (value: string) => new AsYouType('US').input(value)

export const normalizeUsPhoneNumber = (value: string) => {
  const phoneNumber = parsePhoneNumberFromString(value, 'US')
  return phoneNumber?.isValid() && phoneNumber.country === 'US' ? phoneNumber.number : ''
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

export const getTransferDescription = (transfer: Transfer) => {
  const fullDescription = transfer.full_description.trim()
  if (fullDescription !== '') {
    return fullDescription
  }

  return transfer.description.trim()
}

export const formatStatusLabel = (value: string) =>
  value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')

export const getTransferDate = (transfer: Transfer | undefined) =>
  transfer?.transaction_date ? formatShortDate(transfer.transaction_date) : ''
