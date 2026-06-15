import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { TruistMark } from '../common/TruistMark'
import { DesktopProfileMenu } from './DesktopProfileMenu'
import { MobileNavMenu } from './MobileNavMenu'
import styles from './navigation.module.css'

interface TopbarProps {
  accountRoute: string
  greetingName: string
  isAccountPage: boolean
  isHomePage: boolean
  lastSignInText: string
  onSignOut: () => void
}

export function Topbar({
  accountRoute,
  greetingName,
  isAccountPage,
  isHomePage,
  lastSignInText,
  onSignOut,
}: TopbarProps) {
  return (
    <header className={styles.topbar}>
      <div className={styles.topbarInner}>
        <Link className={styles.brandLink} to="/" aria-label="Truist home">
          <TruistMark />
        </Link>

        <nav className={styles.desktopNav} aria-label="Primary">
          <Link className={cn(isHomePage && styles.current)} to="/">
            Home
          </Link>
          <Link className={cn(isAccountPage && styles.current)} to={accountRoute}>
            Accounts
          </Link>
        </nav>

        <div className={styles.desktopSession}>
          <DesktopProfileMenu greetingName={greetingName} lastSignInText={lastSignInText} />
          <span className={styles.statusDot} aria-hidden="true" />
          <button className={styles.signOutButton} onClick={onSignOut} type="button">
            Sign out
          </button>
        </div>

        <MobileNavMenu
          accountRoute={accountRoute}
          isAccountPage={isAccountPage}
          isHomePage={isHomePage}
          onSignOut={onSignOut}
        />
      </div>
    </header>
  )
}
