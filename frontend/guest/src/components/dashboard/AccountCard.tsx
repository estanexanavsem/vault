import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { GuestData } from '../../types/guest'
import { getAccountSummary } from '../../utils/accountSummary'
import { cn } from '../../utils/cn'
import { BusinessAccountSummary } from './account-card/BusinessAccountSummary'
import { LinkedAccountEmpty } from './account-card/LinkedAccountEmpty'
import styles from './AccountCard.module.css'

interface AccountCardProps {
  accountRoute: string
  data: GuestData
}

export function AccountCard({ accountRoute, data }: AccountCardProps) {
  const [activeTab, setActiveTab] = useState<'business' | 'linked'>('business')
  const account = getAccountSummary(data.master)
  const isLinked = activeTab === 'linked'

  return (
    <section className={cn(styles.card)} aria-labelledby="accounts-title">
      <div className={styles.heading}>
        <h2 id="accounts-title" className={styles.kicker}>
          Accounts
        </h2>
      </div>

      <div className={styles.tabs} aria-label="Account groups">
        <button
          className={cn(styles.tab, activeTab === 'business' && styles.active)}
          type="button"
          onClick={() => setActiveTab('business')}
        >
          Business
        </button>
        <button
          className={cn(styles.tab, isLinked && styles.active)}
          type="button"
          onClick={() => setActiveTab('linked')}
        >
          Linked
        </button>
      </div>

      {isLinked ? (
        <LinkedAccountEmpty />
      ) : (
        <BusinessAccountSummary account={account} accountRoute={accountRoute} />
      )}

      <Link className={styles.button} to={accountRoute}>
        View all accounts
      </Link>
    </section>
  )
}
