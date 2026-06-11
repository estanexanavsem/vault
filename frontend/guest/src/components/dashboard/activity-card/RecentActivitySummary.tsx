import { ChevronRight, Folder } from 'lucide-react'
import type { TransferSummary } from '../../../utils/transferSummary'

interface RecentActivitySummaryProps {
  onOpenAccount: () => void
  transfer: TransferSummary
}

export function RecentActivitySummary({ onOpenAccount, transfer }: RecentActivitySummaryProps) {
  return (
    <>
      <div className="activity-table-labels" aria-hidden="true">
        <span>Description</span>
        <span>Amount</span>
      </div>

      <button className="activity-row" type="button" onClick={onOpenAccount}>
        <span className="activity-icon" aria-hidden="true">
          <Folder size={16} />
        </span>
        <span className="activity-copy">
          <strong>{transfer.label}</strong>
          {transfer.meta ? <span className="activity-meta">{transfer.meta}</span> : null}
        </span>
        <span className={`activity-amount ${transfer.isPositive ? 'is-positive' : 'is-negative'}`}>
          {transfer.amountText}
        </span>
        <ChevronRight size={18} aria-hidden="true" />
      </button>
    </>
  )
}
