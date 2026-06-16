import { useDismiss, useFloating, useInteractions, useRole } from '@floating-ui/react'
import { ChevronDown, ChevronUp, Info } from 'lucide-react'
import { useCallback, useState } from 'react'
import { cn } from '../../../utils/cn'
import type { TransferSummary } from '../../../utils/transferSummary'
import { BalanceInfoModal } from './BalanceInfoModal'
import { TransactionIcon } from './TransactionIcon'
import styles from './TransactionRow.module.css'

interface TransactionRowProps {
  transfer: TransferSummary
}

export function TransactionRow({ transfer }: TransactionRowProps) {
  const [isExpanded, setExpanded] = useState(false)
  const [isTransactionInfoOpen, setTransactionInfoOpen] = useState(false)
  const hasTransactionDetails = [
    transfer.fullDescription,
    transfer.transferType,
    transfer.date,
    transfer.reference,
  ].some(Boolean)
  const hasCategoryDetails = Boolean(transfer.category)
  const hasExpandedDetails = hasTransactionDetails || hasCategoryDetails
  const { context, refs } = useFloating({
    onOpenChange: setTransactionInfoOpen,
    open: isTransactionInfoOpen,
  })
  const dismiss = useDismiss(context, {
    outsidePressEvent: 'mousedown',
  })
  const role = useRole(context, { role: 'dialog' })
  const { getFloatingProps } = useInteractions([dismiss, role])
  const setFloatingNode = useCallback((node: HTMLElement | null) => refs.setFloating(node), [refs])

  return (
    <>
      <button
        className={cn(styles.row, isExpanded && styles.open)}
        type="button"
        aria-expanded={isExpanded}
        onClick={() => setExpanded((isOpen) => !isOpen)}
      >
        <strong className={styles.date}>{transfer.date}</strong>
        <span className={styles.status}>
          <span aria-hidden="true" />
          {transfer.status}
        </span>
        <span className={styles.desc}>
          <TransactionIcon className={styles.icon} transfer={transfer} />
          {transfer.label ? <strong>{transfer.label}</strong> : null}
        </span>
        <span className={cn(styles.amount, !transfer.isPositive && styles.negative)}>
          {transfer.amountText}
        </span>
        {isExpanded ? (
          <ChevronUp size={18} aria-hidden="true" />
        ) : (
          <ChevronDown size={18} aria-hidden="true" />
        )}
      </button>
      {isExpanded && hasExpandedDetails ? (
        <div className={styles.panel}>
          <div
            className={cn(
              styles.cards,
              (!hasTransactionDetails || !hasCategoryDetails) && styles.single,
            )}
          >
            {hasTransactionDetails ? (
              <section className={styles.card}>
                <h3>
                  Transaction details
                  <button
                    className={styles.info}
                    type="button"
                    aria-label="Transaction details data source information"
                    onClick={() => setTransactionInfoOpen(true)}
                  >
                    <Info size={15} aria-hidden="true" />
                  </button>
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
              <section className={styles.card}>
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
          <p className={styles.note}>
            <strong>Note:</strong> Category and merchant details may take up to an hour to appear
            once a transaction has been completed.
          </p>
        </div>
      ) : null}
      {isTransactionInfoOpen ? (
        <BalanceInfoModal
          context={context}
          floatingProps={getFloatingProps}
          onClose={() => setTransactionInfoOpen(false)}
          setFloatingNode={setFloatingNode}
          title="Where did we get this data?"
        >
          <p>
            After a new posted transaction is made, we utilize tools to improve data associated with
            it and provide a clearer picture of your account history. These improvements include
            categorizing your transactions and providing more detailed merchant information.
          </p>
          <p>
            Please note that this may take up to an hour to complete from time of transaction.
            Merchant names and categories, which are provided by Personetics, may differ from the
            original merchant and those found in other planning tools.
          </p>
        </BalanceInfoModal>
      ) : null}
    </>
  )
}
