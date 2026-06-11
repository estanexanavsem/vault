import { ChevronDown, WalletCards } from 'lucide-react'
import type { AccountSummary } from '../../../utils/accountSummary'
import type { TransferSummary } from '../../../utils/transferSummary'

interface TransactionPanelProps {
  account: AccountSummary
  transfer: TransferSummary
}

export function TransactionPanel({ account, transfer }: TransactionPanelProps) {
  return (
    <div className="transaction-panel">
      <div className="transaction-header" aria-hidden="true">
        <span>Date</span>
        <span>Status</span>
        <span>Description</span>
        <span>Check/Serial #</span>
        <span>Credits</span>
        <span>Debits</span>
      </div>
      <div className="posted-balance-row">
        <span>{transfer.date}</span>
        <span>Posted Balance: {account.balanceText}</span>
      </div>
      <button className="transaction-detail-row" type="button">
        <strong className="transaction-date">{transfer.date}</strong>
        <span className="transaction-status">
          <span aria-hidden="true" />
          Deposited
        </span>
        <span className="transaction-description">
          <span className="activity-icon" aria-hidden="true">
            <WalletCards size={16} />
          </span>
          <strong>{transfer.label}</strong>
        </span>
        <span className="transaction-credit">{transfer.amountText}</span>
        <ChevronDown size={18} aria-hidden="true" />
      </button>
      <p className="statement-note">
        <a href="#statements">View statements</a> for transactions made before 06/10/26
      </p>
    </div>
  )
}
