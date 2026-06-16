import { CircleDollarSign, ReceiptText, WalletCards } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { getTransactionLogoAsset } from '../../../utils/transactionLogoAssets'
import { getTransactionIconKind } from '../../../utils/transactionIcon'
import type { TransferSummary } from '../../../utils/transferSummary'
import dashboardStyles from '../dashboard.module.css'
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
      className={cn(
        dashboardStyles.activityIcon,
        logoAsset && styles.transactionLogoIcon,
        className,
      )}
      aria-hidden="true"
    >
      {iconKind === 'deposit' ? <CircleDollarSign size={20} /> : null}
      {iconKind === 'check' ? <ReceiptText size={20} /> : null}
      {logoAsset ? (
        <img
          className={cn(
            styles.transactionLogo,
            logoAsset.variant === 'wide' && styles.transactionLogoWide,
          )}
          src={logoAsset.src}
          alt=""
        />
      ) : null}
      {iconKind === 'other' ? <WalletCards size={20} /> : null}
    </span>
  )
}
