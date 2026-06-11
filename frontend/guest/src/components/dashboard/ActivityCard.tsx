import { ChevronRight, Folder } from 'lucide-react'
import { useState } from 'react'
import type { Transfer } from '../../types/guest'
import {
  formatSignedCurrency,
  getTransferDate,
  getTransferDescription,
} from '../../utils/formatters'

interface ActivityCardProps {
  onOpenAccount: () => void
  transfers: Transfer[]
}

export function ActivityCard({ onOpenAccount, transfers }: ActivityCardProps) {
  const [activeTab, setActiveTab] = useState<'recent' | 'upcoming'>('recent')
  const latestTransfer = transfers[0]
  const label = getTransferDescription(latestTransfer, 'Zelle business transfer')
  const amount = latestTransfer?.amount ?? 10
  const transactionDate = getTransferDate(latestTransfer)
  const transferMeta = transactionDate || latestTransfer?.status.trim() || ''
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

          <button className="activity-row" type="button" onClick={onOpenAccount}>
            <span className="activity-icon" aria-hidden="true">
              <Folder size={16} />
            </span>
            <span className="activity-copy">
              <strong>{label}</strong>
              {transferMeta ? <span className="activity-meta">{transferMeta}</span> : null}
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
