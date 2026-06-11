import { useDismiss, useFloating, useInteractions, useRole } from '@floating-ui/react'
import { Eye, Info, List, SlidersHorizontal } from 'lucide-react'
import { useCallback, useState } from 'react'
import type { MasterAccount } from '../../../types/guest'
import type { AccountSummary } from '../../../utils/accountSummary'
import { getLastFour } from '../../../utils/formatters'
import { BalanceInfoModal } from './BalanceInfoModal'
import styles from './account-details.module.css'

type BalanceInfoDialog = 'available' | 'current'

interface BalanceSummaryCardProps {
  account: AccountSummary
  accountDetails: MasterAccount
  isAccountDetailsOpen: boolean
  lastDepositText: string
  onAccountDetailsOpenChange: (isOpen: boolean) => void
}

export function BalanceSummaryCard({
  account,
  accountDetails,
  isAccountDetailsOpen,
  lastDepositText,
  onAccountDetailsOpenChange,
}: BalanceSummaryCardProps) {
  const [isAccountNumberVisible, setAccountNumberVisible] = useState(false)
  const [balanceInfoDialog, setBalanceInfoDialog] = useState<BalanceInfoDialog | null>(null)
  const accountNumber = accountDetails.account_number.trim()
  const routingNumber = accountDetails.routing_number.trim()
  const accountNumberSuffix = getLastFour(accountNumber)
  const accountNumberText = isAccountNumberVisible
    ? accountNumber
    : accountNumberSuffix
      ? `xxxxxx${accountNumberSuffix}`
      : ''
  const isBalanceInfoOpen = balanceInfoDialog !== null
  const closeBalanceInfo = () => setBalanceInfoDialog(null)
  const { context, refs } = useFloating({
    onOpenChange: (isOpen) => {
      if (!isOpen) {
        closeBalanceInfo()
      }
    },
    open: isBalanceInfoOpen,
  })
  const dismiss = useDismiss(context, {
    outsidePressEvent: 'mousedown',
  })
  const role = useRole(context, { role: 'dialog' })
  const { getFloatingProps } = useInteractions([dismiss, role])
  const setFloatingNode = useCallback((node: HTMLElement | null) => refs.setFloating(node), [refs])

  return (
    <>
      <section className={styles.balanceCard} aria-labelledby="balance-title">
        <div className={styles.balanceCardTop}>
          <h1 id="balance-title">{account.title}</h1>
          <button
            className={styles.accountDetailsLink}
            type="button"
            aria-expanded={isAccountDetailsOpen}
            onClick={() => onAccountDetailsOpenChange(!isAccountDetailsOpen)}
          >
            Account details
            <SlidersHorizontal size={15} aria-hidden="true" />
          </button>
        </div>
        {isAccountDetailsOpen ? (
          <div className={styles.accountInfoPanel}>
            <div className={styles.accountInfoDivider} />
            <h2 className={styles.accountInfoTitle}>
              <span aria-hidden="true">$</span>
              <List size={17} aria-hidden="true" />
              Account Information
            </h2>
            <dl className={styles.accountInfoGrid}>
              {accountNumber ? (
                <div>
                  <dt>Account number</dt>
                  <dd>
                    {accountNumberText}
                    <button
                      className={styles.accountNumberReveal}
                      type="button"
                      aria-label={isAccountNumberVisible ? 'Hide account number' : 'Show account number'}
                      aria-pressed={isAccountNumberVisible}
                      onClick={() => setAccountNumberVisible((isVisible) => !isVisible)}
                    >
                      <Eye size={15} aria-hidden="true" />
                    </button>
                  </dd>
                </div>
              ) : null}
              {routingNumber ? (
                <div>
                  <dt>Routing number</dt>
                  <dd>{routingNumber}</dd>
                </div>
              ) : null}
              <div>
                <dt>
                  Current balance
                  <button
                    className={styles.accountInfoHelp}
                    type="button"
                    aria-label="Current balance information"
                    onClick={() => setBalanceInfoDialog('current')}
                  >
                    <Info size={15} aria-hidden="true" />
                  </button>
                </dt>
                <dd>{account.balanceText}</dd>
              </div>
              <div>
                <dt>Last deposit amount</dt>
                <dd>{lastDepositText}</dd>
              </div>
            </dl>
            <div className={styles.accountInfoDivider} />
          </div>
        ) : null}
        <p className={styles.balanceAmount}>
          {account.balanceText}
          <button
            className={styles.balanceInfoButton}
            type="button"
            aria-label="Available balance information"
            onClick={() => setBalanceInfoDialog('available')}
          >
            <Info size={16} aria-hidden="true" />
          </button>
        </p>
        {account.availableBalanceDate ? (
          <p className={styles.balanceNote}>Available balance as of {account.availableBalanceDate}</p>
        ) : null}
      </section>

      {balanceInfoDialog === 'current' ? (
        <BalanceInfoModal
          context={context}
          floatingProps={getFloatingProps}
          onClose={closeBalanceInfo}
          setFloatingNode={setFloatingNode}
          title="Current balance"
        >
          Your current balance (also called ledger balance) is the actual amount in your account
          after nightly posting and does not change throughout the day. It does not include holds or
          pending transactions. Transactions are paid from your available balance according to our
          posting order, and your available balance may differ from your daily current balance.
        </BalanceInfoModal>
      ) : null}
      {balanceInfoDialog === 'available' ? (
        <BalanceInfoModal
          context={context}
          floatingProps={getFloatingProps}
          onClose={closeBalanceInfo}
          setFloatingNode={setFloatingNode}
          title="Available balance"
        >
          Your available balance is the money currently available to make purchases, withdrawals, and
          payments. This balance is updated throughout the day with the transactions you make,
          including pending transactions and holds. It does not include bill pay checks or checks
          you've written or deposited that have not yet posted. This balance is used in making
          payment decisions and triggering overdraft fees if applicable.
        </BalanceInfoModal>
      ) : null}
    </>
  )
}
