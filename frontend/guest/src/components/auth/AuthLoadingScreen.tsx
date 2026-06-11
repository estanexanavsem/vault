import styles from './auth.module.css'

export function AuthLoadingScreen() {
  return <main className={styles.screen} aria-label="Checking session" />
}
