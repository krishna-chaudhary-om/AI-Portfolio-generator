import { THEMES } from '../styles/themes.js'

/** Format bytes to human-readable size */
export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Get initials from name */
export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('')
}

/** Truncate text to n chars */
export function truncate(text, n = 100) {
  if (!text || text.length <= n) return text
  return text.slice(0, n).trimEnd() + '…'
}

/** Debounce a function */
export function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Generate a standalone exportable HTML portfolio file.
 * Fully self-contained — no external runtime dependencies.
 */
export function generatePortfolioHTML(portfolioData, themeId = 'midnight', layout = 'classic') {
  const theme = THEMES[themeId] || THEMES.midnight
  const d = portfolioData

  const cssVars = Object.entries(theme.vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n')

  // ── Section builders ──────────────────────────────────────────────────────

  const skillsHTML = (() => {
    if (!d.skills) return ''
    const isGrouped = !Array.isArray(d.skills) && typeof d.skills === 'object'
    if (isGrouped) {
      return Object.entries(d.skills)
        .map(([group, skills]) => `
          <div class="skill-group">
            <span class="skill-group-label">${group}</span>
            <div class="tags">${skills.map((s) => `<span class="tag">${s}</span>`).join('')}</div>
          </div>`)
        .join('')
    }
    return `<div class="tags">${d.skills.map((s) => `<span class="tag">${s}</span>`).join('')}</div>`
  })()

  const experienceHTML = (d.experience || [])
    .map((exp) => `
      <div class="timeline-item">
        <div class="item-header">
          <div class="item-left">
            <h3 class="role">${exp.role}</h3>
            <span class="company">${exp.company}</span>
            ${exp.location ? `<span class="location"> · ${exp.location}</span>` : ''}
          </div>
          <span class="period">${exp.period}</span>
        </div>
        <ul class="bullets">
          ${(exp.bullets || []).map((b) => `<li>${b}</li>`).join('')}
        </ul>
      </div>`)
    .join('')

  const projectsHTML = (d.projects || [])
    .map((p) => `
      <div class="project-card">
        <div class="project-header">
          <h3 class="project-name">${p.name}</h3>
          ${p.link ? `<a href="https://${p.link}" target="_blank" class="project-link">↗</a>` : ''}
        </div>
        <p class="project-desc">${p.description}</p>
        ${p.highlights?.length ? `<div class="highlights">${p.highlights.map((h) => `<span class="highlight">${h}</span>`).join('')}</div>` : ''}
        ${p.tech?.length ? `<div class="tags small">${p.tech.map((t) => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
      </div>`)
    .join('')

  const educationHTML = (d.education || [])
    .map((edu) => `
      <div class="edu-item">
        <div class="item-header">
          <div>
            <h3 class="institution">${edu.institution}</h3>
            <p class="degree">${edu.degree}</p>
          </div>
          <div class="edu-right">
            <span class="period">${edu.period}</span>
            ${edu.gpa ? `<span class="gpa">GPA ${edu.gpa}</span>` : ''}
          </div>
        </div>
        ${edu.highlights?.length ? `<div class="tags small">${edu.highlights.map((h) => `<span class="tag">${h}</span>`).join('')}</div>` : ''}
      </div>`)
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${d.name} — Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    :root {
${cssVars}
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { -webkit-font-smoothing: antialiased; }
    body { background: var(--pt-bg); color: var(--pt-text); font-family: var(--pt-body-font); line-height: 1.6; }
    a { color: inherit; text-decoration: none; }

    /* ── Header ── */
    .site-header { background: var(--pt-surface); border-bottom: 1px solid var(--pt-border); padding: 48px 32px 36px; }
    .header-inner { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 24px; }
    .left { display: flex; align-items: center; gap: 20px; }
    .avatar {
      width: 64px; height: 64px; border-radius: 16px; flex-shrink: 0;
      background: color-mix(in srgb, var(--pt-accent) 15%, transparent);
      border: 2px solid color-mix(in srgb, var(--pt-accent) 30%, transparent);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Syne', sans-serif; font-weight: 800; font-size: 22px;
      color: var(--pt-accent); letter-spacing: -0.02em;
    }
    .name { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; letter-spacing: -0.03em; }
    .title-line { font-size: 14px; font-weight: 500; color: var(--pt-accent); margin-top: 4px; }
    .tagline { font-size: 13px; color: var(--pt-muted); margin-top: 4px; }
    .contact-links { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }
    .contact-link { font-size: 12px; color: var(--pt-muted); font-family: 'DM Mono', monospace; }
    .social-links { display: flex; gap: 8px; margin-top: 8px; justify-content: flex-end; }
    .social-link {
      width: 30px; height: 30px; border-radius: 8px;
      background: var(--pt-bg); border: 1px solid var(--pt-border);
      display: flex; align-items: center; justify-content: center;
      color: var(--pt-muted); font-size: 13px; transition: border-color 0.15s;
    }
    .social-link:hover { border-color: var(--pt-accent); }
    .summary { max-width: 1100px; margin: 24px auto 0; padding-top: 20px; border-top: 1px solid var(--pt-border); }
    .summary p { font-size: 14px; line-height: 1.7; color: var(--pt-muted); max-width: 680px; }

    /* ── Layout ── */
    .content { display: grid; grid-template-columns: 1fr 280px; max-width: 1100px; margin: 0 auto; padding: 48px 32px 80px; gap: 0; }
    .main { display: flex; flex-direction: column; gap: 56px; padding-right: 48px; }
    .aside { display: flex; flex-direction: column; gap: 36px; }

    /* ── Sections ── */
    .section { display: flex; flex-direction: column; gap: 20px; }
    .section-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; letter-spacing: -0.03em; padding-bottom: 16px; border-bottom: 1px solid var(--pt-border); }
    .aside-title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--pt-muted); font-family: 'DM Mono', monospace; }

    /* ── Timeline ── */
    .timeline { display: flex; flex-direction: column; gap: 28px; }
    .timeline-item { padding-left: 16px; border-left: 2px solid var(--pt-border); transition: border-color 0.2s; }
    .timeline-item:hover { border-left-color: var(--pt-accent); }
    .item-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; margin-bottom: 10px; }
    .item-left { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
    .role { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; letter-spacing: -0.02em; }
    .company { font-size: 13px; font-weight: 600; color: var(--pt-accent); }
    .location { font-size: 12px; color: var(--pt-muted); font-family: 'DM Mono', monospace; }
    .period { font-size: 11px; font-family: 'DM Mono', monospace; color: var(--pt-muted); padding: 2px 8px; background: var(--pt-surface); border: 1px solid var(--pt-border); border-radius: 99px; white-space: nowrap; }
    .bullets { list-style: none; display: flex; flex-direction: column; gap: 5px; }
    .bullets li { font-size: 13px; color: var(--pt-muted); line-height: 1.6; padding-left: 16px; position: relative; }
    .bullets li::before { content: '▸'; position: absolute; left: 0; color: var(--pt-accent); font-size: 10px; top: 3px; }

    /* ── Projects ── */
    .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
    .project-card { background: var(--pt-surface); border: 1px solid var(--pt-border); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 10px; transition: border-color 0.2s, transform 0.2s; }
    .project-card:hover { border-color: var(--pt-accent); transform: translateY(-2px); }
    .project-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .project-name { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: -0.02em; }
    .project-link { color: var(--pt-muted); font-size: 16px; transition: color 0.15s; }
    .project-link:hover { color: var(--pt-accent); }
    .project-desc { font-size: 12px; color: var(--pt-muted); line-height: 1.6; }

    /* ── Education ── */
    .edu-list { display: flex; flex-direction: column; gap: 20px; }
    .edu-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
    .institution { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; letter-spacing: -0.02em; }
    .degree { font-size: 13px; color: var(--pt-accent); font-weight: 500; margin-top: 2px; }
    .gpa { font-size: 11px; font-family: 'DM Mono', monospace; color: var(--pt-accent); }

    /* ── Tags ── */
    .tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .tag { font-size: 11px; font-family: 'DM Mono', monospace; padding: 3px 9px; border-radius: 99px; background: var(--pt-bg); border: 1px solid var(--pt-border); color: var(--pt-text); }
    .tags.small .tag { font-size: 10px; padding: 2px 7px; color: var(--pt-muted); }
    .highlights { display: flex; flex-wrap: wrap; gap: 5px; }
    .highlight { font-size: 10px; font-family: 'DM Mono', monospace; padding: 2px 7px; border-radius: 99px; background: color-mix(in srgb, var(--pt-accent) 10%, transparent); border: 1px solid color-mix(in srgb, var(--pt-accent) 20%, transparent); color: var(--pt-accent); }

    /* ── Skills ── */
    .skill-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
    .skill-group-label { font-size: 11px; font-weight: 500; color: var(--pt-accent); font-family: 'DM Mono', monospace; text-transform: uppercase; letter-spacing: 0.06em; }

    @media (max-width: 768px) {
      .content { grid-template-columns: 1fr; padding: 24px 20px 60px; }
      .main { padding-right: 0; gap: 40px; }
      .header-inner { flex-direction: column; }
      .contact-links { align-items: flex-start; }
      .social-links { justify-content: flex-start; }
    }
  </style>
</head>
<body>
  <header class="site-header">
    <div class="header-inner">
      <div class="left">
        <div class="avatar">${getInitials(d.name)}</div>
        <div>
          <h1 class="name">${d.name}</h1>
          <p class="title-line">${d.title || ''}</p>
          ${d.tagline ? `<p class="tagline">${d.tagline}</p>` : ''}
        </div>
      </div>
      <div>
        <div class="contact-links">
          ${d.email    ? `<span class="contact-link">✉ &nbsp;${d.email}</span>` : ''}
          ${d.phone    ? `<span class="contact-link">✆ &nbsp;${d.phone}</span>` : ''}
          ${d.location ? `<span class="contact-link">⌖ &nbsp;${d.location}</span>` : ''}
        </div>
        <div class="social-links">
          ${d.github   ? `<a href="https://${d.github}"   target="_blank" class="social-link" title="GitHub">GH</a>` : ''}
          ${d.linkedin ? `<a href="https://${d.linkedin}" target="_blank" class="social-link" title="LinkedIn">LI</a>` : ''}
          ${d.website  ? `<a href="https://${d.website}"  target="_blank" class="social-link" title="Website">↗</a>` : ''}
        </div>
      </div>
    </div>
    ${d.summary ? `<div class="summary"><p>${d.summary}</p></div>` : ''}
  </header>

  <div class="content">
    <main class="main">
      ${experienceHTML ? `<section class="section"><h2 class="section-title">Experience</h2><div class="timeline">${experienceHTML}</div></section>` : ''}
      ${projectsHTML   ? `<section class="section"><h2 class="section-title">Projects</h2><div class="projects-grid">${projectsHTML}</div></section>` : ''}
      ${educationHTML  ? `<section class="section"><h2 class="section-title">Education</h2><div class="edu-list">${educationHTML}</div></section>` : ''}
    </main>
    <aside class="aside">
      ${skillsHTML ? `<section class="section"><h3 class="aside-title">Skills</h3>${skillsHTML}</section>` : ''}
      ${(d.certifications || []).length > 0 ? `
        <section class="section">
          <h3 class="aside-title">Certifications</h3>
          ${d.certifications.map((c) => `
            <div style="margin-bottom:10px">
              <div style="font-size:13px;font-weight:500;color:var(--pt-text)">${c.name}</div>
              <div style="font-size:11px;color:var(--pt-muted);font-family:'DM Mono',monospace">${c.issuer} · ${c.year}</div>
            </div>`).join('')}
        </section>` : ''}
      ${(d.languages || []).length > 0 ? `
        <section class="section">
          <h3 class="aside-title">Languages</h3>
          <div class="tags">${d.languages.map((l) => `<span class="tag">${l}</span>`).join('')}</div>
        </section>` : ''}
    </aside>
  </div>
</body>
</html>`
}
