import { Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { AccountSummary } from '../../../utils/accountSummary'
import styles from '../dashboard.module.css'

interface BusinessAccountSummaryProps {
  account: AccountSummary
  accountRoute: string
}

export function BusinessAccountSummary({ account, accountRoute }: BusinessAccountSummaryProps) {
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

      <Link className={styles.accountRow} to={accountRoute}>
        <span>{account.title}</span>
        <strong>{account.balanceText}</strong>
      </Link>
    </>
  )
}
