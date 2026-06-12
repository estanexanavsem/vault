import { Button, Group, Modal, Stack, Text } from '@mantine/core'

interface UnsavedChangesDialogProps {
  opened: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function UnsavedChangesDialog({ opened, onCancel, onConfirm }: UnsavedChangesDialogProps) {
  return (
    <Modal opened={opened} onClose={onCancel} title="Закрыть без сохранения?" centered>
      <Stack>
        <Text size="sm">
          В форме есть несохраненные изменения. Если закрыть окно, они пропадут.
        </Text>
        <Group justify="flex-end">
          <Button variant="subtle" onClick={onCancel}>
            Вернуться
          </Button>
          <Button color="red" onClick={onConfirm}>
            Закрыть
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
