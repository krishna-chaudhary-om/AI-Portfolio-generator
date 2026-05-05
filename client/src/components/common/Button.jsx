import clsx from 'clsx'
import styles from './Button.module.css'

/**
 * @param {'primary'|'secondary'|'ghost'|'danger'} variant
 * @param {'sm'|'md'|'lg'} size
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconRight,
  fullWidth = false,
  className,
  onClick,
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(
        styles.btn,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        loading && styles.loading,
        className
      )}
      {...rest}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {!loading && icon && <span className={styles.iconLeft}>{icon}</span>}
      <span className={styles.label}>{children}</span>
      {!loading && iconRight && <span className={styles.iconRight}>{iconRight}</span>}
    </button>
  )
}
