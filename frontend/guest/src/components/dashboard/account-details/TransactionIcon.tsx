import { CircleDollarSign, ReceiptText, WalletCards } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { getTransactionLogoAsset } from '../../../utils/transactionLogoAssets'
import { getTransactionIconKind } from '../../../utils/transactionIcon'
import type { TransferSummary } from '../../../utils/transferSummary'
import dashboardStyles from '../dashboard.module.css'
import styles from './account-details.module.css'

interface TransactionIconProps {
  transfer: TransferSummary
}

export function TransactionIcon({ transfer }: TransactionIconProps) {
  const iconKind = getTransactionIconKind(transfer)
  const logoAsset = getTransactionLogoAsset(iconKind)

  return (
    <span
      className={cn(
        dashboardStyles.activityIcon,
        styles.transactionIcon,
        logoAsset && styles.transactionLogoIcon,
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
