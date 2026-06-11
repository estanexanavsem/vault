import { ChevronDown } from 'lucide-react'
import { FloatingDropdown } from '../common/FloatingDropdown'

interface QuickLinksMenuProps {
  statementLabel: string
}

export function QuickLinksMenu({ statementLabel }: QuickLinksMenuProps) {
  return (
    <div className="mobile-quick-links-wrap">
      <FloatingDropdown
        floatingClassName="mobile-quick-links-menu"
        label="Quick Links"
        triggerClassName="mobile-quick-links"
        triggerContent={(isOpen) => (
          <>
            <span>Quick Links</span>
            <ChevronDown
              className="mobile-quick-links-icon"
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
