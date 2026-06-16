import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'
import styles from './MobileNavItem.module.css'

interface MobileNavItemProps {
  children: ReactNode
  current?: boolean
  icon: ReactNode
  onSelect?: () => void
  to?: string
}

export function MobileNavItem({
  children,
  current = false,
  icon,
  onSelect,
  to,
}: MobileNavItemProps) {
  const className = cn(styles.mobileNavItem, current && styles.current)

  if (to) {
    return (
      <Link className={className} to={to} role="menuitem" onClick={onSelect}>
        {icon}
        <span>{children}</span>
      </Link>
    )
  }

  return (
    <button className={className} type="button" role="menuitem" onClick={onSelect}>
      {icon}
      <span>{children}</span>
    </button>
  )
}
