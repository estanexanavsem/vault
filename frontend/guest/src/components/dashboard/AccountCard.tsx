import { useState } from 'react'
import type { GuestData } from '../../types/guest'
import { getAccountSummary } from '../../utils/accountSummary'
import { BusinessAccountSummary } from './account-card/BusinessAccountSummary'
import { LinkedAccountEmpty } from './account-card/LinkedAccountEmpty'

interface AccountCardProps {
  data: GuestData
  onOpenAccount: () => void
}

export function AccountCard({ data, onOpenAccount }: AccountCardProps) {
  const [activeTab, setActiveTab] = useState<'business' | 'linked'>('business')
  const account = getAccountSummary(data.master)
  const isLinked = activeTab === 'linked'

  return (
    <section className="dashboard-card accounts-card" aria-labelledby="accounts-title">
      <div className="section-heading-row">
        <h2 id="accounts-title" className="section-kicker">
          Accounts
        </h2>
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
        <LinkedAccountEmpty />
      ) : (
        <BusinessAccountSummary account={account} onOpenAccount={onOpenAccount} />
      )}

      <button className="pill-button" type="button">
        View all accounts
      </button>
    </section>
  )
}
