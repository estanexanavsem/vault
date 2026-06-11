import { Bell } from 'lucide-react'

export function NotificationsCard() {
  return (
    <section className="dashboard-card notifications-card" aria-labelledby="notifications-title">
      <div className="notifications-title">
        <Bell size={18} aria-hidden="true" />
        <h2 id="notifications-title" className="section-kicker">
          Notifications
        </h2>
      </div>
      <p>You're all caught up.</p>
    </section>
  )
}
