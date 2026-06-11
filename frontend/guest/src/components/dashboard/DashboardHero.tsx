import { QuickLinksMenu } from './QuickLinksMenu'

interface DashboardHeroProps {
  greetingName: string
  statementLabel: string
}

export function DashboardHero({ greetingName, statementLabel }: DashboardHeroProps) {
  return (
    <section className="hero-band">
      <div className="hero-inner">
        <h1>Good afternoon, {greetingName}</h1>
        <div className="desktop-quick-actions" aria-label="Quick actions">
          <button type="button">{statementLabel}</button>
          <button type="button">Security center</button>
        </div>
        <QuickLinksMenu statementLabel={statementLabel} />
      </div>
    </section>
  )
}
