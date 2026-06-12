import { Alert, Button, Group, Modal, Stack, Text } from '@mantine/core'

interface DeleteConfirmDialogProps {
  opened: boolean
  formError: string
  title: string
  description: string
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteConfirmDialog({
  opened,
  formError,
  title,
  description,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <Stack>
        {formError && <Alert color="red">{formError}</Alert>}
        <Text size="sm">{description}</Text>
        <Group justify="flex-end">
          <Button variant="subtle" onClick={onClose}>
            Отмена
          </Button>
          <Button color="red" loading={isDeleting} onClick={onConfirm}>
            Удалить
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
