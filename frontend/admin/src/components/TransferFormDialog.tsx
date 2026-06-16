import { Alert, Button, Modal, NumberInput, Select, TextInput } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { CalendarDays } from 'lucide-react'
import { Controller, type SubmitHandler, type UseFormReturn } from 'react-hook-form'
import type { TransferFormInput, TransferFormValues } from '../forms/transferForm'
import type { FormDialog } from '../types/panel'
import {
  darkInputClassNames,
  dialogLabelClass,
  dialogRowClass,
  modalClassNames,
  moneyInputProps,
  transferTypeOptions,
} from '../utils/panelDialogConfig'
import { CategoryCreatableSelect } from './CategoryCreatableSelect'

interface TransferFormDialogProps {
  formDialog: FormDialog
  formError: string
  transferForm: UseFormReturn<TransferFormInput, unknown, TransferFormValues>
  isSaving: boolean
  onClose: () => void
  onSave: SubmitHandler<TransferFormValues>
}

export function TransferFormDialog({
  formDialog,
  formError,
  transferForm,
  isSaving,
  onClose,
  onSave,
}: TransferFormDialogProps) {
  const transferErrors = transferForm.formState.errors

  return (
    <Modal
      opened={formDialog?.entity === 'transfer'}
      onClose={onClose}
      title={formDialog?.mode === 'edit' ? 'Редактировать перевод' : 'Добавить перевод'}
      size={640}
      classNames={modalClassNames}
      centered
    >
      <form onSubmit={transferForm.handleSubmit(onSave)}>
        <div className="space-y-3 px-4 py-4">
          {formError && <Alert color="red">{formError}</Alert>}
          <div className={dialogRowClass}>
            <label className={dialogLabelClass} htmlFor="transfer-transaction-date">
              Дата
            </label>
            <Controller
              name="transaction_date"
              control={transferForm.control}
              render={({ field: { value, onChange, ...field } }) => (
                <DatePickerInput
                  id="transfer-transaction-date"
                  value={value || null}
                  onChange={(nextValue) => onChange(nextValue ?? '')}
                  valueFormat="YYYY-MM-DD"
                  placeholder="yyyy-mm-dd"
                  description="Формат даты: yyyy-mm-dd"
                  error={transferErrors.transaction_date?.message}
                  clearable
                  hideOutsideDates
                  leftSection={<CalendarDays size={16} />}
                  leftSectionPointerEvents="none"
                  classNames={darkInputClassNames}
                  {...field}
                />
              )}
            />
          </div>
          <div className={dialogRowClass}>
            <label className={dialogLabelClass} htmlFor="transfer-description">
              Краткое описание
            </label>
            <Controller
              name="description"
              control={transferForm.control}
              render={({ field }) => (
                <TextInput id="transfer-description" classNames={darkInputClassNames} {...field} />
              )}
            />
          </div>
          <div className={dialogRowClass}>
            <label className={dialogLabelClass} htmlFor="transfer-full-description">
              Полное описание
            </label>
            <Controller
              name="full_description"
              control={transferForm.control}
              render={({ field }) => (
                <TextInput
                  id="transfer-full-description"
                  classNames={darkInputClassNames}
                  {...field}
                />
              )}
            />
          </div>
          <div className={dialogRowClass}>
            <label className={dialogLabelClass} htmlFor="transfer-category">
              Категория
            </label>
            <Controller
              name="category"
              control={transferForm.control}
              render={({ field: { value, onChange, ...field } }) => (
                <CategoryCreatableSelect
                  id="transfer-category"
                  value={value}
                  onChange={onChange}
                  {...field}
                />
              )}
            />
          </div>
          <div className={dialogRowClass}>
            <label className={dialogLabelClass} htmlFor="transfer-reference">
              Референс
            </label>
            <Controller
              name="reference"
              control={transferForm.control}
              render={({ field }) => (
                <TextInput
                  id="transfer-reference"
                  autoCapitalize="none"
                  autoCorrect="off"
                  classNames={darkInputClassNames}
                  {...field}
                />
              )}
            />
          </div>
          <div className={dialogRowClass}>
            <label className={dialogLabelClass} htmlFor="transfer-type">
              Тип
            </label>
            <Controller
              name="transfer_type"
              control={transferForm.control}
              render={({ field: { value, onChange, ...field } }) => (
                <Select
                  id="transfer-type"
                  data={transferTypeOptions}
                  value={value}
                  onChange={(nextValue) => onChange(nextValue ?? '')}
                  allowDeselect
                  classNames={darkInputClassNames}
                  {...field}
                />
              )}
            />
          </div>
          <div className={dialogRowClass}>
            <label className={dialogLabelClass} htmlFor="transfer-amount">
              Сумма
            </label>
            <Controller
              name="amount"
              control={transferForm.control}
              render={({ field }) => (
                <NumberInput
                  id="transfer-amount"
                  allowNegative
                  placeholder="$ 1,999.99"
                  description="Формат суммы: $ 1,999.99"
                  error={transferErrors.amount?.message}
                  {...moneyInputProps}
                  {...field}
                />
              )}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-[#2a2a2a] bg-[#191919] px-3 py-2">
          <Button type="submit" variant="default" loading={isSaving}>
            Сохранить
          </Button>
          <Button variant="default" onClick={onClose}>
            Отмена
          </Button>
        </div>
      </form>
    </Modal>
  )
}
