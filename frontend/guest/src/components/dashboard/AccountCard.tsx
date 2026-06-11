import { useState } from 'react'
import type { GuestData } from '../../types/guest'
import { getAccountSummary } from '../../utils/accountSummary'
import { cn } from '../../utils/cn'
import { BusinessAccountSummary } from './account-card/BusinessAccountSummary'
import { LinkedAccountEmpty } from './account-card/LinkedAccountEmpty'
import styles from './dashboard.module.css'

interface AccountCardProps {
  data: GuestData
  onOpenAccount: () => void
}

export function AccountCard({ data, onOpenAccount }: AccountCardProps) {
  const [activeTab, setActiveTab] = useState<'business' | 'linked'>('business')
  const account = getAccountSummary(data.master)
  const isLinked = activeTab === 'linked'

  return (
    <section className={cn(styles.card, styles.accountsCard)} aria-labelledby="accounts-title">
      <div className={styles.sectionHeadingRow}>
        <h2 id="accounts-title" className={styles.sectionKicker}>
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
        <BusinessAccountSummary account={account} onOpenAccount={onOpenAccount} />
      )}

      <button className={styles.pillButton} type="button">
        View all accounts
      </button>
    </section>
  )
}
