import type { AccountFile } from '../types'
import { formatFileSize } from '../utils/formatters'
import { FileActionMenu } from './FileActionMenu'

interface FileTableProps {
  files: AccountFile[]
  selectedAccountId: number | null
  selectedFileId: number | null
  isLoading: boolean
  error: Error | null
  onSelectFile: (id: number) => void
  onEditFile: (id: number) => void
  onDeleteFile: (id: number) => void
}

export function FileTable({
  files,
  selectedAccountId,
  selectedFileId,
  isLoading,
  error,
  onSelectFile,
  onEditFile,
  onDeleteFile,
}: FileTableProps) {
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
        <>
          <div className="space-y-2 sm:hidden">
            {filteredFiles.map((file) => {
              const isSelected = selectedFileId === file.id

              return (
                <div
                  key={file.id}
                  className={
                    isSelected
                      ? 'flex w-full items-start gap-2 rounded-lg border border-blue-500/50 bg-blue-950/50 p-3 text-left'
                      : 'flex w-full items-start gap-2 rounded-lg border border-slate-800 bg-slate-950/45 p-3 text-left transition-colors hover:border-slate-700 hover:bg-slate-900'
                  }
                >
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    className="min-w-0 flex-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70"
                    onClick={() => onSelectFile(file.id)}
                  >
                    <span className="flex min-w-0 items-start justify-between gap-3">
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold break-words text-slate-50">
                          {file.name}
                        </span>
                        <span className="mt-1 block text-xs break-all text-slate-400">
                          {file.type || 'Тип не указан'}
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-slate-50">
                        {formatFileSize(file.size)}
                      </span>
                    </span>
                  </button>
                  <div className="-mt-1 -mr-1 shrink-0">
                    <FileActionMenu
                      fileId={file.id}
                      onEditFile={onEditFile}
                      onDeleteFile={onDeleteFile}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[560px] border-separate border-spacing-0 text-left text-sm">
              <thead className="bg-slate-950/60 text-xs text-slate-400 uppercase">
                <tr>
                  <th className="px-3 py-2 font-semibold">Название</th>
                  <th className="px-3 py-2 font-semibold">Тип</th>
                  <th className="px-3 py-2 text-right font-semibold">Размер</th>
                  <th className="w-12 px-2 py-2 font-semibold" aria-label="Действия" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredFiles.map((file) => (
                  <tr
                    key={file.id}
                    className={
                      selectedFileId === file.id ? 'bg-blue-950/50' : 'hover:bg-slate-800/70'
                    }
                  >
                    <td className="max-w-64 truncate px-3 py-2 font-medium text-slate-50">
                      <button
                        type="button"
                        aria-pressed={selectedFileId === file.id}
                        className="w-full truncate text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70"
                        onClick={() => onSelectFile(file.id)}
                      >
                        {file.name}
                      </button>
                    </td>
                    <td className="max-w-72 px-3 py-2 break-all text-slate-300">{file.type}</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap text-slate-50">
                      {formatFileSize(file.size)}
                    </td>
                    <td
                      className="px-2 py-1 text-right"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <FileActionMenu
                        fileId={file.id}
                        onEditFile={onEditFile}
                        onDeleteFile={onDeleteFile}
                      />
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
