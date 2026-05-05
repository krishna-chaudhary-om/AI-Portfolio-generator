import { Github, Linkedin, Globe, Mail, Phone, MapPin } from 'lucide-react'
import { getInitials } from '../../../utils/helpers.js'
import styles from './HeroSection.module.css'

export default function HeroSection({ data = {} }) {
  const {
    name, title, tagline, summary,
    email, phone, location,
    linkedin, github, website,
  } = data

  return (
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.left}>
          <div className={styles.avatar}>{getInitials(name)}</div>
          <div className={styles.identity}>
            <h1 className={styles.name}>{name}</h1>
            <p className={styles.title}>{title}</p>
            {tagline && <p className={styles.tagline}>{tagline}</p>}
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.contactLinks}>
            {email && (
              <a href={`mailto:${email}`} className={styles.contactLink}>
                <Mail size={13} /> {email}
              </a>
            )}
            {phone && (
              <a href={`tel:${phone}`} className={styles.contactLink}>
                <Phone size={13} /> {phone}
              </a>
            )}
            {location && (
              <span className={styles.contactLink}>
                <MapPin size={13} /> {location}
              </span>
            )}
          </div>
          <div className={styles.socialLinks}>
            {github && (
              <a href={`https://${github}`} target="_blank" rel="noreferrer" className={styles.socialLink}>
                <Github size={15} />
              </a>
            )}
            {linkedin && (
              <a href={`https://${linkedin}`} target="_blank" rel="noreferrer" className={styles.socialLink}>
                <Linkedin size={15} />
              </a>
            )}
            {website && (
              <a href={`https://${website}`} target="_blank" rel="noreferrer" className={styles.socialLink}>
                <Globe size={15} />
              </a>
            )}
          </div>
        </div>
      </div>

      {summary && (
        <div className={styles.summary}>
          <p>{summary}</p>
        </div>
      )}
    </header>
  )
}
