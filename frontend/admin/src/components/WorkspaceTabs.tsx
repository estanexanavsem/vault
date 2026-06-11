import { Button, Tabs } from '@mantine/core'
import { Plus } from 'lucide-react'
import type { AccountFile, Transfer } from '../types'
import FileTable from './FileTable'
import TransferDetails from './TransferDetails'
import TransferTable from './TransferTable'

interface WorkspaceTabsProps {
  activeTab: string
  transfers: Transfer[]
  files: AccountFile[]
  selectedTransfer: Transfer | null
  activeAccountId: number | null
  selectedTransferId: number | null
  selectedFileId: number | null
  transfersLoading: boolean
  filesLoading: boolean
  transfersError: Error | null
  filesError: Error | null
  onTabChange: (tab: string) => void
  onSelectTransfer: (id: number) => void
  onSelectFile: (id: number) => void
  onCreateTransfer: () => void
  onEditTransfer: (id: number) => void
  onDeleteTransfer: (id: number) => void
  onCreateFile: () => void
  onEditFile: (id: number) => void
  onDeleteFile: (id: number) => void
}

function WorkspaceTabs({
  activeTab,
  transfers,
  files,
  selectedTransfer,
  activeAccountId,
  selectedTransferId,
  selectedFileId,
  transfersLoading,
  filesLoading,
  transfersError,
  filesError,
  onTabChange,
  onSelectTransfer,
  onSelectFile,
  onCreateTransfer,
  onEditTransfer,
  onDeleteTransfer,
  onCreateFile,
  onEditFile,
  onDeleteFile,
}: WorkspaceTabsProps) {
  return (
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
  )
}

export default WorkspaceTabs
