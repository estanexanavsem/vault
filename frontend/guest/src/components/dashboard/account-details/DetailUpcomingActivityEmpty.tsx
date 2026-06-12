import styles from './account-details.module.css'

export function DetailUpcomingActivityEmpty() {
  return (
    <div className={styles.upcomingActivity}>
      <p className={styles.upcomingIntro}>
        Showing upcoming activity for the next 30 days. Please note: Only the next instance of a
        recurring transfer or payment series will be displayed. Some one-time or externally
        initiated transactions aren't included in this calculation.
      </p>

      <div className={styles.upcomingEmptyState}>
        <img src="/assets/no-upcoming-result.png" alt="" aria-hidden="true" />
        <strong>You have no upcoming transactions.</strong>
      </div>

      {['Outgoing', 'Incoming'].map((label) => (
        <section className={styles.upcomingTable} key={label}>
          <header>
            <strong>{label} (0)</strong>
            <span>Total: $0.00</span>
          </header>
          <div className={styles.upcomingTableHead} aria-hidden="true">
            <span>Date</span>
            <span>To</span>
            <span>From</span>
            <span>Amount</span>
          </div>
          <p>There is currently no information to display.</p>
        </section>
      ))}
    </div>
  )
}
