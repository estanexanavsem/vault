import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import type { Transfer } from '../../types/guest'
import { cn } from '../../utils/cn'
import { getLatestTransferSummary } from '../../utils/transferSummary'
import { RecentActivitySummary } from './activity-card/RecentActivitySummary'
import { UpcomingActivityEmpty } from './activity-card/UpcomingActivityEmpty'
import styles from './dashboard.module.css'

interface ActivityCardProps {
  onOpenAccount: () => void
  transfers: Transfer[]
}

export function ActivityCard({ onOpenAccount, transfers }: ActivityCardProps) {
  const [activeTab, setActiveTab] = useState<'recent' | 'upcoming'>('recent')
  const transfer = getLatestTransferSummary(transfers, 'Zelle business transfer')
  const isUpcoming = activeTab === 'upcoming'

  return (
    <section className={cn(styles.card, styles.activityCard)} aria-labelledby="activity-title">
      <h2 id="activity-title" className={styles.sectionKicker}>
        Activity
      </h2>

      <div className={cn(styles.tabs, styles.activityTabs)} aria-label="Activity range">
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
        <RecentActivitySummary onOpenAccount={onOpenAccount} transfer={transfer} />
      )}

      <button className={styles.inlineAction} type="button">
        More activity
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </section>
  )
}
