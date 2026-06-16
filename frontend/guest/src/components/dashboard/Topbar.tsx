import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { TruistMark } from '../common/TruistMark'
import { DesktopProfileMenu } from './DesktopProfileMenu'
import { MobileNavMenu } from './MobileNavMenu'
import styles from './Topbar.module.css'

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
    <header className={styles.root}>
      <div className={styles.inner}>
        <Link className={styles.brand} to="/" aria-label="Truist home">
          <TruistMark />
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <Link className={cn(isHomePage && styles.current)} to="/">
            Home
          </Link>
          <Link className={cn(isAccountPage && styles.current)} to={accountRoute}>
            Accounts
          </Link>
        </nav>

        <div className={styles.session}>
          <DesktopProfileMenu greetingName={greetingName} lastSignInText={lastSignInText} />
          <span className={styles.status} aria-hidden="true" />
          <button className={styles.signout} onClick={onSignOut} type="button">
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
