import { Button, Select } from '@mantine/core'
import { Plus } from 'lucide-react'
import type { Account } from '../types'
import type { AccountSelectOption } from '../utils/panelWorkspace'

interface AccountWorkspaceHeaderProps {
  accounts: Account[]
  accountOptions: AccountSelectOption[]
  activeAccountId: number | null
  accountsLoading: boolean
  onSelectAccount: (id: number) => void
  onCreateAccount: () => void
}

function AccountWorkspaceHeader({
  accounts,
  accountOptions,
  activeAccountId,
  accountsLoading,
  onSelectAccount,
  onCreateAccount,
}: AccountWorkspaceHeaderProps) {
  return (
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
          limit={20}
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
  )
}

export default AccountWorkspaceHeader
