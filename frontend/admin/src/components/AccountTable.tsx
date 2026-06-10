import type { KeyboardEvent } from 'react'
import type { Account } from '../types'

interface AccountTableProps {
  accounts: Account[]
  selectedAccountId: number | null
  isLoading: boolean
  error: Error | null
  onSelectAccount: (id: number) => void
}

function AccountTable({
  accounts,
  selectedAccountId,
  isLoading,
  error,
  onSelectAccount,
}: AccountTableProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, accountId: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelectAccount(accountId)
    }
  }

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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
            <thead className="bg-slate-950/60 text-xs text-slate-400 uppercase">
              <tr>
                <th className="px-3 py-2 font-semibold">Логин</th>
                <th className="px-3 py-2 font-semibold">Имя холдера</th>
                <th className="px-3 py-2 font-semibold">Полное название счета</th>
                <th className="px-3 py-2 font-semibold">Номер счета</th>
                <th className="px-3 py-2 text-right font-semibold">Баланс</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AccountTable
