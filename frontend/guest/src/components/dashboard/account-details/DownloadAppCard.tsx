import { ArrowRight } from 'lucide-react'
import styles from './DownloadAppCard.module.css'

export function DownloadAppCard() {
  return (
    <a
      className={styles.card}
      href="https://www.truist.com/digital-banking"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span>Thanks for banking with Truist.</span>
      <strong>
        Download the app
        <ArrowRight size={18} aria-hidden="true" />
      </strong>
    </a>
  )
}
