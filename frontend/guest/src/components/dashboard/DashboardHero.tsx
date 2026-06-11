import { useEffect, useState } from 'react'
import { getTimeGreeting } from '../../utils/formatters'
import { QuickLinksMenu } from './QuickLinksMenu'

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
    <section className="hero-band">
      <div className="hero-inner">
        <h1>
          {timeGreeting}, {greetingName}
        </h1>
        <div className="desktop-quick-actions" aria-label="Quick actions">
          <button type="button">{statementLabel}</button>
          <button type="button">Security center</button>
        </div>
        <QuickLinksMenu statementLabel={statementLabel} />
      </div>
    </section>
  )
}
