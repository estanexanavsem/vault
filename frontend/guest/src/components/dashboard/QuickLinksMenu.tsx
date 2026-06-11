import { ChevronDown } from 'lucide-react'
import { FloatingDropdown } from '../common/FloatingDropdown'
import styles from './navigation.module.css'

interface QuickLinksMenuProps {
  statementLabel: string
}

export function QuickLinksMenu({ statementLabel }: QuickLinksMenuProps) {
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
              {statementLabel}
            </button>
            <button type="button" role="menuitem" onClick={close}>
              Security center
            </button>
          </>
        )}
      </FloatingDropdown>
    </div>
  )
}
