import { ExternalLink } from 'lucide-react'
import { legalSections } from '../../data/legalSections'
import { TruistMark } from '../common/TruistMark'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span>TRUIST</span>
          <TruistMark />
        </div>

        <nav className="footer-links" aria-label="Footer">
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

        <div className="legal-copy">
          {legalSections.map((section) => (
            <p key={section}>{section}</p>
          ))}
        </div>
      </div>
    </footer>
  )
}
