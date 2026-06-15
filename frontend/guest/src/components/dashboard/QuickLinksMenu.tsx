import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FloatingDropdown } from '../common/FloatingDropdown'
import styles from './navigation.module.css'

export function QuickLinksMenu() {
  return (
    <div className={styles.mobileQuickLinksWrap}>
      <FloatingDropdown
        floatingClassName={styles.mobileQuickLinksMenu}
        label="Quick Links"
        triggerClassName={styles.mobileQuickLinks}
        triggerContent={(isOpen) => (
          <>
            <span>Quick Links</span>
            <ChevronDown
              className={styles.mobileQuickLinksIcon}
              data-open={isOpen ? 'true' : 'false'}
              size={22}
              aria-hidden="true"
            />
          </>
        )}
      >
        {(close) => (
          <>
            <button type="button" role="menuitem" onClick={close}>
              Statements
            </button>
            <Link
              to="/security-center"
              role="menuitem"
              onClick={close}
            >
              Security center
            </Link>
          </>
        )}
      </FloatingDropdown>
    </div>
  )
}
