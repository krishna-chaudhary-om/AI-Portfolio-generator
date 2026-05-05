import { Outlet, Link, useLocation } from 'react-router-dom'
import { usePortfolio } from '../context/PortfolioContext.jsx'
import styles from './MainLayout.module.css'

export default function MainLayout() {
  const location = useLocation()
  const { portfolioData, reset } = usePortfolio()
  const isPreview = location.pathname === '/preview'

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo} onClick={isPreview ? reset : undefined}>
          <span className={styles.logoMark}>P</span>
          <span className={styles.logoText}>
            Portfolio<span className={styles.logoAccent}>AI</span>
          </span>
        </Link>

        <nav className={styles.nav}>
          {isPreview && portfolioData && (
            <>
              <Link to="/" className={styles.navLink} onClick={reset}>
                ← New Resume
              </Link>
              <a
                href="#export"
                className={`${styles.navLink} ${styles.navCta}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.querySelector('[data-export-btn]')?.click()
                }}
              >
                Export Site
              </a>
            </>
          )}
          {!isPreview && (
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className={styles.navLink}
            >
              GitHub
            </a>
          )}
        </nav>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
