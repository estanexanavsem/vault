import { ExternalLink } from 'lucide-react'
import { legalSections } from '../../data/legalSections'
import { TruistMark } from '../common/TruistMark'
import styles from './dashboard.module.css'

export function Footer() {
  return (
    <footer className={styles.siteFooter}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <span>TRUIST</span>
          <TruistMark className={styles.footerBrandMark} />
        </div>

        <nav className={styles.footerLinks} aria-label="Footer">
          <a href="#customer-service">Customer service</a>
          <a href="#privacy">
            Privacy
            <ExternalLink size={13} aria-hidden="true" />
          </a>
          <a href="#fraud">
            Fraud and security
            <ExternalLink size={13} aria-hidden="true" />
          </a>
          <a href="#accessibility">
            Accessibility
            <ExternalLink size={13} aria-hidden="true" />
          </a>
          <a href="#agreements">Service agreements</a>
          <a href="tel:8444878478">844-4TRUIST (844-487-8478)</a>
          <a href="#sensitive">
            Limit use of my sensitive personal information
            <ExternalLink size={13} aria-hidden="true" />
          </a>
        </nav>

        <div className={styles.legalCopy}>
          {legalSections.map((section) => (
            <p key={section}>{section}</p>
          ))}
        </div>
      </div>
    </footer>
  )
}
