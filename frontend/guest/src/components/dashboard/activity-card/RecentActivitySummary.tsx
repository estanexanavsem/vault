import { ArrowRight, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../../../utils/cn'
import type { TransferSummary } from '../../../utils/transferSummary'
import { TransactionIcon } from '../account-details/TransactionIcon'
import styles from './RecentActivitySummary.module.css'

interface RecentActivitySummaryProps {
  accountRoute: string
  transfers: TransferSummary[]
}

export function RecentActivitySummary({ accountRoute, transfers }: RecentActivitySummaryProps) {
  if (transfers.length === 0) {
    return <p className={styles.empty}>No recent transactions.</p>
  }

  return (
    <>
      <div className={styles.labels} aria-hidden="true">
        <span>Description</span>
        <span>Amount</span>
      </div>

      <div className={styles.rows}>
        {transfers.map((transfer, index) => (
          <Link
            className={styles.row}
            key={transfer.id ?? `${transfer.date}-${transfer.amount}-${index}`}
            to={accountRoute}
          >
            <TransactionIcon className={styles.icon} transfer={transfer} />
            <span className={styles.copy}>
              {transfer.label ? <strong>{transfer.label}</strong> : null}
              {transfer.meta ? <span className={styles.meta}>{transfer.meta}</span> : null}
            </span>
            <span
              className={cn(
                styles.amount,
                transfer.isPositive ? styles.positive : styles.negative,
              )}
            >
              {transfer.amountText}
            </span>
            <ChevronRight size={18} aria-hidden="true" />
          </Link>
        ))}
      </div>

      <Link className={styles.more} to={accountRoute}>
        More activity
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </>
  )
}
