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
    <aside className={styles.root} aria-label="Profile settings">
      <div className={styles.head}>
        <div className={styles.badge}>
          <span className={styles.avatar}>{initials}</span>
        </div>
        <h1>{fullName}</h1>
        {lastSignInText ? <p>Last sign-in at {lastSignInText}</p> : null}
      </div>

      <nav className={styles.nav} aria-label="Security center sections">
        <button className={styles.current} type="button">
          <UserRound size={20} aria-hidden="true" />
          Personal information
        </button>
      </nav>
    </aside>
  )
}
