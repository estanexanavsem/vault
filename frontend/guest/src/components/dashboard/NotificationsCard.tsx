import { Bell } from 'lucide-react'
import { cn } from '../../utils/cn'
import primitiveStyles from './DashboardPrimitives.module.css'
import styles from './NotificationsCard.module.css'

export function NotificationsCard() {
  return (
    <section
      className={cn(primitiveStyles.card, styles.card)}
      aria-labelledby="notifications-title"
    >
      <div className={styles.title}>
        <Bell size={24} aria-hidden="true" />
        <h2 id="notifications-title" className={primitiveStyles.kicker}>
          Notifications
        </h2>
      </div>
      <p>You're all caught up.</p>
    </section>
  )
}
