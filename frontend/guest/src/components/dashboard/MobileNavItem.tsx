import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'
import styles from './navigation.module.css'

interface MobileNavItemProps {
  children: ReactNode
  current?: boolean
  icon: ReactNode
  onSelect?: () => void
}

export function MobileNavItem({ children, current = false, icon, onSelect }: MobileNavItemProps) {
  const className = cn(styles.mobileNavItem, current && styles.current)

  return (
    <button className={className} type="button" role="menuitem" onClick={onSelect}>
      {icon}
      <span>{children}</span>
    </button>
  )
}
