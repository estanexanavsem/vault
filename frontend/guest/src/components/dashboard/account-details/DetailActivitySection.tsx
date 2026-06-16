import { useState } from 'react'
import { cn } from '../../../utils/cn'
import type { TransferSummary } from '../../../utils/transferSummary'
import styles from './DetailActivitySection.module.css'
import { DetailUpcomingActivityEmpty } from './DetailUpcomingActivityEmpty'
import { TransactionPanel } from './TransactionPanel'

interface DetailActivitySectionProps {
  isAccountDetailsOpen: boolean
  transfers: TransferSummary[]
}

export function DetailActivitySection({
  isAccountDetailsOpen,
  transfers,
}: DetailActivitySectionProps) {
  const [activeTab, setActiveTab] = useState<'recent' | 'upcoming'>('recent')
  const isUpcoming = activeTab === 'upcoming'

  return (
    <section
      className={cn(styles.card, isAccountDetailsOpen && styles.open)}
      aria-labelledby="detail-activity-title"
    >
      <div className={styles.head}>
        <h2 id="detail-activity-title">Activity</h2>
      </div>

      <div className={cn(styles.tabs)} aria-label="Activity range">
        <button
          className={cn(styles.tab, !isUpcoming && styles.active)}
          type="button"
          onClick={() => setActiveTab('recent')}
        >
          Recent
        </button>
        <button
          className={cn(styles.tab, isUpcoming && styles.active)}
          type="button"
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
      </div>

      {isUpcoming ? <DetailUpcomingActivityEmpty /> : <TransactionPanel transfers={transfers} />}
    </section>
  )
}
