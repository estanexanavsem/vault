import { useLocation, useNavigate } from 'react-router-dom'
import type { GuestData } from '../../types/guest'
import { getAccountRoute } from '../../utils/accountRoute'
import { getDisplayName } from '../../utils/formatters'
import { getStatementLabel } from '../../utils/statementLabel'
import { AccountDetailsPage } from './AccountDetailsPage'
import { DashboardHome } from './DashboardHome'
import { Footer } from './Footer'
import { Topbar } from './Topbar'
import styles from './dashboard.module.css'

interface DashboardProps {
  data: GuestData
  onSignOut: () => void
}

export function Dashboard({ data, onSignOut }: DashboardProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const greetingName = getDisplayName(data.master)
  const statementLabel = getStatementLabel(data.files)
  const isAccountPage = location.pathname.startsWith('/accounts/')
  const showHome = () => navigate('/')
  const showAccount = () => navigate(getAccountRoute(data.master.id))

  return (
    <div className={styles.shell}>
      <Topbar
        greetingName={greetingName}
        isAccountPage={isAccountPage}
        onOpenAccount={showAccount}
        onShowHome={showHome}
        onSignOut={onSignOut}
      />

      {isAccountPage ? (
        <AccountDetailsPage data={data} onBack={showHome} />
      ) : (
        <DashboardHome
          data={data}
          greetingName={greetingName}
          onOpenAccount={showAccount}
          statementLabel={statementLabel}
        />
      )}

      <Footer />
    </div>
  )
}
