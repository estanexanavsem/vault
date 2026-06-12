import { useLocation, useNavigate } from 'react-router-dom'
import type { GuestData, MasterAccount } from '../../types/guest'
import { getAccountRoute } from '../../utils/accountRoute'
import { getDisplayName } from '../../utils/formatters'
import { AccountDetailsPage } from './AccountDetailsPage'
import { DashboardHome } from './DashboardHome'
import { Footer } from './Footer'
import { SecurityCenterPage } from './SecurityCenterPage'
import { Topbar } from './Topbar'
import styles from './dashboard.module.css'

interface DashboardProps {
  data: GuestData
  onAccountUpdate: (account: MasterAccount) => void
  onSignOut: () => void
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
        <AccountDetailsPage data={data} onBack={showHome} />
      ) : isSecurityCenterPage ? (
        <SecurityCenterPage
          account={data.master}
          onAccountUpdate={onAccountUpdate}
          onBack={showHome}
        />
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
