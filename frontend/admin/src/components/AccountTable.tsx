import type { KeyboardEvent } from 'react'
import { ActionIcon, Menu } from '@mantine/core'
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import type { Account } from '../types'

interface AccountTableProps {
  accounts: Account[]
  selectedAccountId: number | null
  isLoading: boolean
  error: Error | null
  onSelectAccount: (id: number) => void
  onEditAccount: (id: number) => void
  onDeleteAccount: (id: number) => void
}

function AccountTable({
  accounts,
  selectedAccountId,
  isLoading,
  error,
  onSelectAccount,
  onEditAccount,
  onDeleteAccount,
}: AccountTableProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, accountId: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelectAccount(accountId)
    }
  }

  const renderActionMenu = (accountId: number) => (
    <Menu withinPortal position="bottom-end" shadow="md">
      <Menu.Target>
        <ActionIcon
          aria-label="Действия аккаунта"
          variant="subtle"
          color="gray"
          className="!h-9 !w-9 !text-slate-300 hover:!bg-slate-800"
          onClick={(event) => event.stopPropagation()}
        >
          <MoreVertical size={18} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<Pencil size={14} />}
          onClick={(event) => {
            event.stopPropagation()
            onEditAccount(accountId)
          }}
        >
          Редактировать
        </Menu.Item>
        <Menu.Item
          color="red"
          leftSection={<Trash2 size={14} />}
          onClick={(event) => {
            event.stopPropagation()
            onDeleteAccount(accountId)
          }}
        >
          Удалить
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )

  if (isLoading) {
    return <p className="text-sm text-slate-400">Загрузка аккаунтов...</p>
  }

  if (error) {
    return <p className="text-sm text-red-400">Не удалось загрузить аккаунты: {error.message}</p>
  }

  return (
    <div className="min-w-0" id="account-table">
      {accounts.length === 0 ? (
        <p className="text-sm text-slate-400">Аккаунтов пока нет</p>
      ) : (
        <>
          <div className="space-y-2 sm:hidden">
            {accounts.map((account) => {
              const isSelected = selectedAccountId === account.id

              return (
                <div
                  key={account.id}
                  aria-pressed={isSelected}
                  className={
                    isSelected
                      ? 'flex w-full items-start gap-2 rounded-lg border border-blue-500/50 bg-blue-950/50 p-3 text-left'
                      : 'flex w-full items-start gap-2 rounded-lg border border-slate-800 bg-slate-950/45 p-3 text-left transition-colors hover:border-slate-700 hover:bg-slate-900'
                  }
                >
                  <button
                    type="button"
                    className="min-w-0 flex-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70"
                    onClick={() => onSelectAccount(account.id)}
                  >
                    <span className="flex min-w-0 items-start justify-between gap-3">
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold break-words text-slate-50">
                          {account.login}
                        </span>
                        <span className="mt-1 block text-xs break-words text-slate-400">
                          {account.holder_name || 'Холдер не указан'}
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-slate-50">
                        ${Number(account.balance).toFixed(2)}
                      </span>
                    </span>
                    <span className="mt-3 grid gap-1 text-xs text-slate-400">
                      <span className="break-words">
                        {account.full_account_name ||
                          account.account_name ||
                          'Название счета не указано'}
                      </span>
                      <span className="break-words">
                        {account.account_number
                          ? `Номер: ${account.account_number}`
                          : 'Номер не указан'}
                      </span>
                    </span>
                  </button>
                  <div className="-mt-1 -mr-1 shrink-0">{renderActionMenu(account.id)}</div>
                </div>
              )
            })}
          </div>

          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[800px] border-separate border-spacing-0 text-left text-sm">
              <thead className="bg-slate-950/60 text-xs text-slate-400 uppercase">
                <tr>
                  <th className="px-3 py-2 font-semibold">Логин</th>
                  <th className="px-3 py-2 font-semibold">Имя холдера</th>
                  <th className="px-3 py-2 font-semibold">Полное название счета</th>
                  <th className="px-3 py-2 font-semibold">Номер счета</th>
                  <th className="px-3 py-2 text-right font-semibold">Баланс</th>
                  <th className="w-12 px-2 py-2 font-semibold" aria-label="Действия" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {accounts.map((account) => (
                  <tr
                    key={account.id}
                    role="button"
                    tabIndex={0}
                    aria-selected={selectedAccountId === account.id}
                    className={
                      selectedAccountId === account.id
                        ? 'selected cursor-pointer bg-blue-950/50 outline-none'
                        : 'cursor-pointer outline-none hover:bg-slate-800/70 focus:bg-slate-800/70'
                    }
                    onClick={() => onSelectAccount(account.id)}
                    onKeyDown={(event) => handleKeyDown(event, account.id)}
                  >
                    <td className="px-3 py-2 font-medium whitespace-nowrap text-slate-50">
                      {account.login}
                    </td>
                    <td className="max-w-56 truncate px-3 py-2 text-slate-300">
                      {account.holder_name}
                    </td>
                    <td className="max-w-64 truncate px-3 py-2 text-slate-300">
                      {account.full_account_name || '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-slate-300">
                      {account.account_number || '-'}
                    </td>
                    <td className="px-3 py-2 text-right whitespace-nowrap text-slate-50">
                      ${Number(account.balance).toFixed(2)}
                    </td>
                    <td
                      className="px-2 py-1 text-right"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {renderActionMenu(account.id)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default AccountTable
