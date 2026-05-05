import { useEffect } from 'react'
import { usePortfolio } from '../../context/PortfolioContext.jsx'
import { THEMES } from '../../styles/themes.js'
import HeroSection from './sections/HeroSection.jsx'
import SkillsSection from './sections/SkillsSection.jsx'
import ExperienceSection from './sections/ExperienceSection.jsx'
import ProjectsSection from './sections/ProjectsSection.jsx'
import EducationSection from './sections/EducationSection.jsx'
import styles from './PortfolioRenderer.module.css'

// ─────────────────────────────────────────────────────────────
// NORMALIZATION
// ─────────────────────────────────────────────────────────────

function normalizePortfolio(raw) {
  if (!raw) return null

  const c = raw.content || raw
  const hero = c.hero || raw

  return {
    _id: raw._id || raw.id || 'portfolio',

    name: hero.name || raw.name || '',
    title: hero.tagline || raw.title || '',
    tagline: hero.tagline || '',
    email: hero.email || raw.email || '',
    phone: hero.phone || raw.phone || '',
    location: hero.location || raw.location || '',
    linkedin: hero.linkedin || raw.linkedin || '',
    github: hero.github || raw.github || '',
    website: hero.website || raw.website || '',
    summary: hero.bio || raw.summary || '',

    skills: normalizeSkills(c.skills || raw.skills),

    experience: normalizeExperience(c.experience || raw.experience || []),
    projects: normalizeProjects(c.projects || raw.projects || []),
    education: normalizeEducation(c.education || raw.education || []),

    certifications: raw.certifications || [],
    languages: c.skills?.languages || raw.languages || [],
  }
}

function normalizeSkills(skills) {
  if (!skills) return {}

  if (!Array.isArray(skills) && typeof skills === 'object') {
    if (skills.technical || skills.soft) {
      return {
        Technical: skills.technical || [],
        Soft: skills.soft || [],
        Languages: skills.languages || [],
      }
    }
    return skills
  }

  if (Array.isArray(skills)) return { Skills: skills }

  return {}
}

// 🔥 FIXED: Always inject _id
function normalizeExperience(exp) {
  if (!Array.isArray(exp)) return []

  return exp.map((e, i) => ({
    _id: e._id || e.id || `exp-${i}`,

    company: e.company || '',
    role: e.role || e.title || '',
    period:
      e.period ||
      `${e.startDate || ''} – ${e.current ? 'Present' : e.endDate || ''}`,
    location: e.location || '',
    bullets:
      e.bullets ||
      e.achievements ||
      (e.description ? [e.description] : []),
  }))
}

// 🔥 FIXED: Always inject _id
function normalizeProjects(projects) {
  if (!Array.isArray(projects)) return []

  return projects.map((p, i) => ({
    _id: p._id || p.id || `proj-${i}`,

    name: p.name || p.title || '',
    description: p.description || '',
    tech: p.tech || p.technologies || [],
    link: p.link || p.url || p.github || '',
    highlights: p.highlights || [],
  }))
}

// 🔥 FIXED: Always inject _id
function normalizeEducation(edu) {
  if (!Array.isArray(edu)) return []

  return edu.map((e, i) => ({
    _id: e._id || e.id || `edu-${i}`,

    institution: e.institution || '',
    degree:
      e.degree || `${e.degree || ''} ${e.field || ''}`.trim(),
    period:
      e.period ||
      `${e.startYear || ''} – ${e.endYear || ''}`,
    gpa: e.gpa || '',
    highlights: e.highlights || [],
  }))
}

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────

export default function PortfolioRenderer() {
  const { portfolioData, selectedTheme, selectedLayout } = usePortfolio()

  const theme =
    THEMES[selectedTheme] || THEMES[Object.keys(THEMES)[0]]

  const data = normalizePortfolio(portfolioData)

  useEffect(() => {
    const el = document.getElementById('portfolio-preview-root')
    if (!el || !theme?.vars) return

    Object.entries(theme.vars).forEach(([key, val]) => {
      el.style.setProperty(key, val)
    })
  }, [theme])

  if (!data) return null

  return (
    <div
      id="portfolio-preview-root"
      className={[
        styles.root,
        styles[`layout-${selectedLayout}`],
      ].join(' ')}
    >
      <HeroSection data={data} />

      <div className={styles.body}>
        <main className={styles.main}>
          {data.experience.length > 0 && (
            <ExperienceSection data={data.experience} />
          )}

          {data.projects.length > 0 && (
            <ProjectsSection data={data.projects} />
          )}

          {data.education.length > 0 && (
            <EducationSection data={data.education} />
          )}
        </main>

        <aside className={styles.aside}>
          {Object.keys(data.skills).length > 0 && (
            <SkillsSection data={data.skills} />
          )}

          {data.certifications.length > 0 && (
            <CertificationsSection data={data.certifications} />
          )}

          {data.languages.length > 0 && (
            <LanguagesSection data={data.languages} />
          )}
        </aside>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SUB SECTIONS
// ─────────────────────────────────────────────────────────────

function CertificationsSection({ data }) {
  return (
    <section className={styles.asideSection}>
      <h3 className={styles.asideSectionTitle}>Certifications</h3>
      <div className={styles.certList}>
        {data.map((cert, i) => (
          <div key={cert._id || i} className={styles.certItem}>
            <span className={styles.certName}>{cert.name}</span>
            <span className={styles.certMeta}>
              {cert.issuer} · {cert.year}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

function LanguagesSection({ data }) {
  return (
    <section className={styles.asideSection}>
      <h3 className={styles.asideSectionTitle}>Languages</h3>
      <div className={styles.langList}>
        {data.map((lang, i) => (
          <span key={i} className={styles.langItem}>
            {lang}
          </span>
        ))}
      </div>
    </section>
  )
}