import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Download,
  Info,
  List,
  MoreVertical,
  Printer,
  Search,
  Settings,
  SlidersHorizontal,
  WalletCards,
} from 'lucide-react'
import type { GuestData } from '../../types/guest'
import {
  formatCurrency,
  formatShortDate,
  formatSignedCurrency,
  getAccountName,
  getLastFour,
  getTransferDate,
  getTransferDescription,
} from '../../utils/formatters'

interface AccountDetailsPageProps {
  data: GuestData
  onBack: () => void
}

export function AccountDetailsPage({ data, onBack }: AccountDetailsPageProps) {
  const accountName = getAccountName(data.master)
  const accountSuffix = getLastFour(data.master.account_number)
  const accountTitle = `${accountName} ${accountSuffix}`
  const latestTransfer = data.transfers[0]
  const transferDate = getTransferDate(latestTransfer)
  const transferLabel = getTransferDescription(latestTransfer, 'Zelle business payment from')
  const transferAmount = latestTransfer?.amount ?? 10
  const availableBalanceDate = formatShortDate(data.master.updated_at) || '06/11/2026'

  return (
    <>
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

            <section className="balance-card" aria-labelledby="balance-title">
              <div className="balance-card-top">
                <h1 id="balance-title">{accountTitle}</h1>
                <button className="account-details-link" type="button">
                  Account details
                  <SlidersHorizontal size={15} aria-hidden="true" />
                </button>
              </div>
              <p className="balance-amount">
                {formatCurrency(data.master.balance)}
                <Info size={16} aria-hidden="true" />
              </p>
              <p className="balance-note">Available balance as of {availableBalanceDate}</p>
              <div className="balance-actions" aria-label="Account actions">
                <button type="button">
                  <List size={15} aria-hidden="true" />
                  Statements
                </button>
                <button type="button">
                  <Settings size={15} aria-hidden="true" />
                  Account settings
                </button>
                <button type="button">
                  <MoreVertical size={15} aria-hidden="true" />
                  More
                </button>
              </div>
            </section>
          </div>
        </div>
      </section>

      <main className="account-detail-main" id="account-detail">
        <aside className="account-detail-sidebar" aria-label="Account list">
          <div className="account-detail-sidebar-head">
            <h2>Accounts</h2>
            <button
              className="icon-button more-button"
              type="button"
              aria-label="More account actions"
            >
              <MoreVertical size={22} aria-hidden="true" />
            </button>
          </div>
          <div className="detail-sidebar-family">
            <WalletCards size={22} aria-hidden="true" />
            <strong>Cash &amp; savings</strong>
            <span>{formatCurrency(data.master.balance)}</span>
          </div>
          <button className="detail-sidebar-account is-selected" type="button">
            <span>{accountTitle}</span>
            <strong>{formatCurrency(data.master.balance)}</strong>
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
              <span>{transferDate}</span>
              <span>Posted Balance: {formatCurrency(data.master.balance)}</span>
            </div>
            <button className="transaction-detail-row" type="button">
              <strong className="transaction-date">{transferDate}</strong>
              <span className="transaction-status">
                <span aria-hidden="true" />
                Deposited
              </span>
              <span className="transaction-description">
                <span className="activity-icon" aria-hidden="true">
                  <WalletCards size={16} />
                </span>
                <strong>{transferLabel}</strong>
              </span>
              <span className="transaction-credit">{formatSignedCurrency(transferAmount)}</span>
              <ChevronDown size={18} aria-hidden="true" />
            </button>
            <p className="statement-note">
              <a href="#statements">View statements</a> for transactions made before 06/10/26
            </p>
          </div>
        </section>

        <div className="detail-copy">
          <p>
            Daily Posted Balance: The posted balance after nightly processing is completed. Please
            note that transactions are paid from your Available Balance according to our posting
            order, and that the Available Balance may be different than your Daily Posted Balance.
            Important: The Daily Posted Balance does not reflect all pending transactions and fees
            and should not be used to determine whether overdraft fees were assessed.
          </p>
          <a href="#fee-schedule">Personal Deposit Accounts Fee Schedule</a>
        </div>

        <button className="download-app-card" type="button">
          <span>Thanks for banking with Truist.</span>
          <strong>Download the app</strong>
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </main>
    </>
  )
}
