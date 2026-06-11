import { ChevronRight, MoreVertical, WalletCards } from 'lucide-react'
import type { AccountSummary } from '../../../utils/accountSummary'

interface AccountDetailSidebarProps {
  account: AccountSummary
}

export function AccountDetailSidebar({ account }: AccountDetailSidebarProps) {
  return (
    <aside className="account-detail-sidebar" aria-label="Account list">
      <div className="account-detail-sidebar-head">
        <h2>Accounts</h2>
        <button className="icon-button more-button" type="button" aria-label="More account actions">
          <MoreVertical size={22} aria-hidden="true" />
        </button>
      </div>
      <div className="detail-sidebar-family">
        <WalletCards size={22} aria-hidden="true" />
        <strong>Cash &amp; savings</strong>
        <span>{account.balanceText}</span>
      </div>
      <button className="detail-sidebar-account is-selected" type="button">
        <span>{account.title}</span>
        <strong>{account.balanceText}</strong>
      </button>
      <button className="open-account-card" type="button">
        <WalletCards size={22} aria-hidden="true" />
        <span>
          <strong>Open an account</strong>
          <small>Find the perfect Truist account that fits your life.</small>
        </span>
        <ChevronRight className="open-account-chevron" size={22} aria-hidden="true" />
      </button>
    </aside>
  )
}
