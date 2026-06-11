import { Info, List, MoreVertical, Settings, SlidersHorizontal } from 'lucide-react'
import type { AccountSummary } from '../../../utils/accountSummary'

interface BalanceSummaryCardProps {
  account: AccountSummary
}

export function BalanceSummaryCard({ account }: BalanceSummaryCardProps) {
  return (
    <section className="balance-card" aria-labelledby="balance-title">
      <div className="balance-card-top">
        <h1 id="balance-title">{account.title}</h1>
        <button className="account-details-link" type="button">
          Account details
          <SlidersHorizontal size={15} aria-hidden="true" />
        </button>
      </div>
      <p className="balance-amount">
        {account.balanceText}
        <Info size={16} aria-hidden="true" />
      </p>
      <p className="balance-note">Available balance as of {account.availableBalanceDate}</p>
      <div className="balance-actions" aria-label="Account actions">
        <button type="button">
          <List size={15} aria-hidden="true" />
          Statements
        </button>
        <button type="button">
          <Settings size={15} aria-hidden="true" />
          Account settings
        </button>
        <button type="button">
          <MoreVertical size={15} aria-hidden="true" />
          More
        </button>
      </div>
    </section>
  )
}
