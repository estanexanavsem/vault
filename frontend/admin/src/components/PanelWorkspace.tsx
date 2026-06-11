import { Button, Select, Tabs } from '@mantine/core'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import type { Account, AccountFile, Transfer } from '../types'
import { formatCurrency } from '../utils/formatters'
import { getAccountFacts, getAccountSelectOptions } from '../utils/panelWorkspace'
import FileTable from './FileTable'
import TransferDetails from './TransferDetails'
import TransferTable from './TransferTable'

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

function PanelWorkspace({
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
  const selectedAccountBalance = selectedAccount
    ? formatCurrency(selectedAccount.balance)
    : '$0.00'
  const accountOptions = getAccountSelectOptions(accounts)
  const accountFacts = getAccountFacts(selectedAccount)

  return (
    <>
      <header className="mb-3 grid gap-3 sm:mb-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">Аккаунты</h1>
          <p className="mt-1 text-sm text-slate-400">Выберите аккаунт и работайте с его переводами</p>
        </div>

        <div className="grid min-w-0 gap-2 sm:grid-cols-[minmax(260px,420px)_auto] sm:items-end">
          <Select
            aria-label="Выбрать аккаунт"
            searchable
            clearable={false}
            disabled={accountsLoading || accounts.length === 0}
            data={accountOptions}
            value={activeAccountId ? activeAccountId.toString() : null}
            placeholder={accountsLoading ? 'Загрузка аккаунтов...' : 'Выберите аккаунт'}
            nothingFoundMessage="Аккаунт не найден"
            classNames={{
              input:
                '!min-h-10 !border-slate-700 !bg-slate-950/60 !text-slate-50 placeholder:!text-slate-500',
              dropdown: '!border-slate-700 !bg-slate-950',
              option: 'data-[checked=true]:!bg-blue-950/60',
            }}
            onChange={(value) => {
              if (value) {
                onSelectAccount(Number(value))
              }
            }}
          />
          <Button
            leftSection={<Plus size={16} />}
            color="blue"
            size="sm"
            className="!h-10 shrink-0"
            onClick={onCreateAccount}
          >
            Добавить аккаунт
          </Button>
        </div>
      </header>

      {accountsError && (
        <p className="mb-3 text-sm text-red-400">
          Не удалось загрузить аккаунты: {accountsError.message}
        </p>
      )}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
        <section className="border-b border-slate-800 p-3 sm:p-4">
          {selectedAccount ? (
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
              <div className="min-w-0">
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                      Выбранный аккаунт
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold break-words text-slate-50">
                      {selectedAccount.login}
                    </h2>
                  </div>
                  <div className="shrink-0 sm:text-right">
                    <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                      Баланс
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-slate-50">
                      {selectedAccountBalance}
                    </p>
                  </div>
                </div>

                {accountFacts.length > 0 && (
                  <dl className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                    {accountFacts.map(([label, value]) => (
                      <div
                        key={label}
                        className="min-w-0 rounded-md border border-slate-800 bg-slate-950/35 px-3 py-2"
                      >
                        <dt className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                          {label}
                        </dt>
                        <dd className="mt-1 min-w-0 text-sm break-words text-slate-200">{value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row xl:flex-col">
                <Button
                  leftSection={<Pencil size={14} />}
                  variant="light"
                  color="blue"
                  size="sm"
                  className="!h-10"
                  onClick={() => onEditAccount(selectedAccount.id)}
                >
                  Редактировать
                </Button>
                <Button
                  leftSection={<Trash2 size={14} />}
                  variant="subtle"
                  color="red"
                  size="sm"
                  className="!h-10"
                  onClick={() => onDeleteAccount(selectedAccount.id)}
                >
                  Удалить
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-slate-700 bg-slate-950/35 p-4">
              <h2 className="text-lg font-medium text-slate-50">Аккаунт не выбран</h2>
              <p className="mt-1 text-sm text-slate-400">
                Создайте аккаунт или выберите существующий, чтобы увидеть переводы и файлы.
              </p>
            </div>
          )}
        </section>

        <div className="min-h-0 min-w-0 flex-1 overflow-auto p-3 sm:p-4">
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
              <TransferDetails transfer={selectedTransfer} />
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
