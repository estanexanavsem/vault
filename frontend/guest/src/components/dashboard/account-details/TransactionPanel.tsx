import { Fragment } from 'react'
import type { TransferSummary } from '../../../utils/transferSummary'
import styles from './account-details.module.css'
import { TransactionRow } from './TransactionRow'
import { getTransactionDateGroups } from './transactionGroups'

interface TransactionPanelProps {
  transfers: TransferSummary[]
}

export function TransactionPanel({ transfers }: TransactionPanelProps) {
  const transactionGroups = getTransactionDateGroups(transfers)

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

      {transactionGroups.length === 0 ? (
        <div className={styles.transactionEmptyState}>No recent transactions.</div>
      ) : null}

      {transactionGroups.map((group, groupIndex) => (
        <Fragment key={group.date || groupIndex}>
          <div className={styles.postedBalanceRow}>
            <span>{group.date}</span>
            <span>Posted Balance: {group.postedBalanceText}</span>
          </div>
          {group.transfers.map((transfer, transferIndex) => (
            <TransactionRow
              key={transfer.id ?? `${transfer.date}-${transfer.amount}-${transferIndex}`}
              transfer={transfer}
            />
          ))}
        </Fragment>
      ))}
    </div>
  )
}
