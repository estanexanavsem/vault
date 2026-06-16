import { WalletCards } from 'lucide-react'
import type { AccountSummary } from '../../../utils/accountSummary'
import styles from './AccountDetailSidebar.module.css'

interface AccountDetailSidebarProps {
  account: AccountSummary
}

export function AccountDetailSidebar({ account }: AccountDetailSidebarProps) {
  return (
    <aside className={styles.sidebar} aria-label="Account list">
      <div className={styles.sidebarHead}>
        <h2>Accounts</h2>
      </div>
      <div className={styles.sidebarFamily}>
        <WalletCards size={22} aria-hidden="true" />
        <strong>Cash &amp; savings</strong>
        <span>{account.balanceText}</span>
      </div>
      <button className={styles.sidebarAccount} type="button">
        <span>{account.title}</span>
        <strong>{account.balanceText}</strong>
        {account.availableBalanceDate ? <small>As of {account.availableBalanceDate}</small> : null}
      </button>
    </aside>
  )
}
