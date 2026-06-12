import { ChevronDown, LoaderCircle, Mail, Pencil, Phone, UserRound, X } from 'lucide-react'
import { useState, type ChangeEvent } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { guestAuthService } from '../../services/guestAuthService'
import type { MasterAccount } from '../../types/guest'
import { cn } from '../../utils/cn'
import {
  formatEasternDateTime,
  formatUsPhoneInput,
  formatUsPhoneNumber,
  normalizeUsPhoneNumber,
} from '../../utils/formatters'
import { notifyRequestError } from '../../utils/notifications'
import { normalizeRequestError } from '../../utils/requestError'
import styles from './security-center.module.css'

interface SecurityCenterPageProps {
  account: MasterAccount
  onAccountUpdate: (account: MasterAccount) => void
  onBack: () => void
  onSessionExpired: () => void
}

type EditField = 'email' | 'phone'

const contactEditorSchema = z
  .object({
    field: z.enum(['email', 'phone']),
    value: z.string().trim(),
  })
  .superRefine((data, ctx) => {
    if (data.field === 'email') {
      const emailResult = z.email('Enter a valid email address.').safeParse(data.value)
      if (!emailResult.success) {
        ctx.addIssue({
          code: 'custom',
          message: 'Enter a valid email address.',
          path: ['value'],
        })
      }
      return
    }

    if (!normalizeUsPhoneNumber(data.value)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Enter a valid US phone number.',
        path: ['value'],
      })
    }
  })

type ContactEditorForm = z.infer<typeof contactEditorSchema>

const getInitials = (name: string, fallback: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }

  return (parts[0] ?? fallback).slice(0, 2).toUpperCase()
}

const getFullName = (account: MasterAccount) => {
  const holderName = account.holder_name.trim()
  return holderName !== '' ? holderName : account.login
}

export function SecurityCenterPage({
  account,
  onAccountUpdate,
  onBack,
  onSessionExpired,
}: SecurityCenterPageProps) {
  const [isPhoneOpen, setIsPhoneOpen] = useState(false)
  const [editingField, setEditingField] = useState<EditField | null>(null)
  const {
    clearErrors,
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
    setError,
  } = useForm<ContactEditorForm>({
    defaultValues: {
      field: 'email',
      value: '',
    },
    resolver: zodResolver(contactEditorSchema),
  })
  const fullName = getFullName(account)
  const initials = getInitials(fullName, account.login)
  const lastSignInText = account.last_sign_in_at
    ? formatEasternDateTime(account.last_sign_in_at)
    : ''
  const phoneNumber = formatUsPhoneNumber(account.phone)
  const isEditingEmail = editingField === 'email'
  const modalTitle = isEditingEmail ? 'Edit email address' : 'Edit phone number'
  const modalCopy = isEditingEmail
    ? 'Updates made to your current email address will affect any associated accounts.'
    : 'Updates made to your current phone number will affect security alerts for your accounts.'
  const inputLabel = isEditingEmail ? 'Primary email address' : 'Primary phone number'

  const openEditor = (field: EditField) => {
    setEditingField(field)
    reset({
      field,
      value: field === 'email' ? account.email : formatUsPhoneInput(account.phone),
    })
  }

  const closeEditor = () => {
    if (isSubmitting) {
      return
    }
    setEditingField(null)
    reset({ field: 'email', value: '' })
    clearErrors()
  }

  const getEditorInputValue = (event: ChangeEvent<HTMLInputElement>) => {
    const value = isEditingEmail ? event.target.value : formatUsPhoneInput(event.target.value)
    clearErrors('value')
    clearErrors('root')
    return value
  }

  const submitEditor = async (values: ContactEditorForm) => {
    const payload =
      values.field === 'email'
        ? { email: values.value.trim() }
        : { phone: normalizeUsPhoneNumber(values.value) }

    try {
      const updatedAccount = await guestAuthService.updateProfile(payload)
      onAccountUpdate(updatedAccount)
      setEditingField(null)
      reset({ field: 'email', value: '' })
    } catch (error: unknown) {
      const requestError = normalizeRequestError(error)

      if (requestError.kind === 'auth') {
        notifyRequestError(error, {
          id: 'guest-profile-session',
          title: 'Your session expired',
        })
        onSessionExpired()
        return
      }

      if (
        requestError.kind === 'network' ||
        requestError.kind === 'server' ||
        requestError.kind === 'timeout'
      ) {
        notifyRequestError(error, {
          id: 'guest-profile-update',
          title: "We couldn't update your contact information",
        })
      }

      setError('root', {
        message: requestError.userMessage,
      })
    }
  }

  return (
    <main className={styles.page}>
      <aside className={styles.sidebar} aria-label="Profile settings">
        <div className={styles.profile}>
          <div className={styles.avatarWrap}>
            <span className={styles.avatar}>{initials}</span>
          </div>
          <h1>{fullName}</h1>
          {lastSignInText ? <p>Last sign-in at {lastSignInText}</p> : null}
        </div>

        <nav className={styles.sideNav} aria-label="Security center sections">
          <button className={styles.sideNavCurrent} type="button">
            <UserRound size={20} aria-hidden="true" />
            Personal information
          </button>
        </nav>
      </aside>

      <section className={styles.content} aria-labelledby="personal-info-heading">
        <button className={styles.backButton} type="button" onClick={onBack}>
          Back to dashboard
        </button>

        <div className={styles.titleRow}>
          <UserRound size={32} aria-hidden="true" />
          <h2 id="personal-info-heading">Personal information</h2>
        </div>

        <section className={styles.infoPanel} aria-labelledby="email-heading">
          <div className={styles.panelHead}>
            <div>
              <h3 id="email-heading">Email address</h3>
              <p>
                We'll send important information about your online profile and your accounts to your
                primary email address. Add up to 2 additional email addresses if you want us to send
                information for any of your accounts somewhere else.
              </p>
            </div>
          </div>

          <div className={styles.detailRow}>
            <div>
              <span>Primary email address</span>
              <strong>{account.email}</strong>
              <p>Your primary email address can't be deleted.</p>
            </div>
            <button
              className={styles.outlineButton}
              type="button"
              onClick={() => openEditor('email')}
            >
              <Pencil size={16} aria-hidden="true" />
              Edit
            </button>
          </div>
        </section>

        <section className={styles.infoPanel} aria-labelledby="phone-heading">
          <button
            className={cn(styles.panelHead, styles.panelToggle)}
            type="button"
            aria-expanded={isPhoneOpen}
            aria-controls="phone-details"
            onClick={() => setIsPhoneOpen((current) => !current)}
          >
            <div>
              <h3 id="phone-heading">Phone number</h3>
              <p>
                We'll use your primary phone number to call you or send a text message if we notice
                any suspicious activity on your accounts. You can add another phone number to
                associate with any of your accounts.
              </p>
            </div>
            <ChevronDown size={22} aria-hidden="true" data-open={isPhoneOpen} />
          </button>

          {isPhoneOpen ? (
            <div className={styles.detailRow} id="phone-details">
              <div>
                <span>Primary phone number</span>
                <strong>{phoneNumber}</strong>
              </div>
              <button
                className={styles.outlineButton}
                type="button"
                onClick={() => openEditor('phone')}
              >
                <Pencil size={16} aria-hidden="true" />
                Edit
              </button>
            </div>
          ) : null}
        </section>

        {editingField ? (
          <div className={styles.modalOverlay} role="presentation">
            <form
              className={styles.modal}
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-editor-title"
              onSubmit={handleSubmit(submitEditor)}
            >
              <button
                className={styles.modalClose}
                type="button"
                aria-label="Close"
                onClick={closeEditor}
              >
                <X size={22} aria-hidden="true" />
              </button>

              <h3 id="contact-editor-title">{modalTitle}</h3>
              <p className={styles.modalCopy}>{modalCopy}</p>

              <label className={styles.modalField}>
                <span>{inputLabel}</span>
                <span className={styles.inputShell}>
                  {isEditingEmail ? (
                    <Mail className={styles.inputIcon} size={22} aria-hidden="true" />
                  ) : (
                    <Phone className={styles.inputIcon} size={22} aria-hidden="true" />
                  )}
                  <Controller
                    control={control}
                    name="value"
                    render={({ field }) => (
                      <input
                        autoComplete={isEditingEmail ? 'email' : 'tel'}
                        autoCorrect="off"
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
                <p className={styles.modalError}>{errors.value?.message ?? errors.root?.message}</p>
              ) : null}

              <div className={styles.modalActions}>
                <button
                  className={styles.primaryButton}
                  type="submit"
                  disabled={isSubmitting}
                  aria-label={isSubmitting ? 'Updating' : undefined}
                >
                  {isSubmitting ? (
                    <LoaderCircle
                      className="motion-safe:animate-spin"
                      size={20}
                      aria-hidden="true"
                    />
                  ) : (
                    'Update'
                  )}
                </button>
                <button
                  className={styles.secondaryButton}
                  type="button"
                  disabled={isSubmitting}
                  onClick={closeEditor}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </section>
    </main>
  )
}
