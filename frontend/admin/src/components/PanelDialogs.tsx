import {
  Alert,
  Button,
  FileInput,
  Group,
  Modal,
  NumberInput,
  PasswordInput,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { CalendarDays } from 'lucide-react'
import { Controller, type SubmitHandler, type UseFormReturn } from 'react-hook-form'
import type { AccountFormInput, AccountFormValues } from '../forms/accountForm'
import type { FileFormInput, FileFormValues } from '../forms/fileForm'
import type { TransferFormInput, TransferFormValues } from '../forms/transferForm'
import type { Entity, FormDialog } from '../types/panel'

interface PanelDialogsProps {
  formDialog: FormDialog
  deleteDialog: Entity | null
  formError: string
  accountForm: UseFormReturn<AccountFormInput, unknown, AccountFormValues>
  transferForm: UseFormReturn<TransferFormInput, unknown, TransferFormValues>
  fileForm: UseFormReturn<FileFormInput, unknown, FileFormValues>
  isAccountSaving: boolean
  isTransferSaving: boolean
  isFileSaving: boolean
  isDeleting: boolean
  deleteTitle: string
  deleteDescription: string
  onCloseFormDialog: () => void
  onCloseDeleteDialog: () => void
  onSaveAccount: SubmitHandler<AccountFormValues>
  onSaveTransfer: SubmitHandler<TransferFormValues>
  onSaveFile: SubmitHandler<FileFormValues>
  onConfirmDelete: () => void
}

const modalClassNames = {
  content: '!bg-[#171717] !text-neutral-100 !border !border-[#2a2a2a] !rounded-[18px] !shadow-2xl',
  header: '!bg-[#171717] !border-b !border-[#2a2a2a] !px-4 !py-3',
  title: '!text-base !font-semibold !text-neutral-100',
  body: '!p-0',
  close: '!text-neutral-300 hover:!bg-[#242424]',
}

const darkInputClassNames = {
  input:
    '!bg-[#0f0f0f] !border-[#303030] !text-neutral-100 placeholder:!text-neutral-500 focus:!border-blue-500',
}
const moneyInputProps = {
  decimalScale: 2,
  fixedDecimalScale: true,
  thousandSeparator: ',',
  decimalSeparator: '.',
  allowedDecimalSeparators: ['.', ','],
  prefix: '$ ',
  hideControls: true,
  selectAllOnFocus: true,
  classNames: darkInputClassNames,
}

const accountRowClass = 'grid grid-cols-[160px_minmax(0,1fr)] items-center gap-3'
const accountLabelClass = 'text-sm text-neutral-400'
const transferCategoryOptions = [
  { value: 'Taxes & Fees', label: 'Налоги и сборы' },
  { value: 'Other', label: 'Другое' },
  { value: 'Deposits', label: 'Депозиты' },
  { value: 'Professional & Legal Services', label: 'Профессиональные и юридические услуги' },
]
const transferTypeOptions = [
  { value: 'Deposit', label: 'Депозит' },
  { value: 'Other', label: 'Другое' },
  { value: 'Check', label: 'Чек' },
  { value: 'Intuit', label: 'Intuit' },
]

export function PanelDialogs({
  formDialog,
  deleteDialog,
  formError,
  accountForm,
  transferForm,
  fileForm,
  isAccountSaving,
  isTransferSaving,
  isFileSaving,
  isDeleting,
  deleteTitle,
  deleteDescription,
  onCloseFormDialog,
  onCloseDeleteDialog,
  onSaveAccount,
  onSaveTransfer,
  onSaveFile,
  onConfirmDelete,
}: PanelDialogsProps) {
  const accountErrors = accountForm.formState.errors
  const transferErrors = transferForm.formState.errors
  const fileErrors = fileForm.formState.errors

  return (
    <>
      <Modal
        opened={formDialog?.entity === 'account'}
        onClose={onCloseFormDialog}
        title={formDialog?.mode === 'edit' ? 'Редактировать аккаунт' : 'Добавить аккаунт'}
        size={640}
        classNames={modalClassNames}
        centered
      >
        <form onSubmit={accountForm.handleSubmit(onSaveAccount)}>
          <div className="space-y-3 px-4 py-4">
            {formError && <Alert color="red">{formError}</Alert>}
            <div className={accountRowClass}>
              <label className={accountLabelClass}>Логин</label>
              <Controller
                name="login"
                control={accountForm.control}
                render={({ field }) => (
                  <TextInput error={accountErrors.login?.message} classNames={darkInputClassNames} {...field} />
                )}
              />
            </div>
            <div className={accountRowClass}>
              <label className={accountLabelClass}>
                {formDialog?.mode === 'edit' ? 'Новый пароль' : 'Пароль'}
              </label>
              <Controller
                name="password"
                control={accountForm.control}
                render={({ field }) => (
                  <PasswordInput
                    error={accountErrors.password?.message}
                    classNames={darkInputClassNames}
                    {...field}
                  />
                )}
              />
            </div>
            <div className={accountRowClass}>
              <label className={accountLabelClass}>Имя холдера</label>
              <Controller
                name="holder_name"
                control={accountForm.control}
                render={({ field }) => <TextInput classNames={darkInputClassNames} {...field} />}
              />
            </div>
            <div className={accountRowClass}>
              <label className={accountLabelClass}>Название счета</label>
              <Controller
                name="account_name"
                control={accountForm.control}
                render={({ field }) => <TextInput classNames={darkInputClassNames} {...field} />}
              />
            </div>
            <div className={accountRowClass}>
              <label className={accountLabelClass}>Полное название счета</label>
              <Controller
                name="full_account_name"
                control={accountForm.control}
                render={({ field }) => <TextInput classNames={darkInputClassNames} {...field} />}
              />
            </div>
            <div className={accountRowClass}>
              <label className={accountLabelClass}>Номер счета</label>
              <Controller
                name="account_number"
                control={accountForm.control}
                render={({ field }) => <TextInput classNames={darkInputClassNames} {...field} />}
              />
            </div>
            <div className={accountRowClass}>
              <label className={accountLabelClass}>Роутинг</label>
              <Controller
                name="routing_number"
                control={accountForm.control}
                render={({ field }) => <TextInput classNames={darkInputClassNames} {...field} />}
              />
            </div>
            <div className={accountRowClass}>
              <label className={accountLabelClass}>Эл. почта</label>
              <Controller
                name="email"
                control={accountForm.control}
                render={({ field }) => <TextInput type="email" classNames={darkInputClassNames} {...field} />}
              />
            </div>
            <div className={accountRowClass}>
              <label className={accountLabelClass}>Телефон</label>
              <Controller
                name="phone"
                control={accountForm.control}
                render={({ field }) => <TextInput classNames={darkInputClassNames} {...field} />}
              />
            </div>
            <div className={accountRowClass}>
              <label className={accountLabelClass}>Баланс</label>
              <Controller
                name="balance"
                control={accountForm.control}
                render={({ field }) => (
                  <NumberInput
                    placeholder="$ 1,999.99"
                    description="Формат баланса: $ 1,999.99"
                    error={accountErrors.balance?.message}
                    {...moneyInputProps}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-[#2a2a2a] bg-[#191919] px-3 py-2">
            <Button type="submit" variant="default" loading={isAccountSaving}>
              Сохранить
            </Button>
            <Button variant="default" onClick={onCloseFormDialog}>
              Отмена
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        opened={formDialog?.entity === 'transfer'}
        onClose={onCloseFormDialog}
        title={formDialog?.mode === 'edit' ? 'Редактировать перевод' : 'Добавить перевод'}
        size={640}
        classNames={modalClassNames}
        centered
      >
        <form onSubmit={transferForm.handleSubmit(onSaveTransfer)}>
          <div className="space-y-3 px-4 py-4">
            {formError && <Alert color="red">{formError}</Alert>}
            <div className={accountRowClass}>
              <label className={accountLabelClass}>Дата</label>
              <Controller
                name="transaction_date"
                control={transferForm.control}
                render={({ field: { value, onChange, ...field } }) => (
                  <DatePickerInput
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
            <div className={accountRowClass}>
              <label className={accountLabelClass}>Краткое описание</label>
              <Controller
                name="description"
                control={transferForm.control}
                render={({ field }) => <TextInput classNames={darkInputClassNames} {...field} />}
              />
            </div>
            <div className={accountRowClass}>
              <label className={accountLabelClass}>Полное описание</label>
              <Controller
                name="full_description"
                control={transferForm.control}
                render={({ field }) => <TextInput classNames={darkInputClassNames} {...field} />}
              />
            </div>
            <div className={accountRowClass}>
              <label className={accountLabelClass}>Категория</label>
              <Controller
                name="category"
                control={transferForm.control}
                render={({ field: { value, onChange, ...field } }) => (
                  <Select
                    data={transferCategoryOptions}
                    value={value}
                    onChange={(nextValue) => onChange(nextValue ?? 'Other')}
                    allowDeselect={false}
                    classNames={darkInputClassNames}
                    {...field}
                  />
                )}
              />
            </div>
            <div className={accountRowClass}>
              <label className={accountLabelClass}>Референс</label>
              <Controller
                name="reference"
                control={transferForm.control}
                render={({ field }) => <TextInput classNames={darkInputClassNames} {...field} />}
              />
            </div>
            <div className={accountRowClass}>
              <label className={accountLabelClass}>Тип</label>
              <Controller
                name="transfer_type"
                control={transferForm.control}
                render={({ field: { value, onChange, ...field } }) => (
                  <Select
                    data={transferTypeOptions}
                    value={value}
                    onChange={(nextValue) => onChange(nextValue ?? 'Other')}
                    allowDeselect={false}
                    classNames={darkInputClassNames}
                    {...field}
                  />
                )}
              />
            </div>
            <div className={accountRowClass}>
              <label className={accountLabelClass}>Сумма</label>
              <Controller
                name="amount"
                control={transferForm.control}
                render={({ field }) => (
                  <NumberInput
                    min={0}
                    allowNegative={false}
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
            <Button type="submit" variant="default" loading={isTransferSaving}>
              Сохранить
            </Button>
            <Button variant="default" onClick={onCloseFormDialog}>
              Отмена
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        opened={formDialog?.entity === 'file'}
        onClose={onCloseFormDialog}
        title={formDialog?.mode === 'edit' ? 'Редактировать файл' : 'Добавить файл'}
        centered
      >
        <form onSubmit={fileForm.handleSubmit(onSaveFile)}>
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
              <Button variant="subtle" onClick={onCloseFormDialog}>
                Отмена
              </Button>
              <Button type="submit" loading={isFileSaving}>
                {formDialog?.mode === 'edit' ? 'Сохранить' : 'Добавить'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Modal opened={deleteDialog !== null} onClose={onCloseDeleteDialog} title={deleteTitle} centered>
        <Stack>
          {formError && <Alert color="red">{formError}</Alert>}
          <Text size="sm">{deleteDescription}</Text>
          <Group justify="flex-end">
            <Button variant="subtle" onClick={onCloseDeleteDialog}>
              Отмена
            </Button>
            <Button color="red" loading={isDeleting} onClick={onConfirmDelete}>
              Удалить
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}
