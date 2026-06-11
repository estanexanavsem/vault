import { ChevronRight, Circle } from 'lucide-react'
import { useState } from 'react'
import type { Transfer } from '../../types/guest'
import { formatSignedCurrency } from '../../utils/formatters'

interface ActivityCardProps {
  transfers: Transfer[]
}

export function ActivityCard({ transfers }: ActivityCardProps) {
  const [activeTab, setActiveTab] = useState<'recent' | 'upcoming'>('recent')
  const latestTransfer = transfers[0]
  const description = latestTransfer?.description.trim() || latestTransfer?.full_description.trim()
  const label = description !== '' ? description : 'Zelle business transfer'
  const amount = latestTransfer?.amount ?? 10
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
        <div className="activity-empty">
          <p>You have no upcoming transactions.</p>
          <img
            alt=""
            aria-hidden="true"
            height="200"
            loading="lazy"
            src="/assets/no-recent-transactions.svg"
            width="200"
          />
        </div>
      ) : (
        <>
          <div className="activity-table-labels" aria-hidden="true">
            <span>Description</span>
            <span>Amount</span>
          </div>

          <button className="activity-row" type="button">
            <span className="activity-copy">
              <strong>{label}</strong>
              <span className="pending-line">
                <Circle size={7} fill="currentColor" aria-hidden="true" />
                Pending
              </span>
            </span>
            <span className={`activity-amount ${amount >= 0 ? 'is-positive' : 'is-negative'}`}>
              {formatSignedCurrency(amount)}
            </span>
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </>
      )}

      <button className="inline-action" type="button">
        More activity
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </section>
  )
}
