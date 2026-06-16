import { UserRound } from 'lucide-react'
import { useRef, useState } from 'react'
import { type ContactEditField, useContactEditor } from '../../hooks/useContactEditor'
import type { MasterAccount } from '../../types/guest'
import { getFullName, getInitials } from '../../utils/accountIdentity'
import { formatEasternDateTime, formatUsPhoneNumber } from '../../utils/formatters'
import styles from './SecurityCenterPage.module.css'
import { ContactEditorDialog } from './security-center/ContactEditorDialog'
import { ContactInfoPanel } from './security-center/ContactInfoPanel'
import { SecurityProfileSidebar } from './security-center/SecurityProfileSidebar'

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
    form,
    getEditorInputValue,
    isEditingEmail,
    openEditor,
    submitEditor,
  } = useContactEditor({
    account,
    onEditorClosed: () => dialogRef.current?.close(),
    onSessionExpired,
  })
  const {
    formState: { isSubmitting },
  } = form
  const fullName = getFullName(account)
  const initials = getInitials(fullName, account.login)
  const lastSignInText = account.last_sign_in_at
    ? formatEasternDateTime(account.last_sign_in_at)
    : ''
  const phoneNumber = formatUsPhoneNumber(account.phone)

  const openContactEditor = (field: ContactEditField) => {
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
      <SecurityProfileSidebar
        fullName={fullName}
        initials={initials}
        lastSignInText={lastSignInText}
      />

      <section className={styles.content} aria-labelledby="personal-info-heading">
        <button className={styles.backButton} type="button" onClick={onBack}>
          Back to dashboard
        </button>

        <div className={styles.titleRow}>
          <UserRound size={32} aria-hidden="true" />
          <h2 id="personal-info-heading">Personal information</h2>
        </div>

        <ContactInfoPanel
          description="We'll send important information about your online profile and your accounts to your primary email address. Add up to 2 additional email addresses if you want us to send information for any of your accounts somewhere else."
          headingId="email-heading"
          label="Primary email address"
          note="Your primary email address can't be deleted."
          title="Email address"
          value={account.email}
          onEdit={() => openContactEditor('email')}
        />

        <ContactInfoPanel
          description="We'll use your primary phone number to call you or send a text message if we notice any suspicious activity on your accounts. You can add another phone number to associate with any of your accounts."
          detailId="phone-details"
          headingId="phone-heading"
          isOpen={isPhoneOpen}
          label="Primary phone number"
          title="Phone number"
          value={phoneNumber}
          onEdit={() => openContactEditor('phone')}
          onToggle={() => setIsPhoneOpen((current) => !current)}
        />

        <ContactEditorDialog
          dialogRef={dialogRef}
          editingField={editingField}
          form={form}
          getEditorInputValue={getEditorInputValue}
          isEditingEmail={isEditingEmail}
          onClose={closeEditor}
          onRequestClose={closeContactEditor}
          onSubmit={submitEditor}
        />
      </section>
    </main>
  )
}
