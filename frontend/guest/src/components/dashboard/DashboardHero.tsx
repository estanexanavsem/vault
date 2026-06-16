import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTimeGreeting } from '../../utils/formatters'
import { QuickLinksMenu } from './QuickLinksMenu'
import styles from './DashboardHero.module.css'

interface DashboardHeroProps {
  greetingName: string
}

export function DashboardHero({ greetingName }: DashboardHeroProps) {
  const [timeGreeting, setTimeGreeting] = useState(getTimeGreeting)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTimeGreeting(getTimeGreeting())
    }, 60_000)

    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <section className={styles.root}>
      <div className={styles.inner}>
        <h1>
          {timeGreeting}, {greetingName}
        </h1>
        <div className={styles.actions} aria-label="Quick actions">
          <Link to="/security-center">Security center</Link>
        </div>
        <QuickLinksMenu />
      </div>
    </section>
  )
}
