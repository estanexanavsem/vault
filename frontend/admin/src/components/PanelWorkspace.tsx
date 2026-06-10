import { Button, Group, Tabs } from '@mantine/core'
import { Plus, Pencil, Trash2 } from 'lucide-react'
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
  selectedTransfer: Transfer | null
  selectedFile: AccountFile | null
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
  onEditAccount: () => void
  onDeleteAccount: () => void
  onCreateTransfer: () => void
  onEditTransfer: () => void
  onDeleteTransfer: () => void
  onCreateFile: () => void
  onEditFile: () => void
  onDeleteFile: () => void
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
  selectedTransfer,
  selectedFile,
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
      <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-slate-50">Аккаунты</h1>
        <Group>
          <Button leftSection={<Plus size={16} />} color="blue" onClick={onCreateAccount}>
            Добавить
          </Button>
          <Button
            leftSection={<Pencil size={16} />}
            variant="light"
            disabled={!selectedAccount}
            onClick={onEditAccount}
          >
            Редактировать
          </Button>
          <Button
            leftSection={<Trash2 size={16} />}
            color="red"
            variant="light"
            disabled={!selectedAccount}
            onClick={onDeleteAccount}
          >
            Удалить
          </Button>
        </Group>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 lg:flex-row">
        <div className="max-h-[38vh] min-h-0 overflow-auto border-b border-slate-800 p-3 lg:max-h-none lg:w-2/5 lg:border-r lg:border-b-0 lg:p-4">
          <AccountTable
            accounts={accounts}
            selectedAccountId={activeAccountId}
            isLoading={accountsLoading}
            error={accountsError}
            onSelectAccount={onSelectAccount}
          />
        </div>

        <div className="min-h-0 min-w-0 flex-1 overflow-auto p-3 lg:w-3/5 lg:p-4">
          <div className="mb-3 min-w-0">
            <h2 className="truncate text-lg font-medium text-slate-50">
              {selectedAccount ? selectedAccount.login : 'Аккаунт не выбран'}
            </h2>
            {accountDetails.length > 0 && (
              <p className="mt-1 truncate text-xs text-slate-400">
                {accountDetails.map(([label, value]) => `${label}: ${value}`).join(' · ')}
              </p>
            )}
          </div>

          <Tabs value={activeTab} onChange={(value) => onTabChange(value ?? 'transfers')}>
            <Tabs.List>
              <Tabs.Tab value="transfers">Переводы</Tabs.Tab>
              <Tabs.Tab value="files">Файлы</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="transfers" pt="md">
              <Group mb="sm">
                <Button
                  leftSection={<Plus size={14} />}
                  size="xs"
                  color="blue"
                  disabled={!activeAccountId}
                  onClick={onCreateTransfer}
                >
                  Добавить
                </Button>
                <Button
                  leftSection={<Pencil size={14} />}
                  size="xs"
                  variant="light"
                  disabled={!selectedTransfer}
                  onClick={onEditTransfer}
                >
                  Редактировать
                </Button>
                <Button
                  leftSection={<Trash2 size={14} />}
                  size="xs"
                  color="red"
                  variant="light"
                  disabled={!selectedTransfer}
                  onClick={onDeleteTransfer}
                >
                  Удалить
                </Button>
              </Group>
              <TransferTable
                transfers={transfers}
                selectedAccountId={activeAccountId}
                selectedTransferId={selectedTransferId}
                isLoading={transfersLoading}
                error={transfersError}
                onSelectTransfer={onSelectTransfer}
              />
            </Tabs.Panel>

            <Tabs.Panel value="files" pt="md">
              <Group mb="sm">
                <Button
                  leftSection={<Plus size={14} />}
                  size="xs"
                  color="blue"
                  disabled={!activeAccountId}
                  onClick={onCreateFile}
                >
                  Добавить
                </Button>
                <Button
                  leftSection={<Pencil size={14} />}
                  size="xs"
                  variant="light"
                  disabled={!selectedFile}
                  onClick={onEditFile}
                >
                  Редактировать
                </Button>
                <Button
                  leftSection={<Trash2 size={14} />}
                  size="xs"
                  color="red"
                  variant="light"
                  disabled={!selectedFile}
                  onClick={onDeleteFile}
                >
                  Удалить
                </Button>
              </Group>
              <FileTable
                files={files}
                selectedAccountId={activeAccountId}
                selectedFileId={selectedFileId}
                isLoading={filesLoading}
                error={filesError}
                onSelectFile={onSelectFile}
              />
            </Tabs.Panel>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default PanelWorkspace
