import { Download, Printer, Search } from 'lucide-react'
import type { AccountSummary } from '../../../utils/accountSummary'
import type { TransferSummary } from '../../../utils/transferSummary'
import { TransactionPanel } from './TransactionPanel'

interface DetailActivitySectionProps {
  account: AccountSummary
  transfer: TransferSummary
}

export function DetailActivitySection({ account, transfer }: DetailActivitySectionProps) {
  return (
    <section className="detail-activity-card" aria-labelledby="detail-activity-title">
      <div className="detail-activity-heading">
        <h2 id="detail-activity-title">Activity</h2>
        <div className="detail-activity-tools" aria-label="Activity tools">
          <button className="search-button" type="button">
            <Search size={20} aria-hidden="true" />
            Search
          </button>
          <button className="detail-icon-button" type="button" aria-label="Download activity">
            <Download size={20} aria-hidden="true" />
          </button>
          <button className="detail-icon-button" type="button" aria-label="Print activity">
            <Printer size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="tabs detail-tabs" aria-label="Activity range">
        <button className="tab is-active" type="button">
          Recent
        </button>
        <button className="tab" type="button">
          Upcoming
        </button>
      </div>

      <TransactionPanel account={account} transfer={transfer} />
    </section>
  )
}
