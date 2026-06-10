import { Button, Tabs } from '@mantine/core'
import { Plus } from 'lucide-react'
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
  const accountDetails = selectedAccount
    ? [
        ['Холдер', selectedAccount.holder_name],
        ['Счет', selectedAccount.account_name],
        ['Полное имя счета', selectedAccount.full_account_name],
        ['Номер', selectedAccount.account_number],
        ['Роутинг', selectedAccount.routing_number],
        ['Эл. почта', selectedAccount.email],
        ['Телефон', selectedAccount.phone],
        ['Баланс', Number(selectedAccount.balance).toLocaleString('ru-RU')],
      ].filter(([, value]) => value !== '')
    : []

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
          <div className="mb-4 min-w-0">
            <h2 className="text-lg font-medium break-words text-slate-50">
              {selectedAccount ? selectedAccount.login : 'Аккаунт не выбран'}
            </h2>
            {accountDetails.length > 0 && (
              <dl className="mt-2 grid grid-cols-2 gap-1 text-[11px] leading-4 text-slate-400 sm:flex sm:flex-wrap">
                {accountDetails.map(([label, value]) => {
                  const spansTwoColumns = label === 'Полное имя счета' || label === 'Эл. почта'

                  return (
                    <div
                      key={label}
                      className={[
                        'min-w-0 rounded border border-slate-800 bg-slate-950/35 px-2 py-0.5 sm:max-w-72',
                        spansTwoColumns ? 'col-span-2' : '',
                      ].join(' ')}
                    >
                      <dt className="inline font-medium text-slate-500">{label}: </dt>
                      <dd className="inline break-words text-slate-300">{value}</dd>
                    </div>
                  )
                })}
              </dl>
            )}
          </div>

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
