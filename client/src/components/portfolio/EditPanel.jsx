import { useState } from 'react'
import { X, RotateCcw, Check } from 'lucide-react'
import { usePortfolio } from '../../context/PortfolioContext.jsx'
import { THEMES, LAYOUTS, TONES } from '../../styles/themes.js'
import Button from '../common/Button.jsx'
import styles from './EditPanel.module.css'

export default function EditPanel({ onClose }) {
  const {
    portfolioData, selectedTheme, selectedLayout, selectedTone,
    setTheme, setLayout, setTone, updateSection,
  } = usePortfolio()

  const [activeTab, setActiveTab] = useState('customize') // 'customize' | 'edit'

  return (
    <aside className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.tabs}>
          <button
            className={[styles.tab, activeTab === 'customize' ? styles.tabActive : ''].join(' ')}
            onClick={() => setActiveTab('customize')}
          >
            Customize
          </button>
          <button
            className={[styles.tab, activeTab === 'edit' ? styles.tabActive : ''].join(' ')}
            onClick={() => setActiveTab('edit')}
          >
            Edit Content
          </button>
        </div>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <div className={styles.panelBody}>
        {activeTab === 'customize' && (
          <CustomizeTab
            selectedTheme={selectedTheme}
            selectedLayout={selectedLayout}
            selectedTone={selectedTone}
            setTheme={setTheme}
            setLayout={setLayout}
            setTone={setTone}
          />
        )}
        {activeTab === 'edit' && portfolioData && (
          <EditTab data={portfolioData} updateSection={updateSection} />
        )}
      </div>
    </aside>
  )
}

/* ── Customize Tab ── */
function CustomizeTab({ selectedTheme, selectedLayout, selectedTone, setTheme, setLayout, setTone }) {
  return (
    <div className={styles.tabContent}>
      <Section title="Theme">
        <div className={styles.themeGrid}>
          {Object.values(THEMES).map((theme) => (
            <button
              key={theme.id}
              className={[styles.themeCard, selectedTheme === theme.id ? styles.selectedCard : ''].join(' ')}
              onClick={() => setTheme(theme.id)}
              title={theme.description}
            >
              <div className={styles.swatches}>
                {theme.preview.map((c, i) => (
                  <span key={i} style={{ background: c, width: 8, height: 8, borderRadius: 2, display: 'block' }} />
                ))}
              </div>
              <span className={styles.cardLabel}>{theme.name}</span>
              {selectedTheme === theme.id && <Check size={10} className={styles.checkIcon} />}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Layout">
        {Object.values(LAYOUTS).map((layout) => (
          <button
            key={layout.id}
            className={[styles.layoutRow, selectedLayout === layout.id ? styles.selectedRow : ''].join(' ')}
            onClick={() => setLayout(layout.id)}
          >
            <span className={styles.layoutIcon}>{layout.icon}</span>
            <span className={styles.layoutName}>{layout.name}</span>
            <span className={styles.layoutDesc}>{layout.description}</span>
            {selectedLayout === layout.id && <Check size={12} className={styles.checkIcon} />}
          </button>
        ))}
      </Section>

      <Section title="Tone">
        <div className={styles.toneGrid}>
          {Object.values(TONES).map((tone) => (
            <button
              key={tone.id}
              className={[styles.toneChip, selectedTone === tone.id ? styles.selectedChip : ''].join(' ')}
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

/* ── Edit Tab ── */
function EditTab({ data, updateSection }) {
  return (
    <div className={styles.tabContent}>
      <EditField
        label="Name"
        value={data.name}
        onChange={(v) => updateSection('name', v)}
      />
      <EditField
        label="Title"
        value={data.title}
        onChange={(v) => updateSection('title', v)}
      />
      <EditField
        label="Tagline"
        value={data.tagline}
        onChange={(v) => updateSection('tagline', v)}
      />
      <EditField
        label="Summary"
        value={data.summary}
        multiline
        onChange={(v) => updateSection('summary', v)}
      />
      <EditField
        label="Email"
        value={data.email}
        onChange={(v) => updateSection('email', v)}
      />
      <EditField
        label="Location"
        value={data.location}
        onChange={(v) => updateSection('location', v)}
      />
      <EditField
        label="LinkedIn"
        value={data.linkedin}
        onChange={(v) => updateSection('linkedin', v)}
      />
      <EditField
        label="GitHub"
        value={data.github}
        onChange={(v) => updateSection('github', v)}
      />
    </div>
  )
}

function EditField({ label, value, multiline = false, onChange }) {
  const [localVal, setLocalVal] = useState(value || '')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    onChange(localVal)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className={styles.editField}>
      <label className={styles.fieldLabel}>{label}</label>
      {multiline ? (
        <textarea
          className={styles.textarea}
          value={localVal}
          onChange={(e) => setLocalVal(e.target.value)}
          rows={3}
        />
      ) : (
        <input
          className={styles.input}
          type="text"
          value={localVal}
          onChange={(e) => setLocalVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        />
      )}
      <button
        className={[styles.saveBtn, saved ? styles.savedBtn : ''].join(' ')}
        onClick={handleSave}
      >
        {saved ? <><Check size={11} /> Saved</> : 'Save'}
      </button>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>{title}</p>
      {children}
    </div>
  )
}
