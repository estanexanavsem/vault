import { useMemo } from 'react'
import type { Account, AccountFile, Transfer } from '../types'
import { formatCurrency } from '../utils/formatters'
import { getAccountFacts, getAccountSelectOptions } from '../utils/panelWorkspace'
import { getAccountTransferBalance } from '../utils/transferBalance'
import { AccountSummary } from './AccountSummary'
import { AccountWorkspaceHeader } from './AccountWorkspaceHeader'
import { WorkspaceTabs } from './WorkspaceTabs'

interface PanelWorkspaceProps {
  activeTab: string
  accounts: Account[]
  transfers: Transfer[]
  files: AccountFile[]
  selectedAccount: Account | null
  selectedTransfer: Transfer | null
  activeAccountId: number | null
  selectedTransferId: number | null
  selectedFileId: number | null
  accountsLoading: boolean
  transfersLoading: boolean
  filesLoading: boolean
  accountsError: Error | null
  transfersError: Error | null
  filesError: Error | null
  onTabChange: (tab: string) => void
  onSelectAccount: (id: number) => void
  onSelectTransfer: (id: number) => void
  onSelectFile: (id: number) => void
  onCreateAccount: () => void
  onEditAccount: (id: number) => void
  onDeleteAccount: (id: number) => void
  onCreateTransfer: () => void
  onEditTransfer: (id: number) => void
  onDeleteTransfer: (id: number) => void
  onCreateFile: () => void
  onEditFile: (id: number) => void
  onDeleteFile: (id: number) => void
}

export function PanelWorkspace({
  activeTab,
  accounts,
  transfers,
  files,
  selectedAccount,
  selectedTransfer,
  activeAccountId,
  selectedTransferId,
  selectedFileId,
  accountsLoading,
  transfersLoading,
  filesLoading,
  accountsError,
  transfersError,
  filesError,
  onTabChange,
  onSelectAccount,
  onSelectTransfer,
  onSelectFile,
  onCreateAccount,
  onEditAccount,
  onDeleteAccount,
  onCreateTransfer,
  onEditTransfer,
  onDeleteTransfer,
  onCreateFile,
  onEditFile,
  onDeleteFile,
}: PanelWorkspaceProps) {
  const accountOptions = useMemo(() => getAccountSelectOptions(accounts), [accounts])
  const accountFacts = useMemo(() => getAccountFacts(selectedAccount), [selectedAccount])
  const selectedAccountBalance = useMemo(
    () =>
      selectedAccount
        ? formatCurrency(getAccountTransferBalance(transfers, selectedAccount.id))
        : '$0.00',
    [selectedAccount, transfers],
  )

  return (
    <>
      <AccountWorkspaceHeader
        accounts={accounts}
        accountOptions={accountOptions}
        activeAccountId={activeAccountId}
        accountsLoading={accountsLoading}
        onSelectAccount={onSelectAccount}
        onCreateAccount={onCreateAccount}
      />

      {accountsError && (
        <p className="mb-3 text-sm text-red-400">
          Не удалось загрузить аккаунты: {accountsError.message}
        </p>
      )}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
        <AccountSummary
          account={selectedAccount}
          accountFacts={accountFacts}
          balance={selectedAccountBalance}
          onEditAccount={onEditAccount}
          onDeleteAccount={onDeleteAccount}
        />

        <WorkspaceTabs
          activeTab={activeTab}
          transfers={transfers}
          files={files}
          selectedTransfer={selectedTransfer}
          activeAccountId={activeAccountId}
          selectedTransferId={selectedTransferId}
          selectedFileId={selectedFileId}
          transfersLoading={transfersLoading}
          filesLoading={filesLoading}
          transfersError={transfersError}
          filesError={filesError}
          onTabChange={onTabChange}
          onSelectTransfer={onSelectTransfer}
          onSelectFile={onSelectFile}
          onCreateTransfer={onCreateTransfer}
          onEditTransfer={onEditTransfer}
          onDeleteTransfer={onDeleteTransfer}
          onCreateFile={onCreateFile}
          onEditFile={onEditFile}
          onDeleteFile={onDeleteFile}
        />
      </div>
    </>
  )
}
