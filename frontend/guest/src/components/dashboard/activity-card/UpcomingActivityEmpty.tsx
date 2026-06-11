import styles from '../dashboard.module.css'

export function UpcomingActivityEmpty() {
  return (
    <div className={styles.activityEmpty}>
      <p>You have no upcoming transactions.</p>
      <img
        alt=""
        aria-hidden="true"
        height="200"
        loading="lazy"
        src="/assets/no-recent-transactions.svg"
        width="200"
      />
    </div>
  )
}
