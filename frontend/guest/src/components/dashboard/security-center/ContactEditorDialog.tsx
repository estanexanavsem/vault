import { LoaderCircle, Mail, Phone, X } from 'lucide-react'
import { type ChangeEvent, type RefObject } from 'react'
import { Controller, type UseFormReturn } from 'react-hook-form'
import type { ContactEditField, ContactEditorForm } from '../../../hooks/useContactEditor'
import styles from './ContactEditorDialog.module.css'

interface ContactEditorDialogProps {
  dialogRef: RefObject<HTMLDialogElement | null>
  editingField: ContactEditField | null
  form: UseFormReturn<ContactEditorForm>
  getEditorInputValue: (event: ChangeEvent<HTMLInputElement>) => string
  isEditingEmail: boolean
  onClose: () => void
  onRequestClose: () => void
  onSubmit: (values: ContactEditorForm) => Promise<void>
}

export function ContactEditorDialog({
  dialogRef,
  editingField,
  form,
  getEditorInputValue,
  isEditingEmail,
  onClose,
  onRequestClose,
  onSubmit,
}: ContactEditorDialogProps) {
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = form
  const modalTitle = isEditingEmail ? 'Edit email address' : 'Edit phone number'
  const modalCopy = isEditingEmail
    ? 'Updates made to your current email address will affect any associated accounts.'
    : 'Updates made to your current phone number will affect security alerts for your accounts.'
  const inputLabel = isEditingEmail ? 'Primary email address' : 'Primary phone number'
  const inputId = isEditingEmail ? 'contact-editor-email' : 'contact-editor-phone'

  return (
    <dialog
      ref={dialogRef}
      className={styles.overlay}
      aria-labelledby="contact-editor-title"
      onCancel={(event) => {
        if (isSubmitting) {
          event.preventDefault()
          return
        }

        onClose()
      }}
      onClose={onClose}
    >
      {editingField ? (
        <form className={styles.dialog} onSubmit={handleSubmit(onSubmit)}>
          <button
            className={styles.close}
            type="button"
            aria-label="Close"
            onClick={onRequestClose}
          >
            <X size={22} aria-hidden="true" />
          </button>

          <h3 id="contact-editor-title">{modalTitle}</h3>
          <p className={styles.copy}>{modalCopy}</p>

          <label className={styles.field} htmlFor={inputId}>
            <span>{inputLabel}</span>
            <span className={styles.input}>
              {isEditingEmail ? (
                <Mail className={styles.icon} size={22} aria-hidden="true" />
              ) : (
                <Phone className={styles.icon} size={22} aria-hidden="true" />
              )}
              <Controller
                control={control}
                name="value"
                render={({ field }) => (
                  <input
                    id={inputId}
                    autoCapitalize="none"
                    autoComplete={isEditingEmail ? 'email' : 'tel'}
                    autoCorrect="off"
                    aria-label={inputLabel}
                    aria-invalid={errors.value ? 'true' : undefined}
                    inputMode={isEditingEmail ? 'email' : 'tel'}
                    maxLength={isEditingEmail ? 254 : 14}
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={(event) => {
                      field.onChange(getEditorInputValue(event))
                    }}
                    required
                    spellCheck={false}
                    type={isEditingEmail ? 'email' : 'tel'}
                    value={field.value}
                  />
                )}
              />
            </span>
          </label>

          {errors.value?.message || errors.root?.message ? (
            <p className={styles.error}>{errors.value?.message ?? errors.root?.message}</p>
          ) : null}

          <div className={styles.actions}>
            <button
              className={styles.primary}
              type="submit"
              disabled={isSubmitting}
              aria-label={isSubmitting ? 'Updating' : undefined}
            >
              {isSubmitting ? (
                <LoaderCircle className="motion-safe:animate-spin" size={20} aria-hidden="true" />
              ) : (
                'Update'
              )}
            </button>
            <button
              className={styles.secondary}
              type="button"
              disabled={isSubmitting}
              onClick={onRequestClose}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}
    </dialog>
  )
}
