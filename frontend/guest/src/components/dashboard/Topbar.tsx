import { cn } from '../../utils/cn'
import { TruistMark } from '../common/TruistMark'
import { MobileNavMenu } from './MobileNavMenu'
import styles from './navigation.module.css'

interface TopbarProps {
  greetingName: string
  isAccountPage: boolean
  isHomePage: boolean
  onOpenAccount: () => void
  onShowHome: () => void
  onSignOut: () => void
}

export function Topbar({
  greetingName,
  isAccountPage,
  isHomePage,
  onOpenAccount,
  onShowHome,
  onSignOut,
}: TopbarProps) {
  return (
    <header className={styles.topbar}>
      <div className={styles.topbarInner}>
        <button
          className={styles.brandLink}
          type="button"
          aria-label="Truist home"
          onClick={onShowHome}
        >
          <TruistMark />
        </button>

        <nav className={styles.desktopNav} aria-label="Primary">
          <button className={cn(isHomePage && styles.current)} type="button" onClick={onShowHome}>
            Home
          </button>
          <button
            className={cn(isAccountPage && styles.current)}
            type="button"
            onClick={onOpenAccount}
          >
            Accounts
          </button>
          <a href="#transfer">Transfer &amp; pay</a>
          <a href="#business">Business tools</a>
          <a href="#support">Help &amp; support</a>
        </nav>

        <div className={styles.desktopSession}>
          <span className={styles.avatar} aria-label={`${greetingName} profile`}>
            {greetingName.slice(0, 2).toUpperCase()}
          </span>
          <span className={styles.statusDot} aria-hidden="true" />
          <button className={styles.signOutButton} onClick={onSignOut} type="button">
            Sign out
          </button>
        </div>

        <MobileNavMenu
          isAccountPage={isAccountPage}
          isHomePage={isHomePage}
          onOpenAccount={onOpenAccount}
          onShowHome={onShowHome}
          onSignOut={onSignOut}
        />
      </div>
    </header>
  )
}
