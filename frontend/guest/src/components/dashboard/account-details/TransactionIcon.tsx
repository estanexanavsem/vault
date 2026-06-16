import { CircleDollarSign, ReceiptText, WalletCards } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { getTransactionLogoAsset } from '../../../utils/transactionLogoAssets'
import { getTransactionIconKind } from '../../../utils/transactionIcon'
import type { TransferSummary } from '../../../utils/transferSummary'
import primitiveStyles from '../DashboardPrimitives.module.css'
import styles from './TransactionIcon.module.css'

interface TransactionIconProps {
  className?: string
  transfer: TransferSummary
}

export function TransactionIcon({ className, transfer }: TransactionIconProps) {
  const iconKind = getTransactionIconKind(transfer)
  const logoAsset = getTransactionLogoAsset(iconKind)

  return (
    <span
      className={cn(primitiveStyles.icon, logoAsset && styles.logo, className)}
      aria-hidden="true"
    >
      {iconKind === 'deposit' ? <CircleDollarSign size={20} /> : null}
      {iconKind === 'check' ? <ReceiptText size={20} /> : null}
      {logoAsset ? (
        <img
          className={cn(styles.image, logoAsset.variant === 'wide' && styles.wide)}
          src={logoAsset.src}
          alt=""
        />
      ) : null}
      {iconKind === 'other' ? <WalletCards size={20} /> : null}
    </span>
  )
}
