import { Wallet } from 'lucide-react'
import type { AccountSummary } from '../../../utils/accountSummary'

interface BusinessAccountSummaryProps {
  account: AccountSummary
  onOpenAccount: () => void
}

export function BusinessAccountSummary({ account, onOpenAccount }: BusinessAccountSummaryProps) {
  return (
    <>
      <div className="account-family">
        <div className="account-family-label">
          <span className="account-icon">
            <Wallet size={20} aria-hidden="true" />
          </span>
          <strong>Cash &amp; savings</strong>
        </div>
        <strong className="family-balance">{account.balanceText}</strong>
      </div>

      <button className="account-row" type="button" onClick={onOpenAccount}>
        <span>{account.title}</span>
        <strong>{account.balanceText}</strong>
      </button>
    </>
  )
}
