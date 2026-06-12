import { useState } from 'react'
import { cn } from '../../../utils/cn'
import type { TransferSummary } from '../../../utils/transferSummary'
import dashboardStyles from '../dashboard.module.css'
import styles from './account-details.module.css'
import { DetailUpcomingActivityEmpty } from './DetailUpcomingActivityEmpty'
import { TransactionPanel } from './TransactionPanel'

interface DetailActivitySectionProps {
  transfers: TransferSummary[]
}

export function DetailActivitySection({ transfers }: DetailActivitySectionProps) {
  const [activeTab, setActiveTab] = useState<'recent' | 'upcoming'>('recent')
  const isUpcoming = activeTab === 'upcoming'

  return (
    <section className={styles.activityCard} aria-labelledby="detail-activity-title">
      <div className={styles.activityHeading}>
        <h2 id="detail-activity-title">Activity</h2>
      </div>

      <div className={cn(dashboardStyles.tabs, styles.detailTabs)} aria-label="Activity range">
        <button
          className={cn(dashboardStyles.tab, !isUpcoming && dashboardStyles.active)}
          type="button"
          onClick={() => setActiveTab('recent')}
        >
          Recent
        </button>
        <button
          className={cn(dashboardStyles.tab, isUpcoming && dashboardStyles.active)}
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
