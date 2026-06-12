import { ChevronRight, Folder } from 'lucide-react'
import { cn } from '../../../utils/cn'
import type { TransferSummary } from '../../../utils/transferSummary'
import styles from '../dashboard.module.css'

interface RecentActivitySummaryProps {
  onOpenAccount: () => void
  transfers: TransferSummary[]
}

export function RecentActivitySummary({ onOpenAccount, transfers }: RecentActivitySummaryProps) {
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
          <button
            className={styles.activityRow}
            key={transfer.id ?? `${transfer.date}-${transfer.amount}-${index}`}
            type="button"
            onClick={onOpenAccount}
          >
            <span className={styles.activityIcon} aria-hidden="true">
              <Folder size={16} />
            </span>
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
          </button>
        ))}
      </div>
    </>
  )
}
