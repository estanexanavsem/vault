import { ChevronRight } from 'lucide-react'
import styles from './account-details.module.css'

export function DownloadAppCard() {
  return (
    <button className={styles.downloadAppCard} type="button">
      <span>Thanks for banking with Truist.</span>
      <strong>Download the app</strong>
      <ChevronRight size={18} aria-hidden="true" />
    </button>
  )
}
