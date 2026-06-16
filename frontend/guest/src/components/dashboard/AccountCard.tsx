import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { GuestData } from '../../types/guest'
import { getAccountSummary } from '../../utils/accountSummary'
import { cn } from '../../utils/cn'
import { getTransferBalance } from '../../utils/transferBalance'
import { BusinessAccountSummary } from './account-card/BusinessAccountSummary'
import { LinkedAccountEmpty } from './account-card/LinkedAccountEmpty'
import styles from './AccountCard.module.css'
import primitiveStyles from './DashboardPrimitives.module.css'

interface AccountCardProps {
  accountRoute: string
  data: GuestData
}

export function AccountCard({ accountRoute, data }: AccountCardProps) {
  const [activeTab, setActiveTab] = useState<'business' | 'linked'>('business')
  const account = getAccountSummary(data.master, getTransferBalance(data.transfers))
  const isLinked = activeTab === 'linked'

  return (
    <section
      className={cn(primitiveStyles.card, styles.card)}
      aria-labelledby="accounts-title"
    >
      <div className={primitiveStyles.sectionHeadingRow}>
        <h2 id="accounts-title" className={primitiveStyles.sectionKicker}>
          Accounts
        </h2>
      </div>

      <div className={primitiveStyles.tabs} aria-label="Account groups">
        <button
          className={cn(primitiveStyles.tab, activeTab === 'business' && primitiveStyles.active)}
          type="button"
          onClick={() => setActiveTab('business')}
        >
          Business
        </button>
        <button
          className={cn(primitiveStyles.tab, isLinked && primitiveStyles.active)}
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
