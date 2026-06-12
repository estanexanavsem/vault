import type { MasterAccount } from '../types/guest'

export const getInitials = (name: string, fallback: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }

  return (parts[0] ?? fallback).slice(0, 2).toUpperCase()
}

export const getFullName = (account: MasterAccount) => {
  const holderName = account.holder_name.trim()
  return holderName !== '' ? holderName : account.login
}
