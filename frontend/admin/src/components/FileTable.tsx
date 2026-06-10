import type { KeyboardEvent } from 'react'
import type { AccountFile } from '../types'
import { formatFileSize } from '../utils/formatters'

interface FileTableProps {
  files: AccountFile[]
  selectedAccountId: number | null
  selectedFileId: number | null
  isLoading: boolean
  error: Error | null
  onSelectFile: (id: number) => void
}

function FileTable({
  files,
  selectedAccountId,
  selectedFileId,
  isLoading,
  error,
  onSelectFile,
}: FileTableProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, fileId: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelectFile(fileId)
    }
  }

  if (!selectedAccountId) {
    return <p className="text-sm text-slate-400">Выберите аккаунт, чтобы посмотреть файлы</p>
  }

  if (isLoading) {
    return <p className="text-sm text-slate-400">Загрузка файлов...</p>
  }

  if (error) {
    return <p className="text-sm text-red-400">Не удалось загрузить файлы: {error.message}</p>
  }

  const filteredFiles = files.filter((f) => f.account_id === selectedAccountId)

  return (
    <div className="min-w-0" id="file-table">
      {filteredFiles.length === 0 ? (
        <p className="text-sm text-slate-400">Для этого аккаунта файлов нет</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-separate border-spacing-0 text-left text-sm">
            <thead className="bg-slate-950/60 text-xs text-slate-400 uppercase">
              <tr>
                <th className="px-3 py-2 font-semibold">Название</th>
                <th className="px-3 py-2 font-semibold">Тип</th>
                <th className="px-3 py-2 text-right font-semibold">Размер</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredFiles.map((file) => (
                <tr
                  key={file.id}
                  role="button"
                  tabIndex={0}
                  aria-selected={selectedFileId === file.id}
                  className={
                    selectedFileId === file.id
                      ? 'cursor-pointer bg-blue-950/50 outline-none'
                      : 'cursor-pointer outline-none hover:bg-slate-800/70 focus:bg-slate-800/70'
                  }
                  onClick={() => onSelectFile(file.id)}
                  onKeyDown={(event) => handleKeyDown(event, file.id)}
                >
                  <td className="max-w-64 truncate px-3 py-2 font-medium text-slate-50">
                    {file.name}
                  </td>
                  <td className="max-w-72 px-3 py-2 break-all text-slate-300">{file.type}</td>
                  <td className="px-3 py-2 text-right whitespace-nowrap text-slate-50">
                    {formatFileSize(file.size)}
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

export default FileTable
