import { CircleDollarSign, ReceiptText, WalletCards } from 'lucide-react'
import intuitLogoUrl from '../../../assets/intuit-logo.svg'
import { cn } from '../../../utils/cn'
import { getTransactionIconKind } from '../../../utils/transactionIcon'
import type { TransferSummary } from '../../../utils/transferSummary'
import dashboardStyles from '../dashboard.module.css'
import styles from './account-details.module.css'

interface TransactionIconProps {
  transfer: TransferSummary
}

export function TransactionIcon({ transfer }: TransactionIconProps) {
  const iconKind = getTransactionIconKind(transfer)

  return (
    <span
      className={cn(
        dashboardStyles.activityIcon,
        styles.transactionIcon,
        iconKind === 'intuit' && styles.transactionLogoIcon,
      )}
      aria-hidden="true"
    >
      {iconKind === 'deposit' ? <CircleDollarSign size={20} /> : null}
      {iconKind === 'check' ? <ReceiptText size={20} /> : null}
      {iconKind === 'intuit' ? (
        <img className={styles.transactionLogo} src={intuitLogoUrl} alt="" />
      ) : null}
      {iconKind === 'other' ? <WalletCards size={20} /> : null}
    </span>
  )
}
