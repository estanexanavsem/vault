import { ArrowRight, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../../../utils/cn'
import type { TransferSummary } from '../../../utils/transferSummary'
import { TransactionIcon } from '../account-details/TransactionIcon'
import styles from '../dashboard.module.css'

interface RecentActivitySummaryProps {
  accountRoute: string
  transfers: TransferSummary[]
}

export function RecentActivitySummary({ accountRoute, transfers }: RecentActivitySummaryProps) {
  if (transfers.length === 0) {
    return <p className={styles.activityNoRows}>No recent transactions.</p>
  }

  return (
    <>
      <div className={styles.activityTableLabels} aria-hidden="true">
        <span>Description</span>
        <span>Amount</span>
      </div>

      <div className={styles.activityRows}>
        {transfers.map((transfer, index) => (
          <Link
            className={styles.activityRow}
            key={transfer.id ?? `${transfer.date}-${transfer.amount}-${index}`}
            to={accountRoute}
          >
            <TransactionIcon className={styles.activityTransactionIcon} transfer={transfer} />
            <span className={styles.activityCopy}>
              {transfer.label ? <strong>{transfer.label}</strong> : null}
              {transfer.meta ? <span className={styles.activityMeta}>{transfer.meta}</span> : null}
            </span>
            <span
              className={cn(
                styles.activityAmount,
                transfer.isPositive ? styles.positive : styles.negative,
              )}
            >
              {transfer.amountText}
            </span>
            <ChevronRight size={18} aria-hidden="true" />
          </Link>
        ))}
      </div>

      <Link className={styles.moreActivityButton} to={accountRoute}>
        More activity
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </>
  )
}
