import { ChevronRight, Folder } from 'lucide-react'
import { cn } from '../../../utils/cn'
import type { TransferSummary } from '../../../utils/transferSummary'
import styles from '../dashboard.module.css'

interface RecentActivitySummaryProps {
  onOpenAccount: () => void
  transfer: TransferSummary
}

export function RecentActivitySummary({ onOpenAccount, transfer }: RecentActivitySummaryProps) {
  return (
    <>
      <div className={styles.activityTableLabels} aria-hidden="true">
        <span>Description</span>
        <span>Amount</span>
      </div>

      <button className={styles.activityRow} type="button" onClick={onOpenAccount}>
        <span className={styles.activityIcon} aria-hidden="true">
          <Folder size={16} />
        </span>
        <span className={styles.activityCopy}>
          <strong>{transfer.label}</strong>
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
    </>
  )
}
