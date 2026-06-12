import { EntityActionMenu } from './EntityActionMenu'

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
    <EntityActionMenu
      ariaLabel="Действия аккаунта"
      entityId={accountId}
      onEdit={onEditAccount}
      onDelete={onDeleteAccount}
    />
  )
}
