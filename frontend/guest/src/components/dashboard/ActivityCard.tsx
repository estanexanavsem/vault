import { useState } from 'react'
import type { Transfer } from '../../types/guest'
import { cn } from '../../utils/cn'
import { getTransferSummaries } from '../../utils/transferSummary'
import { RecentActivitySummary } from './activity-card/RecentActivitySummary'
import { UpcomingActivityEmpty } from './activity-card/UpcomingActivityEmpty'
import styles from './ActivityCard.module.css'
import primitiveStyles from './DashboardPrimitives.module.css'

interface ActivityCardProps {
  accountRoute: string
  transfers: Transfer[]
}

export function ActivityCard({ accountRoute, transfers }: ActivityCardProps) {
  const [activeTab, setActiveTab] = useState<'recent' | 'upcoming'>('recent')
  const transferSummaries = getTransferSummaries(transfers).slice(0, 3)
  const isUpcoming = activeTab === 'upcoming'

  return (
    <section
      className={cn(primitiveStyles.card, styles.card)}
      aria-labelledby="activity-title"
    >
      <h2 id="activity-title" className={primitiveStyles.sectionKicker}>
        Activity
      </h2>

      <div className={cn(primitiveStyles.tabs, styles.tabs)} aria-label="Activity range">
        <button
          className={cn(primitiveStyles.tab, activeTab === 'recent' && primitiveStyles.active)}
          type="button"
          onClick={() => setActiveTab('recent')}
        >
          Recent
        </button>
        <button
          className={cn(primitiveStyles.tab, isUpcoming && primitiveStyles.active)}
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
