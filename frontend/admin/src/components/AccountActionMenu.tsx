import { ActionIcon, Menu } from '@mantine/core'
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'

interface AccountActionMenuProps {
  accountId: number
  onEditAccount: (id: number) => void
  onDeleteAccount: (id: number) => void
}

export function AccountActionMenu({
  accountId,
  onEditAccount,
  onDeleteAccount,
}: AccountActionMenuProps) {
  return (
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
}
