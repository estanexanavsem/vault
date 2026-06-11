import { useEffect, useState } from 'react'
import { getTimeGreeting } from '../../utils/formatters'
import { QuickLinksMenu } from './QuickLinksMenu'
import styles from './dashboard.module.css'

interface DashboardHeroProps {
  greetingName: string
  statementLabel: string
}

export function DashboardHero({ greetingName, statementLabel }: DashboardHeroProps) {
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
          <button type="button">{statementLabel}</button>
          <button type="button">Security center</button>
        </div>
        <QuickLinksMenu statementLabel={statementLabel} />
      </div>
    </section>
  )
}
