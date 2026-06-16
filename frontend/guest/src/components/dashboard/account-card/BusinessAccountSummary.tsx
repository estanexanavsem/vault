import { Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { AccountSummary } from '../../../utils/accountSummary'
import styles from './BusinessAccountSummary.module.css'

interface BusinessAccountSummaryProps {
  account: AccountSummary
  accountRoute: string
}

export function BusinessAccountSummary({ account, accountRoute }: BusinessAccountSummaryProps) {
  return (
    <>
      <div className={styles.group}>
        <div className={styles.label}>
          <span className={styles.icon}>
            <Wallet size={20} aria-hidden="true" />
          </span>
          <strong>Cash &amp; savings</strong>
        </div>
        <strong className={styles.balance}>{account.balanceText}</strong>
      </div>

      <Link className={styles.row} to={accountRoute}>
        <span>{account.title}</span>
        <strong>{account.balanceText}</strong>
      </Link>
    </>
  )
}
