import { useDismiss, useFloating, useInteractions, useRole } from '@floating-ui/react'
import { ChevronDown, ChevronUp, Info, WalletCards } from 'lucide-react'
import { useCallback, useState } from 'react'
import type { AccountSummary } from '../../../utils/accountSummary'
import { cn } from '../../../utils/cn'
import type { TransferSummary } from '../../../utils/transferSummary'
import dashboardStyles from '../dashboard.module.css'
import styles from './account-details.module.css'
import { BalanceInfoModal } from './BalanceInfoModal'

interface TransactionPanelProps {
  account: AccountSummary
  transfer: TransferSummary
}

export function TransactionPanel({ account, transfer }: TransactionPanelProps) {
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
                    <button
                      className={styles.transactionInfoButton}
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
