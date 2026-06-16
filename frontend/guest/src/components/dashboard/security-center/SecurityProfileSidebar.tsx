import { UserRound } from 'lucide-react'
import styles from './SecurityProfileSidebar.module.css'

interface SecurityProfileSidebarProps {
  fullName: string
  initials: string
  lastSignInText: string
}

export function SecurityProfileSidebar({
  fullName,
  initials,
  lastSignInText,
}: SecurityProfileSidebarProps) {
  return (
    <aside className={styles.sidebar} aria-label="Profile settings">
      <div className={styles.profile}>
        <div className={styles.avatarWrap}>
          <span className={styles.avatar}>{initials}</span>
        </div>
        <h1>{fullName}</h1>
        {lastSignInText ? <p>Last sign-in at {lastSignInText}</p> : null}
      </div>

      <nav className={styles.sideNav} aria-label="Security center sections">
        <button className={styles.sideNavCurrent} type="button">
          <UserRound size={20} aria-hidden="true" />
          Personal information
        </button>
      </nav>
    </aside>
  )
}
