import { ChevronDown, ChevronRight, Menu } from 'lucide-react'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { GuestData } from '../../types/guest'
import { getDisplayName } from '../../utils/formatters'
import { TruistMark } from '../common/TruistMark'
import { AccountCard } from './AccountCard'
import { AccountDetailsPage } from './AccountDetailsPage'
import { ActivityCard } from './ActivityCard'
import { Footer } from './Footer'
import { NotificationsCard } from './NotificationsCard'

interface DashboardProps {
  data: GuestData
  onSignOut: () => void
}

export function Dashboard({ data, onSignOut }: DashboardProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const greetingName = getDisplayName(data.master)
  const filesLabel = useMemo(() => {
    if (data.files.length === 0) {
      return 'Statements'
    }
    return `Statements (${data.files.length})`
  }, [data.files.length])
  const isAccountPage = location.pathname.startsWith('/accounts/')
  const showHome = () => navigate('/')
  const showAccount = () => navigate(`/accounts/${data.master.id}`)

  return (
    <div className="guest-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <button className="brand-link" type="button" aria-label="Truist home" onClick={showHome}>
            <TruistMark />
          </button>

          <nav className="desktop-nav" aria-label="Primary">
            <button className={!isAccountPage ? 'is-current' : ''} type="button" onClick={showHome}>
              Home
            </button>
            <button
              className={isAccountPage ? 'is-current' : ''}
              type="button"
              onClick={showAccount}
            >
              Accounts
            </button>
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

      {isAccountPage ? (
        <AccountDetailsPage data={data} onBack={showHome} />
      ) : (
        <>
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
                <AccountCard data={data} onOpenAccount={showAccount} />
                <ActivityCard onOpenAccount={showAccount} transfers={data.transfers} />
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
      )}

      <Footer />
    </div>
  )
}
