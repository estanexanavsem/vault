import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js/min'

export function formatFileSize(bytes: number): string {
  if (bytes <= 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function formatTransactionDate(value: string): string {
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  if (dateOnlyMatch) {
    return `${dateOnlyMatch[1]}-${dateOnlyMatch[2]}-${dateOnlyMatch[3]}`
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return localDate.toISOString().slice(0, 10)
}

export function formatCurrency(value: number): string {
  return `$${Number(value).toFixed(2)}`
}

export function formatDateTime(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString()
}

export const formatUsPhoneInput = (value: string) => new AsYouType('US').input(value)

export const normalizeUsPhoneNumber = (value: string) => {
  const phoneNumber = parsePhoneNumberFromString(value, 'US')
  return phoneNumber?.isValid() && phoneNumber.country === 'US' ? phoneNumber.number : ''
}
