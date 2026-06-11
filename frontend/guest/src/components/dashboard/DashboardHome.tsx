import { ChevronRight } from 'lucide-react'
import type { GuestData } from '../../types/guest'
import { AccountCard } from './AccountCard'
import { ActivityCard } from './ActivityCard'
import { DashboardHero } from './DashboardHero'
import { NotificationsCard } from './NotificationsCard'

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

      <main className="dashboard-main" id="home">
        <div className="dashboard-grid">
          <div className="dashboard-left-column">
            <AccountCard data={data} onOpenAccount={onOpenAccount} />
            <ActivityCard onOpenAccount={onOpenAccount} transfers={data.transfers} />
          </div>

          <div className="dashboard-right-column">
            <NotificationsCard />
            <button className="thanks-card" type="button">
              <span>Thanks for banking with Truist.</span>
              <ChevronRight size={22} aria-hidden="true" />
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
