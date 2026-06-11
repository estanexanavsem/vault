import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import type { Transfer } from '../../types/guest'
import { getLatestTransferSummary } from '../../utils/transferSummary'
import { RecentActivitySummary } from './activity-card/RecentActivitySummary'
import { UpcomingActivityEmpty } from './activity-card/UpcomingActivityEmpty'

interface ActivityCardProps {
  onOpenAccount: () => void
  transfers: Transfer[]
}

export function ActivityCard({ onOpenAccount, transfers }: ActivityCardProps) {
  const [activeTab, setActiveTab] = useState<'recent' | 'upcoming'>('recent')
  const transfer = getLatestTransferSummary(transfers, 'Zelle business transfer')
  const isUpcoming = activeTab === 'upcoming'

  return (
    <section className="dashboard-card activity-card" aria-labelledby="activity-title">
      <h2 id="activity-title" className="section-kicker">
        Activity
      </h2>

      <div className="tabs activity-tabs" aria-label="Activity range">
        <button
          className={`tab ${activeTab === 'recent' ? 'is-active' : ''}`}
          type="button"
          onClick={() => setActiveTab('recent')}
        >
          Recent
        </button>
        <button
          className={`tab ${isUpcoming ? 'is-active' : ''}`}
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

      <button className="inline-action" type="button">
        More activity
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </section>
  )
}
