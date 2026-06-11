import { ChevronRight, Circle } from 'lucide-react'
import type { Transfer } from '../../types/guest'
import { formatSignedCurrency } from '../../utils/formatters'

interface ActivityCardProps {
  transfers: Transfer[]
}

export function ActivityCard({ transfers }: ActivityCardProps) {
  const latestTransfer = transfers[0]
  const description = latestTransfer?.description.trim() || latestTransfer?.full_description.trim()
  const label = description !== '' ? description : 'Zelle business transfer'
  const amount = latestTransfer?.amount ?? 10

  return (
    <section className="dashboard-card activity-card" aria-labelledby="activity-title">
      <h2 id="activity-title" className="section-kicker">
        Activity
      </h2>

      <div className="tabs activity-tabs" aria-label="Activity range">
        <button className="tab is-active" type="button">
          Recent
        </button>
        <button className="tab" type="button">
          Upcoming
        </button>
      </div>

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

      <button className="inline-action" type="button">
        More activity
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </section>
  )
}
