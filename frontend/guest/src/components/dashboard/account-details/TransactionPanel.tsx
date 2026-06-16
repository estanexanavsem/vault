import { Fragment, useEffect, useMemo, useState } from 'react'
import type { TransferSummary } from '../../../utils/transferSummary'
import styles from './account-details.module.css'
import { TransactionRow } from './TransactionRow'
import { getNextVisibleTransactionGroupCount, getTransferSignature } from './transactionPagination'
import { getTransactionDateGroups } from './transactionGroups'

interface TransactionPanelProps {
  transfers: TransferSummary[]
}

export function TransactionPanel({ transfers }: TransactionPanelProps) {
  const [visibleGroupCount, setVisibleGroupCount] = useState(0)
  const transferSignature = getTransferSignature(transfers)
  const transactionGroups = useMemo(() => getTransactionDateGroups(transfers), [transfers])
  const initialVisibleGroupCount = useMemo(
    () => getNextVisibleTransactionGroupCount(transactionGroups, 0),
    [transactionGroups],
  )
  const resolvedVisibleGroupCount = visibleGroupCount || initialVisibleGroupCount
  const visibleTransactionGroups = transactionGroups.slice(0, resolvedVisibleGroupCount)
  const hasMoreTransactions = resolvedVisibleGroupCount < transactionGroups.length

  useEffect(() => {
    setVisibleGroupCount(0)
  }, [transferSignature])

  const loadMoreTransactions = () => {
    setVisibleGroupCount((currentGroupCount) =>
      getNextVisibleTransactionGroupCount(
        transactionGroups,
        currentGroupCount || initialVisibleGroupCount,
      ),
    )
  }

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

      {visibleTransactionGroups.map((group, groupIndex) => (
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

      {hasMoreTransactions ? (
        <div className={styles.transactionLoadMoreRow}>
          <button
            className={styles.transactionLoadMoreButton}
            type="button"
            onClick={loadMoreTransactions}
          >
            Load more
          </button>
        </div>
      ) : null}
    </div>
  )
}
