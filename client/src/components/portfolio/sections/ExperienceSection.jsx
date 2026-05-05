import styles from './ExperienceSection.module.css'

export default function ExperienceSection({ data = [] }) {
  const items = Array.isArray(data) ? data : []

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Experience</h2>
      <div className={styles.timeline}>
        {items.map((exp, i) => (
          <div key={exp?._id || i} className={styles.item}>
            <div className={styles.itemHeader}>
              <div className={styles.itemLeft}>
                <h3 className={styles.role}>{exp?.role || ''}</h3>
                <span className={styles.company}>{exp?.company || ''}</span>
                {exp?.location && <span className={styles.location}>· {exp.location}</span>}
              </div>
              <span className={styles.period}>{exp?.period || ''}</span>
            </div>
            {Array.isArray(exp?.bullets) && exp.bullets.length > 0 && (
              <ul className={styles.bullets}>
                {exp.bullets.map((b, j) => (
                  <li key={j} className={styles.bullet}>{b || ''}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
