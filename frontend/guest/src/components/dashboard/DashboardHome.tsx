import { ChevronRight } from 'lucide-react'
import type { GuestData } from '../../types/guest'
import { AccountCard } from './AccountCard'
import { ActivityCard } from './ActivityCard'
import { DashboardHero } from './DashboardHero'
import { NotificationsCard } from './NotificationsCard'
import styles from './DashboardHome.module.css'

interface DashboardHomeProps {
  accountRoute: string
  data: GuestData
  greetingName: string
}

export function DashboardHome({ accountRoute, data, greetingName }: DashboardHomeProps) {
  return (
    <>
      <DashboardHero greetingName={greetingName} />

      <main className={styles.dashboardMain} id="home">
        <div className={styles.dashboardGrid}>
          <div className={styles.dashboardLeftColumn}>
            <AccountCard accountRoute={accountRoute} data={data} />
            <ActivityCard accountRoute={accountRoute} transfers={data.transfers} />
          </div>

          <div className={styles.dashboardRightColumn}>
            <NotificationsCard />
            <a
              className={styles.thanksCard}
              href="https://www.truist.com/digital-banking"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Thanks for banking with Truist.</span>
              <ChevronRight size={22} aria-hidden="true" />
            </a>
          </div>
        </div>
      </main>
    </>
  )
}
