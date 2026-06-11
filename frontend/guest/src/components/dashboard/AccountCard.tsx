import { MoreHorizontal, WalletCards } from 'lucide-react'
import type { GuestData } from '../../types/guest'
import { formatCurrency, getAccountName, getLastFour } from '../../utils/formatters'

interface AccountCardProps {
  data: GuestData
}

export function AccountCard({ data }: AccountCardProps) {
  const accountName = getAccountName(data.master)
  const accountSuffix = getLastFour(data.master.account_number)

  return (
    <section className="dashboard-card accounts-card" aria-labelledby="accounts-title">
      <div className="section-heading-row">
        <h2 id="accounts-title" className="section-kicker">
          Accounts
        </h2>
        <button className="icon-button more-button" type="button" aria-label="More account actions">
          <MoreHorizontal size={24} aria-hidden="true" />
        </button>
      </div>

      <div className="tabs" aria-label="Account groups">
        <button className="tab is-active" type="button">
          Business
        </button>
        <button className="tab" type="button">
          Linked
        </button>
      </div>

      <div className="account-family">
        <div className="account-family-label">
          <span className="account-icon">
            <WalletCards size={20} aria-hidden="true" />
          </span>
          <strong>Cash &amp; savings</strong>
        </div>
        <strong className="family-balance">{formatCurrency(data.master.balance)}</strong>
      </div>

      <button className="account-row" type="button">
        <span>
          {accountName} {accountSuffix}
        </span>
        <strong>{formatCurrency(data.master.balance)}</strong>
      </button>

      <button className="pill-button" type="button">
        View all accounts
      </button>
    </section>
  )
}
