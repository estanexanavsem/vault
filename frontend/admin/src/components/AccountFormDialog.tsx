import { Alert, Button, Modal, NumberInput, PasswordInput, TextInput } from '@mantine/core'
import { Controller, type SubmitHandler, type UseFormReturn } from 'react-hook-form'
import type { AccountFormInput, AccountFormValues } from '../forms/accountForm'
import type { FormDialog } from '../types/panel'
import {
  darkInputClassNames,
  dialogLabelClass,
  dialogRowClass,
  modalClassNames,
  moneyInputProps,
} from '../utils/panelDialogConfig'

interface AccountFormDialogProps {
  formDialog: FormDialog
  formError: string
  accountForm: UseFormReturn<AccountFormInput, unknown, AccountFormValues>
  isSaving: boolean
  onClose: () => void
  onSave: SubmitHandler<AccountFormValues>
}

export function AccountFormDialog({
  formDialog,
  formError,
  accountForm,
  isSaving,
  onClose,
  onSave,
}: AccountFormDialogProps) {
  const accountErrors = accountForm.formState.errors

  return (
    <Modal
      opened={formDialog?.entity === 'account'}
      onClose={onClose}
      title={formDialog?.mode === 'edit' ? 'Редактировать аккаунт' : 'Добавить аккаунт'}
      size={640}
      classNames={modalClassNames}
      centered
    >
      <form onSubmit={accountForm.handleSubmit(onSave)}>
        <div className="space-y-3 px-4 py-4">
          {formError && <Alert color="red">{formError}</Alert>}
          <div className={dialogRowClass}>
            <label className={dialogLabelClass} htmlFor="account-login">
              Логин
            </label>
            <Controller
              name="login"
              control={accountForm.control}
              render={({ field }) => (
                <TextInput
                  id="account-login"
                  error={accountErrors.login?.message}
                  classNames={darkInputClassNames}
                  {...field}
                />
              )}
            />
          </div>
          <div className={dialogRowClass}>
            <label className={dialogLabelClass} htmlFor="account-password">
              {formDialog?.mode === 'edit' ? 'Новый пароль' : 'Пароль'}
            </label>
            <Controller
              name="password"
              control={accountForm.control}
              render={({ field }) => (
                <PasswordInput
                  id="account-password"
                  error={accountErrors.password?.message}
                  classNames={darkInputClassNames}
                  {...field}
                />
              )}
            />
          </div>
          <div className={dialogRowClass}>
            <label className={dialogLabelClass} htmlFor="account-holder-name">
              Имя холдера
            </label>
            <Controller
              name="holder_name"
              control={accountForm.control}
              render={({ field }) => (
                <TextInput id="account-holder-name" classNames={darkInputClassNames} {...field} />
              )}
            />
          </div>
          <div className={dialogRowClass}>
            <label className={dialogLabelClass} htmlFor="account-name">
              Название счета
            </label>
            <Controller
              name="account_name"
              control={accountForm.control}
              render={({ field }) => (
                <TextInput id="account-name" classNames={darkInputClassNames} {...field} />
              )}
            />
          </div>
          <div className={dialogRowClass}>
            <label className={dialogLabelClass} htmlFor="account-full-name">
              Полное название счета
            </label>
            <Controller
              name="full_account_name"
              control={accountForm.control}
              render={({ field }) => (
                <TextInput id="account-full-name" classNames={darkInputClassNames} {...field} />
              )}
            />
          </div>
          <div className={dialogRowClass}>
            <label className={dialogLabelClass} htmlFor="account-number">
              Номер счета
            </label>
            <Controller
              name="account_number"
              control={accountForm.control}
              render={({ field }) => (
                <TextInput id="account-number" classNames={darkInputClassNames} {...field} />
              )}
            />
          </div>
          <div className={dialogRowClass}>
            <label className={dialogLabelClass} htmlFor="account-routing-number">
              Роутинг
            </label>
            <Controller
              name="routing_number"
              control={accountForm.control}
              render={({ field }) => (
                <TextInput
                  id="account-routing-number"
                  classNames={darkInputClassNames}
                  {...field}
                />
              )}
            />
          </div>
          <div className={dialogRowClass}>
            <label className={dialogLabelClass} htmlFor="account-email">
              Эл. почта
            </label>
            <Controller
              name="email"
              control={accountForm.control}
              render={({ field }) => (
                <TextInput
                  id="account-email"
                  type="email"
                  classNames={darkInputClassNames}
                  {...field}
                />
              )}
            />
          </div>
          <div className={dialogRowClass}>
            <label className={dialogLabelClass} htmlFor="account-phone">
              Телефон
            </label>
            <Controller
              name="phone"
              control={accountForm.control}
              render={({ field }) => (
                <TextInput id="account-phone" classNames={darkInputClassNames} {...field} />
              )}
            />
          </div>
          <div className={dialogRowClass}>
            <label className={dialogLabelClass} htmlFor="account-balance">
              Баланс
            </label>
            <Controller
              name="balance"
              control={accountForm.control}
              render={({ field }) => (
                <NumberInput
                  id="account-balance"
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
