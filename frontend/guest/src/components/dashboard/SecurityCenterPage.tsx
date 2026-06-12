import { ChevronDown, LoaderCircle, Mail, Pencil, Phone, UserRound, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { Controller } from 'react-hook-form'
import { useContactEditor } from '../../hooks/useContactEditor'
import type { MasterAccount } from '../../types/guest'
import { getFullName, getInitials } from '../../utils/accountIdentity'
import { cn } from '../../utils/cn'
import { formatEasternDateTime, formatUsPhoneNumber } from '../../utils/formatters'
import styles from './security-center.module.css'

interface SecurityCenterPageProps {
  account: MasterAccount
  onBack: () => void
  onSessionExpired: () => void
}

export function SecurityCenterPage({ account, onBack, onSessionExpired }: SecurityCenterPageProps) {
  const [isPhoneOpen, setIsPhoneOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const {
    closeEditor,
    editingField,
    form: {
      control,
      formState: { errors, isSubmitting },
      handleSubmit,
    },
    getEditorInputValue,
    isEditingEmail,
    openEditor,
    submitEditor,
  } = useContactEditor({
    account,
    onEditorClosed: () => dialogRef.current?.close(),
    onSessionExpired,
  })
  const fullName = getFullName(account)
  const initials = getInitials(fullName, account.login)
  const lastSignInText = account.last_sign_in_at
    ? formatEasternDateTime(account.last_sign_in_at)
    : ''
  const phoneNumber = formatUsPhoneNumber(account.phone)
  const modalTitle = isEditingEmail ? 'Edit email address' : 'Edit phone number'
  const modalCopy = isEditingEmail
    ? 'Updates made to your current email address will affect any associated accounts.'
    : 'Updates made to your current phone number will affect security alerts for your accounts.'
  const inputLabel = isEditingEmail ? 'Primary email address' : 'Primary phone number'
  const inputId = isEditingEmail ? 'contact-editor-email' : 'contact-editor-phone'

  const openContactEditor = (field: 'email' | 'phone') => {
    openEditor(field)
    const dialog = dialogRef.current
    if (dialog && !dialog.open) {
      dialog.showModal()
    }
  }

  const closeContactEditor = () => {
    if (isSubmitting) {
      return
    }

    closeEditor()
    dialogRef.current?.close()
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
              onClick={() => openContactEditor('email')}
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
                onClick={() => openContactEditor('phone')}
              >
                <Pencil size={16} aria-hidden="true" />
                Edit
              </button>
            </div>
          ) : null}
        </section>

        <dialog
          ref={dialogRef}
          className={styles.modalOverlay}
          aria-labelledby="contact-editor-title"
          onCancel={(event) => {
            if (isSubmitting) {
              event.preventDefault()
              return
            }

            closeEditor()
          }}
          onClose={closeEditor}
        >
          {editingField ? (
            <form className={styles.modal} onSubmit={handleSubmit(submitEditor)}>
              <button
                className={styles.modalClose}
                type="button"
                aria-label="Close"
                onClick={closeContactEditor}
              >
                <X size={22} aria-hidden="true" />
              </button>

              <h3 id="contact-editor-title">{modalTitle}</h3>
              <p className={styles.modalCopy}>{modalCopy}</p>

              <label className={styles.modalField} htmlFor={inputId}>
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
                  onClick={closeContactEditor}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : null}
        </dialog>
      </section>
    </main>
  )
}
