import { ChevronLeft } from 'lucide-react'
import type { MasterAccount } from '../../../types/guest'
import type { AccountSummary } from '../../../utils/accountSummary'
import { BalanceSummaryCard } from './BalanceSummaryCard'
import styles from './account-details.module.css'

interface AccountDetailHeroProps {
  account: AccountSummary
  accountDetails: MasterAccount
  isAccountDetailsOpen: boolean
  lastDepositText: string
  onAccountDetailsOpenChange: (isOpen: boolean) => void
  onBack: () => void
}

export function AccountDetailHero({
  account,
  accountDetails,
  isAccountDetailsOpen,
  lastDepositText,
  onAccountDetailsOpenChange,
  onBack,
}: AccountDetailHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.shell}>
        <button className={styles.mobileBackLink} type="button" onClick={onBack}>
          <ChevronLeft size={14} aria-hidden="true" />
          Account List
        </button>

        <div className={styles.content}>
          <div className={styles.fdicRow}>
            <img src="/assets/FDIC-logo.png" alt="FDIC" />
            <span>
              <em>FDIC-Insured - Backed by the full faith and credit of the U.S. Government</em>
            </span>
          </div>

          <BalanceSummaryCard
            account={account}
            accountDetails={accountDetails}
            isAccountDetailsOpen={isAccountDetailsOpen}
            lastDepositText={lastDepositText}
            onAccountDetailsOpenChange={onAccountDetailsOpenChange}
          />
        </div>
      </div>
    </section>
  )
}
