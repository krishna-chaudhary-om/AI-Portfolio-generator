import clsx from 'clsx'
import styles from './Badge.module.css'

export default function Badge({ children, variant = 'default', size = 'md', className }) {
  return (
    <span className={clsx(styles.badge, styles[variant], styles[size], className)}>
      {children}
    </span>
  )
}
