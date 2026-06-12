import { lazy, Suspense } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { GuestData, MasterAccount } from '../../types/guest'
import { getAccountRoute } from '../../utils/accountRoute'
import { getDisplayName } from '../../utils/formatters'
import { DashboardHome } from './DashboardHome'
import { Footer } from './Footer'
import { Topbar } from './Topbar'
import styles from './dashboard.module.css'

const AccountDetailsPage = lazy(() =>
  import('./AccountDetailsPage').then((module) => ({ default: module.AccountDetailsPage })),
)
const SecurityCenterPage = lazy(() =>
  import('./SecurityCenterPage').then((module) => ({ default: module.SecurityCenterPage })),
)

interface DashboardProps {
  data: GuestData
  onAccountUpdate: (account: MasterAccount) => void
  onSignOut: () => void
}

function DashboardPageFallback() {
  return <main className={styles.pageFallback} aria-label="Loading page" />
}

export function Dashboard({ data, onAccountUpdate, onSignOut }: DashboardProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const greetingName = getDisplayName(data.master)
  const isAccountPage = location.pathname.startsWith('/accounts/')
  const isSecurityCenterPage = location.pathname === '/security-center'
  const showHome = () => navigate('/')
  const showAccount = () => navigate(getAccountRoute(data.master.id))
  const showSecurityCenter = () => navigate('/security-center')

  return (
    <div className={styles.shell}>
      <Topbar
        greetingName={greetingName}
        isAccountPage={isAccountPage}
        isHomePage={!isAccountPage && !isSecurityCenterPage}
        onOpenAccount={showAccount}
        onShowHome={showHome}
        onSignOut={onSignOut}
      />

      {isAccountPage ? (
        <Suspense fallback={<DashboardPageFallback />}>
          <AccountDetailsPage data={data} onBack={showHome} />
        </Suspense>
      ) : isSecurityCenterPage ? (
        <Suspense fallback={<DashboardPageFallback />}>
          <SecurityCenterPage
            account={data.master}
            onAccountUpdate={onAccountUpdate}
            onBack={showHome}
          />
        </Suspense>
      ) : (
        <DashboardHome
          data={data}
          greetingName={greetingName}
          onOpenAccount={showAccount}
          onOpenSecurityCenter={showSecurityCenter}
        />
      )}

      <Footer />
    </div>
  )
}
