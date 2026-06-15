import { ExternalLink, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { legalSections } from '../../data/legalSections'
import { LegalSectionPart } from './LegalSectionPart'
import { TruistMark } from '../common/TruistMark'
import styles from './dashboard.module.css'

const externalLinkProps = {
  target: '_blank',
  rel: 'noopener noreferrer',
}

export function Footer() {
  return (
    <footer className={styles.siteFooter}>
      <div className={styles.footerInner}>
        <Link className={styles.footerBrand} to="/">
          <span>TRUIST</span>
          <TruistMark className={styles.footerBrandMark} />
        </Link>

        <nav className={styles.footerLinks} aria-label="Footer">
          <a href="https://bank.truist.com/web/support" {...externalLinkProps}>
            Customer service
          </a>
          <a href="https://www.truist.com/privacy" {...externalLinkProps}>
            Privacy
            <ExternalLink size={13} aria-hidden="true" />
          </a>
          <a href="https://www.truist.com/fraud-and-security" {...externalLinkProps}>
            Fraud and security
            <ExternalLink size={13} aria-hidden="true" />
          </a>
          <a href="https://www.truist.com/accessibility" {...externalLinkProps}>
            Accessibility
            <ExternalLink size={13} aria-hidden="true" />
          </a>
          <a
            href="https://bank.truist.com/web/documents?view=service-agreements"
            {...externalLinkProps}
          >
            Service agreements
          </a>
          <a className={styles.phoneLink} href="tel:8444878478">
            <Phone size={14} aria-hidden="true" />
            844-4TRUIST (844-487-8478)
          </a>
          <a
            className={styles.sensitiveInfoLink}
            href="https://privacycenter.truist.com/"
            {...externalLinkProps}
          >
            Limit use of my sensitive personal information
            <ExternalLink size={13} aria-hidden="true" />
          </a>
        </nav>

        <div className={styles.legalCopy}>
          {legalSections.map((section, sectionIndex) => (
            <p key={sectionIndex}>
              {section.parts.map((part, partIndex) => (
                <LegalSectionPart key={partIndex} part={part} />
              ))}
            </p>
          ))}
        </div>
      </div>
    </footer>
  )
}
