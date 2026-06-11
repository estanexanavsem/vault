import { ChevronLeft } from 'lucide-react'
import type { AccountSummary } from '../../../utils/accountSummary'
import { BalanceSummaryCard } from './BalanceSummaryCard'

interface AccountDetailHeroProps {
  account: AccountSummary
  onBack: () => void
}

export function AccountDetailHero({ account, onBack }: AccountDetailHeroProps) {
  return (
    <section className="account-detail-hero">
      <div className="account-detail-shell">
        <button className="mobile-back-link" type="button" onClick={onBack}>
          <ChevronLeft size={14} aria-hidden="true" />
          Account List
        </button>

        <div className="account-detail-content">
          <div className="fdic-row">
            <strong>FDIC</strong>
            <span>FDIC-Insured - Backed by the full faith and credit of the U.S. Government</span>
          </div>

          <BalanceSummaryCard account={account} />
        </div>
      </div>
    </section>
  )
}
