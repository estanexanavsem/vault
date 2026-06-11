import { Wallet } from 'lucide-react'
import type { AccountSummary } from '../../../utils/accountSummary'
import styles from '../dashboard.module.css'

interface BusinessAccountSummaryProps {
  account: AccountSummary
  onOpenAccount: () => void
}

export function BusinessAccountSummary({ account, onOpenAccount }: BusinessAccountSummaryProps) {
  return (
    <>
      <div className={styles.accountFamily}>
        <div className={styles.accountFamilyLabel}>
          <span className={styles.accountIcon}>
            <Wallet size={20} aria-hidden="true" />
          </span>
          <strong>Cash &amp; savings</strong>
        </div>
        <strong className={styles.familyBalance}>{account.balanceText}</strong>
      </div>

      <button className={styles.accountRow} type="button" onClick={onOpenAccount}>
        <span>{account.title}</span>
        <strong>{account.balanceText}</strong>
      </button>
    </>
  )
}
