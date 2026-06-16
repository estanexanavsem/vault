import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  type useFloating,
  type useInteractions,
} from '@floating-ui/react'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import styles from './BalanceInfoModal.module.css'

interface BalanceInfoModalProps {
  children: ReactNode
  context: ReturnType<typeof useFloating>['context']
  floatingProps: ReturnType<typeof useInteractions>['getFloatingProps']
  onClose: () => void
  setFloatingNode: (node: HTMLElement | null) => void
  title: string
}

export function BalanceInfoModal({
  children,
  context,
  floatingProps,
  onClose,
  setFloatingNode,
  title,
}: BalanceInfoModalProps) {
  return (
    <FloatingPortal>
      <FloatingOverlay className={styles.overlay} lockScroll>
        <FloatingFocusManager context={context}>
          <section
            ref={setFloatingNode}
            aria-labelledby="balance-info-title"
            {...floatingProps({ className: styles.dialog })}
          >
            <button
              className={styles.close}
              type="button"
              aria-label={`Close ${title.toLowerCase()} information`}
              onClick={onClose}
            >
              <X size={18} aria-hidden="true" />
            </button>
            <h2 id="balance-info-title">{title}</h2>
            <div className={styles.body}>{children}</div>
            <button className={styles.action} type="button" onClick={onClose}>
              Close
            </button>
          </section>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  )
}
