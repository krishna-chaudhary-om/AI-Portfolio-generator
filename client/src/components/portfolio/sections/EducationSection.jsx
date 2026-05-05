import styles from './EducationSection.module.css'

export default function EducationSection({ data = [] }) {
  const entries = Array.isArray(data) ? data : []

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Education</h2>
      <div className={styles.list}>
        {entries.map((edu, i) => (
          <div key={edu?._id || i} className={styles.item}>
            <div className={styles.itemHeader}>
              <div>
                <h3 className={styles.institution}>{edu?.institution || ''}</h3>
                <p className={styles.degree}>{edu?.degree || ''}</p>
              </div>
              <div className={styles.right}>
                <span className={styles.period}>{edu?.period || ''}</span>
                {edu?.gpa && <span className={styles.gpa}>GPA {edu.gpa}</span>}
              </div>
            </div>
            {Array.isArray(edu?.highlights) && edu.highlights.length > 0 && (
              <div className={styles.highlights}>
                {edu.highlights.map((h, j) => (
                  <span key={j} className={styles.highlight}>{h || ''}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
