import type { GuestData } from '../../types/guest'
import { getAccountSummary } from '../../utils/accountSummary'
import { getLatestTransferSummary } from '../../utils/transferSummary'
import { AccountDetailHero } from './account-details/AccountDetailHero'
import { AccountDetailSidebar } from './account-details/AccountDetailSidebar'
import { DetailActivitySection } from './account-details/DetailActivitySection'
import { DetailCopy } from './account-details/DetailCopy'
import { DownloadAppCard } from './account-details/DownloadAppCard'
import styles from './account-details/account-details.module.css'

interface AccountDetailsPageProps {
  data: GuestData
  onBack: () => void
}

export function AccountDetailsPage({ data, onBack }: AccountDetailsPageProps) {
  const account = getAccountSummary(data.master)
  const transfer = getLatestTransferSummary(data.transfers, 'Zelle business payment from')

  return (
    <>
      <AccountDetailHero account={account} onBack={onBack} />

      <main className={styles.main} id="account-detail">
        <AccountDetailSidebar account={account} />
        <DetailActivitySection account={account} transfer={transfer} />
        <DetailCopy />
        <DownloadAppCard />
      </main>
    </>
  )
}
