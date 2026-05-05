import { ExternalLink } from 'lucide-react'
import styles from './ProjectsSection.module.css'

export default function ProjectsSection({ data = [] }) {
  const projects = Array.isArray(data) ? data : []

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Projects</h2>
      <div className={styles.grid}>
        {projects.map((project, i) => (
          <div key={project?._id || i} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.projectName}>{project?.name || ''}</h3>
              {project?.link && (
                <a
                  href={`https://${project.link}`}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.link}
                >
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
            <p className={styles.description}>{project?.description || ''}</p>
            {Array.isArray(project?.highlights) && project.highlights.length > 0 && (
              <div className={styles.highlights}>
                {project.highlights.map((h, j) => (
                  <span key={j} className={styles.highlight}>{h || ''}</span>
                ))}
              </div>
            )}
            {Array.isArray(project?.tech) && project.tech.length > 0 && (
              <div className={styles.techStack}>
                {project.tech.map((t, j) => (
                  <span key={j} className={styles.techTag}>{t || ''}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
