import { ChevronLeft } from 'lucide-react'
import type { AccountSummary } from '../../../utils/accountSummary'
import { BalanceSummaryCard } from './BalanceSummaryCard'
import styles from './account-details.module.css'

interface AccountDetailHeroProps {
  account: AccountSummary
  onBack: () => void
}

export function AccountDetailHero({ account, onBack }: AccountDetailHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.shell}>
        <button className={styles.mobileBackLink} type="button" onClick={onBack}>
          <ChevronLeft size={14} aria-hidden="true" />
          Account List
        </button>

        <div className={styles.content}>
          <div className={styles.fdicRow}>
            <strong>FDIC</strong>
            <span>FDIC-Insured - Backed by the full faith and credit of the U.S. Government</span>
          </div>

          <BalanceSummaryCard account={account} />
        </div>
      </div>
    </section>
  )
}
