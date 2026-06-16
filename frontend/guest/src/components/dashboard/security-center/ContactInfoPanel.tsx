import { ChevronDown, Pencil } from 'lucide-react'
import { cn } from '../../../utils/cn'
import styles from './ContactInfoPanel.module.css'

interface ContactInfoPanelProps {
  description: string
  detailId?: string
  headingId: string
  isOpen?: boolean
  label: string
  note?: string
  onEdit: () => void
  onToggle?: () => void
  title: string
  value: string
}

export function ContactInfoPanel({
  description,
  detailId,
  headingId,
  isOpen = true,
  label,
  note,
  onEdit,
  onToggle,
  title,
  value,
}: ContactInfoPanelProps) {
  const isToggleable = Boolean(onToggle)
  const detail = (
    <div className={styles.detail} id={detailId}>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        {note ? <p>{note}</p> : null}
      </div>
      <button className={styles.button} type="button" onClick={onEdit}>
        <Pencil size={16} aria-hidden="true" />
        Edit
      </button>
    </div>
  )

  return (
    <section className={styles.panel} aria-labelledby={headingId}>
      {onToggle ? (
        <button
          className={cn(styles.head, styles.toggle)}
          type="button"
          aria-expanded={isOpen}
          aria-controls={detailId}
          onClick={onToggle}
        >
          <div>
            <h3 id={headingId}>{title}</h3>
            <p>{description}</p>
          </div>
          <ChevronDown size={22} aria-hidden="true" data-open={isOpen} />
        </button>
      ) : (
        <div className={styles.head}>
          <div>
            <h3 id={headingId}>{title}</h3>
            <p>{description}</p>
          </div>
        </div>
      )}

      {isToggleable ? (isOpen ? detail : null) : detail}
    </section>
  )
}
