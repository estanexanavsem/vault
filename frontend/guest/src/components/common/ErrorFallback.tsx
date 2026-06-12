import type { FallbackProps } from 'react-error-boundary'
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react'
import { cn } from '../../utils/cn'
import styles from './ErrorFallback.module.css'

interface ErrorFallbackProps extends FallbackProps {
  onBack?: () => void
  scope?: 'app' | 'page'
}

const fallbackCopy = {
  app: {
    message: 'Refresh the page to start again. Your account information was not changed.',
    title: 'Something went wrong.',
  },
  page: {
    message: 'This section could not be displayed. You can retry it or return to the dashboard.',
    title: 'This section is unavailable.',
  },
}

export function ErrorFallback({ onBack, resetErrorBoundary, scope = 'app' }: ErrorFallbackProps) {
  const copy = fallbackCopy[scope]
  const headingId = `${scope}-error-title`
  const primaryAction = scope === 'app' ? () => window.location.reload() : resetErrorBoundary
  const primaryActionLabel = scope === 'app' ? 'Refresh' : 'Try again'
  const panel = (
    <div className={styles.panel}>
      <span className={styles.icon}>
        <AlertTriangle size={24} aria-hidden="true" />
      </span>

      <div className={styles.copy}>
        {scope === 'app' ? (
          <h1 id={headingId}>{copy.title}</h1>
        ) : (
          <h2 id={headingId}>{copy.title}</h2>
        )}
        <p>{copy.message}</p>
      </div>

      <div className={styles.actions}>
        <button className={styles.primaryButton} type="button" onClick={primaryAction}>
          <RefreshCw size={16} aria-hidden="true" />
          {primaryActionLabel}
        </button>
        {onBack ? (
          <button className={styles.secondaryButton} type="button" onClick={onBack}>
            <ArrowLeft size={16} aria-hidden="true" />
            Back to dashboard
          </button>
        ) : null}
      </div>
    </div>
  )

  if (scope === 'app') {
    return (
      <main
        className={cn(styles.fallback, styles.fullPage)}
        role="alert"
        aria-labelledby={headingId}
      >
        {panel}
      </main>
    )
  }

  return (
    <section className={styles.fallback} role="alert" aria-labelledby={headingId}>
      {panel}
    </section>
  )
}
