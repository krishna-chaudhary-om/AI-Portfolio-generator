import styles from './SkillsSection.module.css'

export default function SkillsSection({ data = [] }) {
  const isGrouped = !Array.isArray(data) && data && typeof data === 'object'
  const groups = isGrouped ? Object.entries(data) : []
  const tags = Array.isArray(data) ? data : []

  return (
    <section className={styles.section}>
      <h3 className={styles.title}>Skills</h3>
      {isGrouped ? (
        <div className={styles.groups}>
          {groups.map(([group, skills], groupIndex) => {
            const skillItems = Array.isArray(skills) ? skills : []
            return (
              <div key={`${group}-${groupIndex}`} className={styles.group}>
                <span className={styles.groupLabel}>{group}</span>
                <div className={styles.tags}>
                  {skillItems.map((s, j) => (
                    <span key={j} className={styles.tag}>{s || ''}</span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className={styles.tags}>
          {tags.map((s, j) => (
            <span key={j} className={styles.tag}>{s || ''}</span>
          ))}
        </div>
      )}
    </section>
  )
}
