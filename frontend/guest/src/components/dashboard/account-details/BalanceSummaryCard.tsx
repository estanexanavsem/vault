import { Info, List, MoreVertical, Settings, SlidersHorizontal } from 'lucide-react'
import type { AccountSummary } from '../../../utils/accountSummary'
import styles from './account-details.module.css'

interface BalanceSummaryCardProps {
  account: AccountSummary
}

export function BalanceSummaryCard({ account }: BalanceSummaryCardProps) {
  return (
    <section className={styles.balanceCard} aria-labelledby="balance-title">
      <div className={styles.balanceCardTop}>
        <h1 id="balance-title">{account.title}</h1>
        <button className={styles.accountDetailsLink} type="button">
          Account details
          <SlidersHorizontal size={15} aria-hidden="true" />
        </button>
      </div>
      <p className={styles.balanceAmount}>
        {account.balanceText}
        <Info size={16} aria-hidden="true" />
      </p>
      <p className={styles.balanceNote}>Available balance as of {account.availableBalanceDate}</p>
      <div className={styles.balanceActions} aria-label="Account actions">
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
