import { ChevronDown, ChevronRight, Menu } from 'lucide-react'
import { useMemo } from 'react'
import type { GuestData } from '../../types/guest'
import { getDisplayName } from '../../utils/formatters'
import { TruistMark } from '../common/TruistMark'
import { AccountCard } from './AccountCard'
import { ActivityCard } from './ActivityCard'
import { Footer } from './Footer'
import { NotificationsCard } from './NotificationsCard'

interface DashboardProps {
  data: GuestData
  onSignOut: () => void
}

export function Dashboard({ data, onSignOut }: DashboardProps) {
  const greetingName = getDisplayName(data.master)
  const filesLabel = useMemo(() => {
    if (data.files.length === 0) {
      return 'Statements'
    }
    return `Statements (${data.files.length})`
  }, [data.files.length])

  return (
    <div className="guest-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand-link" href="#home" aria-label="Truist home">
            <TruistMark />
          </a>

          <nav className="desktop-nav" aria-label="Primary">
            <a className="is-current" href="#home">
              Home
            </a>
            <a href="#accounts">Accounts</a>
            <a href="#transfer">Transfer &amp; pay</a>
            <a href="#business">Business tools</a>
            <a href="#support">Help &amp; support</a>
          </nav>

          <div className="desktop-session">
            <span className="avatar" aria-label={`${greetingName} profile`}>
              {greetingName.slice(0, 2).toUpperCase()}
            </span>
            <span className="status-dot" aria-hidden="true" />
            <button className="sign-out-button" onClick={onSignOut} type="button">
              Sign out
            </button>
          </div>

          <button className="mobile-menu-button" type="button" aria-label="Open menu">
            <Menu size={24} aria-hidden="true" />
          </button>
        </div>
      </header>

      <section className="hero-band">
        <div className="hero-inner">
          <h1>Good afternoon, {greetingName}</h1>
          <div className="desktop-quick-actions" aria-label="Quick actions">
            <button type="button">{filesLabel}</button>
            <button type="button">Security center</button>
          </div>
          <button className="mobile-quick-links" type="button">
            <span>Quick Links</span>
            <ChevronDown size={22} aria-hidden="true" />
          </button>
        </div>
      </section>

      <main className="dashboard-main" id="home">
        <div className="dashboard-grid">
          <div className="dashboard-left-column">
            <AccountCard data={data} />
            <ActivityCard transfers={data.transfers} />
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

      <Footer />
    </div>
  )
}
