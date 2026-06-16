import { Fragment, useMemo, useState } from 'react'
import { cn } from '../../../utils/cn'
import type { TransferSummary } from '../../../utils/transferSummary'
import { TransactionRow } from './TransactionRow'
import styles from './TransactionPanel.module.css'
import { getNextVisibleTransactionGroupCount, getTransferSignature } from './transactionPagination'
import { getTransactionDateGroups } from './transactionGroups'

interface TransactionPanelProps {
  transfers: TransferSummary[]
}

interface VisibleTransactionState {
  groupCount: number
  transferSignature: string
}

export function TransactionPanel({ transfers }: TransactionPanelProps) {
  const transferSignature = getTransferSignature(transfers)
  const [visibleTransactionState, setVisibleTransactionState] = useState<VisibleTransactionState>(
    () => ({
      groupCount: 0,
      transferSignature,
    }),
  )
  const transactionGroups = useMemo(() => getTransactionDateGroups(transfers), [transfers])
  const initialVisibleGroupCount = useMemo(
    () => getNextVisibleTransactionGroupCount(transactionGroups, 0),
    [transactionGroups],
  )
  const visibleGroupCount =
    visibleTransactionState.transferSignature === transferSignature
      ? visibleTransactionState.groupCount
      : 0
  const resolvedVisibleGroupCount = visibleGroupCount || initialVisibleGroupCount
  const visibleTransactionGroups = transactionGroups.slice(0, resolvedVisibleGroupCount)
  const hasMoreTransactions = resolvedVisibleGroupCount < transactionGroups.length

  const loadMoreTransactions = () => {
    setVisibleTransactionState((currentState) => {
      const currentGroupCount =
        currentState.transferSignature === transferSignature ? currentState.groupCount : 0

      return {
        groupCount: getNextVisibleTransactionGroupCount(
          transactionGroups,
          currentGroupCount || initialVisibleGroupCount,
        ),
        transferSignature,
      }
    })
  }

  return (
    <div className={styles.root}>
      <div className={styles.head} aria-hidden="true">
        <span>Date</span>
        <span>Status</span>
        <span>Description</span>
        <span>Check/Serial #</span>
        <span>Credits</span>
        <span>Debits</span>
      </div>

      {transactionGroups.length === 0 ? (
        <div className={styles.empty}>No recent transactions.</div>
      ) : null}

      {visibleTransactionGroups.map((group, groupIndex) => (
        <Fragment key={group.date || groupIndex}>
          <div className={cn(styles.row, groupIndex > 0 && styles.separate)}>
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
        <div className={styles.more}>
          <button className={styles.action} type="button" onClick={loadMoreTransactions}>
            Load more
          </button>
        </div>
      ) : null}
    </div>
  )
}
