import { cn } from '../../utils/cn'
import styles from './TruistMark.module.css'

interface TruistMarkProps {
  className?: string
}

export function TruistMark({ className }: TruistMarkProps) {
  return (
    <span className={cn(styles.mark, className)} aria-hidden="true">
      <svg viewBox="0 0 26 27" role="img" focusable="false">
        <path
          fill="currentColor"
          d="M0 24.08V2.92C0 1.44 0.89 0.55 2.37 0.55H23.53C25.01 0.55 25.9 1.44 25.9 2.92V24.08C25.9 25.56 25.01 26.45 23.53 26.45H2.37C0.89 26.45 0 25.56 0 24.08ZM23.72 24.27V14.76H17.15V19.47H14.63V7.53H17.15V12.24H23.72V2.73H2.18V12.24H8.75V7.53H11.27V19.47H8.75V14.76H2.18V24.27H23.72Z"
        />
      </svg>
    </span>
  )
}
