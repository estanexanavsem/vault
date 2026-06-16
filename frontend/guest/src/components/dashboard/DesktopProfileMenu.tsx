import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import { ShieldCheck, UserRound } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './DesktopProfileMenu.module.css'

interface DesktopProfileMenuProps {
  greetingName: string
  lastSignInText: string
}

export function DesktopProfileMenu({ greetingName, lastSignInText }: DesktopProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { context, refs } = useFloating({
    middleware: [offset(14), flip(), shift({ padding: 24 })],
    onOpenChange: setIsOpen,
    open: isOpen,
    placement: 'bottom-end',
    whileElementsMounted: autoUpdate,
  })
  const click = useClick(context)
  const dismiss = useDismiss(context, {
    outsidePressEvent: 'mousedown',
  })
  const role = useRole(context, { role: 'dialog' })
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
          'aria-expanded': isOpen,
          'aria-label': `${greetingName} profile`,
          className: styles.trigger,
        })}
      >
        {greetingName.slice(0, 2).toUpperCase()}
      </button>

      {isOpen ? (
        <FloatingPortal>
          <FloatingOverlay
            className={styles.overlay}
            style={{ top: 'var(--size-header-height)' }}
            lockScroll
          >
            <FloatingFocusManager context={context}>
              <section
                ref={setFloatingNode}
                {...getFloatingProps({
                  'aria-labelledby': 'desktop-profile-menu-title',
                  className: styles.panel,
                })}
              >
                <div className={styles.head}>
                  <h2 id="desktop-profile-menu-title">Hello, {greetingName}</h2>
                  {lastSignInText ? <p>Last sign in: {lastSignInText}</p> : null}
                </div>

                <nav className={styles.grid} aria-label="Profile menu">
                  <Link to="/security-center" onClick={() => setIsOpen(false)}>
                    <UserRound size={22} aria-hidden="true" />
                    <span>
                      <strong>Personal information</strong>
                      <small>Mailing address, email address, phone number</small>
                    </span>
                  </Link>
                  <Link to="/security-center" onClick={() => setIsOpen(false)}>
                    <ShieldCheck size={22} aria-hidden="true" />
                    <span>
                      <strong>Security center</strong>
                      <small>Sign-in preferences, access history, devices</small>
                    </span>
                  </Link>
                </nav>
              </section>
            </FloatingFocusManager>
          </FloatingOverlay>
        </FloatingPortal>
      ) : null}
    </>
  )
}
