import { useState } from 'react'
import type { GuestData } from '../../types/guest'
import { getAccountSummary } from '../../utils/accountSummary'
import { cn } from '../../utils/cn'
import { formatCurrency } from '../../utils/formatters'
import { getLatestTransferSummary, getTransferSummaries } from '../../utils/transferSummary'
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
  const [isAccountDetailsOpen, setAccountDetailsOpen] = useState(false)
  const account = getAccountSummary(data.master)
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

      <main
        className={cn(styles.main, isAccountDetailsOpen && styles.mainDetailsOpen)}
        id="account-detail"
      >
        <AccountDetailSidebar account={account} />
        <DetailActivitySection transfers={transferSummaries} />
        <DetailCopy />
        <DownloadAppCard />
      </main>
    </>
  )
}
