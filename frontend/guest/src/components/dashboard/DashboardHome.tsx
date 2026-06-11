import { ChevronRight } from 'lucide-react'
import type { GuestData } from '../../types/guest'
import { AccountCard } from './AccountCard'
import { ActivityCard } from './ActivityCard'
import { DashboardHero } from './DashboardHero'
import { NotificationsCard } from './NotificationsCard'
import styles from './dashboard.module.css'

interface DashboardHomeProps {
  data: GuestData
  greetingName: string
  onOpenAccount: () => void
  statementLabel: string
}

export function DashboardHome({
  data,
  greetingName,
  onOpenAccount,
  statementLabel,
}: DashboardHomeProps) {
  return (
    <>
      <DashboardHero greetingName={greetingName} statementLabel={statementLabel} />

      <main className={styles.dashboardMain} id="home">
        <div className={styles.dashboardGrid}>
          <div className={styles.dashboardLeftColumn}>
            <AccountCard data={data} onOpenAccount={onOpenAccount} />
            <ActivityCard onOpenAccount={onOpenAccount} transfers={data.transfers} />
          </div>

          <div className={styles.dashboardRightColumn}>
            <NotificationsCard />
            <button className={styles.thanksCard} type="button">
              <span>Thanks for banking with Truist.</span>
              <ChevronRight size={22} aria-hidden="true" />
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
