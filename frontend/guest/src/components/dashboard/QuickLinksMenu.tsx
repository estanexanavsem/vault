import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FloatingDropdown } from '../common/FloatingDropdown'
import styles from './QuickLinksMenu.module.css'

export function QuickLinksMenu() {
  return (
    <div className={styles.wrap}>
      <FloatingDropdown
        floatingClassName={styles.menu}
        label="Quick Links"
        triggerClassName={styles.trigger}
        triggerContent={(isOpen) => (
          <>
            <span>Quick Links</span>
            <ChevronDown
              className={styles.icon}
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
            <Link to="/security-center" role="menuitem" onClick={close}>
              Security center
            </Link>
          </>
        )}
      </FloatingDropdown>
    </div>
  )
}
