import { lazy, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useLocation, useNavigate } from 'react-router-dom'
import type { GuestData } from '../../types/guest'
import { getAccountRoute } from '../../utils/accountRoute'
import { logBoundaryError } from '../../utils/errorBoundary'
import { formatProfileMenuDateTime, getDisplayName } from '../../utils/formatters'
import { ErrorFallback } from '../common/ErrorFallback'
import { DashboardPageFallback } from './DashboardPageFallback'
import { DashboardHome } from './DashboardHome'
import { Footer } from './Footer'
import { Topbar } from './Topbar'
import styles from './Dashboard.module.css'

const AccountDetailsPage = lazy(() =>
  import('./AccountDetailsPage').then((module) => ({ default: module.AccountDetailsPage })),
)
const SecurityCenterPage = lazy(() =>
  import('./SecurityCenterPage').then((module) => ({ default: module.SecurityCenterPage })),
)

interface DashboardProps {
  data: GuestData
  onSignOut: () => void
}

export function Dashboard({ data, onSignOut }: DashboardProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const greetingName = getDisplayName(data.master)
  const lastSignInText = data.master.last_sign_in_at
    ? formatProfileMenuDateTime(data.master.last_sign_in_at)
    : ''
  const accountRoute = getAccountRoute(data.master.id)
  const isAccountPage = location.pathname.startsWith('/accounts/')
  const isSecurityCenterPage = location.pathname === '/security-center'
  const showHome = () => navigate('/')
  const pageBoundaryKeys = [location.pathname, data.master.id]

  return (
    <div className={styles.shell}>
      <Topbar
        accountRoute={accountRoute}
        greetingName={greetingName}
        isAccountPage={isAccountPage}
        isHomePage={!isAccountPage && !isSecurityCenterPage}
        lastSignInText={lastSignInText}
        onSignOut={onSignOut}
      />

      <ErrorBoundary
        fallbackRender={(props) => (
          <ErrorFallback
            {...props}
            scope="page"
            onBack={isAccountPage || isSecurityCenterPage ? showHome : undefined}
          />
        )}
        onError={logBoundaryError}
        resetKeys={pageBoundaryKeys}
      >
        {isAccountPage ? (
          <Suspense fallback={<DashboardPageFallback />}>
            <AccountDetailsPage data={data} onBack={showHome} />
          </Suspense>
        ) : isSecurityCenterPage ? (
          <Suspense fallback={<DashboardPageFallback />}>
            <SecurityCenterPage
              account={data.master}
              onBack={showHome}
              onSessionExpired={onSignOut}
            />
          </Suspense>
        ) : (
          <DashboardHome accountRoute={accountRoute} data={data} greetingName={greetingName} />
        )}
      </ErrorBoundary>

      <Footer />
    </div>
  )
}
