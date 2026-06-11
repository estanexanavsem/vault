import { ChevronDown, WalletCards } from 'lucide-react'
import type { AccountSummary } from '../../../utils/accountSummary'
import { cn } from '../../../utils/cn'
import type { TransferSummary } from '../../../utils/transferSummary'
import dashboardStyles from '../dashboard.module.css'
import styles from './account-details.module.css'

interface TransactionPanelProps {
  account: AccountSummary
  transfer: TransferSummary
}

export function TransactionPanel({ account, transfer }: TransactionPanelProps) {
  return (
    <div className={styles.transactionPanel}>
      <div className={styles.transactionHeader} aria-hidden="true">
        <span>Date</span>
        <span>Status</span>
        <span>Description</span>
        <span>Check/Serial #</span>
        <span>Credits</span>
        <span>Debits</span>
      </div>
      <div className={styles.postedBalanceRow}>
        <span>{transfer.date}</span>
        <span>Posted Balance: {account.balanceText}</span>
      </div>
      <button className={styles.transactionDetailRow} type="button">
        <strong className={styles.transactionDate}>{transfer.date}</strong>
        <span className={styles.transactionStatus}>
          <span aria-hidden="true" />
          Deposited
        </span>
        <span className={styles.transactionDescription}>
          <span
            className={cn(dashboardStyles.activityIcon, styles.transactionIcon)}
            aria-hidden="true"
          >
            <WalletCards size={16} />
          </span>
          <strong>{transfer.label}</strong>
        </span>
        <span className={styles.transactionCredit}>{transfer.amountText}</span>
        <ChevronDown size={18} aria-hidden="true" />
      </button>
      <p className={styles.statementNote}>
        <a href="#statements">View statements</a> for transactions made before 06/10/26
      </p>
    </div>
  )
}
