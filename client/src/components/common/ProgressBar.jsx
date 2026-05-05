import styles from './ProgressBar.module.css'

export default function ProgressBar({ value = 0, label, showPercent = true, variant = 'accent' }) {
  const pct = Math.min(100, Math.max(0, value))

  return (
    <div className={styles.wrapper}>
      {(label || showPercent) && (
        <div className={styles.meta}>
          {label && <span className={styles.label}>{label}</span>}
          {showPercent && <span className={styles.percent}>{pct}%</span>}
        </div>
      )}
      <div className={styles.track} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`${styles.fill} ${styles[variant]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
