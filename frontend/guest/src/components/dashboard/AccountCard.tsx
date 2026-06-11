import { MoreHorizontal, WalletCards } from 'lucide-react'
import { useState } from 'react'
import type { GuestData } from '../../types/guest'
import { formatCurrency, getAccountName, getLastFour } from '../../utils/formatters'

interface AccountCardProps {
  data: GuestData
}

export function AccountCard({ data }: AccountCardProps) {
  const [activeTab, setActiveTab] = useState<'business' | 'linked'>('business')
  const accountName = getAccountName(data.master)
  const accountSuffix = getLastFour(data.master.account_number)
  const isLinked = activeTab === 'linked'

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
        <button
          className={`tab ${activeTab === 'business' ? 'is-active' : ''}`}
          type="button"
          onClick={() => setActiveTab('business')}
        >
          Business
        </button>
        <button
          className={`tab ${isLinked ? 'is-active' : ''}`}
          type="button"
          onClick={() => setActiveTab('linked')}
        >
          Linked
        </button>
      </div>

      {isLinked ? (
        <div className="account-linked-empty">
          <img
            alt=""
            aria-hidden="true"
            height="100"
            loading="lazy"
            src="/assets/system-error.svg"
            width="100"
          />
          <p>
            We can't display your linked accounts right now.
            <br />
            Please refresh or try again later.
          </p>
        </div>
      ) : (
        <>
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
        </>
      )}

      <button className="pill-button" type="button">
        View all accounts
      </button>
    </section>
  )
}
