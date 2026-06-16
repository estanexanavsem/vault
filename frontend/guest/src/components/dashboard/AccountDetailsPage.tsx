import { useState } from 'react'
import type { GuestData } from '../../types/guest'
import { getAccountSummary } from '../../utils/accountSummary'
import { formatCurrency } from '../../utils/formatters'
import { getTransferBalance } from '../../utils/transferBalance'
import { getLatestTransferSummary, getTransferSummaries } from '../../utils/transferSummary'
import { AccountDetailHero } from './account-details/AccountDetailHero'
import { AccountDetailSidebar } from './account-details/AccountDetailSidebar'
import { DetailActivitySection } from './account-details/DetailActivitySection'
import { DetailCopy } from './account-details/DetailCopy'
import { DownloadAppCard } from './account-details/DownloadAppCard'
import styles from './AccountDetailsPage.module.css'

interface AccountDetailsPageProps {
  data: GuestData
  onBack: () => void
}

export function AccountDetailsPage({ data, onBack }: AccountDetailsPageProps) {
  const [isAccountDetailsOpen, setAccountDetailsOpen] = useState(false)
  const account = getAccountSummary(data.master, getTransferBalance(data.transfers))
  const transfer = getLatestTransferSummary(data.transfers)
  const transferSummaries = getTransferSummaries(data.transfers)
  const lastDepositText = transfer ? formatCurrency(Math.abs(transfer.amount)) : ''

  return (
    <>
      <AccountDetailHero
        account={account}
        accountDetails={data.master}
        isAccountDetailsOpen={isAccountDetailsOpen}
        lastDepositText={lastDepositText}
        onAccountDetailsOpenChange={setAccountDetailsOpen}
        onBack={onBack}
      />

      <main className={styles.main} id="account-detail">
        <AccountDetailSidebar account={account} />
        <DetailActivitySection
          isAccountDetailsOpen={isAccountDetailsOpen}
          transfers={transferSummaries}
        />
        <DetailCopy />
        <DownloadAppCard />
      </main>
    </>
  )
}
