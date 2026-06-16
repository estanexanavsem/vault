import { LoaderCircle } from 'lucide-react'
import styles from './AuthLoadingScreen.module.css'

export function AuthLoadingScreen() {
  return (
    <main className={styles.screen} aria-label="Checking session">
      <LoaderCircle className="motion-safe:animate-spin" size={32} aria-hidden="true" />
    </main>
  )
}
