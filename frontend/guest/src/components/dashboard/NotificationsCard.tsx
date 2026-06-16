import { Bell } from 'lucide-react'
import { cn } from '../../utils/cn'
import styles from './NotificationsCard.module.css'

export function NotificationsCard() {
  return (
    <section className={cn(styles.card)} aria-labelledby="notifications-title">
      <div className={styles.title}>
        <Bell size={24} aria-hidden="true" />
        <h2 id="notifications-title" className={styles.kicker}>
          Notifications
        </h2>
      </div>
      <p>You're all caught up.</p>
    </section>
  )
}
