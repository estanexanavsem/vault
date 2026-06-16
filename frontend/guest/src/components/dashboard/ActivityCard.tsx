import { useState } from 'react'
import type { Transfer } from '../../types/guest'
import { cn } from '../../utils/cn'
import { getTransferSummaries } from '../../utils/transferSummary'
import { RecentActivitySummary } from './activity-card/RecentActivitySummary'
import { UpcomingActivityEmpty } from './activity-card/UpcomingActivityEmpty'
import styles from './ActivityCard.module.css'

interface ActivityCardProps {
  accountRoute: string
  transfers: Transfer[]
}

export function ActivityCard({ accountRoute, transfers }: ActivityCardProps) {
  const [activeTab, setActiveTab] = useState<'recent' | 'upcoming'>('recent')
  const transferSummaries = getTransferSummaries(transfers).slice(0, 3)
  const isUpcoming = activeTab === 'upcoming'

  return (
    <section className={cn(styles.card)} aria-labelledby="activity-title">
      <h2 id="activity-title" className={styles.kicker}>
        Activity
      </h2>

      <div className={cn(styles.tabs)} aria-label="Activity range">
        <button
          className={cn(styles.tab, activeTab === 'recent' && styles.active)}
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

      {isUpcoming ? (
        <UpcomingActivityEmpty />
      ) : (
        <RecentActivitySummary accountRoute={accountRoute} transfers={transferSummaries} />
      )}
    </section>
  )
}
