import type { TransferSummary } from './transferSummary'

export type TransactionLogoKind =
  | 'american-express'
  | 'apple'
  | 'bank-of-america'
  | 'chase'
  | 'discover-bank'
  | 'gm-financial'
  | 'gusto'
  | 'intuit'
  | 'robinhood'
  | 'td-bank'
  | 'toyota'

export type TransactionIconKind = 'check' | 'deposit' | 'other' | TransactionLogoKind

interface TransactionBrandRule {
  kind: TransactionLogoKind
  matches: string[]
}

const normalizeText = (value: string | undefined) => value?.trim().toLowerCase() ?? ''

const transactionBrandRules: TransactionBrandRule[] = [
  { kind: 'bank-of-america', matches: ['bank of america', 'bankofamerica'] },
  { kind: 'american-express', matches: ['american express', 'americanexpress', 'amex'] },
  { kind: 'discover-bank', matches: ['discover bank', 'discover'] },
  { kind: 'apple', matches: ['apple'] },
  { kind: 'intuit', matches: ['intuit'] },
  { kind: 'td-bank', matches: ['td bank', 'tdbank', 'toronto-dominion'] },
  { kind: 'gusto', matches: ['gusto'] },
  { kind: 'toyota', matches: ['toyota'] },
  { kind: 'chase', matches: ['chase'] },
  { kind: 'robinhood', matches: ['robinhood'] },
  { kind: 'gm-financial', matches: ['gm financial', 'gmfinancial', 'general motors financial'] },
]

export const getTransactionIconKind = (transfer: TransferSummary): TransactionIconKind => {
  const values = [
    transfer.status,
    transfer.transferType,
    transfer.label,
    transfer.fullDescription,
    transfer.category,
  ].map(normalizeText)

  const brandRule = transactionBrandRules.find((rule) =>
    values.some((value) => rule.matches.some((match) => value.includes(match))),
  )

  if (brandRule) {
    return brandRule.kind
  }

  if (values.some((value) => value.startsWith('deposit'))) {
    return 'deposit'
  }

  if (values.some((value) => value.includes('check'))) {
    return 'check'
  }

  return 'other'
}
