import { useEffect, useState } from 'react'
import { getTimeGreeting } from '../../utils/formatters'
import { QuickLinksMenu } from './QuickLinksMenu'
import styles from './dashboard.module.css'

interface DashboardHeroProps {
  greetingName: string
  onOpenSecurityCenter: () => void
}

export function DashboardHero({ greetingName, onOpenSecurityCenter }: DashboardHeroProps) {
  const [timeGreeting, setTimeGreeting] = useState(getTimeGreeting)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTimeGreeting(getTimeGreeting())
    }, 60_000)

    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <section className={styles.heroBand}>
      <div className={styles.heroInner}>
        <h1>
          {timeGreeting}, {greetingName}
        </h1>
        <div className={styles.desktopQuickActions} aria-label="Quick actions">
          <button type="button">Statements</button>
          <button type="button" onClick={onOpenSecurityCenter}>
            Security center
          </button>
        </div>
        <QuickLinksMenu onOpenSecurityCenter={onOpenSecurityCenter} />
      </div>
    </section>
  )
}
