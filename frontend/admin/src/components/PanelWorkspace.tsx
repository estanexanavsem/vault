import { Button, Tabs } from '@mantine/core'
import { ChevronDown, Plus } from 'lucide-react'
import type { Account, AccountFile, Transfer } from '../types'
import AccountTable from './AccountTable'
import TransferTable from './TransferTable'
import FileTable from './FileTable'

interface PanelWorkspaceProps {
  activeTab: string
  accounts: Account[]
  transfers: Transfer[]
  files: AccountFile[]
  selectedAccount: Account | null
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

function PanelWorkspace({
  activeTab,
  accounts,
  transfers,
  files,
  selectedAccount,
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
  const accountDetailsRows = selectedAccount
    ? [
        ['Холдер', selectedAccount.holder_name],
        ['Счет', selectedAccount.account_name],
        ['Полное имя счета', selectedAccount.full_account_name],
        ['Номер', selectedAccount.account_number],
        ['Роутинг', selectedAccount.routing_number],
        ['Эл. почта', selectedAccount.email],
        ['Телефон', selectedAccount.phone],
      ].filter(([, value]) => value !== '')
    : []
  const selectedAccountBalance = selectedAccount
    ? `$${Number(selectedAccount.balance).toFixed(2)}`
    : '$0.00'
  const selectedAccountSubtitle = selectedAccount
    ? [
        selectedAccount.holder_name,
        selectedAccount.full_account_name,
        selectedAccount.account_name,
      ].find((value) => value.trim() !== '')
    : undefined

  return (
    <>
      <header className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
        <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">Аккаунты</h1>
        <Button
          leftSection={<Plus size={16} />}
          color="blue"
          size="sm"
          className="!h-10 shrink-0"
          onClick={onCreateAccount}
        >
          Добавить аккаунт
        </Button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-800 bg-slate-900 lg:flex-row">
        <div className="max-h-[34dvh] min-h-0 overflow-auto border-b border-slate-800 p-2 sm:p-3 lg:max-h-none lg:w-2/5 lg:border-r lg:border-b-0 lg:p-4">
          <AccountTable
            accounts={accounts}
            selectedAccountId={activeAccountId}
            isLoading={accountsLoading}
            error={accountsError}
            onSelectAccount={onSelectAccount}
            onEditAccount={onEditAccount}
            onDeleteAccount={onDeleteAccount}
          />
        </div>

        <div className="min-h-0 min-w-0 flex-1 overflow-auto p-3 lg:w-3/5 lg:p-4">
          {selectedAccount ? (
            <section className="mb-4 min-w-0 border-b border-slate-800 pb-4">
              <div className="flex min-w-0 items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                    Выбранный аккаунт
                  </p>
                  <h2 className="mt-1 text-xl font-semibold break-words text-slate-50">
                    {selectedAccount.login}
                  </h2>
                  {selectedAccountSubtitle && (
                    <p className="mt-1 max-w-2xl truncate text-sm text-slate-400">
                      {selectedAccountSubtitle}
                    </p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                    Баланс
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-50">
                    {selectedAccountBalance}
                  </p>
                </div>
              </div>

              {accountDetailsRows.length > 0 && (
                <>
                  <dl className="mt-4 hidden grid-cols-[minmax(128px,180px)_minmax(0,1fr)] overflow-hidden rounded-md border border-slate-800 text-sm sm:grid">
                    {accountDetailsRows.map(([label, value]) => (
                      <div
                        key={label}
                        className="contents border-b border-slate-800 last:border-b-0"
                      >
                        <dt className="border-b border-slate-800 bg-slate-950/35 px-3 py-2 font-medium text-slate-500">
                          {label}
                        </dt>
                        <dd className="min-w-0 border-b border-slate-800 px-3 py-2 break-words text-slate-200">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <details className="group mt-3 sm:hidden">
                    <summary className="flex h-10 cursor-pointer list-none items-center justify-between rounded-md border border-slate-800 px-3 text-sm font-medium text-slate-200 [&::-webkit-details-marker]:hidden">
                      <span>Реквизиты</span>
                      <ChevronDown
                        className="text-slate-400 transition-transform group-open:rotate-180"
                        size={16}
                      />
                    </summary>
                    <dl className="mt-2 divide-y divide-slate-800 rounded-md border border-slate-800 text-sm">
                      {accountDetailsRows.map(([label, value]) => (
                        <div
                          key={label}
                          className="grid grid-cols-[92px_minmax(0,1fr)] gap-3 px-3 py-2"
                        >
                          <dt className="text-slate-500">{label}</dt>
                          <dd className="min-w-0 break-words text-slate-200">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </details>
                </>
              )}
            </section>
          ) : (
            <div className="mb-4 border-b border-slate-800 pb-4">
              <h2 className="text-lg font-medium text-slate-50">Аккаунт не выбран</h2>
            </div>
          )}

          <Tabs value={activeTab} onChange={(value) => onTabChange(value ?? 'transfers')}>
            <Tabs.List className="!flex-nowrap">
              <Tabs.Tab value="transfers" className="!h-11 flex-1">
                Переводы
              </Tabs.Tab>
              <Tabs.Tab value="files" className="!h-11 flex-1">
                Файлы
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="transfers" pt="md">
              <div className="mb-3 flex justify-end">
                <Button
                  leftSection={<Plus size={14} />}
                  size="sm"
                  color="blue"
                  disabled={!activeAccountId}
                  className="!h-10 w-full sm:w-auto"
                  onClick={onCreateTransfer}
                >
                  Добавить перевод
                </Button>
              </div>
              <TransferTable
                transfers={transfers}
                selectedAccountId={activeAccountId}
                selectedTransferId={selectedTransferId}
                isLoading={transfersLoading}
                error={transfersError}
                onSelectTransfer={onSelectTransfer}
                onEditTransfer={onEditTransfer}
                onDeleteTransfer={onDeleteTransfer}
              />
            </Tabs.Panel>

            <Tabs.Panel value="files" pt="md">
              <div className="mb-3 flex justify-end">
                <Button
                  leftSection={<Plus size={14} />}
                  size="sm"
                  color="blue"
                  disabled={!activeAccountId}
                  className="!h-10 w-full sm:w-auto"
                  onClick={onCreateFile}
                >
                  Добавить файл
                </Button>
              </div>
              <FileTable
                files={files}
                selectedAccountId={activeAccountId}
                selectedFileId={selectedFileId}
                isLoading={filesLoading}
                error={filesError}
                onSelectFile={onSelectFile}
                onEditFile={onEditFile}
                onDeleteFile={onDeleteFile}
              />
            </Tabs.Panel>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default PanelWorkspace
