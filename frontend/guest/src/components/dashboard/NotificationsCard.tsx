import { Bell } from 'lucide-react'
import { cn } from '../../utils/cn'
import styles from './dashboard.module.css'

export function NotificationsCard() {
  return (
    <section
      className={cn(styles.card, styles.notificationsCard)}
      aria-labelledby="notifications-title"
    >
      <div className={styles.notificationsTitle}>
        <Bell size={24} aria-hidden="true" />
        <h2 id="notifications-title" className={styles.sectionKicker}>
          Notifications
        </h2>
      </div>
      <p>You're all caught up.</p>
    </section>
  )
}
