import styles from './account-details.module.css'

export function DetailCopy() {
  return (
    <div className={styles.copy}>
      <p>
        Daily Posted Balance: The posted balance after nightly processing is completed. Please note
        that transactions are paid from your Available Balance according to our posting order, and
        that the Available Balance may be different than your Daily Posted Balance. Important: The
        Daily Posted Balance does not reflect all pending transactions and fees and should not be
        used to determine whether overdraft fees were assessed.
      </p>
      <a
        href="https://www.truist.com/content/dam/truist-bank/us/en/documents/rates-fees/personal/truist-one-personal-deposit-accounts-fee-schedule.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        Personal Deposit Accounts Fee Schedule
      </a>
    </div>
  )
}
