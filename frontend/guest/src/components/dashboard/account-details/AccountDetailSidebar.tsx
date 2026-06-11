import { ChevronRight, MoreVertical, WalletCards } from 'lucide-react'
import type { AccountSummary } from '../../../utils/accountSummary'
import { cn } from '../../../utils/cn'
import dashboardStyles from '../dashboard.module.css'
import styles from './account-details.module.css'

interface AccountDetailSidebarProps {
  account: AccountSummary
}

export function AccountDetailSidebar({ account }: AccountDetailSidebarProps) {
  return (
    <aside className={styles.sidebar} aria-label="Account list">
      <div className={styles.sidebarHead}>
        <h2>Accounts</h2>
        <button
          className={cn(dashboardStyles.iconButton, dashboardStyles.moreButton)}
          type="button"
          aria-label="More account actions"
        >
          <MoreVertical size={22} aria-hidden="true" />
        </button>
      </div>
      <div className={styles.sidebarFamily}>
        <WalletCards size={22} aria-hidden="true" />
        <strong>Cash &amp; savings</strong>
        <span>{account.balanceText}</span>
      </div>
      <button className={styles.sidebarAccount} type="button">
        <span>{account.title}</span>
        <strong>{account.balanceText}</strong>
      </button>
      <button className={styles.openAccountCard} type="button">
        <WalletCards size={22} aria-hidden="true" />
        <span>
          <strong>Open an account</strong>
          <small>Find the perfect Truist account that fits your life.</small>
        </span>
        <ChevronRight className={styles.openAccountChevron} size={22} aria-hidden="true" />
      </button>
    </aside>
  )
}
