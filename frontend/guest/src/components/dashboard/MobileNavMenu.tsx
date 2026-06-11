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
import {
  ArrowLeftRight,
  CircleDollarSign,
  CircleHelp,
  ClipboardList,
  Home,
  Menu,
  UserRound,
  X,
} from 'lucide-react'
import { useCallback, useState, type ReactNode } from 'react'
import { TruistMark } from '../common/TruistMark'

interface MobileNavMenuProps {
  isAccountPage: boolean
  onOpenAccount: () => void
  onShowHome: () => void
  onSignOut: () => void
}

interface MobileNavItemProps {
  children: ReactNode
  current?: boolean
  icon: ReactNode
  onSelect?: () => void
  href?: string
}

function MobileNavItem({ children, current = false, href, icon, onSelect }: MobileNavItemProps) {
  const className = current ? 'mobile-nav-item is-current' : 'mobile-nav-item'
  const content = (
    <>
      {icon}
      <span>{children}</span>
    </>
  )

  if (href) {
    return (
      <a className={className} href={href} role="menuitem" onClick={onSelect}>
        {content}
      </a>
    )
  }

  return (
    <button className={className} type="button" role="menuitem" onClick={onSelect}>
      {content}
    </button>
  )
}

export function MobileNavMenu({
  isAccountPage,
  onOpenAccount,
  onShowHome,
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
        {...getReferenceProps({
          'aria-label': 'Open menu',
          className: 'mobile-menu-button',
          type: 'button',
        })}
      >
        <Menu size={24} aria-hidden="true" />
      </button>

      {isOpen ? (
        <FloatingPortal>
          <FloatingOverlay className="mobile-nav-overlay" lockScroll>
            <FloatingFocusManager context={context}>
              <section
                ref={setFloatingNode}
                {...getFloatingProps({ className: 'mobile-nav-panel' })}
              >
                <div className="mobile-nav-head">
                  <TruistMark />
                  <button
                    className="mobile-nav-close"
                    type="button"
                    aria-label="Close menu"
                    onClick={close}
                  >
                    <X size={28} aria-hidden="true" />
                  </button>
                </div>

                <nav className="mobile-nav-list" aria-label="Mobile primary">
                  <MobileNavItem
                    current={!isAccountPage}
                    icon={<Home size={23} aria-hidden="true" />}
                    onSelect={() => {
                      close()
                      onShowHome()
                    }}
                  >
                    Home
                  </MobileNavItem>
                  <MobileNavItem
                    current={isAccountPage}
                    icon={<CircleDollarSign size={23} aria-hidden="true" />}
                    onSelect={() => {
                      close()
                      onOpenAccount()
                    }}
                  >
                    Accounts
                  </MobileNavItem>
                  <MobileNavItem
                    href="#transfer"
                    icon={<ArrowLeftRight size={23} aria-hidden="true" />}
                    onSelect={close}
                  >
                    Transfer &amp; pay
                  </MobileNavItem>
                  <MobileNavItem
                    href="#business"
                    icon={<ClipboardList size={23} aria-hidden="true" />}
                    onSelect={close}
                  >
                    Business tools
                  </MobileNavItem>
                  <MobileNavItem
                    href="#support"
                    icon={<CircleHelp size={23} aria-hidden="true" />}
                    onSelect={close}
                  >
                    Help &amp; support
                  </MobileNavItem>
                  <MobileNavItem icon={<UserRound size={23} aria-hidden="true" />}>
                    Profile &amp; settings
                  </MobileNavItem>
                </nav>

                <div className="mobile-nav-footer">
                  <button
                    className="mobile-nav-sign-out"
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
