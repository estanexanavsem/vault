import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import { CircleDollarSign, Home, Menu, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { TruistMark } from '../common/TruistMark'
import { MobileNavItem } from './MobileNavItem'
import styles from './navigation.module.css'

interface MobileNavMenuProps {
  accountRoute: string
  isAccountPage: boolean
  isHomePage: boolean
  onSignOut: () => void
}

export function MobileNavMenu({
  accountRoute,
  isAccountPage,
  isHomePage,
  onSignOut,
}: MobileNavMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const close = () => setIsOpen(false)
  const { context, refs } = useFloating({
    onOpenChange: setIsOpen,
    open: isOpen,
  })
  const click = useClick(context)
  const dismiss = useDismiss(context, {
    outsidePressEvent: 'mousedown',
  })
  const role = useRole(context, { role: 'menu' })
  const { getFloatingProps, getReferenceProps } = useInteractions([click, dismiss, role])
  const setReferenceNode = useCallback(
    (node: HTMLButtonElement | null) => refs.setReference(node),
    [refs],
  )
  const setFloatingNode = useCallback((node: HTMLElement | null) => refs.setFloating(node), [refs])

  return (
    <>
      <button
        ref={setReferenceNode}
        type="button"
        {...getReferenceProps({
          'aria-label': 'Open menu',
          className: styles.mobileMenuButton,
        })}
      >
        <Menu size={24} aria-hidden="true" />
      </button>

      {isOpen ? (
        <FloatingPortal>
          <FloatingOverlay className={styles.mobileNavOverlay} lockScroll>
            <FloatingFocusManager context={context}>
              <section
                ref={setFloatingNode}
                {...getFloatingProps({ className: styles.mobileNavPanel })}
              >
                <div className={styles.mobileNavHead}>
                  <TruistMark className={styles.mobileNavMark} />
                  <button
                    className={styles.mobileNavClose}
                    type="button"
                    aria-label="Close menu"
                    onClick={close}
                  >
                    <X size={28} aria-hidden="true" />
                  </button>
                </div>

                <nav className={styles.mobileNavList} aria-label="Mobile primary">
                  <MobileNavItem
                    current={isHomePage}
                    icon={<Home size={23} aria-hidden="true" />}
                    onSelect={close}
                    to="/"
                  >
                    Home
                  </MobileNavItem>
                  <MobileNavItem
                    current={isAccountPage}
                    icon={<CircleDollarSign size={23} aria-hidden="true" />}
                    onSelect={close}
                    to={accountRoute}
                  >
                    Accounts
                  </MobileNavItem>
                </nav>

                <div className={styles.mobileNavFooter}>
                  <button
                    className={styles.mobileNavSignOut}
                    type="button"
                    onClick={() => {
                      close()
                      onSignOut()
                    }}
                  >
                    Sign out
                  </button>
                </div>
              </section>
            </FloatingFocusManager>
          </FloatingOverlay>
        </FloatingPortal>
      ) : null}
    </>
  )
}
