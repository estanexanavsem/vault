import { Alert, Button, FileInput, Group, Modal, Stack, TextInput } from '@mantine/core'
import { Controller, type SubmitHandler, type UseFormReturn } from 'react-hook-form'
import type { FileFormInput, FileFormValues } from '../forms/fileForm'
import type { FormDialog } from '../types/panel'

interface FileFormDialogProps {
  formDialog: FormDialog
  formError: string
  fileForm: UseFormReturn<FileFormInput, unknown, FileFormValues>
  isSaving: boolean
  onClose: () => void
  onSave: SubmitHandler<FileFormValues>
}

export function FileFormDialog({
  formDialog,
  formError,
  fileForm,
  isSaving,
  onClose,
  onSave,
}: FileFormDialogProps) {
  const fileErrors = fileForm.formState.errors

  return (
    <Modal
      opened={formDialog?.entity === 'file'}
      onClose={onClose}
      title={formDialog?.mode === 'edit' ? 'Редактировать файл' : 'Добавить файл'}
      centered
    >
      <form onSubmit={fileForm.handleSubmit(onSave)}>
        <Stack>
          {formError && <Alert color="red">{formError}</Alert>}
          {formDialog?.mode === 'create' ? (
            <Controller
              name="file"
              control={fileForm.control}
              render={({ field: { value, onChange, ...field } }) => (
                <FileInput
                  label="Файл"
                  value={value}
                  onChange={onChange}
                  error={fileErrors.file?.message}
                  required
                  {...field}
                />
              )}
            />
          ) : (
            <>
              <Controller
                name="name"
                control={fileForm.control}
                render={({ field }) => <TextInput label="Название" {...field} />}
              />
              <Controller
                name="type"
                control={fileForm.control}
                render={({ field }) => <TextInput label="Тип" {...field} />}
              />
            </>
          )}
          <Controller
            name="description"
            control={fileForm.control}
            render={({ field }) => <TextInput label="Описание" {...field} />}
          />
          <Group justify="flex-end">
            <Button variant="subtle" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" loading={isSaving}>
              {formDialog?.mode === 'edit' ? 'Сохранить' : 'Добавить'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
