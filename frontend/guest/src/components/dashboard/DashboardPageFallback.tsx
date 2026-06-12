import styles from './dashboard.module.css'

export function DashboardPageFallback() {
  return <main className={styles.pageFallback} aria-label="Loading page" />
}
