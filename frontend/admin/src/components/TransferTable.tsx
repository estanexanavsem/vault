import type { KeyboardEvent } from 'react'
import { ActionIcon, Menu } from '@mantine/core'
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import type { Transfer } from '../types'
import { formatTransactionDate } from '../utils/formatters'

interface TransferTableProps {
  transfers: Transfer[]
  selectedAccountId: number | null
  selectedTransferId: number | null
  isLoading: boolean
  error: Error | null
  onSelectTransfer: (id: number) => void
  onEditTransfer: (id: number) => void
  onDeleteTransfer: (id: number) => void
}

export function TransferTable({
  transfers,
  selectedAccountId,
  selectedTransferId,
  isLoading,
  error,
  onSelectTransfer,
  onEditTransfer,
  onDeleteTransfer,
}: TransferTableProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, transferId: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelectTransfer(transferId)
    }
  }

  const renderActionMenu = (transferId: number) => (
    <Menu withinPortal position="bottom-end" shadow="md">
      <Menu.Target>
        <ActionIcon
          aria-label="Действия перевода"
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
            onEditTransfer(transferId)
          }}
        >
          Редактировать
        </Menu.Item>
        <Menu.Item
          color="red"
          leftSection={<Trash2 size={14} />}
          onClick={(event) => {
            event.stopPropagation()
            onDeleteTransfer(transferId)
          }}
        >
          Удалить
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )

  if (!selectedAccountId) {
    return <p className="text-sm text-slate-400">Выберите аккаунт, чтобы посмотреть переводы</p>
  }

  if (isLoading) {
    return <p className="text-sm text-slate-400">Загрузка переводов...</p>
  }

  if (error) {
    return <p className="text-sm text-red-400">Не удалось загрузить переводы: {error.message}</p>
  }

  const filteredTransfers = transfers.filter((t) => t.account_id === selectedAccountId)

  return (
    <div className="min-w-0" id="transfer-table">
      {filteredTransfers.length === 0 ? (
        <p className="text-sm text-slate-400">Для этого аккаунта переводов нет</p>
      ) : (
        <>
          <div className="space-y-2 sm:hidden">
            {filteredTransfers.map((transfer) => {
              const isSelected = selectedTransferId === transfer.id

              return (
                <div
                  key={transfer.id}
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
                    onClick={() => onSelectTransfer(transfer.id)}
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="text-xs font-medium text-slate-400">
                        {formatTransactionDate(transfer.transaction_date)}
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-slate-50">
                        ${Number(transfer.amount).toFixed(2)}
                      </span>
                    </span>
                    <span className="mt-2 block text-sm break-words text-slate-200">
                      {transfer.description || 'Описание не указано'}
                    </span>
                  </button>
                  <div className="-mt-1 -mr-1 shrink-0">{renderActionMenu(transfer.id)}</div>
                </div>
              )
            })}
          </div>

          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[600px] border-separate border-spacing-0 text-left text-sm">
              <thead className="bg-slate-950/60 text-xs text-slate-400 uppercase">
                <tr>
                  <th className="px-3 py-2 font-semibold">Дата</th>
                  <th className="px-3 py-2 font-semibold">Описание</th>
                  <th className="px-3 py-2 text-right font-semibold">Сумма</th>
                  <th className="w-12 px-2 py-2 font-semibold" aria-label="Действия" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredTransfers.map((transfer) => (
                  <tr
                    key={transfer.id}
                    role="button"
                    tabIndex={0}
                    aria-selected={selectedTransferId === transfer.id}
                    className={
                      selectedTransferId === transfer.id
                        ? 'cursor-pointer bg-blue-950/50 outline-none'
                        : 'cursor-pointer outline-none hover:bg-slate-800/70 focus:bg-slate-800/70'
                    }
                    onClick={() => onSelectTransfer(transfer.id)}
                    onKeyDown={(event) => handleKeyDown(event, transfer.id)}
                  >
                    <td className="px-3 py-2 whitespace-nowrap text-slate-300">
                      {formatTransactionDate(transfer.transaction_date)}
                    </td>
                    <td className="max-w-80 truncate px-3 py-2 text-slate-300">
                      {transfer.description}
                    </td>
                    <td className="px-3 py-2 text-right whitespace-nowrap text-slate-50">
                      ${Number(transfer.amount).toFixed(2)}
                    </td>
                    <td
                      className="px-2 py-1 text-right"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {renderActionMenu(transfer.id)}
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
