import { ChevronDown, ChevronUp, Info, WalletCards } from 'lucide-react'
import { useState } from 'react'
import type { AccountSummary } from '../../../utils/accountSummary'
import { cn } from '../../../utils/cn'
import type { TransferSummary } from '../../../utils/transferSummary'
import dashboardStyles from '../dashboard.module.css'
import styles from './account-details.module.css'

interface TransactionPanelProps {
  account: AccountSummary
  transfer: TransferSummary
}

export function TransactionPanel({ account, transfer }: TransactionPanelProps) {
  const [isExpanded, setExpanded] = useState(false)
  const hasTransactionDetails = [
    transfer.fullDescription,
    transfer.transferType,
    transfer.date,
    transfer.reference,
  ].some(Boolean)
  const hasCategoryDetails = Boolean(transfer.category)
  const hasExpandedDetails = hasTransactionDetails || hasCategoryDetails

  return (
    <div className={styles.transactionPanel}>
      <div className={styles.transactionHeader} aria-hidden="true">
        <span>Date</span>
        <span>Status</span>
        <span>Description</span>
        <span>Check/Serial #</span>
        <span>Credits</span>
        <span>Debits</span>
      </div>
      <div className={styles.postedBalanceRow}>
        <span>{transfer.date}</span>
        <span>Posted Balance: {account.balanceText}</span>
      </div>
      <button
        className={cn(styles.transactionDetailRow, isExpanded && styles.transactionDetailRowOpen)}
        type="button"
        aria-expanded={isExpanded}
        onClick={() => setExpanded((isOpen) => !isOpen)}
      >
        <strong className={styles.transactionDate}>{transfer.date}</strong>
        <span className={styles.transactionStatus}>
          <span aria-hidden="true" />
          Deposited
        </span>
        <span className={styles.transactionDescription}>
          <span
            className={cn(dashboardStyles.activityIcon, styles.transactionIcon)}
            aria-hidden="true"
          >
            <WalletCards size={20} />
          </span>
          <strong>{transfer.label}</strong>
        </span>
        <span className={styles.transactionCredit}>{transfer.amountText}</span>
        {isExpanded ? (
          <ChevronUp size={18} aria-hidden="true" />
        ) : (
          <ChevronDown size={18} aria-hidden="true" />
        )}
      </button>
      {isExpanded && hasExpandedDetails ? (
        <div className={styles.transactionExpandedPanel}>
          <div
            className={cn(
              styles.transactionExpandedCards,
              (!hasTransactionDetails || !hasCategoryDetails) &&
                styles.transactionExpandedCardsSingle,
            )}
          >
            {hasTransactionDetails ? (
              <section className={styles.transactionExpandedCard}>
                <h3>
                  Transaction details
                  <Info size={15} aria-hidden="true" />
                </h3>
                <dl>
                  {transfer.fullDescription ? (
                    <div>
                      <dt>Full description</dt>
                      <dd>{transfer.fullDescription}</dd>
                    </div>
                  ) : null}
                  {transfer.transferType ? (
                    <div>
                      <dt>Transaction type</dt>
                      <dd>{transfer.transferType}</dd>
                    </div>
                  ) : null}
                  {transfer.date ? (
                    <div>
                      <dt>Transaction date</dt>
                      <dd>{transfer.date}</dd>
                    </div>
                  ) : null}
                  {transfer.reference ? (
                    <div>
                      <dt>Reference number</dt>
                      <dd>{transfer.reference}</dd>
                    </div>
                  ) : null}
                </dl>
              </section>
            ) : null}
            {hasCategoryDetails ? (
              <section className={styles.transactionExpandedCard}>
                <h3>Category</h3>
                <dl>
                  <div>
                    <dt>Category name</dt>
                    <dd>{transfer.category}</dd>
                  </div>
                </dl>
              </section>
            ) : null}
          </div>
          <p className={styles.transactionExpandedNote}>
            <strong>Note:</strong> Category and merchant details may take up to an hour to appear
            once a transaction has been completed.
          </p>
        </div>
      ) : null}
    </div>
  )
}
