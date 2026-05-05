import { usePortfolio } from '../../context/PortfolioContext.jsx'
import { THEMES, LAYOUTS, TONES } from '../../styles/themes.js'
import styles from './CustomizationPanel.module.css'

export default function CustomizationPanel() {
  const { selectedTheme, selectedLayout, selectedTone, setTheme, setLayout, setTone } = usePortfolio()

  return (
    <div className={styles.panel}>
      <Section title="Theme">
        <div className={styles.themeGrid}>
          {Object.values(THEMES).map((theme) => (
            <button
              key={theme.id}
              className={[styles.themeCard, selectedTheme === theme.id ? styles.selected : ''].join(' ')}
              onClick={() => setTheme(theme.id)}
              title={theme.description}
            >
              <div className={styles.themeSwatches}>
                {theme.preview.map((color, i) => (
                  <span key={i} className={styles.swatch} style={{ background: color }} />
                ))}
              </div>
              <span className={styles.themeName}>{theme.name}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Layout">
        <div className={styles.layoutGrid}>
          {Object.values(LAYOUTS).map((layout) => (
            <button
              key={layout.id}
              className={[styles.layoutCard, selectedLayout === layout.id ? styles.selected : ''].join(' ')}
              onClick={() => setLayout(layout.id)}
            >
              <span className={styles.layoutIcon}>{layout.icon}</span>
              <div className={styles.layoutInfo}>
                <span className={styles.layoutName}>{layout.name}</span>
                <span className={styles.layoutDesc}>{layout.description}</span>
              </div>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Writing Tone">
        <div className={styles.toneGrid}>
          {Object.values(TONES).map((tone) => (
            <button
              key={tone.id}
              className={[styles.toneChip, selectedTone === tone.id ? styles.selected : ''].join(' ')}
              onClick={() => setTone(tone.id)}
            >
              {tone.label}
            </button>
          ))}
        </div>
      </Section>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className={styles.section}>
      <h4 className={styles.sectionTitle}>{title}</h4>
      {children}
    </div>
  )
}
