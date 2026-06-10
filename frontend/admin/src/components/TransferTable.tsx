import type { KeyboardEvent } from 'react'
import type { Transfer } from '../types'
import { formatTransactionDate } from '../utils/formatters'

interface TransferTableProps {
  transfers: Transfer[]
  selectedAccountId: number | null
  selectedTransferId: number | null
  isLoading: boolean
  error: Error | null
  onSelectTransfer: (id: number) => void
}

function TransferTable({
  transfers,
  selectedAccountId,
  selectedTransferId,
  isLoading,
  error,
  onSelectTransfer,
}: TransferTableProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, transferId: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelectTransfer(transferId)
    }
  }

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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-separate border-spacing-0 text-left text-sm">
            <thead className="bg-slate-950/60 text-xs text-slate-400 uppercase">
              <tr>
                <th className="px-3 py-2 font-semibold">Дата</th>
                <th className="px-3 py-2 font-semibold">Описание</th>
                <th className="px-3 py-2 text-right font-semibold">Сумма</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default TransferTable
