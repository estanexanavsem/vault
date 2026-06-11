import { Menu } from 'lucide-react'
import { TruistMark } from '../common/TruistMark'

interface TopbarProps {
  greetingName: string
  isAccountPage: boolean
  onOpenAccount: () => void
  onShowHome: () => void
  onSignOut: () => void
}

export function Topbar({
  greetingName,
  isAccountPage,
  onOpenAccount,
  onShowHome,
  onSignOut,
}: TopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <button className="brand-link" type="button" aria-label="Truist home" onClick={onShowHome}>
          <TruistMark />
        </button>

        <nav className="desktop-nav" aria-label="Primary">
          <button className={!isAccountPage ? 'is-current' : ''} type="button" onClick={onShowHome}>
            Home
          </button>
          <button
            className={isAccountPage ? 'is-current' : ''}
            type="button"
            onClick={onOpenAccount}
          >
            Accounts
          </button>
          <a href="#transfer">Transfer &amp; pay</a>
          <a href="#business">Business tools</a>
          <a href="#support">Help &amp; support</a>
        </nav>

        <div className="desktop-session">
          <span className="avatar" aria-label={`${greetingName} profile`}>
            {greetingName.slice(0, 2).toUpperCase()}
          </span>
          <span className="status-dot" aria-hidden="true" />
          <button className="sign-out-button" onClick={onSignOut} type="button">
            Sign out
          </button>
        </div>

        <button className="mobile-menu-button" type="button" aria-label="Open menu">
          <Menu size={24} aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
