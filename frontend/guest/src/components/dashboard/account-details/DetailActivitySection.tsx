import { Download, Printer, Search } from 'lucide-react'
import type { AccountSummary } from '../../../utils/accountSummary'
import { cn } from '../../../utils/cn'
import type { TransferSummary } from '../../../utils/transferSummary'
import dashboardStyles from '../dashboard.module.css'
import styles from './account-details.module.css'
import { TransactionPanel } from './TransactionPanel'

interface DetailActivitySectionProps {
  account: AccountSummary
  transfer: TransferSummary
}

export function DetailActivitySection({ account, transfer }: DetailActivitySectionProps) {
  return (
    <section className={styles.activityCard} aria-labelledby="detail-activity-title">
      <div className={styles.activityHeading}>
        <h2 id="detail-activity-title">Activity</h2>
        <div className={styles.activityTools} aria-label="Activity tools">
          <button className={styles.searchButton} type="button">
            <Search size={20} aria-hidden="true" />
            Search
          </button>
          <button className={styles.iconButton} type="button" aria-label="Download activity">
            <Download size={20} aria-hidden="true" />
          </button>
          <button className={styles.iconButton} type="button" aria-label="Print activity">
            <Printer size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className={cn(dashboardStyles.tabs, styles.detailTabs)} aria-label="Activity range">
        <button className={cn(dashboardStyles.tab, dashboardStyles.active)} type="button">
          Recent
        </button>
        <button className={dashboardStyles.tab} type="button">
          Upcoming
        </button>
      </div>

      <TransactionPanel account={account} transfer={transfer} />
    </section>
  )
}
