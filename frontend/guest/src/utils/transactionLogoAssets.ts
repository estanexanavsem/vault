import americanExpressLogoUrl from '../assets/american-express-logo.svg'
import appleLogoUrl from '../assets/apple-logo.svg'
import bankOfAmericaLogoUrl from '../assets/bank-of-america-logo.svg'
import chaseLogoUrl from '../assets/chase-logo.svg'
import discoverLogoUrl from '../assets/discover-logo.svg'
import gmFinancialLogoUrl from '../assets/gm-financial-logo.svg'
import gustoLogoUrl from '../assets/gusto-logo.svg'
import intuitLogoUrl from '../assets/intuit-logo.svg'
import robinhoodLogoUrl from '../assets/robinhood-logo.svg'
import tdBankLogoUrl from '../assets/td-bank-logo.svg'
import toyotaLogoUrl from '../assets/toyota-logo.svg'
import type { TransactionIconKind, TransactionLogoKind } from './transactionIcon'

export interface TransactionLogoAsset {
  src: string
  variant?: 'wide'
}

const transactionLogoAssets: Record<TransactionLogoKind, TransactionLogoAsset> = {
  'american-express': { src: americanExpressLogoUrl },
  apple: { src: appleLogoUrl },
  'bank-of-america': { src: bankOfAmericaLogoUrl },
  chase: { src: chaseLogoUrl },
  'discover-bank': { src: discoverLogoUrl, variant: 'wide' },
  'gm-financial': { src: gmFinancialLogoUrl, variant: 'wide' },
  gusto: { src: gustoLogoUrl, variant: 'wide' },
  intuit: { src: intuitLogoUrl, variant: 'wide' },
  robinhood: { src: robinhoodLogoUrl },
  'td-bank': { src: tdBankLogoUrl, variant: 'wide' },
  toyota: { src: toyotaLogoUrl },
}

export const getTransactionLogoAsset = (
  iconKind: TransactionIconKind,
): TransactionLogoAsset | undefined =>
  iconKind in transactionLogoAssets
    ? transactionLogoAssets[iconKind as TransactionLogoKind]
    : undefined
